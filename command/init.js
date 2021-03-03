const utils = require('./utils');
const inquirer = require('inquirer');
const fs = require('fs');
const StreamZip = require('node-stream-zip');

const init_action = async (option) => {
    console.log('即将创建一个新项目！');
    const config = await inquirer.prompt([
        { type: 'input', name: 'project_name', message: '请输入项目名称' },
        { type: 'list', name: 'project_type', message: '请选择项目类型', choices: ['server', 'web'] },
        { type: 'confirm', name: 'project_install', message: '是否安装依赖？', default: true },
    ]);
    const start_time = (new Date()).getTime();
    const stat = fs.existsSync(`./${config.project_name}`);
    if (stat) {
        console.log('\033[41;30m ERROR \033[40;31m 项目目录已经存在！\033[0m')
        return;
    }
    await utils.downloadFile('https://github.com/cherishs001/cli/releases/download/1.0.0/server.zip', '从远程仓库拉取模板');
    // 解压文件
    fs.mkdirSync(`./${config.project_name}`);
    const zip = new StreamZip.async({ file: `./.ksc-cache/${config.project_type}.zip` });
    await zip.extract(null, `./${config.project_name}`);
    await zip.close();
    const package = JSON.parse(fs.readFileSync(`./${config.project_name}/package.json`));
    package.name = config.project_name;
    fs.writeFileSync(`./${config.project_name}/package.json`, JSON.stringify(package, null, 2));
    utils.deleteFolder('./.ksc-cache')
    if (config.project_install) {
        await utils.npm_install(`./${config.project_name}`, true);
    }
    const end_time = (new Date()).getTime();
    console.log('\033[42;30m DONE \033[40;32m 完成耗时 ' + (end_time - start_time) + 'ms\033[0m');
}

module.exports = init_action;