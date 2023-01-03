"use strict";

var _chalk = _interopRequireDefault(require("chalk"));
var _async = _interopRequireDefault(require("async"));
var _path = _interopRequireDefault(require("path"));
var _inquirer = _interopRequireDefault(require("inquirer"));
var _ncp = _interopRequireDefault(require("ncp"));
var _fs = _interopRequireDefault(require("fs"));
var _metalsmith = _interopRequireDefault(require("metalsmith"));
var _child_process = require("child_process");
var _utils = require("../utils");
var _git = require("../utils/git");
var _files = require("../utils/files");
var _download = require("../utils/download");
var _initGit = require("../utils/initGit");
var _constants = require("../utils/constants");
var _ejs = _interopRequireDefault(require("ejs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
module.exports = async appname => {
  if (!appname) return console.log(_chalk.default.red('command格式错误, 请输入 ystore create appname'));
  // 更改终端所在目录
  let templateDir = _path.default.join(process.cwd(), appname);
  if ((0, _files.hasDirectory)(templateDir)) return console.log(_chalk.default.red(`工程名 ---> ${appname} 重复`));
  // 0> 获取git模板仓库信息
  let repos = await (0, _utils.startLoading)(_git.fetchRepoList, '正在获取模板列表 ....')();
  const {
    repo
  } = await _inquirer.default.prompt({
    name: 'repo',
    type: 'list',
    message: '请选择创建工程的模板仓库',
    choices: repos
  });
  // 2) 拉取远程仓库版本
  let tags = await (0, _utils.startLoading)(_git.fetchTagList, '正在拉取 tags ....')(repo);
  const {
    tag
  } = await _inquirer.default.prompt({
    name: 'tag',
    type: 'list',
    message: '请选择创建工程的模板版本',
    choices: tags
  });
  // 3) 将模板缓存下来
  const result = await (0, _utils.startLoading)(_download.download, '正在下载模板中 ...')(repo, tag);
  // let result = 'C:/Users/Lenovo/.ystoreTemplate/template-vue-dev';
  if (!result) return;
  // 4) 选择使用的包管理工具， npm / yarn
  const {
    packageManagerName
  } = await _inquirer.default.prompt({
    name: 'packageManagerName',
    type: 'list',
    message: '请选择之一包管理工具下载依赖',
    choices: _constants.packageManagers.map(item => item.name)
  });
  const packageItem = _constants.packageManagers.find(item => item.name === packageManagerName);
  const installDependencies = () => {
    try {
      process.chdir(templateDir);
      (0, _child_process.execSync)(packageItem === null || packageItem === void 0 ? void 0 : packageItem.installCommand, {
        stdio: 'ignore'
      });
    } catch (error) {
      console.log(_chalk.default.red(`使用${packageItem === null || packageItem === void 0 ? void 0 : packageItem.name}${error.message}`));
    }
  };
  const successTip = () => {
    console.log(_chalk.default.green('异步下载node_modules中,此操作用时可能过长，请耐心等待 ...'));
    installDependencies();
    const repoDir = `${_constants.downloadDirectory}/${repo}`;
    (0, _files.rmDir)(repoDir);
    (0, _initGit.initGit)();
    console.log(_chalk.default.green('初始化模板仓库成功，请:'));
    console.log();
    console.log(_chalk.default.cyan('  cd'), appname);
    console.log(`  ${_chalk.default.cyan(`${packageItem === null || packageItem === void 0 ? void 0 : packageItem.name} run serve`)}`);
  };
  const CONFIG = await (0, _files.getAll)();
  let TPLConfig;
  const ask = async (files, metalsmith, done) => {
    TPLConfig = require(_path.default.join(result, CONFIG.ASK_IN_CLI));
    const prompts = await _inquirer.default.prompt(TPLConfig.requiredPrompts || TPLConfig);
    const meta = metalsmith.metadata();
    Object.assign(meta, prompts);
    done();
  };
  const template = (files, metalsmith, done) => {
    const metadata = metalsmith.metadata();
    const effectFiles = TPLConfig.effectFiles || [];
    const keys = Object.keys(files);
    const run = async file => {
      if (effectFiles.includes(file)) {
        let content = files[file].contents.toString();
        if (/<%=([\s\S]+?)%>/g.test(content)) {
          let options = {
            async: true
          };
          content = await _ejs.default.render(content, metadata, options);
          files[file].contents = Buffer.from(content);
          done();
        } else {
          done();
        }
      }
    };
    _async.default.each(keys, run, done);
  };
  const copy = () => {
    successTip();
  };
  // 4）进行拷贝操作
  if (!_fs.default.existsSync(_path.default.join(result, CONFIG.ASK_IN_CLI))) {
    (0, _ncp.default)(result, _path.default.resolve(appname), error => {
      if (error) {
        return console.log((0, _chalk.default)(`拷贝操作发生错误，错误原因${error.message}`));
      } else {
        successTip();
      }
    });
  } else {
    (0, _metalsmith.default)(__dirname).source(result).destination(_path.default.resolve(appname)).use(ask).use(template).build(function (err) {
      if (err) throw err;else copy();
    });
  }
};