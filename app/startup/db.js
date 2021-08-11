const mongoose = require("mongoose");

require("dotenv").config();
const mongodbConnectionString = process.env.MONGODB_CONNECTION_STRING;
const chalk = require("chalk");
var connected = chalk.bold.green;
var error = chalk.bold.yellow;
var disconnected = chalk.bold.red;
var termination = chalk.bold.magenta;

const winston = require('winston');
require('winston-mongodb');

module.exports = function () {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.connect(mongodbConnectionString)
    .then(() => winston.info('Connected to MongoDB...'));

  mongoose.connection.on("connected", function () {
    console.log(connected("Mongoose default connection is open "));
  });

  mongoose.connection.on("error", function (err) {
    console.log(
      error("Mongoose default connection has occured " + err + " error")
    );
  });

  mongoose.connection.on("disconnected", function () {
    console.log(disconnected("Mongoose default connection is disconnected"));
  });

  process.on("SIGINT", function () {
    mongoose.connection.close(function () {
      console.log(
        termination(
          "Mongoose default connection is disconnected due to application termination"
        )
      );
      process.exit(0);
    });
  });
};
