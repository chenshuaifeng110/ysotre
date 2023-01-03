"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isInitGiy = exports.initGit = void 0;
var _chalk = _interopRequireDefault(require("chalk"));
var _child_process = require("child_process");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const initGit = () => {
  try {
    if (isInitGiy()) {
      // console.log(chalk.red(`已经初始化Git不可再次初始化`));
    } else {
      (0, _child_process.execSync)('git init', {
        stdio: 'ignore'
      });
    }
  } catch (error) {
    console.warn(_chalk.default.red(`初始化git失败,失败原因${error.message}`), error);
  }
};
exports.initGit = initGit;
const isInitGiy = () => {
  try {
    (0, _child_process.execSync)('git rev-parse --is-inside-work-tree', {
      stdio: 'ignore'
    });
    return true;
  } catch (e) {
    return false;
  }
};
exports.isInitGiy = isInitGiy;