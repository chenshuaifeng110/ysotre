"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const operations = {
  create: {
    alias: 'c',
    description: 'create a template project',
    examples: ['ystore create <project-name>']
  },
  clean: {
    alias: 'cl',
    description: 'clean the cache in local disk',
    examples: ['ystore clean']
  },
  '*': {
    alias: '',
    description: 'command not found',
    examples: []
  }
};
var _default = operations;
exports.default = _default;