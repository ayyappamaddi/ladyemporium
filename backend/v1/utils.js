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

const getPhoneNumbers = (msg) => {
    try {
        msg = msg.trim();
        const phoneNumbers = [];

        msg = msg.replace(/[^\d][0-9]{6}[^\d]/g, '');
        msg = msg.replace(/ /g,"");
        msg = msg.replace(/(\+91)[0-9]{10}/g, function (match) {
            phoneNumbers.push(match.substr(3, 10));
            return '';
        });
        msg = msg.replace(/0[0-9]{10}/g, function (match) {
            phoneNumbers.push(match.substr(1, 10));
            return '';
        });

        msg = msg.replace(/[0-9]{10}/g, function (match) {
            phoneNumbers.push(match);
            return '';
        });
        return phoneNumbers;
    } catch (err) {
        logger.info('error occured while extracting phone numbers');
        throw err;
    }
}

module.exports = {
    generateAccessToken,
    verifyAccessToken,
    getPhoneNumbers
}