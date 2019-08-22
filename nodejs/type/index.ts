import {Context} from 'koa';
import {Redis} from '@kaishen/orm';

interface KaishenContext extends Context {
    apiInfo: string,
    database: DBList,
}

interface DBList {
}

export {
    KaishenContext,
    DBList,
}
