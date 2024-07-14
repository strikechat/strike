import chalk from "chalk";

export class Logger {
  private static formattedTimestamp() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds}`;
  }

  public static info(message: string) {
    console.log(
      chalk.blue(
        `${chalk.bgBlue(this.formattedTimestamp())} ${chalk.bgBlue.white(
          "INFO"
        )} `
      ) + message
    );
  }

  public static error(message: string) {
    console.log(
      chalk.red(
        `${chalk.bgRed(this.formattedTimestamp())} ${chalk.bgRed.white(
          "ERROR"
        )} `
      ) + message
    );
  }

  public static warn(message: string) {
    console.log(
      chalk.yellow(
        `${chalk.bgYellow(this.formattedTimestamp())} ${chalk.bgYellow.white(
          "WARN"
        )} `
      ) + message
    );
  }

  public static debug(message: string) {
    console.log(
      chalk.green(
        `${chalk.bgGreen(this.formattedTimestamp())} ${chalk.bgGreen.white(
          "DEBUG"
        )} `
      ) + message
    );
  }

  public static trace(message: string) {
    console.log(
      chalk.magenta(
        `${chalk.bgMagenta(this.formattedTimestamp())} ${chalk.bgMagenta.white(
          "TRACE"
        )} `
      ) + message
    );
  }
}
