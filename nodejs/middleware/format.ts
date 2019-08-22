import {KaishenContext} from '../type'

export const format = () => {
    return async (ctx: KaishenContext, next) => {
        try {
            await next();
            if (ctx.status === 200 && ctx.apiInfo !== '') {
                ctx.body = {
                    status: 1000,
                    message: ctx.apiInfo,
                    data: ctx.body,
                }
            }
            if (ctx.status === 500) {
                ctx.body = {
                    status: 5001,
                    message: ctx.error || '服务器故障',
                }
            }
        } catch (e) {
            if (e.status && e.message) {
                ctx.status = 200;
                ctx.body = {
                    status: e.status,
                    message: e.message,
                    data: e.data ? e.data : {},
                }
            } else {
                throw e
            }
        }
    }
};
