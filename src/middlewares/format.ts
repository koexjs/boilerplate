import { Context } from 'koa';

declare module 'koa' {
  export interface ContextState {
    data: object | object[];
    [key: string]: any;
  }

  export interface Context {
    state: ContextState;
  }
}

export default () => {
  return async function format(ctx: Context, next: () => Promise<void>) {
    await next();

    const { data } = ctx.state;

    if (typeof data !== 'undefined') {
      ctx.body = data;
    }
  };
}