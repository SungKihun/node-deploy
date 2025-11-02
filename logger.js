const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const winstonDaily = require('winston-daily-rotate-file');

const logDir = './logs';
const logFormat = printf(({ timestamp, level, message }) => {
   return `${timestamp} ${level}: ${message}`;
});

// const logger = createLogger({
//     level: 'info',
//     format: format.json(),
//     transports: [
//         new transports.File({ filename: 'combined.log' }),
//         new transports.File({ filename: 'error.log', level: 'error' }),
//     ],
// });

const logger = createLogger({
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat,
    ),
    transports: [
        new winstonDaily({
            level: 'info',
            datePattern: 'YYYY-MM-DD-HH',
            dirname: logDir,
            filename: `%DATE%-combined.log`,
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true,
        }),
        new winstonDaily({
            level: 'error',
            datePattern: 'YYYY-MM-DD-HH',
            dirname: logDir,
            filename: `%DATE%-error.log`,
            maxSize: '20m',
            maxFiles: '14d',
            zippedArchive: true,
        }),
    ],
  });

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({ format: format.simple() }));
}

module.exports = logger;