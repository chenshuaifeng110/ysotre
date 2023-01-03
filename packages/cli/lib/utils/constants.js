"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = exports.templateRepos = exports.packageManagers = exports.name = exports.downloadDirectory = exports.CLI_DIRECTORY = exports.CLI_DEFAULTS = void 0;
const {
  version,
  name
} = require('../../package.json');
exports.name = name;
exports.version = version;
const HOME = process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE'];
// 存储模板的位置
const downloadDirectory = `${HOME}/.ystoreTemplate`;
// cli配置存放位置
exports.downloadDirectory = downloadDirectory;
const CLI_DIRECTORY = `${HOME}/.ystorerc`;
// cli默认配置
exports.CLI_DIRECTORY = CLI_DIRECTORY;
const CLI_DEFAULTS = {
  API_BASE: 'https://api.github.com',
  REPO_GROUP: 'https://api.github.com',
  ASK_IN_CLI: 'ask_in_cli.js',
  CHECK_VERSION_INTERVAL: 3600 * 1000 * 24,
  DOMAIN_CONF_KEY: 'res_domain',
  newVersion: '1.0.0',
  lastVersion: '1.0.0',
  updataTime: 0,
  localVersion: '1.0.0'
};

// 模板项目
exports.CLI_DEFAULTS = CLI_DEFAULTS;
const templateRepos = ['vue-source', 'vue-template', 'template-vue-dev'];

// 包管理工具选择
exports.templateRepos = templateRepos;
const packageManagers = [{
  name: 'npm',
  installCommand: 'npm install',
  installFailTip: "use 'npm install --registry=https://registry.npm.taobao.org'"
}, {
  name: 'yarn',
  installCommand: 'yarn install',
  installFailTip: "use 'yarn install --registry=https://registry.npm.taobao.org'"
}];
exports.packageManagers = packageManagers;