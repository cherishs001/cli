#!/usr/bin/env node
const shell = require('shelljs');
const { readSyncByRl, copy } = require('./utils');
const fs = require('fs');
const path = require('path');

const actions = ['new'];
const targets = {
    'new': ['server'], // ['server', 'miniapp', 'h5', 'app']
}
const params = {
    'new server': ['env'], // ['env']
}

global.args = process.argv.splice(2);
const commond = global.args;

// 拆解commond
// commond 格式为 action target --params=value ...

const action = commond[0];

if (actions.indexOf(action) < 0) {
    shell.echo(`kaishen: unknown action: ${action}`);
    shell.echo(`Usage: kaishen -h`);
    shell.exit(1);
}

const target = commond[1];

if (!target || targets[action].indexOf(target) < 0) {
    shell.echo(`kaishen: unknown target: ${target}`);
    shell.echo(`Usage: kaishen -h`);
    shell.exit(1);
}

const param = commond.splice(2);

(async () => {
    if (`${action} ${target}` === 'new server') {
        const config = {
            env: 'nodejs',
        };
        for (const item of param) {
            const tmp = item.split('=');
            let name = tmp[0].replace('-', '');
            name = name.replace('-', '');
            let value = '';
            if (tmp[1]) {
                value = tmp[1];
            }
            if (params[`${action} ${target}`].indexOf(name) >= 0) {
                if (value !== '') {
                    config[name] = value;
                }
            } else {
                shell.echo(`kaishen: unknown params: ${name}`);
                shell.echo(`Usage: kaishen -h`);
                shell.exit(1);
            }
        }

        if (config.env === 'nodejs') {
            const sourceDir = path.join(__dirname, '../nodejs');
            const name = await readSyncByRl('project name: ');

            fs.stat(path.join(process.cwd(), name), async (err, stat) => {
                if (stat && stat.isDirectory()) {
                    shell.echo(`kaishen: Specifies that the path contains the same directory.`);
                    shell.exit(1);
                } else {
                    const targetDir = path.join(process.cwd(), name);
                    copy(sourceDir, targetDir);
                    setTimeout(() => {
                        // 读取package.json, 修改项目名字
                        const res = fs.readFileSync(path.join(process.cwd(), `${name}/package.json`), 'utf8');
                        const res2 = res.replace('${name}', name);
                        fs.writeFileSync(path.join(process.cwd(), `${name}/package.json`), res2);
                        // 自动安装依赖
                        shell.exec(`cd ${name} && npm install`);
                        shell.echo(`kaishen: finished.`);
                        shell.exit(0);
                    }, 3000);
                }
            })
        } else {
            shell.echo(`kaishen: The specified environment is not available.`);
            shell.exit(0);
        }
    }
})()