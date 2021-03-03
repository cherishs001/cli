const utils = require('./utils');

const fix_action = async () => {
    // 删除node_moudle后，重新安装
    const nums = utils.scanFolder('./node_modules');
    const pb = new utils.ProgressBar('正在修复...', 50); 
    utils.deleteFolder('./node_modules', {pb, nums: nums + (nums / 14)})
    await utils.npm_install('./');
    pb.render({ completed: 100, total: 100 });
}

module.exports = fix_action;