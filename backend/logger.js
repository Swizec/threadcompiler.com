// https://gist.github.com/Necmttn/e704212ccbdc57a1155a68e384741c82

const winston = require('winston')

const logger = winston.createLogger({
    level: 'debug',
    //  (typeof(process.env.NODE_ENV) === 'string' && process.env.NODE_ENV.startsWith('prod'))
    //    ? 'info'
    //    : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.json()
    ),
    transports: [new winston.transports.Console()],
})

module.exports = logger