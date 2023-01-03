"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function getPackageVersion(name, version = '') {
  const registry = 'https://registry.npm.taobao.org';
  return _axios.default.get(
  // 关于npm对package的定义 https://docs.npmjs.com/about-packages-and-modules
  `${registry}/${encodeURIComponent(name).replace(/^%40/, '@')}/${version}`);
}
var _default = getPackageVersion;
exports.default = _default;