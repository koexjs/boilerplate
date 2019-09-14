import * as typings from './interface';

import { IRole, Model } from '@models/role';
// import { _throw } from '@utils/index';

import { field } from './field';
import { _throw } from '@utils';
import * as STATUS from '@utils/status';


const get = async (query: typings.Query.Get) => {
  const q = new RegExp(query.q, 'i');
  
  const conditions = {
    $or: [
      { name: { $regex: q } },
      { description: { $regex: q } },
    ],
  };

  const projection = field;

  const options = {
    skip: query.offset,
    limit: query.limit,
    sort: Array.isArray(query.sort) ? query.sort.join(' ') : query.sort + ' -createdAt',
  };

  const total = await Model.countDocuments(conditions);

  const data = await Model
    .find(conditions, projection, options);

  return {
    total,
    data: data.map(instance => ({
      id: instance.id,
      name: instance.name,
      code: instance.code,
      description: instance.description,
      scope: instance.scope,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    })),
  };
}

const create = async (mutation: typings.Muation.Create) => {
  const instance = await Model.findOne({ code: mutation.code });

  if (!!instance) {
    _throw(STATUS.BAD_REQUEST, '角色名称不可重复');
  }

  return Model.create(mutation);
}

const retrieve = async ( query: typings.Query.Retrieve) => {
  const instance = await Model
    .findOne({ _id: query.id });

  if (!instance) {
    _throw(STATUS.BAD_REQUEST, '角色不存在');
  }

  return {
    id: instance.id,
    name: instance.name,
    code: instance.code,
    description: instance.description,
    scope: instance.scope,
    createdAt: instance.createdAt,
    updatedAt: instance.updatedAt,
  };
}

const update = async (query: typings.Query.Update, mutation: typings.Muation.Update) => {
  const instance = await Model.findOne({ _id: query.id });

  if (!instance) {
    _throw(STATUS.BAD_REQUEST, '角色不存在');
  }

  return instance.update({
    $set: mutation,
  });
}

const del = async (query: typings.Query.Delete) => {
  const instance = await Model.findOne({ _id: query.id });

  if (!instance) {
    _throw(STATUS.BAD_REQUEST, '角色不存在');
  }

  return instance.remove();
}

export const Query = {
  get,
  retrieve,
};

export const Mutation = {
  create,
  update,
  delete: del,
};