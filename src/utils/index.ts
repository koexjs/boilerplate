import createError from 'http-errors';

export function _throw(status: number, message: string) {
  throw createError(status, message);
};