import {KaishenContext} from '../../type/';

export const Home = {
    /**
     * 测试
     * @param ctx
     * @constructor
     */
    async Test(ctx: KaishenContext): Promise<void> {
        ctx.apiInfo = '测试';
        ctx.body = {
            id: 1,
        };
    },
};
