import chalk from "chalk";

export const logBad = (data: unknown) => {
  console.log(chalk.red(JSON.stringify(data, null, 2)));
};
