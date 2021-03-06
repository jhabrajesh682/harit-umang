
const jwt = require('jsonwebtoken');
require('dotenv').config();



var jwttoken = function (userid) {


    // Filter user from the users array by username and password
    const user = userid;

    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ userid }, process.env.accessTokenSecret, {
            expiresIn: process.env.JWT_EXPIRY_TIME
        });


        return accessToken;

    } else {
        return 0;
    }
}


var jwttokenAdmin = function (userId, isAdmin) {


    // Filter user from the users array by username and password
    const user = userId;

    if (user) {
        // Generate an access token
        const accessToken = jwt.sign({ userId, isAdmin: isAdmin }, process.env.accessTokenSecret, {
            expiresIn: process.env.JWT_EXPIRY_TIME
        });


        return accessToken;

    } else {
        return 0;
    }
}



module.exports.jwttoken = jwttoken;
module.exports.jwttokenAdmin = jwttokenAdmin;
