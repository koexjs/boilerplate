import { Context } from 'koa';

import { _throw } from '@utils/index';
import * as STATUS from '@utils/status';
import { IUser } from '@models/user';

export const withAdmin = () => {
  return async (ctx: Context, next: () => Promise<void>) => {
    const user = ctx.state.user as IUser;

    if (user.role !== 'admin') {
      return _throw(STATUS.FORBIDDEN, 'Permission Denied');
    }

    await next();
  };
}