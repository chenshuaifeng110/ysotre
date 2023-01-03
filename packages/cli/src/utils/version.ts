import semver from 'semver'
import chalk from 'chalk';
import Inquirer from 'inquirer';
import ora from 'ora';
import { exec } from 'child_process';
import {name as pkgname, version as curVersion} from './constants'
import getPackageVersion from './getPackageVersion'
import { readFile, writeFile } from './files';
import { clearConsole } from './index';
import type { VersionInfo } from '../index.d';

let originVersion: string = '1.0.0'
// 获取远程NPM版本
async function getUpdataFlag(): Promise<Boolean> {
  try {
    let VersionInfoMap: VersionInfo = {
      newVersion: '1.0.0',
      lastVersion: '1.0.0',
      updataTime:  Date.now(),
      localVersion: '1.0.0',
    }
    Object.keys(VersionInfoMap).forEach(key => {
      writeFile(key, VersionInfoMap[key])
    })
    const res = await getPackageVersion(pkgname, 'latest');
    // npm上的包版本信息
    const { version } = res.data;
    originVersion = version
    if (semver.valid(version) && version !== curVersion) {
      // 如果远程版本与本地版本不一致将最新版本更新到本地
      return true;
    }else{
      return false; 
    }
  } catch (err: any) {
    const formatErr = err.toJSON();
    console.log(chalk.red(`查询版本信息失败：${formatErr.message || '网络异常'}`));
  }
  return false;
}

/**
 * 判断本地版本是否是最新版本
 * 不是 保证每天询问一次是否更新 
 */
async function getVersions(): Promise<Boolean> {
  const updataTime: any = readFile('updataTime');
  const interval: number = readFile
  ('CHECK_VERSION_INTERVAL')
  // 设置版本检查频率
  const checkRate  = (Date.now() - updataTime)/ interval
  if(checkRate > 1){
    // 如果上一次更新时间距离当前时间超过一天不用缓存
    return getUpdataFlag()
  }else {
    // 如果上一次更新时间距离当前时间没有超过一天使用，不用更新
    return false
  }
}

async function checkVersion(): Promise<void> {
  const updateFlag = await getVersions();
  if (updateFlag) {
    const { update } = await Inquirer.prompt({
      name: 'update',
      type: 'confirm',
      message: `当前版本不是最新版本，当前版本是${curVersion},最新版本是${originVersion},是否更新到最新版本?`,
    });
    if (update) {
      await updateCli();
    }
  }
}

function updateCli() {
  return new Promise<void>((resolve, reject) => {
    const spinner = ora('@ystore/cli正在更新中...');
    spinner.start();
    exec(`npm update -g ${pkgname}`, (err, stdout) => {
      clearConsole();
      if (err) {
        console.log(err);
        spinner.fail();
        reject(err);
      }
      console.log('log for update:\n', chalk.green(stdout));
      spinner.text = '更新@ystore/cli成功';
      spinner.succeed();
      resolve();
    });
  });
}

export default checkVersion;