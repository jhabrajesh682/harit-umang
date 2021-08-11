require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');

module.exports = function () {
    /**
     * winston logging 
     */
    winston.add(new winston.transports.File({ filename: 'logfile.log' }));
    winston.add(new winston.transports.MongoDB({ db: process.env.MONGODB_CONNECTION_STRING }));

    // catching uncaughtExceptions
    process.on('uncaughtException', exception => {
        console.log('we got an Uncaughted Exception')
        winston.error(exception.message, exception)
        console.log(exception);

    })

    // catching unhandledRejection
    process.on('unhandledRejection', rejection => {
        console.log('we got an Unhandled Rejection')
        winston.error(rejection)
        console.log(rejection);

    })
}