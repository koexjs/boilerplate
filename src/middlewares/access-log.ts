import { Context } from 'koa';
import moment from '@zcorky/moment';
import chalk from 'chalk';

export default () => {
  return async (ctx: Context, next: () => Promise<void>) => {
    const start = process.hrtime();

    await next();

    const deltaHr = process.hrtime(start);
    const responseTime = Math.round(deltaHr[0] * 1000 + deltaHr[1] / 1000000);

    const data = {
      ip: ctx.ip,
      dateTime: moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ'),
      method: ctx.method,
      path: ctx.path,
      status: ctx.status,
      responseTime: chalk.green(`+${responseTime}ms`),// ctx.responseTime,
      protocol: ctx.protocol,
    };

    ctx.logger.log({
      level: 'info',
      message: `[PID: ${process.pid}] ${data.ip} -- [${data.dateTime}] "${data.method} ${data.path} ${data.protocol}" ${data.status} ${data.responseTime}`,
    });
  };
};