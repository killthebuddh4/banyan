import chalk from "chalk";

export const logGood = (data: unknown) => {
  console.log(chalk.green(JSON.stringify(data, null, 2)));
};
