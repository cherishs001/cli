#!/usr/bin/env node
const { Command } = require('commander');
const init_action = require('./command/init');
const add_action = require('./command/add');
const start_action = require('./command/start');

const program = new Command();

program
    .name('kaishen')
    .version(require('./package.json').version, '-v, --version')
    .option('-h, --help', 'output usage information');

program
    .command('init')
    .description('Init a project with default templete')
    .action(init_action)

program
    .command('add')
    .description('add controller|config|someting... in project folder')
    .action(add_action)

program
    .command('start')
    .description('start project')
    .action(start_action)


program.parse(process.argv);

const options = program.opts();

if (options.version) {
    console.log(program.version);
}
