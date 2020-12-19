const logger = require('../logger');

var jwt = require('jsonwebtoken');

const secretKey = 'ayyappamaddi1244';
const generateAccessToken = (user) => {
    var token = jwt.sign(user, secretKey, { expiresIn: 6 * 60 * 60 });
    return token;
}

const verifyAccessToken = (authorization) => {
    try {
        const token = authorization.split(' ')[1];
        var decodedValue = jwt.verify(token, secretKey);
        return decodedValue;
    } catch (err) {
        logger.info('error occur while validating jwt');
        throw err;

    }
}


module.exports = {
    generateAccessToken,
    verifyAccessToken
}