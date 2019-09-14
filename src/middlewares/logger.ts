import { Context } from 'koa';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

declare module 'koa' {
  export interface Context {
    logger: winston.Logger;
  }
}

export interface Options extends winston.LoggerOptions {
  // transports?: Transport[];
}

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const {
  colorize,
  simple,
} = winston.format;

const DEFAULT_FORMAT = winston.format.combine(
  colorize(),
  simple(),
);

const DEV_TRANSPORTS = [new winston.transports.Console({
  format: DEFAULT_FORMAT,
})];

const PROD_TRANSPORTS = [
  new DailyRotateFile({
    level: 'error',
    dirname: './logs',
    filename: 'error.%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '90d',
  }),
  new DailyRotateFile({
    level: 'info',
    dirname: './logs',
    filename: 'access.%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '90d',
  }),
];

const DEFAULT_OPTIONS = {
  format: winston.format.json(),
  transports: !IS_PRODUCTION ? DEV_TRANSPORTS : PROD_TRANSPORTS,
};

export default (options: Options = DEFAULT_OPTIONS) => {
  const logger = winston.createLogger(options);

  return async function mlogger(ctx: Context, next: () => Promise<void>) {
    ctx.logger = logger;

    await next();
  };
};