import {KaishenContext} from '../type';
import * as Busboy from 'busboy';
import request from '@kaishen/request';
import * as fs from 'fs';
import * as path from 'path';

const parseQueryStr = (queryStr, isJson) => {
    if (isJson) {
        return JSON.parse(queryStr);
    } else {
        const queryData = {};
        const queryStrList = queryStr.split('&');
        for (const [index, queryStr] of queryStrList.entries()) {
            const itemList = queryStr.split('=');
            queryData[itemList[0]] = decodeURIComponent(itemList[1]);
        }
        return queryData;
    }
};

const parsePostData = (ctx) => {
    return new Promise((resolve, reject) => {
        try {
            let postData = '';
            const isJson = ctx.request.header['content-type'] === 'application/json';
            ctx.req.addListener('data', (data) => { // 有数据传入的时候
                postData += data;
            });
            ctx.req.on('end', () => {
                const parseData = parseQueryStr(postData, isJson);
                resolve(parseData);
            });
        } catch (e) {
            reject(e);
        }
    })
};

const getSuffixName = (fileName: string) => {
    const nameList = fileName.split('.');
    return nameList[nameList.length - 1];
};

const pipeBusBoy = (busboy, req) => {
    const formData: any = {
    };

    return new Promise(async (resolve, reject) => {
        const snowRes = await request('https://api.gaotengasset.com/gt/crm/snowflake', {
            method: 'GET',
        });

        //  解析请求文件事件
        busboy.on('file', (filenames, file, filename, encoding, mimetype) => {
            const name = `${snowRes['data']['snowId']}.${getSuffixName(filename)}`;
            // let len = 0;
            const p = path.join(__dirname, `../static/${name}`);
            file.pipe(fs.createWriteStream(p));
            formData[filenames] = {
                title: filename,
                name,
                path: p,
            };
            file.on('data', (data) => {
            });
            file.on('end', () => {
            });
        });

        busboy.on('field', (filenames, val, fieldnameTruncated, valTruncated) => {
            formData[filenames] = val;
        });

        //  解析结束事件
        busboy.on('finish', () => {
            resolve(formData);
        });

        //  解析错误事件
        busboy.on('error', (err) => {
            reject({
                status: 5000,
                message: '表单处理出错',
            });
        });
        req.pipe(busboy);
    })
};

export const params = () => {
    return async (ctx: KaishenContext, next) => {
        if (ctx.method === 'POST') {
            if (ctx.request.header['content-type'].indexOf('multipart/form-data') >= 0) {
                const busboy = new Busboy({headers: ctx.req.headers});
                ctx.params = await pipeBusBoy(busboy, ctx.req);
            } else {
                ctx.params = await parsePostData(ctx);
            }
        }
        if (ctx.method === 'GET') {
            ctx.params = ctx.query;
        }
        await next();
    };
};
