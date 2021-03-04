const utils = require('./utils');
const fs = require('fs');

const fix_action = async () => {
    // 删除node_moudle后，重新安装
    const nums = utils.scanFolder('./node_modules');
    const pb = new utils.ProgressBar('正在修复...', 50); 
    utils.deleteFolder('./node_modules', {pb, nums: nums + (nums / 14)})
    await utils.npm_install('./');
    pb.render({ completed: 99, total: 100 });
    // 检查package.json里面有没有dev命令，并增加这个命令
    const package = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
    if (!package.scripts.hasOwnProperty('dev')) {
        package.scripts.dev = 'ts-node index.ts';
    }
    pb.render({ completed: 100, total: 100 });
}

module.exports = fix_action;