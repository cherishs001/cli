import development from './development';
import preTest from './preTest';
import production from './production';
import test from './test';

const isProd = process.env.NODE_ENV === 'online';
const isPre = process.env.NODE_ENV === 'pre';
const isTest = process.env.NODE_ENV === 'test';

const env = isTest ? test : (isProd ? production : (isPre ? preTest : development));


export const Environment = env;
