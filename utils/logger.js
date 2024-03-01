const winston = require('winston')
require('winston-daily-rotate-file');

const { createLogger, transports, format } = winston

var path = require('path');

const logger = createLogger({
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.json()
  ),
  defaultMeta: { service: 'products-ws' },
  transports: [
    new transports.File({ filename: './logs/products-ws.log' }),
    new transports.DailyRotateFile({
      filename: './logs/products-ws-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '1m',
    }),
    new transports.Console()
  ]
});


module.exports = logger