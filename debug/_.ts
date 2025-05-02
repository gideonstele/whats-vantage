import chalk from 'chalk';
import log from 'loglevel';
import logPrefix from 'loglevel-plugin-prefix';

logPrefix.reg(log);

export const getLogger = (name: string) => {
  const logger = log.getLogger(name);

  return logger;
};

export const enableLogger = (logger: log.Logger, level: log.LogLevelDesc = 'debug') => {
  logger.setDefaultLevel(level);
  logger.enableAll();

  logPrefix.apply(logger, {
    format(level, name, timestamp) {
      const color =
        level === 'DEBUG' ? chalk.gray : level === 'INFO' ? chalk.blue : level === 'WARN' ? chalk.yellow : chalk.red;

      if (level === 'DEBUG') {
        return color(`${chalk.bold(name)}:`);
      }

      return color(`[${timestamp}]${chalk.bold(name)}:${level}:`);
    },
  });
};
