const utils = require('./utils');
const inquirer = require('inquirer');

const init_action = async (option) => {
    console.log('即将创建一个新项目！');
    const config = await inquirer.prompt([
        { type: 'input', name: 'project_name', message: '请输入项目名称！' },
        { type: 'list', name: 'project_type', message: '请选择项目类型！', choices: ['server', 'web'] },
    ]);
    const start_time = (new Date()).getTime();
    await utils.downloadFile('https://github.com/cherishs001/cli/releases/download/1.0.0/server.zip', '从远程仓库拉取模板');

    const end_time = (new Date()).getTime();
    console.log('\033[42;30m DONE \033[40;32m Compiled successfully in ' + (end_time - start_time) + 'ms\033[0m');
}

module.exports = init_action;