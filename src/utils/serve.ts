import Koa from 'koa';
import boxen from 'boxen';
import chalk from 'chalk';
import config from 'config';

import mongoose from 'mongoose';

import { getNetworkAddress } from './net';

const PORT = Number(process.env.PORT) || 9000;
const HOST = process.env.HOST || '0.0.0.0';

export default (app: Koa) => {
  mongoose.Promise = global.Promise;
  
  mongoose.connect(config.get('db'), {
    // useMongoClient: true,
    poolSize: 20,
  }, (err) => {
    if (err) {
      console.error('connect to %s error: ', config.get('db'), err.message);
      process.exit(-1);
    }

    const server = app.listen(PORT, HOST, () => {
      const details = server.address();
      const address = {
        local: `http://${HOST}:${PORT}`,
        network: 'unknown',
      };
    
      if (typeof details === 'string') {
        address.local = details;
      } else {
        const host = details.address === '::' ? 'localhost' : details.address;
        const port = details.port;
        const ip = getNetworkAddress();
        address.local = `http://${host}:${port}`;
        address.network =  ip ? `http://${ip}:${port}` : 'unknown';
      }
    
      const message = `
    ${chalk.green('Serving!')}
    
    - ${chalk.bold('Local')}:           ${address.local}
    - ${chalk.bold('On Your Network')}: ${address.network}
    
    ${chalk.grey('Copied local address to clipboard!')}
      `;
      console.log(boxen(message, {
        padding: 1,
        borderColor: 'green',
        margin: 1,
      }));
    });
  });
}