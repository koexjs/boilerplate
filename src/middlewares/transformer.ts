import { Context } from 'koa';

declare module 'koa' {
  export interface Context {
    transform<I>(schema: ISchema, data: I): Promise<I>;
  }
}

export interface ISchema {
  [key: string]: (v: any) => any;
};

export default () => {
  const transform = async <I>(schema: ISchema, data: I): Promise<I> => {
    return Object.keys(schema).reduce((last, key) => {
      if (typeof data[key] === 'undefined') {
        return last;
      }

      last[key] = schema[key](data[key]);
      return last;
    }, {} as { [key: string]: any}) as any;
  };

  return async function transformer(ctx: Context, next: () => Promise<void>) {
    ctx.transform = transform;
    
    await next();
  };
}