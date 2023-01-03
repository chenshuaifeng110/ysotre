"use strict";

var _path = _interopRequireDefault(require("path"));
var _commander = require("commander");
var _operate = _interopRequireDefault(require("./operate"));
var _version = _interopRequireDefault(require("./utils/version"));
var _constants = require("./utils/constants");
var _printLogo = _interopRequireDefault(require("./utils/printLogo"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
(async () => {
  const program = new _commander.Command();
  try {
    await (0, _version.default)();
  } catch (error) {
    console.log(`@ystore/cli启动失败,失败原因${error}}`);
  }
  Object.keys(_operate.default).forEach(order => {
    program.command(order).alias(_operate.default[order].alias).description(_operate.default[order].description).hook('preAction', async () => {
      (0, _printLogo.default)();
    }).action(async () => {
      if (order === '*') {
        console.log(_operate.default[order].description);
      } else {
        // require('./create')('appname')
        require(_path.default.resolve(__dirname, order))(...process.argv.slice(3));
      }
    });
  });
  program.on('--help', () => {
    (0, _printLogo.default)();
    console.log('\nExamples:');
    Object.keys(_operate.default).forEach(order => {
      _operate.default[order].examples.forEach(example => {
        console.log(`  ${example}`);
      });
    });
  });
  program.version(_constants.version, '-v, --version', 'output the current version').parse(process.argv);
})();