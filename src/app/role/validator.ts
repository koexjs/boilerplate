import * as Joi from 'joi';
import mongoose from 'mongoose';

const isValidObjectId = mongoose.Types.ObjectId.isValid;

const custom = Joi.extend({
  base: Joi.string(),
  name: 'objectId',
  language: {
    base: 'must be a valid ObjectId',
  },
  pre(value, state, options) {
    if (!isValidObjectId(value)) {
      return this.createError('objectId.base', { value }, state, options);
    }

    return value;
  },
});

const id = Joi.object().keys({
  id: custom.objectId(),
});

const get = Joi.object().keys({
  q: Joi.string().max(1024).allow(''),
  offset: Joi.number().min(0),
  limit: Joi.number().max(20),
  sort: Joi.alternatives([
    Joi.string(),
    Joi.array().items(Joi.string()),
  ]),
});

const create = Joi.object().keys({
  name: Joi.string().min(3).max(128).required(),
  code: Joi.string().required(),
  description: Joi.string().max(8192),
  scope: Joi.string(),
});

const update = create;

export const Query = {
  get,
  retrieve: id,
  update: id,
  patch: id,
  delete: id,
}

export const Mutation = {
  create,
  update,
}