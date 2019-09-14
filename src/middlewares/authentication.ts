import { Context } from 'koa';

import { _throw } from '@utils/index';
import { Model as User } from '@models/user';

export const withAuthentication = () => {
  return async (ctx: Context, next: () => Promise<void>) => {
    const _id = ctx.cookies.get('uid');

    if (!_id) {
      return _throw(401, 'Unauthorize');
    }

    const user = await User.findById(_id);

    // user may removed
    if (!user) {
      ctx.cookies.set('uid', null);
      return _throw(401, 'Unauthorize');
    }
 
    ctx.state.user = user;

    await next();
  };
}