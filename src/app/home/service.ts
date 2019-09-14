import svgCapture from 'svg-captcha';
import nodemailer from 'nodemailer';

import { Model as UserModel, IUserDocument, IUser } from '@models/user';
import { Model as ResetPasswordModel, IResetPasswordDocument, IResetPassword } from '@models/user/resetPassword';

import * as mailService from '@services/mailer';
import { _throw } from '@utils/index';
import { captcha as getCaptchaCode } from '@utils/captcha';
import * as STATUS from '@utils/status';

import * as typings from './interface';
import { field } from './field';

export const login = async (query: typings.Login) => {
  let user: IUserDocument;

  // @get user
  if (query.type === 'email') {
    user = await UserModel.getUserByEmail(query.username, query.password);
  } else {
    user = await UserModel.getUser(query.username, query.password);
  }

  if (!user) {
    _throw(400, 'user doesnot exist');
  }

  // @create record 登录轨迹
  //

  return user;
};

export const logout = async (query: typings.Logout) => {
  // @get user
  const user = await UserModel.findOne(query);
  // @create record 登出轨迹
};

export const register = async (query: Pick<typings.Register, 'username'>, mutation: typings.Register) => {
  if (mutation.password !== mutation.confirmPassword) {
    return _throw(400, 'confirm password error') as any as IUserDocument;
  }

  const _ = await UserModel.findOne(query);

  if (!!_) {
    return _throw(400, 'user already exists') as any as IUserDocument;
  }

  const isFirstUser = await UserModel.count({}) === 0;

  const user = new UserModel({
    username: mutation.username,
    email: mutation.username,
    password: mutation.password,
    role: isFirstUser ? 'admin' : 'member',
  });

  return await user.save();
}

export const getUser = async (id: string) => {
  if (!id) {
    return _throw(401, '无效授权');
  }

  const projection = field;
  const user = await UserModel.findById(id, projection);

  return user;
};

export const updateUser = async (user: IUserDocument, mutation: IUser) => {
  const r = await user.update({
    $set: mutation,
  });
};

export const updatePassword = async (user: IUserDocument, data: typings.UpdatePassword) => {
  if (data.newPassword !== data.confirmPassword) {
    _throw(STATUS.BAD_REQUEST, '新密码密码不一致');
  }

  const r = await user.updatePassword(data.password, data.newPassword);
};

export const mailResetPassword = async (data: typings.ResetPassword) => {
  const user = await UserModel.findOne({ email: data.email });

  if (!user) {
    _throw(STATUS.BAD_REQUEST, '邮件未注册');
  }

  // record history
  const resetPassword = await ResetPasswordModel.produce(data.email);

  console.log('consume 1: ', resetPassword.consumed, resetPassword.toJSON());

  // @TODO send email
  const link = `http://localhost:8000/password_reset?type=reset&code=${resetPassword.code}&email=${data.email}`;
  await mailService.sendMailResetPassword(data.email, link);
};

export const resetPassword = async (data: typings.ResetPassword) => {
  if (data.password !== data.confirmPassword) {
    _throw(STATUS.BAD_REQUEST, '密码不一致');
  }

  // consume
  const resetPassword = await ResetPasswordModel.get(data.email, data.code);
  console.log('consume 2: ', resetPassword.consumed, data.code, resetPassword.code, resetPassword.toJSON());

  if (!resetPassword) {
    _throw(STATUS.BAD_REQUEST, '无效链接');
  }

  if (resetPassword.consumed) {
    _throw(STATUS.BAD_REQUEST, '已使用');
  }

  if (resetPassword.consumedAt) {
    _throw(STATUS.BAD_REQUEST, '已失效');
  }

  if (data.password !== data.confirmPassword) {
    _throw(STATUS.BAD_REQUEST, '密码不一致');
  }

  await resetPassword.consume();

  const user = await UserModel.findOne({ email: data.email });

  await user.setPassword(data.password);
};

export const createImageCaptcha = async () => {
  return svgCapture.create();
};

export const createEmailCaptcha = async (email: string) => {
  const captcha = {
    text: getCaptchaCode(),
    data: null,
  };

  const transporter = nodemailer.createTransport({
    host: 'smtp.exmail.qq.com',
    secureConnection: true,
    use_authentication: true,
    port: 465,
    auth: {
      user: 'no-reply@zcorky.com',
      pass: 'xw2UZzXm2pxePG6',
    },
  } as any);

  await transporter.sendMail({
    from: '"Zcorky Tech" <no-reply@zcorky.com>',
    to: email,
    subject: 'Zcorky Tech 邮箱验证码',
    text: `
    您的绑定验证码是：${captcha.text}
    
    本邮件由系统自动发送，请勿直接回复！
    感谢您的访问，祝您使用愉快！`,
  });

  return captcha;
};

export const createTelphoneCaptcha = async (telphone: string) => {
  return {
    text: getCaptchaCode(),
    data: null,
  };
};

export const createCaptcha = async (type: 'image' | 'email' | 'telphone', value?: string) => {
  switch (type) {
    case 'image':
      return createImageCaptcha();
    case 'email':
      return createEmailCaptcha(value);
    case 'telphone':
      return createTelphoneCaptcha(value);
    default:
      _throw(STATUS.BAD_REQUEST, 'xx');
  }
};