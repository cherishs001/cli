const readline = require('readline');

function readSyncByRl(tips) {
    tips = tips || '> ';

    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question(tips, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

const fs = require('fs')
const path = require('path')

function copy(from, to) {
    const fromPath = path.resolve(from)
    const toPath = path.resolve(to)
    fs.access(toPath, function (err) {
        if (err) {
            fs.mkdirSync(toPath)
        }
    })
    fs.readdir(fromPath, function (err, paths) {
        if (err) {
            console.log(err)
            return
        }
        paths.forEach(function (item) {
            const newFromPath = fromPath + '/' + item
            const newToPath = path.resolve(toPath + '/' + item)

            fs.stat(newFromPath, function (err, stat) {
                if (err) return
                if (stat.isFile()) {
                    copyFile(newFromPath, newToPath)
                    console.log(`create ${newToPath}`);
                }
                if (stat.isDirectory()) {
                    copy(newFromPath, newToPath)
                }
            })
        })
    })
}

function copyFile(from, to) {
    fs.copyFileSync(from, to, function (err) {
        if (err) {
            console.log(err)
            return
        }
    })
}

module.exports = {
    readSyncByRl,
    copy,
};