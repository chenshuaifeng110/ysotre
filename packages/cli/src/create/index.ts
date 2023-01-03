import chalk from 'chalk';
import async from 'async';
import path from 'path';
import Inquirer from 'inquirer';
import ncp from 'ncp';
import fs from 'fs';
import Metalsmith from 'metalsmith';
import { execSync } from 'child_process';
import { startLoading } from '../utils';
import { fetchRepoList, fetchTagList } from '../utils/git';
import { getAll, rmDir, hasDirectory } from '../utils/files';
import { download } from '../utils/download';
import { initGit } from '../utils/initGit';
import { packageManagers, downloadDirectory } from '../utils/constants';
import ejs from 'ejs';

module.exports = async (appname: string) => {
  if (!appname) return console.log(chalk.red('command格式错误, 请输入 ystore create appname'));
  // 更改终端所在目录
  let templateDir = path.join(process.cwd(), appname);
  if (hasDirectory(templateDir)) return console.log(chalk.red(`工程名 ---> ${appname} 重复`));
  // 0> 获取git模板仓库信息
  let repos = await startLoading(fetchRepoList, '正在获取模板列表 ....')();
  const { repo } = await Inquirer.prompt({
    name: 'repo',
    type: 'list',
    message: '请选择创建工程的模板仓库',
    choices: repos,
  });
  // 2) 拉取远程仓库版本
  let tags = await startLoading(fetchTagList, '正在拉取 tags ....')(repo);
  const { tag } = await Inquirer.prompt({
    name: 'tag',
    type: 'list',
    message: '请选择创建工程的模板版本',
    choices: tags,
  });
  // 3) 将模板缓存下来
  const result = await startLoading(download, '正在下载模板中 ...')(repo, tag);
  // let result = 'C:/Users/Lenovo/.ystoreTemplate/template-vue-dev';
  if (!result) return;
  // 4) 选择使用的包管理工具， npm / yarn
  const { packageManagerName } = await Inquirer.prompt({
    name: 'packageManagerName',
    type: 'list',
    message: '请选择之一包管理工具下载依赖',
    choices: packageManagers.map((item) => item.name),
  });
  const packageItem = packageManagers.find((item) => item.name === packageManagerName);
  const installDependencies = () => {
    try {
      process.chdir(templateDir);
      execSync(packageItem?.installCommand as string, { stdio: 'ignore' });
    } catch (error: any) {
      console.log(chalk.red(`使用${packageItem?.name}${error.message}`));
    }
  };
  const successTip = () => {
    console.log(chalk.green('异步下载node_modules中,此操作用时可能过长，请耐心等待 ...'));
    installDependencies();
    const repoDir = `${downloadDirectory}/${repo}`;
    rmDir(repoDir);
    initGit();
    console.log(chalk.green('初始化模板仓库成功，请:'));
    console.log();
    console.log(chalk.cyan('  cd'), appname);
    console.log(`  ${chalk.cyan(`${packageItem?.name} run serve`)}`);
  };

  const CONFIG = await getAll();
  let TPLConfig: any;
  const ask = async (files: any, metalsmith: any, done: any) => {
    TPLConfig = require(path.join(result, CONFIG.ASK_IN_CLI as string));
    const prompts = await Inquirer.prompt(TPLConfig.requiredPrompts || TPLConfig);
    const meta = metalsmith.metadata();
    Object.assign(meta, prompts);
    done();
  };
  const template = (files: any, metalsmith: any, done: any) => {
    const metadata = metalsmith.metadata();
    const effectFiles = TPLConfig.effectFiles || [];
    const keys = Object.keys(files);
    const run = async (file: any) => {
      if (effectFiles.includes(file)) {
        let content = files[file as string].contents.toString();
        if (/<%=([\s\S]+?)%>/g.test(content)) {
          let options = {
            async: true,
          };
          content = await ejs.render(content, metadata, options);
          files[file as string].contents = Buffer.from(content);
          done();
        } else {
          done();
        }
      }
    };
    async.each(keys, run, done);
  };
  const copy = () => {
    successTip();
  };
  // 4）进行拷贝操作
  if (!fs.existsSync(path.join(result, CONFIG.ASK_IN_CLI))) {
    ncp(result, path.resolve(appname), (error: any) => {
      if (error) {
        return console.log(chalk(`拷贝操作发生错误，错误原因${error.message}`));
      } else {
        successTip();
      }
    });
  } else {
    Metalsmith(__dirname)
      .source(result)
      .destination(path.resolve(appname))
      .use(ask)
      .use(template)
      .build(function (err) {
        if (err) throw err;
        else copy();
      });
  }
};
