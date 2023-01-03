import fs from 'fs';
import path from 'path';
import { decode, encode } from 'ini';
import { CLI_DIRECTORY, CLI_DEFAULTS } from './constants';

export const readFile = (k: string) => {
  const has = fs.existsSync(CLI_DIRECTORY);
  let opts;
  if (has) {
    opts = fs.readFileSync(CLI_DIRECTORY, 'utf8');
    opts = decode(opts);
    return opts[k];
  }
  return CLI_DEFAULTS[k];
};
export const writeFile = (k: string, v: string) => {
  const has = fs.existsSync(CLI_DIRECTORY);
  let opts;
  if (has) {
    opts = fs.readFileSync(CLI_DIRECTORY, 'utf8');
    opts = decode(opts);
    Object.assign(opts, { [k]: v });
  } else {
    opts = Object.assign(CLI_DEFAULTS, { [k]: v });
  }
  fs.writeFileSync(CLI_DIRECTORY, encode(opts), 'utf8');
};

export const getAll = async (): Promise<any> => {
  const has = fs.existsSync(CLI_DIRECTORY);
  let opts;
  if (has) {
    opts = fs.readFileSync(CLI_DIRECTORY, 'utf8');
    opts = decode(opts);
    return opts;
  }
  return CLI_DEFAULTS;
};

export const rmDir = (url: string) => {
  let files = [];
  if (fs.existsSync(url)) {
    files = fs.readdirSync(url);
    files.forEach(function (file) {
      let curPath = path.join(url, file);
      if (fs.statSync(curPath).isDirectory()) {
        rmDir(curPath);
      } else fs.unlinkSync(curPath);
    });
    fs.rmdirSync(url);
  }
};

export const hasDirectory = (dir: string) => {
  return fs.existsSync(dir);
};
