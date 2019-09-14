import { Context } from 'koa';
import uuid from 'uuid/v4';

declare module 'koa' {
  export interface Context {
    requestId: string;
  }
}

export default () => {
  return async (ctx: Context, next: () => Promise<void>) => {
    ctx.requestId = uuid();
    
    await next();

    ctx.set('X-Request-Id', ctx.requestId);
  };
};