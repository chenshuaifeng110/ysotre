import axios from 'axios';

function getPackageVersion(name: string, version = '') {
  const registry = 'https://registry.npm.taobao.org'; 
  return axios.get(
    // 关于npm对package的定义 https://docs.npmjs.com/about-packages-and-modules
    `${registry}/${encodeURIComponent(name).replace(/^%40/, '@')}/${version}`,
  );
}
export default getPackageVersion;
