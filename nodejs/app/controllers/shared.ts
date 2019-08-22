import {errorConfig} from './config';
import * as crypto from 'crypto';
import {KaishenContext} from '../../type';
import {Redis} from '@kaishen/orm';

/**
 * 返回错误信息
 * @param status 错误代码
 * @param message 错误信息
 * @param data 错误返回
 */
const throwException = (status: number, message: string, data = {}) => {
    if (status !== 0) {
        throw {
            status: status,
            message: message,
            data: data,
        }
    }
};

/**
 * 判断请求包中是否包含字段列表中的所有字段
 * @param body 请求包
 * @param fields 字段列表
 */
const requiredParams = (body: object, fields: Array<string>) => {
    let fieldName = '';
    for (const item of fields) {
        if (typeof body[item] === 'undefined') {
            fieldName = item;
            break;
        }
    }

    fieldName !== '' ? throwException(4010, `${errorConfig[4010]}>>${fieldName}`, {error_fields: [fieldName]}) : false;
};

/**
 * 生成范围内随机数
 * @param minNum 最小值
 * @param maxNum 最大值
 */
const randomNum = (minNum: number, maxNum: number) => {
    return parseInt(`${Math.random() * (maxNum - minNum + 1) + minNum}`, 10);
};

/**
 * 生成十位数随机字符串
 */
const randomStr = () => {
    return Math.random().toString(36).substr(2);
};

/**
 * 时间类
 */
const TimeGeneration = {
    /**
     * 获取秒级时间戳
     */
    timestampSeconds: (time?: Date) => {
        if (time) {
            return Math.floor(time.getTime() / 1000);
        } else {
            return Math.floor(new Date().getTime() / 1000);
        }
    },
};

/**
 * 对象转换为QueryString
 * @param data 对象
 */
const objectToQuerystring = (data: object): string => {
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

/**
 * 加密函数
 * @param type 加密类型 ['sha256']
 * @param text 加密原文
 */
const encryption = (type: string, text: string) => {
    return crypto.createHash(type).update(text).digest('hex');
};

/**
 * 判断某个值是否指定范围内
 * @param val 指定值
 * @param vals 指定范围
 */
const isOneOf = (val: any, vals: Array<any>) => {
    return vals.indexOf(val) >= 0;
};

export {
    throwException,
    requiredParams,
    randomNum,
    TimeGeneration,
    objectToQuerystring,
    encryption,
    randomStr,
    isOneOf,
};
