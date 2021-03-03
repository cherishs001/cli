const fs = require('fs')
const slog = require('single-line-log').stdout;
const { spawn } = require('child_process');

const readSyncByfs = (tips) => {
    tips = tips || '> ';
    process.stdout.write(tips);
    process.stdin.pause();

    const buf = Buffer.allocUnsafe(10000);
    let response = fs.readSync(process.stdin.fd, buf, 0, 10000, 0);
    process.stdin.end();

    return buf.toString('utf8', 0, response).trim();
}

const fetch = require('node-fetch');
const path = require("path");
const progressStream = require('progress-stream');

// 封装的 ProgressBar 工具
function ProgressBar(description, bar_length) {
    // 两个基本参数(属性)
    this.description = description || 'Progress';       // 命令行开头的文字信息
    this.length = bar_length || 25;                     // 进度条的长度(单位：字符)，默认设为 25

    // 刷新进度条图案、文字的方法
    this.render = function (opts) {
        var percent = (opts.completed / opts.total).toFixed(4);    // 计算进度(子任务的 完成数 除以 总数)
        var cell_num = Math.floor(percent * this.length);             // 计算需要多少个 █ 符号来拼凑图案

        // 拼接黑色条
        var cell = '';
        for (var i = 0; i < cell_num; i++) {
            cell += '█';
        }

        // 拼接灰色条
        var empty = '';
        for (var i = 0; i < this.length - cell_num; i++) {
            empty += '░';
        }

        // 拼接最终文本
        var cmdText = this.description + ': ' + (100 * percent).toFixed(2) + '% ' + cell + empty + ' ' + opts.completed + '/' + opts.total;

        // 在单行输出文本
        slog(cmdText);
    };
}

const scanFolder = (filePath) => {
    let nums = 0;

    const scanFolder2 = (filePath) => {
        if (fs.existsSync(filePath)) {
            const files = fs.readdirSync(filePath)
            files.forEach((file) => {
                const nextFilePath = `${filePath}/${file}`
                const states = fs.statSync(nextFilePath)
                if (states.isDirectory()) {
                    //recurse
                    scanFolder2(nextFilePath)
                } else {
                    nums++;
                }
            })
            nums++;
        }
    }

    scanFolder2(filePath);

    return nums;
}

const deleteFolder = (filePath, opts) => {
    let nums = 0;

    const deleteFolder2 = (filePath, opts) => {
        if (fs.existsSync(filePath)) {
            const files = fs.readdirSync(filePath)
            files.forEach((file) => {
                const nextFilePath = `${filePath}/${file}`
                const states = fs.statSync(nextFilePath)
                if (states.isDirectory()) {
                    //recurse
                    deleteFolder2(nextFilePath)
                    nums++;
                    if (opts) {
                        opts.pb.render({ completed: parseInt((nums / opts.nums) * 100), total: 100 });
                    }
                } else {
                    //delete file
                    fs.unlinkSync(nextFilePath)
                    nums++;
                    if (opts) {
                        opts.pb.render({ completed: parseInt((nums / opts.nums) * 100), total: 100 });
                    }
                }
            })
            fs.rmdirSync(filePath)
        }
    }

    deleteFolder2(filePath, opts);
}

const downloadFile = (url, msg) => {
    return new Promise(async (resolve, reject) => {
        //下载 的文件 地址
        let fileURL = url;
        try {
            await fs.promises.stat('./.ksc-cache')
        } catch (e) {
            // 不存在文件夹，直接创建 {recursive: true} 这个配置项是配置自动创建多个文件夹
            await fs.promises.mkdir('.ksc-cache', { recursive: true })
        }
        //下载保存的文件路径
        let fileSavePath = path.join('./.ksc-cache', path.basename(fileURL));
        //缓存文件路径
        let tmpFileSavePath = fileSavePath + ".tmp";
        //创建写入流
        const fileStream = fs.createWriteStream(tmpFileSavePath).on('error', function (e) {
            console.error('error==>', e)
        }).on('ready', function () {
        }).on('finish', function () {
            //下载完成后重命名文件
            fs.renameSync(tmpFileSavePath, fileSavePath);
            console.log('\r')
            resolve();
        });
        const pb = new ProgressBar(msg, 50);
        //请求文件
        fetch(fileURL, {
            method: 'GET',
            headers: { 'Content-Type': 'application/octet-stream' },
            // timeout: 100,    
        }).then(res => {
            //获取请求头中的文件大小数据
            let fsize = res.headers.get("content-length");
            //创建进度
            let str = progressStream({
                length: fsize,
                time: 100 /* ms */
            });
            // 下载进度 
            str.on('progress', function (progressData) {
                //不换行输出
                let percentage = Math.round(progressData.percentage);
                pb.render({ completed: percentage, total: 100 });
            });
            res.body.pipe(str).pipe(fileStream);
        }).catch(e => {
            //自定义异常处理
            reject(e);
        });
    })
}

const npm_install = (dir, out) => {
    let config = {};
    if (out) {
        config = { cwd: dir, stdio: 'inherit' };
    } else {
        config = { cwd: dir };
    }
    return new Promise((resolve, reject) => {
        const install = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ['install'], config);

        install.on('close', (code) => {
            resolve();
        });
    })
}

const utils = {
    readSyncByfs,
    downloadFile,
    deleteFolder,
    scanFolder,
    ProgressBar,
    npm_install,
};

module.exports = utils;