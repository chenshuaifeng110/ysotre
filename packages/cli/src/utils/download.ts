import { downloadDirectory } from './constants';
import downloadGitRepoOrigin from 'download-git-repo';
// 下载仓库
export const download = async (repo: string, tag: string) => {
  let api = `chenshuaifeng110/${repo}`;
  if (tag) {
    api += `#${tag}`;
  }
  const taget = `${downloadDirectory}/${repo}`;
  return new Promise((resolve, reject) => {
    downloadGitRepoOrigin(api, taget, (err: any) => {
      if (err) reject(err);
      else resolve(taget);
    });
  });
};
