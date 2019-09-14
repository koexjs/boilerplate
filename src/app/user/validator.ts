import * as Joi from 'joi';

const id = Joi.object().keys({
  id: Joi.string().not('undefined').required(),
});

const get = Joi.object().keys({
  q: Joi.string().max(1024).allow(''),
  offset: Joi.number().min(0),
  limit: Joi.number().min(1).max(20),
  sort: Joi.alternatives([
    Joi.string(),
    Joi.array().items(Joi.string()),
  ]),
});

const create = Joi.object().keys({
  username: Joi.string().min(3).max(20).required(),
  role: Joi.string().valid('admin', 'member').required(),
  active: Joi.bool().required(),
  email: Joi.string().email().max(192),
  nickname: Joi.string().max(192),
  avatar: Joi.string(),
  url: Joi.string().max(8192),
  description: Joi.string().max(8192),
});

const retrieve = Joi.object().keys({
  id: Joi.string().not('undefined').required(),
});

const update = Joi.object().keys({
  role: Joi.string().valid('admin', 'member').required(),
  active: Joi.bool().required(),
  email: Joi.string().email().max(192),
  nickname: Joi.string().max(192),
  avatar: Joi.string(),
  url: Joi.string().max(8192).allow(''),
  description: Joi.string().max(8192).allow(''),
});

const updateDoc = Joi.object().keys({
  resetToken: Joi.string(),
  resetTokenExpires: Joi.string(),
});

const del = Joi.object().keys({
  id: Joi.string().required(),
});

const resetPassword = Joi.object().keys({
  id: Joi.string().required(),
});

const loginAs = id;

export const validator = {
  id,
  get,
  create,
  retrieve,
  update,
  updateDoc,
  del,
  resetPassword,
  loginAs,
};