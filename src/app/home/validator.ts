import * as Joi from 'joi';

export const login = Joi.object().keys({
  type: Joi.string().valid('', 'email'),
  username: Joi.string().required(),
  password: Joi.string().required(),
  captcha: Joi.string().required(),
});

export const logout = Joi.object().keys({
  username: Joi.string().min(3).max(40).required(),
});

export const register = Joi.object().keys({
  type: Joi.string().valid('', 'email', 'telphone'),
  username: Joi.string().min(3).max(40).required(),
  password: Joi.string().min(6).max(32).required(),
  confirmPassword: Joi.string().min(6).max(32).required(),
  captcha: Joi.string().required(),
});

export const updateUser = Joi.object().keys({
  nickname: Joi.string().max(192),
  avatar: Joi.string(),
  url: Joi.string().max(8192).allow(''),
  description: Joi.string().max(8192).allow(''),
});

export const captcha = Joi.object().keys({
  type: Joi.string().valid('image', 'email', 'telphone'),
  value: Joi.string().required(),
});

export const updatePassword = Joi.object().keys({
  password: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().min(6).required(),
});

export const resetPassword = Joi.object().keys({
  type: Joi.string().valid('email', 'reset'),
  // value: Joi.string().required(),
  email: Joi.string().min(3).max(40), //.required(),
  captcha: Joi.string(), //.required(),
  code: Joi.string(),
  password: Joi.string().min(6),
  confirmPassword: Joi.string().min(6),
});
