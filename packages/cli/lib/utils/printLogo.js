"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _chalk = _interopRequireDefault(require("chalk"));
var _figlet = _interopRequireDefault(require("figlet"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// 打印Logo
const printLogo = async (logo = 'Y X T') => {
  try {
    const result = _figlet.default.textSync(logo, {
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    });
    console.log(_chalk.default.green(result));
  } catch (error) {
    console.warn("figlet 运行出错");
  }
};
var _default = printLogo;
exports.default = _default;