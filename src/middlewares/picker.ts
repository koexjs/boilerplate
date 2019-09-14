import { Context } from 'koa';

declare module 'koa' {
  export interface Context {
    pick<I>(keys: string[], data: any): Promise<I>;
  }
}

export default () => {
  const pick = async <I>(keys: string[], data: any): Promise<I> => {
    return keys.reduce((last, key) => {
      last[key] = data[key];
      return last;
    }, {} as any) as any;
  };

  return async function picker(ctx: Context, next: () => Promise<void>) {
    ctx.pick = pick;
    
    await next();
  };
}