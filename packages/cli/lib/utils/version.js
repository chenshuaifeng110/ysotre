"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _semver = _interopRequireDefault(require("semver"));
var _chalk = _interopRequireDefault(require("chalk"));
var _inquirer = _interopRequireDefault(require("inquirer"));
var _ora = _interopRequireDefault(require("ora"));
var _child_process = require("child_process");
var _constants = require("./constants");
var _getPackageVersion = _interopRequireDefault(require("./getPackageVersion"));
var _files = require("./files");
var _index = require("./index");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
let originVersion = '1.0.0';
// 获取远程NPM版本
async function getUpdataFlag() {
  try {
    let VersionInfoMap = {
      newVersion: '1.0.0',
      lastVersion: '1.0.0',
      updataTime: Date.now(),
      localVersion: '1.0.0'
    };
    Object.keys(VersionInfoMap).forEach(key => {
      (0, _files.writeFile)(key, VersionInfoMap[key]);
    });
    const res = await (0, _getPackageVersion.default)(_constants.name, 'latest');
    // npm上的包版本信息
    const {
      version
    } = res.data;
    originVersion = version;
    if (_semver.default.valid(version) && version !== _constants.version) {
      // 如果远程版本与本地版本不一致将最新版本更新到本地
      return true;
    } else {
      return false;
    }
  } catch (err) {
    const formatErr = err.toJSON();
    console.log(_chalk.default.red(`查询版本信息失败：${formatErr.message || '网络异常'}`));
  }
  return false;
}

/**
 * 判断本地版本是否是最新版本
 * 不是 保证每天询问一次是否更新 
 */
async function getVersions() {
  const updataTime = (0, _files.readFile)('updataTime');
  const interval = (0, _files.readFile)('CHECK_VERSION_INTERVAL');
  // 设置版本检查频率
  const checkRate = (Date.now() - updataTime) / interval;
  if (checkRate > 1) {
    // 如果上一次更新时间距离当前时间超过一天不用缓存
    return getUpdataFlag();
  } else {
    // 如果上一次更新时间距离当前时间没有超过一天使用，不用更新
    return false;
  }
}
async function checkVersion() {
  const updateFlag = await getVersions();
  if (updateFlag) {
    const {
      update
    } = await _inquirer.default.prompt({
      name: 'update',
      type: 'confirm',
      message: `当前版本不是最新版本，当前版本是${_constants.version},最新版本是${originVersion},是否更新到最新版本?`
    });
    if (update) {
      await updateCli();
    }
  }
}
function updateCli() {
  return new Promise((resolve, reject) => {
    const spinner = (0, _ora.default)('@ystore/cli正在更新中...');
    spinner.start();
    (0, _child_process.exec)(`npm update -g ${_constants.name}`, (err, stdout) => {
      (0, _index.clearConsole)();
      if (err) {
        console.log(err);
        spinner.fail();
        reject(err);
      }
      console.log('log for update:\n', _chalk.default.green(stdout));
      spinner.text = '更新@ystore/cli成功';
      spinner.succeed();
      resolve();
    });
  });
}
var _default = checkVersion;
exports.default = _default;