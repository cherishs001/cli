const inquirer = require('inquirer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const start_action = async () => {
    // 能否做到自动读取配置中有哪些env了
    const env_list = [];
    fs.readdirSync('./config').map(file => {
        const filePath = path.join('./config', file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            if (file.match(/\.ts|.js$/) !== null) {
                // 读取内容，并找到this.env这句话
                let content = fs.readFileSync(filePath, 'utf-8');
                content = content.replace(/\s+/g, '');
                content_arr = content.split(`this.env='`);
                if (content_arr.length >= 2) {
                    let env = content_arr[1].split(`'`)[0];
                    env_list.push(env);
                }
            }
        }
    });
    const {env_type} = await inquirer.prompt([
        { type: 'list', name: 'env_type', message: '请选择运行环境', choices: env_list },
    ]);
    await project_start(env_type);
}

const project_start = (env) => {
    return new Promise((resolve, reject) => {
        const start = spawn(
            `set NODE_ENV=${env}&&${process.platform === "win32" ? "npm.cmd run dev" : "npm run dev"}`,
            {
                shell: true,
                stdio: 'inherit',
            }
        );
        start.on('close', (code) => {
            resolve();
        });
    })
}

module.exports = start_action;