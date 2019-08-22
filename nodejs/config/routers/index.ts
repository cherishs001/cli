import home from './home'

const router = require('koa-router')();

router.use('/api/v1', home.routes(), home.allowedMethods());

export {
    router,
}
