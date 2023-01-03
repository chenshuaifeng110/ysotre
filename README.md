## 操作指南

npm install ystore/cli -g

projectName(项目名称)，基于当前命令执行路径，并将模板拷贝到这个项目文件夹下

options(可选参数)：

- -f: 强制删除当前命令执行路径下已存在的 projectName 文件夹；
- -h：帮助，commander 原生提供

chalk 美化命令行输出的工具

## 本地开发调式

1. `npm link`

将 ystore 挂在本地全局

2. `ystore` -v

查看全局命令

3. `npm xx`

项目开发
