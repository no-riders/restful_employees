const jwt = require('jsonwebtoken');

//verify token against server, error handling in case of wrong or no token
//token is passed in Headers
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch(error) {
        return res.status(401).json({
            message: 'Auth failed'
        })
    }
}