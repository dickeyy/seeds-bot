const fs = require('fs')
const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: './logs/combined.log' }),
    ],
});

const log = async (logLevel,logMessage) => {

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    logger.log({
        level: logLevel,
        message: logMessage,
        meta: {
            date: date,
            time: time
        }
    });

}

exports.log = log;