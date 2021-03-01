#!/usr/bin/env node
const { Command } = require('commander');
const init_action = require('./command/init');

const program = new Command();

program
    .name('kaishen')
    .version(require('./package.json').version, '-v, --version')
    .option('-h, --help', 'output usage information');

program
    .command('init')
    .description('Init a project with default templete')
    .action(init_action)


program.parse(process.argv);

const options = program.opts();

if (options.version) {
    console.log(program.version);
}
