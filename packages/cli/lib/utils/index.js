"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startLoading = exports.clearConsole = void 0;
var _readline = _interopRequireDefault(require("readline"));
var _ora = _interopRequireDefault(require("ora"));
var _chalk = _interopRequireDefault(require("chalk"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const clearConsole = () => {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    // 在终端移动光标到标准输出流的起始坐标位置, 然后清除给定的TTY流
    _readline.default.cursorTo(process.stdout, 0, 0);
    _readline.default.clearScreenDown(process.stdout);
  }
};

// loading效果
exports.clearConsole = clearConsole;
const startLoading = (fn, message) => async (...args) => {
  const spinner = (0, _ora.default)(message);
  spinner.start();
  let result;
  try {
    result = await fn(...args);
    spinner.succeed();
    return result;
  } catch (error) {
    spinner.fail();
    console.log((0, _chalk.default)(`发生错误，错误原因${error.message}`));
    return false;
  }
};
exports.startLoading = startLoading;