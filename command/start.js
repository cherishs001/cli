const inquirer = require('inquirer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const start_action = async () => {
    const dependencies = JSON.parse(fs.readFileSync(path.join(process.cwd(), './package.json'))).dependencies;
    if (dependencies.hasOwnProperty('@kaishen/sagittarius')) {
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
        const { env_type } = await inquirer.prompt([
            { type: 'list', name: 'env_type', message: '请选择运行环境', choices: env_list },
        ]);
        await project_start(env_type);
    } else {
        console.log('\033[41;30m ERROR \033[40;31m 项目结构不符合规范！\033[0m')
    }
}

const project_start = (env) => {
    return new Promise((resolve, reject) => {
        if (process.platform === "win32") {
            const start = spawn(
                `set NODE_ENV=${env}&&${"npm.cmd run dev"}`,
                {
                    shell: true,
                    stdio: 'inherit',
                }
            );
            start.on('close', (code) => {
                resolve();
            });
        } else {
            const start = spawn(
                `export NODE_ENV=${env}&&${"npm run dev"}`,
                {
                    shell: true,
                    stdio: 'inherit',
                }
            );
            start.on('close', (code) => {
                resolve();
            });
        }
    })
}

module.exports = start_action;