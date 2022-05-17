'use strict';

const pino = require(`pino`);

const LOG_FILE = `./logs/api.log`;
const isDevMode = process.env.NODE_ENV === `development`;
const defaultLogLevel = isDevMode ? `info` : `error`;

const logger = pino({
  name: `base-logger`,
  level: process.env.NODE_ENV || defaultLogLevel,
  prettyPrint: isDevMode,
}, isDevMode ? process.stdout : pino.destination(LOG_FILE));

module.exports = {
  logger,
  getLogger(options = []) {
    return logger.child(options);
  }
};
