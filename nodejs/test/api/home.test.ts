import * as Utils from '../utils.nyc';
import {expect} from 'chai';

const params = (data) => {
    const arr = [];
    for (const i in data) {
        if (data.hasOwnProperty(i)) {
            if (data[i] instanceof Array) {
                data[i] = JSON.stringify(data[i]);
            }
            arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
        }
    }
    return arr.join('&');
};

describe('home', (): void => {
    before(async (): Promise<void> => {
        this.server = await Utils.app();
    });

    it('测试', async (): Promise<void> => {
        const res = await this.server
            .get(`/api/v1/test`);
        expect(res.status).equal(200);
        const body = JSON.parse(res.text);
        expect(body.status).equal(1000);
        expect(body.data.id).equal(1);
    });
});
