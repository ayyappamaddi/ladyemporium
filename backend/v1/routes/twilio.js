const ROUTE_URI = 'twilio';
const express = require('express');
const twilioMsgModel = require('../models/twilio');
const ordersModel = require('../models/orders');
const usersModel = require('../models/user');
const logger = require('../../logger');
const response = require('../../response');
const { catchAsync } = require('../../middleware');
const router = express.Router();
const orderDelimeter = '11';
const printDelimeter = 'print';
async function handleOrders(twilioMsg) {
    const newOrder = { msgIds: [], orderImages: [], orderStatus: 'confirmed', orderDate: new Date(), shippingAddress: '' };

    msgList = await twilioMsgModel.getTwilioMsgs({ processed: false });
    for (let i = 0; msgList && i < msgList.length; i++) {
        newOrder.msgIds.push(msgList[i].msgId);
        if (msgList[i].mediaUrl) {
            newOrder.orderImages.push(msgList[i].mediaUrl);
        }
        newOrder.shippingAddress += ' ' + msgList[i].msgBody
        await twilioMsgModel.updateUnprocessedMsg(msgList[i]);
    }
    if (msgList && msgList.length) {
        await ordersModel.saveOrder(newOrder);
    }
}
async function printOrders(userName){
    
    msgList = await twilioMsgModel.getTwilioMsgs({ processed: false });
    for (let i = 0; msgList && i < msgList.length; i++) {
        const newOrder = { msgIds: [], orderImages: [], orderStatus: 'confirmed', orderDate: new Date(), shippingAddress: '' };
        newOrder.msgIds.push(msgList[i].msgId);
        if (msgList[i].mediaUrl) {
            newOrder.orderImages.push(msgList[i].mediaUrl);
        }
        newOrder.shippingAddress += ' ' + msgList[i].msgBody;
        newOrder.user = userName;
        await twilioMsgModel.updateUnprocessedMsg(msgList[i]);
        await ordersModel.saveOrder(newOrder);
    }
}
const routes = {

    async  twilioPostMsg(req, res) {
        try {
            logger.info("twilio::route::twilioPostMsg");
            const context = req.userContext;
            const newMsgBody = req.body;
            const twilioMsg = {
                messageSid: newMsgBody.MessageSid,
                msgBody: newMsgBody.Body,
                msgFrom: newMsgBody.From,
                msgTo: newMsgBody.To,
                mediaUrl: newMsgBody.MediaUrl0,
                MediaContentType: newMsgBody.MediaContentType0,
                processed: false
            }

            // twilioMsgModel.saveTwilioMsg(context, twilioMsg);
            if (newMsgBody.Body && newMsgBody.Body.toLowerCase() === printDelimeter) {
                const phoneNumber = twilioMsg.msgFrom.replace("whatsapp:+91",'');
                const userInfo = await usersModel.getUsersByUserName('',phoneNumber);
                newMsgBody.Body.user = userInfo.name;
                await printOrders(userInfo.name);
                twilioMsg.processed = true;
            }else if (newMsgBody.Body && newMsgBody.Body.toLowerCase() === orderDelimeter) {
                await handleOrders(newMsgBody.Body);
                twilioMsg.processed = true;
            }
            twilioMsgModel.saveTwilioMsg(context, twilioMsg);
            response.success(res, { msg: 'successfully received twilio post msg' });
        } catch (err) {
            logger.error("Twilio::route::postMsg something went wrong", err.stack);
            response.serverError(res);
        }
    },
    async twilioGetMsg(req, res) {
        try {
            logger.info("twilio::route::twilioGetMsg");
            const twilioMsgs = await twilioMsgModel.getTwilioMsgs();
            response.success(res, twilioMsgs);
        } catch (err) {
            logger.error("Twilio::route::getAllUsers something went wrong", err.stack);
            response.serverError(res);
        }
    }
};

router.get('/getmsg', catchAsync(routes.twilioGetMsg));
router.post('/postmsg', catchAsync(routes.twilioPostMsg));

module.exports = {
    uri: ROUTE_URI,
    routes,
    router
};
