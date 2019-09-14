import { Context } from 'koa';

import * as typing from './interface';
import { IUser } from '@models/user';
import { validator } from './validator';
import { transformer } from './transformer';
import { service } from './service';

export class Controller {
  // curd
  public static async get(ctx: Context) {
    const rawQuery = ctx.query as typing.Get;

    // pipe: validate => transform => service
    await ctx.validate(validator.get, rawQuery);
    const query = await ctx.transform(transformer.get, rawQuery);
    
    const data = await service.get(query);
    ctx.state.data = data;
  }

  public static async create(ctx: Context) {
    const rawBody = (ctx.request as any).body as typing.Create;

    await ctx.validate(validator.create, rawBody);
    const query = await ctx.transform(transformer.create, rawBody);

    await service.create(query);

    ctx.status = 201;
  }

  public static async retrieve(ctx: Context) {
    const rawParams = ctx.params as any as typing.Retrieve;

    await ctx.validate(validator.retrieve, rawParams);
    const query = await ctx.transform(transformer.retrieve, rawParams);

    const user = await service.retrieve(query);

    ctx.state.data = user;
  }

  public static async update(ctx: Context) {
    const rawParams = ctx.params as any as typing.ID;
    const rawBody = (ctx.request as any).body as IUser;

    await ctx.validate(validator.id, rawParams);
    const query = await ctx.transform(transformer.id, rawParams);

    await ctx.validate(validator.update, rawBody);
    const doc = await ctx.transform(transformer.update, rawBody);

    await service.update(query.id, doc);

    ctx.status = 200;
  }

  public static async delete(ctx: Context) {
    const rawParams = ctx.params as any as typing.Delete;

    await ctx.validate(validator.del, rawParams);
    const query = await ctx.transform(transformer.del, rawParams);

    await service.del(query);

    ctx.status = 204;
  }

  // business
  public static async authorize() {

  }

  public static async resetPassword(ctx: Context) {
    const rawParams = ctx.params as any as typing.ID;
    
    await ctx.validate(validator.del, rawParams);
    const query = await ctx.transform(transformer.del, rawParams);

    await service.resetPassword(query);

    ctx.status = 200;
  }

  public static async loginAs(ctx: Context) {
    const rawParams = ctx.params as any as typing.ID;

    await ctx.validate(validator.del, rawParams);
    const query = await ctx.transform(transformer.del, rawParams);

    const user = await service.loginAs(query);

    ctx.cookies.set('uid', user.id, {
      // expires
      // maxAge
    });
    
    ctx.status = 200;
  }
};