import chalk from 'chalk';
import { execSync } from 'child_process';
export const initGit = () => {
  try {
    if (isInitGiy()) {
      // console.log(chalk.red(`已经初始化Git不可再次初始化`));
    } else {
      execSync('git init', { stdio: 'ignore' });
    }
  } catch (error: any) {
    console.warn(chalk.red(`初始化git失败,失败原因${error.message}`), error);
  }
};

export const isInitGiy = () => {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
};
