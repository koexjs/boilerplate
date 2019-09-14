import * as router from '@koex/router';

import ratelimit from '@koex/ratelimit';
import { withAuthentication } from '@middlewares/authentication';
import { withAdmin } from '@middlewares/permission';

import * as home from '@app/home';
import * as user from '@app/user';
import * as role from '@app/role';

export default () => {
  router.get('/health', async ctx => {
    ctx.status = 200;
  });

  router.get('/unsplash', home.Controller.unsplash);

  router.post('/login', home.Controller.login);
  router.post('/logout', home.Controller.logout);
  router.post('/register', home.Controller.register);

  router.get('/captcha', ratelimit({ max: 60, duration: 60000 }), home.Controller.captcha);
  router.post('/captcha', ratelimit({ max: 1, duration: 60000 }), home.Controller.captcha);

  router.get('/user', withAuthentication(), home.Controller.getUser);
  router.put('/user', withAuthentication(), home.Controller.updateUser);
  router.put('/user/password', withAuthentication(), home.Controller.updatePassword);
  router.post('/user/password/reset', home.Controller.resetPassword);

  router.get('/users', withAuthentication(), withAdmin(), user.Controller.get);
  router.post('/users', withAuthentication(), withAdmin(), user.Controller.create);
  router.get('/users/:id', withAuthentication(), withAdmin(), user.Controller.retrieve);
  router.put('/users/:id', withAuthentication(), withAdmin(), user.Controller.update);
  router.del('/users/:id', withAuthentication(), withAdmin(), user.Controller.delete);
  router.patch('/users/:id/reset/password', withAuthentication(), withAdmin(), user.Controller.resetPassword);
  router.post('/users/:id/login/as', withAuthentication(), withAdmin(), user.Controller.loginAs);

  router.get('/roles', withAuthentication(), role.Controller.Query.get);
  router.get('/roles/:id', withAuthentication(), role.Controller.Query.retrieve);
  router.post('/roles', withAuthentication(), role.Controller.Mutation.create);
  router.put('/roles/:id', withAuthentication(), role.Controller.Mutation.update);
  router.del('/roles/:id', withAuthentication(), role.Controller.Mutation.delete);

  return router.routes();
}