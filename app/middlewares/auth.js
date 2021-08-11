const jwt = require('jsonwebtoken')
const jwtPrivateKey = process.env.accessTokenSecret

module.exports = function auth(req, res, next) {
    const token = req.header('x-auth-token')

    if (!token) {
        return res.status(401).send({ message: "Access denied.No token Provided. " })
    }
    try {
        const decode = jwt.verify(token, jwtPrivateKey)
        req.user = decode
        next()
    } catch (error) {
        res.status(400).send({ message: "invalid Token." })
    }
}

