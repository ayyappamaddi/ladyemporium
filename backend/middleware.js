const cors = require('cors');
const bodyParser = require('body-parser');
const { HEADERS } = require('./constants');
const response = require('./response');
const fileUpload = require('express-fileupload');
const userModel = require('./v1/models/user');

const createNamespace = require('continuation-local-storage').createNamespace;
const logger = require('./logger');
const utils = require('./v1/utils');

function appLogs(req, res, next) {
    const myRequest = createNamespace('app-log-nameSpace');
    const reqParam = {
        xReqId: req.headers[HEADERS.XREQUESTID],
        host: req.headers.host,
        method: req.method,
        uri: req.headers.referer
    };
    myRequest.run(() => {
        myRequest.set('reqParam', reqParam);
        logger.create();
        next();
    });
};



function noCacheMiddleware(req, res, next) {
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
};

function hasMinimumRequiredHeaders(req, res, next) {
    next();
    // if (req.headers[HEADERS.XREQUESTID]) {
    //     next();
    // } else {
    //     response.badRequest(res);
    // }
}

async function verifyUserRole(req, res, next) {
    if (req.headers.authorization) {
        try {
            if (req.headers.authorization) {
                decodedObj = utils.verifyAccessToken(req.headers.authorization);
                userInfo = await userModel.getUsersByUserName(decodedObj.userName);
                if (userInfo && userInfo.userName) {
                    req.userContext = { ...userInfo };
                } else {
                    response.badRequest();
                }
            }
        } catch (err) {
            response.unauthorized(res);
        }
    } else {
        req.userContext = { user: '', role: 'anonymus' };
    }
    next();
}

function globalMiddleware() {
    const middlewareList = [];
    middlewareList.push(cors());
    // middlewareList.push(errorHandler);
    middlewareList.push(noCacheMiddleware);

    middlewareList.push(bodyParser.urlencoded({
        extended: true
    }));

    middlewareList.push(bodyParser.json());
    middlewareList.push(fileUpload({
        createParentPath: true
    }));
    middlewareList.push(hasMinimumRequiredHeaders);
    middlewareList.push(verifyUserRole);

    middlewareList.push(appLogs);
    return middlewareList;
}

function catchAsync(fn) {
    return function (req, res, next) {
        const routePromise = fn(req, res, next);
        if (routePromise.catch) {
            routePromise.catch(err => next(err));
        }
    }
};

module.exports = {
    middlewares: globalMiddleware(),
    catchAsync
};
