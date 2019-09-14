import * as typings from './interface';

import { IUser, Model } from '@models/user';
import { _throw } from '@utils/index';

import { field } from './field';


const get = async (data: typings.Get) => {
  const q = new RegExp(data.q, 'i');

  let conditions = {
    $or: [
      { username: { $regex: q } },
      { nickname: { $regex: q } },
    ],
  };

  const projection = field;
  const options = {
    skip: data.offset,
    limit: data.limit,
    sort: Array.isArray(data.sort) ? data.sort.join(' ') : data.sort + ' -createdAt',
  };

  const total = await Model.countDocuments(conditions);

  const res = await Model.find(conditions, projection, options);

  return {
    total,
    data: res,
  };
};

const create = async (query: typings.Create) => {
  const conditions = query;
  return Model.create(conditions);
};

const retrieve = async (query: typings.Retrieve) => {
  return Model.findById(query.id);
};

const update = async (id: string, doc: Partial<IUser>) => {
  const query = { _id: id };
  console.log('update user: ', id, doc)
  return Model.updateOne(query, {
    $set: doc,
  });
};

const del = async (query: typings.Delete) => {
  await Model.deleteOne({ _id: query.id });
};

const resetPassword = async (query: typings.Delete) => {
  const user = await Model.findOne({ _id: query.id });

  if (!user) {
    return _throw(400, 'Invalid User');
  }

  await user.resetPassword();
};

const loginAs = async (query: typings.ID) => {
  const user = await Model.findOne({ _id: query.id });

  if (!user) {
    _throw(400, 'Invalid User');
  }

  return user;
};

export const service = {
  get,
  create,
  retrieve,
  update,
  del,
  resetPassword,
  loginAs,
};