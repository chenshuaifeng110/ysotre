import path from 'path';
import { Command } from 'commander';
import operations from './operate'
import checkVersion from './utils/version';
import {version } from './utils/constants'
import printLogo from './utils/printLogo'
( async () => {
  const program = new Command()
  try {
    await checkVersion()
  } catch (error) {
    console.log(`@ystore/cli启动失败,失败原因${error}}`)
   }
   Object.keys(operations).forEach((order: any) => {
    program
      .command(order)
      .alias(operations[order].alias)
      .description(operations[order].description)
      .hook('preAction', async () => {
        printLogo()
      })
      .action(async () => {
        if (order === '*') {
          console.log(operations[order].description);
        } else {
          // require('./create')('appname')
          require(path.resolve(__dirname, order))(...process.argv.slice(3));
        }
      });
  });

  program.on('--help', () => {
    printLogo()
    console.log('\nExamples:');
    Object.keys(operations).forEach((order: any) => {
      operations[order].examples.forEach((example:any) => {
        console.log(`  ${example}`);
      });
    });
  });

  program.version(version, '-v, --version',  'output the current version').parse(process.argv);
})()