import type { CLI } from '../index.d';
export const { version, name } = require('../../package.json');
const HOME = process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE'];
// 存储模板的位置
export const downloadDirectory = `${HOME}/.ystoreTemplate`;
// cli配置存放位置
export const CLI_DIRECTORY = `${HOME}/.ystorerc`;
// cli默认配置
export const CLI_DEFAULTS: CLI = {
  API_BASE: 'https://api.github.com',
  REPO_GROUP: 'https://api.github.com',
  ASK_IN_CLI: 'ask_in_cli.js',
  CHECK_VERSION_INTERVAL: 3600 * 1000 * 24,
  DOMAIN_CONF_KEY: 'res_domain',
  newVersion: '1.0.0',
  lastVersion: '1.0.0',
  updataTime: 0,
  localVersion: '1.0.0',
};

// 模板项目
export const templateRepos = ['vue-source', 'vue-template', 'template-vue-dev'];

// 包管理工具选择
export const packageManagers = [
  {
    name: 'npm',
    installCommand: 'npm install',
    installFailTip: "use 'npm install --registry=https://registry.npm.taobao.org'",
  },
  {
    name: 'yarn',
    installCommand: 'yarn install',
    installFailTip: "use 'yarn install --registry=https://registry.npm.taobao.org'",
  },
];
