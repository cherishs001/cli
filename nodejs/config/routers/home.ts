import {Home} from '../../app/controllers';

const router = require('koa-router')();

router.get('/test', Home.Test);

export default router;
