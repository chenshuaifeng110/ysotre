import axios from 'axios';
import chalk from 'chalk';
import { templateRepos } from './constants';
import { getAll } from './files';

// 获取模板列表
export const fetchRepoList = async () => {
  const data = templateRepos.map((item) => ({ name: item }));
  return data;
};

// 获取tag列表
export const fetchTagList = async (repo: string) => {
  try {
    const CONFIG = await getAll();
    const { data } = await axios.get(`${CONFIG.API_BASE}/repos/chenshuaifeng110/${repo}/tags`);
    return data;
  } catch (error: any) {
    console.log(chalk.red(`拉取Tag时发生错误，错误原因${error.message}`));
  }
};
