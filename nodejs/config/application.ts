import * as Koa from 'koa';
import * as cors from '@koa/cors'
import * as logger from 'koa-logger';
import {router} from './routers';
import {Connection} from './connection';
import {params, format} from '../middleware';

export const createServer = async (): Promise<any> => {
    const app = new Koa();

    app.use(logger());

    app.use(cors());
    app.use(format());
    app.use(params());
    app.use(router.routes()).use(router.allowedMethods());

    try {
        await Connection(app);
        app.context.apiInfo = '';
    } catch (e) {
        console.log(`error: database connect`);
    }

    return app
};
