
import chalk from 'chalk'
import figlet from 'figlet'
// 打印Logo
 const printLogo = async (logo: string = 'Y X T') => {
  try {
    const result = figlet.textSync(logo, {
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
     })
    console.log(chalk.green(result!))
  } catch (error) {
    console.warn("figlet 运行出错");
  }
};
export default printLogo