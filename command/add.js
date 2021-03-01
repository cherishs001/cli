const inquirer = require('inquirer');
const path = require('path')
const fs = require('fs')

const add_action = async (option) => {
    // 判定当前项目是什么类型的项目
    const dependencies = JSON.parse(fs.readFileSync(path.join(process.cwd(), './package.json'))).dependencies;
    if (dependencies.hasOwnProperty('@kaishen/sagittarius')) {
        // 是server类型的模板
        const {add_type} = await inquirer.prompt([
            {type: 'list', name: 'add_type', message: '选择要新建的内容', choices: ['service', 'env']},
        ]);

        if (add_type === 'env') {
            let {port, env} = await inquirer.prompt([
                {type: 'input', name: 'port', message: '设置启动端口'},
                {type: 'input', name: 'env', message: '设置环境变量'},
            ]);
            const env_class = env.charAt(0).toUpperCase() + env.substring(1);
            let str = '';
            str = config_template;
            str = str.replace('#{env_class}', env_class);
            str = str.replace('#{env}', env);
            str = str.replace('#{port}', port);
            fs.writeFileSync(`./config/${env}.ts`, str);
        }

        if (add_type === 'service') {
            let {class_name, api_path, method, has_schema} = await inquirer.prompt([
                {type: 'input', name: 'class_name', message: 'Service Class名称(大驼峰命名)'},
                {type: 'input', name: 'api_path', message: '接口路由'},
                {type: 'checkbox', name: 'method', message: '选择需要的Method', choices: ['GET', 'POST', 'PUT', 'DELETE'],},
                // {type: 'confirm', name: 'has_schema', message: '是否初始化Schema'},
            ]);
            // class_name至少需要首字符大写, 如果不是, 第一个字符串转大写
            class_name = class_name.charAt(0).toUpperCase() + class_name.substring(1);
            const cname = class_name;
            class_name = class_name.replace(/([A-Z])/g,"_$1").toLowerCase().substring(1);
            const file_name = class_name;
            let str = '';
            str = class_template;
            str = str.replace('#{class_name}', cname);
            str = str.replace('#{path}', api_path);
            str_arr = str.split('\n');
            const method_arr = [];
            for (const item of method) {
                let method_str = '';
                method_str = method_template;
                method_str = method_str.replace('#{method}', item);
                method_arr.push(method_str);
            }
            str = '';
            for (let i = 0; i < str_arr.length; i++) {
                str = str + str_arr[i] + '\n';
                if (i === 3) {
                    for (const item of method_arr) {
                        str = str + item;
                    }
                }
            }
            fs.writeFileSync(`./services/${file_name}.ts`, str);
        }
    }
}

const class_template = `import { Context, Service } from '@kaishen/sagittarius';

export default class #{class_name} extends Service {
    path: string = '#{path}';
}`;

const method_template = `
    async #{method}(ctx: Context): Promise<void> {
        ctx.info = '请求返回说明';
        ctx.body = {}; // 请求结果
    }
`;

const config_template = `import {Config} from '@kaishen/sagittarius';

export default class #{env_class} extends Config {
    async init(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            this.env = '#{env}';
            this.port = #{port};
            this.logs = {
                type: 'console',
                level: 'TRACE',
            };
            this.error = {
                5000: '后端服务器异常',
                5100: '数据库操作异常',
            };
            resolve();
        })
    }
}
`

module.exports = add_action;