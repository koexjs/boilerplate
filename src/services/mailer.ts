import nodemailer from 'nodemailer';

export const sendMail = async (email: string, subject: string, content: { text?: string, html?: string }) => {
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
    subject: `Zcorky Tech ${subject}`,
    ...content,
  });
};

export const sendMailCaptcha = async (email: string, captcha: string) => {
  return sendMail(
    email,
    '验证码',
    {
      text: `
您的绑定验证码是：${captcha}

本邮件由系统自动发送，请勿直接回复！
感谢您的访问，祝您使用愉快！
      `,
    },
  );
};

export const sendMailResetPassword = async (email: string, link: string) => {
  console.log('lll: link: ', email, link);
  return sendMail(
    email,
    '重置密码',
    {
      html: `
<div style="background-color: #2c2c32;background-size: cover;height: 100%;font-family: 'Microsoft YaHei','Microsoft JhengHei','\\009ed1\\004f53',arial,'STHeiti'">
  <div style="width: 520px;padding: 50px 0;margin: 0 auto;color:#eee;text-align: center">
    <a style="display:block;width:123px;height: 44px;background-image:url(https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg);"></a>
    <div style="font-size: 30px;margin-top:20px;">whatwewant，您好</div>
    <p style="margin-top: 30px;line-height: 2;text-align: left;font-size: 16px;">请点击以下按钮验证邮箱重置密码，如果此操作不是由您发起的，请忽略此邮件。</p>
    <a href="${link}" style="width: 200px;height: 50px;border-radius: 4px;line-height: 50px;font-size: 16px;color: #ffffff;text-align: center;background-color: #d64f4f;display: inline-block;text-decoration: none;margin-top: 20px;">重置密码</a>
  </div>
</div>
      `,
    },
  );
};