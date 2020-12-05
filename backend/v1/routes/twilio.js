const ROUTE_URI = 'twilio';
const express = require('express');
const bcrypt = require ('bcrypt');
const userModel = require('../models/user');
const logger = require('../../logger');
const response = require('../../response');
const { catchAsync } = require('../../middleware');
const router = express.Router();

const routes = {
    async twilioPostMsg(req, res) {
        try {
            logger.info("twilio::route::twilioPostMsg");
            const context = req.userContext;
            const newMsgBody = req.body;
            console.log('twilio msg body ', newMsgBody);
            response.success(res, {msg:'successfully received post msg'});
        } catch (err) {
            logger.error("Twilio::route::createNewUser something went wrong", err.stack);
            response.serverError(res);
        }
    },
    async twilioGetMsg(req, res) {
        try {
            logger.info("twilio::route::twilioGetMsg");
            response.success(res, {msg:'successfully received get msg'});
        } catch (err) {
            logger.error("Twilio::route::getAllUsers something went wrong", err.stack);
            response.serverError(res);
        }
    }
};

router.get('/postmsg', catchAsync(routes.twilioGetMsg));
router.post('/postmsg', catchAsync(routes.twilioPostMsg));

module.exports = {
    uri: ROUTE_URI,
    routes,
    router
};
