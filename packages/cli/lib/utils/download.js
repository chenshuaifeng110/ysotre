"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.download = void 0;
var _constants = require("./constants");
var _downloadGitRepo = _interopRequireDefault(require("download-git-repo"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// 下载仓库
const download = async (repo, tag) => {
  let api = `chenshuaifeng110/${repo}`;
  if (tag) {
    api += `#${tag}`;
  }
  const taget = `${_constants.downloadDirectory}/${repo}`;
  return new Promise((resolve, reject) => {
    (0, _downloadGitRepo.default)(api, taget, err => {
      if (err) reject(err);else resolve(taget);
    });
  });
};
exports.download = download;