const express=require("express")
const server = express();  

require('./startup/routes')(server);
require('./startup/logging')()



if (!process.env.JWT_PRIVATE_KEY) {
    console.error('FATAL ERROR: JWT_PRIVATE_KEY is not been defined in env.')
    process.exit(1)
}


module.exports = server;




