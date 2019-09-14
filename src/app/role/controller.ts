import { Context } from 'koa';

import { IRole } from '@models/role';
import * as STATUS from '@utils/status';

import * as typings from './interface';
import * as validator from './validator';
import * as transformer from './transformer';
import * as service from './service';

// default cqrs
const get = async (ctx: Context) => {
  const rawQuery = ctx.query as typings.Query.Get;
  
  await ctx.validate(validator.Query.get, rawQuery);
  const query = await ctx.transform(transformer.Query.get, rawQuery);

  const data = await service.Query.get(query);

  ctx.status = STATUS.OK;
  ctx.state.data = data;
}

const retrieve = async (ctx: Context) => {
  const rawParams = ctx.params as any as typings.Query.Retrieve;

  await ctx.validate(validator.Query.retrieve, rawParams);
  const query = await ctx.transform(transformer.Query.retrieve, rawParams);

  const application = await service.Query.retrieve(query);

  ctx.status = STATUS.OK;
  ctx.state.data = application;
}; 

const create = async (ctx: Context) => {
  const rawBody = (ctx.request as any).body as typings.Muation.Create;

  await ctx.validate(validator.Mutation.create, rawBody);
  const mutation = await ctx.transform(transformer.Mutation.create, rawBody);

  await service.Mutation.create(mutation);

  ctx.status = STATUS.CREATED;
}

const update = async (ctx: Context) => {
  const rawParams = ctx.params as any as typings.Query.Update;
  const rawBody = (ctx.request as any).body as typings.Muation.Update;

  await ctx.validate(validator.Query.update, rawParams);
  const query = await ctx.transform(transformer.Query.update, rawParams);

  await ctx.validate(validator.Mutation.update, rawBody);
  const mutation = await ctx.transform(transformer.Mutation.update, rawBody);

  await service.Mutation.update(query, mutation);

  ctx.status = STATUS.OK;
}

const del = async (ctx: Context) => {
  const rawParams = ctx.params as any as typings.Query.Update;

  await ctx.validate(validator.Query.update, rawParams);
  const query = await ctx.transform(transformer.Query.update, rawParams);

  await service.Mutation.delete(query);

  ctx.status = STATUS.NO_CONTENT;
};

const Query = {
  get,
  retrieve,
};

const Mutation = {
  create,
  update,
  delete: del,
};

export const Controller = {
  Query,
  Mutation,
};