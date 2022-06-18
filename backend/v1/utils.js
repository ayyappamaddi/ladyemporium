const logger = require('../logger');
const rabitmq = require('../rabitmq');
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

const getPostalCode = (msg)=>{
    let postalCode;
    msg = msg.trim();
    msg.replace(/[^\d][0-9]{6}[^\d]/g, function (match) {
        postalCode = match;
        return '';
    });
    return postalCode;
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
const setOrderConfirmationMsg = (orderInfo, userInfo)=>{
    orderMsg = `Your Saree / Dress Been confirmed Order No: ${orderInfo.orderNumber} `;
    if (orderInfo.postalCode) {
        orderMsg += ` Shipping postcode: ${orderInfo.postalCode}`;
    }

    if (orderInfo.phoneNumbers && orderInfo.phoneNumbers.length) {
        orderMsg += ` With Phone numbers: `;
        let separator = '';
        orderInfo.phoneNumbers.map(phoneNo => {
            ePhoneNo = phoneNo.replace(/^\d{1,5}/, m => m.replace(/\d/g, '*'));
            orderMsg += `${ePhoneNo}${separator} `;
            separator = ',';
        });
    }
    orderMsg += 'THIS IS AUTO GENERATED MSG  *** Please donot reply ***';
}

const publishMsg = async (orderMsg, phoneNumbers)=>{
    for (let i = 0; i < phoneNumbers.length; i++) {
        const msObj = {
            phoneNo: phoneNumbers[i],
            msg: orderMsg
        };
        var buf = Buffer.from(JSON.stringify(msObj), 'utf8');
        await rabitmq.publishMsg(buf);
    }
}
module.exports = {
    generateAccessToken,
    verifyAccessToken,
    getPhoneNumbers,
    getPostalCode,
    setOrderConfirmationMsg,
    publishMsg
}