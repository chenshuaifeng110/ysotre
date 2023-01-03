import readline from 'readline';
import ora from 'ora';
import chalk from 'chalk';
export const clearConsole = () => {
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    // 在终端移动光标到标准输出流的起始坐标位置, 然后清除给定的TTY流
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }
};

// loading效果
export const startLoading =
  (fn: Function, message: string) =>
  async (...args: any) => {
    const spinner = ora(message);
    spinner.start();
    let result: any;
    try {
      result = await fn(...args);
      spinner.succeed();
      return result;
    } catch (error: any) {
      spinner.fail();
      console.log(chalk(`发生错误，错误原因${error.message}`));
      return false;
    }
  };
