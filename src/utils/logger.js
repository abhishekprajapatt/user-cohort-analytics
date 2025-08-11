import { LOG_LEVELS } from './constants.js';

class Logger {
  constructor() {
    this.level = process.env.LOG_LEVEL || LOG_LEVELS.INFO;
  }

  log(level, message, ...args) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    if (this.shouldLog(level)) {
      console.log(logMessage, ...args);
    }
  }

  shouldLog(level) {
    const levels = {
      [LOG_LEVELS.ERROR]: 0,
      [LOG_LEVELS.WARN]: 1,
      [LOG_LEVELS.INFO]: 2,
      [LOG_LEVELS.DEBUG]: 3,
    };

    return levels[level] <= levels[this.level];
  }

  error(message, ...args) {
    this.log(LOG_LEVELS.ERROR, message, ...args);
  }

  warn(message, ...args) {
    this.log(LOG_LEVELS.WARN, message, ...args);
  }

  info(message, ...args) {
    this.log(LOG_LEVELS.INFO, message, ...args);
  }

  debug(message, ...args) {
    this.log(LOG_LEVELS.DEBUG, message, ...args);
  }

  // Special methods for cohort analysis logging
  cohortInfo(message, stats = {}) {
    this.info(`[COHORT] ${message}`, stats);
  }

  cohortError(message, error) {
    this.error(`[COHORT] ${message}`, error);
  }

  apiRequest(method, url, statusCode) {
    this.info(`[API] ${method} ${url} - ${statusCode}`);
  }

  dbOperation(operation, collection, result) {
    this.debug(`[DB] ${operation} on ${collection}`, result);
  }
}

export default new Logger();
