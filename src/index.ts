import Koa from 'koa';
import { resolve } from 'path';
import config from 'config';

import session from 'koa-session';
 
// import logger from '@koex/logger';
import responseTime from '@koex/response-time'; 
import ratelimit from '@koex/ratelimit';
import compress from '@koex/compress';
import onerror from '@koex/onerror';
import cache from '@koex/cache'; 
// import redis from '@koex/redis';
import helmet from '@koex/helmet'; 
import ejs from '@koex/ejs';
import staticCache from '@koex/static';
import cors from '@koex/cors';
import bodyParser from '@koex/body';
import joi from '@koex/joi';

import logger from './middlewares/logger';
import accessLog from './middlewares/access-log';
import transformer from './middlewares/transformer';
import picker from './middlewares/picker';
import format from './middlewares/format';
import requestId from './middlewares/request-id';

import router from './router';
import bootstrap from './utils/serve';

const app = new Koa();

app.use(requestId());
app.use(responseTime());
app.use(logger());
app.use(accessLog());
app.use((() => {
  app.keys = ['koex.session.secret', 'koex.session.key'];
  return session({
    key: 'koex:sess',
    maxAge: 8640000,
    // autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
  }, app);
})());

const ratelimitConfig = config.get<{
  max: number;
  duration: number;
}>('ratelimit');
app.use(ratelimit({
  max: ratelimitConfig.max,
  duration: ratelimitConfig.duration,
}));
app.use(onerror({
  log: console.log,
}));
app.use(cors({
  credentials: true,
})); 
app.use(compress());
app.use(cache({
  maxAge: 10 * 1000,
}));

// const redisConfig = config.get<{
//   keyPrefix: string;
//   host: string;
//   port: number;
//   password: string;
//   db: number;
// }>('redis');
// app.use(redis({
//   host: redisConfig.host,
//   port: redisConfig.port,
//   keyPrefix: redisConfig.keyPrefix,
//   password: redisConfig.password,
//   db: redisConfig.db,
// }));

app.use(helmet());
app.use(ejs({
  dir: resolve(__dirname, 'views'),
})); 
app.use(staticCache('/assets', {
  dir: resolve(__dirname, 'public', '../..'),
}));

app.use(format());
app.use(transformer());
app.use(picker());
app.use(bodyParser()); 
app.use(joi());

app.use(router());   
 
bootstrap(app);
