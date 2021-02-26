#!/usr/bin/env node
const { Command } = require('commander');
const init_action = require('./command/init');

const program = new Command();

program
    .name('kaishen')
    .version(require('./package.json').version, '-v, --version')
    .option('-h, --help', 'output usage information');

program
    .command('init <projectName>')
    .description('Init a project with default templete')
    .action(init_action)


program.parse(process.argv);

const options = program.opts();

if (options.version) {
    console.log(program.version);
}

if (options.help) {
    console.log(123);
    console.log('Usage: kaishen <command> [options]');
    console.log();
    console.log('Options:');
    console.log('  -v, --version       output the version number');
    console.log('  -h, --help          output usage information');
    console.log();
    console.log('Commands:');
    console.log('  init [projectName]  Init a project with default templete')
}
