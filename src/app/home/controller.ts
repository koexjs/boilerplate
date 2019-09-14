import { Context } from 'koa';
import config from 'config';

declare module 'koa-session' {
  export interface Session {
    captcha?: string;
  } 
}

(global as any).fetch = require('node-fetch');
import Unsplash, { toJson } from 'unsplash-js';

import { IUser, IUserDocument } from '@models/user';
import * as STATUS from '@utils/status';

import * as typing from './interface';
import * as validator from './validator';
import * as transformer from './transformer';
import * as service from './service';
import { _throw } from '@utils';

export class Controller {
  public static async login(ctx: Context) {
    const rawBody = (ctx.request as any).body as typing.Login;

    // pipe: validate => transform => service
    await ctx.validate(validator.login, rawBody);
    const query = await ctx.transform(transformer.login, rawBody);

    if (query.captcha !== ctx.session.captcha) {
      _throw(STATUS.BAD_REQUEST, '验证码错误');
    }

    const user = await service.login(query);

    ctx.cookies.set('uid', user.id, {
      // expires
      // maxAge
    });
    
    ctx.status = 200;
  }

  public static async logout(ctx: Context) {
    const rawBody = (ctx.request as any).body as typing.Logout;

    await ctx.validate(validator.logout, rawBody);
    const query = await ctx.transform(transformer.logout, rawBody);
    await service.logout(query);
    
    ctx.cookies.set('uid', null);

    ctx.status = 200;
  }

  public static async register(ctx: Context) {
    const rawBody = (ctx.request as any).body as typing.Register;

    await ctx.validate(validator.register, rawBody);
    const body = await ctx.transform(transformer.register, rawBody);
  
    if (body.captcha !== ctx.session.captcha) {
      _throw(STATUS.BAD_REQUEST, '验证码错误');
    }

    const query = {
      type: body.type,
      username: body.username,
    };
    const mutation = body;

    const user = await service.register(query, mutation);

    ctx.cookies.set('uid', user.id, {
      // expires
      // maxAge
    });

    ctx.status = 201;
  }

  public static async getUser(ctx: Context) {
    const uid = ctx.cookies.get('uid');
    
    ctx.body = await service.getUser(uid);
  }

  public static async updateUser(ctx: Context) {
    const rawBody = (ctx.request as any).body as IUser;

    await ctx.validate(validator.updateUser, rawBody);
    const mutation = await ctx.transform(transformer.updateUser, rawBody);

    const user = ctx.state.user as IUserDocument;
    await service.updateUser(user, mutation);

    ctx.status = STATUS.OK;
  }

  public static async updatePassword(ctx: Context) {
    const rawBody = (ctx.request as any).body as typing.UpdatePassword;

    await ctx.validate(validator.updatePassword, rawBody);
    const mutation = await ctx.transform(transformer.updatePassword, rawBody);

    const user = ctx.state.user as IUserDocument;
    await service.updatePassword(user, mutation);

    ctx.status = STATUS.OK;
  }

  public static async unsplash(ctx: Context) {
    const { AccessKey, SecretKey } = config.get('unsplash');

    const unsplash = new Unsplash({
      applicationId: AccessKey,
      secret: SecretKey,
    });

    const data = await unsplash
      .photos
      .getRandomPhoto({
        query: 'girls',
        count: 30,
      })
      .then(toJson);

    ctx.status = STATUS.OK;
    ctx.state.data = data;
  }

  public static async captcha(ctx: Context) {
    ctx.disableCache = true;
    let captchaData;

    if (ctx.method === 'GET') {
      captchaData = await service.createCaptcha('image');
    } else if (ctx.method === 'POST') {
      const rawBody = (ctx.request as any).body as typing.Captcha;

      await ctx.validate(validator.captcha, rawBody);
      const { type, value } = await ctx.transform(transformer.captcha, rawBody);
      
      captchaData = await service.createCaptcha(type, value);
    }

    ctx.session.captcha = captchaData.text.toLowerCase();

    ctx.status = STATUS.OK;
    ctx.type = 'svg';
    ctx.body = captchaData.data;
  }

  public static async resetPassword(ctx: Context) {
    const rawBody = (ctx.request as any).body as typing.ResetPassword;

    await ctx.validate(validator.resetPassword, rawBody);
    const query = await ctx.transform(transformer.resetPassword, rawBody);

    if (query.type === 'email') {
      if (query.captcha !== ctx.session.captcha) {
        _throw(STATUS.BAD_REQUEST, '验证码错误');
      }
  
      await service.mailResetPassword(query);
    } else if (query.type === 'reset') {
      await service.resetPassword(query);
    }

    ctx.status = STATUS.OK;
  }
};