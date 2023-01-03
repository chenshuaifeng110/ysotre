"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeFile = exports.rmDir = exports.readFile = exports.hasDirectory = exports.getAll = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _ini = require("ini");
var _constants = require("./constants");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const readFile = k => {
  const has = _fs.default.existsSync(_constants.CLI_DIRECTORY);
  let opts;
  if (has) {
    opts = _fs.default.readFileSync(_constants.CLI_DIRECTORY, 'utf8');
    opts = (0, _ini.decode)(opts);
    return opts[k];
  }
  return _constants.CLI_DEFAULTS[k];
};
exports.readFile = readFile;
const writeFile = (k, v) => {
  const has = _fs.default.existsSync(_constants.CLI_DIRECTORY);
  let opts;
  if (has) {
    opts = _fs.default.readFileSync(_constants.CLI_DIRECTORY, 'utf8');
    opts = (0, _ini.decode)(opts);
    Object.assign(opts, {
      [k]: v
    });
  } else {
    opts = Object.assign(_constants.CLI_DEFAULTS, {
      [k]: v
    });
  }
  _fs.default.writeFileSync(_constants.CLI_DIRECTORY, (0, _ini.encode)(opts), 'utf8');
};
exports.writeFile = writeFile;
const getAll = async () => {
  const has = _fs.default.existsSync(_constants.CLI_DIRECTORY);
  let opts;
  if (has) {
    opts = _fs.default.readFileSync(_constants.CLI_DIRECTORY, 'utf8');
    opts = (0, _ini.decode)(opts);
    return opts;
  }
  return _constants.CLI_DEFAULTS;
};
exports.getAll = getAll;
const rmDir = url => {
  let files = [];
  if (_fs.default.existsSync(url)) {
    files = _fs.default.readdirSync(url);
    files.forEach(function (file) {
      let curPath = _path.default.join(url, file);
      if (_fs.default.statSync(curPath).isDirectory()) {
        rmDir(curPath);
      } else _fs.default.unlinkSync(curPath);
    });
    _fs.default.rmdirSync(url);
  }
};
exports.rmDir = rmDir;
const hasDirectory = dir => {
  return _fs.default.existsSync(dir);
};
exports.hasDirectory = hasDirectory;