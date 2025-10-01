import pino from 'pino';

// Configure logger based on environment
const isDev = process.env.NODE_ENV === 'development';

export const logger = pino({
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  transport: isDev ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname',
    }
  } : undefined,
  redact: {
    paths: ['req.headers.authorization', 'password', 'token'],
    censor: '[REDACTED]'
  }
});

export default logger;