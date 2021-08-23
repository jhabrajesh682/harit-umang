const express = require("express")
const morgan = require('morgan')
const path = require('path')
var cors = require('cors');
const corsOption = require('../middlewares/corsoptions')
const _admin_folder = 'adminDashboard';
const error = require('../middlewares/error.middleware')
require('express-async-errors')
const fileUpload = require('express-fileupload');
var RewriteMiddleware = require('express-htaccess-middleware');
const bodyParser = require('body-parser');
module.exports = function (server) {
  server.use(fileUpload());

  server.use(morgan('tiny'))
  server.use(express.json({ limit: "50mb" }));
  server.use(express.urlencoded({ limit: "50mb", extended: true }));

  server.use(cors())
  // server.use(express.urlencoded());
  // server.use(bodyParser)
  server.use(express.urlencoded({ extended: true }))
  // Parse JSON bodies (as sent by API clients)
  server.use(express.json());

  // var RewriteOptions = {
  //   file: path.resolve('.htaccess'),
  //   verbose: (process.env.NODE_ENV == 'dev'),
  //   watch: (process.env.NODE_ENV == 'dev'),
  // };
  // server.use(RewriteMiddleware(RewriteOptions));
  server.use(bodyParser.urlencoded({
    extended: true
  }));
  /************************************ API END POINTS*************************************/

  server.use('/api/v1/students', require('../routes/student.routes'))
  server.use('/api/v1/schools', require('../routes/school.routes'))

  server.use('/api/v1/projects', require('../routes/project.routes'))
  server.use('/api/v1/admin', require('../routes/admin.routes'))
  server.use('/api/v1/captcha', require('../routes/captcha.routes'))

  server.get('*.*', express.static(_admin_folder, { maxAge: '1y' }));

  server.all('*', function (req, res) {
    res.status(200).sendFile(`/`, { root: _admin_folder });
  });
  server.use(error)

}