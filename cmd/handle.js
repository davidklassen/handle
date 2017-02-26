#!/usr/bin/env node


import program from 'commander';
import deploy from './deploy';
import login from './login';


program
    .command('login')
    .description('verifies user credentials in registry and saves the access token in configuration file')
    .action(login);


program
    .command('deploy')
    .description('deploys your application')
    .action(deploy);


program.parse(process.argv);


if (program.args.length === 0) {
    program.help();
}
