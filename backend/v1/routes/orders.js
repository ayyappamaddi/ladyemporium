const ROUTE_URI = 'orders';
const express = require('express');
const ordersModel = require('../models/orders');
const logger = require('../../logger');
const response = require('../../response');
const { catchAsync } = require('../../middleware');
const constants = require('../../constants');
const rabitmq = require('../../rabitmq');
const router = express.Router();
const userModel = require('../models/user');

const routes = {
    async getOrders(req, res) {
        try {
            if (!(req.userContext && req.userContext.email)) {
                response.unauthorized(res);
            }
            logger.info("order::route::getOrders");
            const query = { user: req.userContext.email };
            if (req.query && req.query['orderIds']) {
                const orderIds = req.query['orderIds'];
                query.orderId = { $in: orderIds.split(',') };
            }
            if (req.query && req.query['orderNumber']) {
                query.orderNumber = req.query['orderNumber'];
            }
            if (req.query && req.query['dateRange']) {
                
            }
            logger.info('get Orders for following query', JSON.stringify(query));
            const ordersList = await ordersModel.getOrders(query);
            response.success(res, ordersList);
        } catch (err) {
            logger.error("order::route::getAllOrders something went wrong", err.stack);
            response.serverError(res);
        }
    },
    async saveOrderInfo(req, res) {
        try {
            logger.info("order::route::postOrders");
            let orderObj = {};
            orderObj.shippingAddress = req.query.shippingAddress;
            orderObj.msgIds = [req.query.msgId];
            orderObj.user = req.query.user;
            orderObj.orderDate = new Date();

            logger.info("order::route::postOrder save products for given srach params", orderObj);
            const orderInfo = await ordersModel.saveOrder(orderObj);
            response.success(res, orderInfo);
        } catch (err) {
            logger.error("order::route::saveOrderInfo something went wrong", err.stack);
            response.serverError(res);
        }
    },
    async postOrder(req, res) {
        try {
            logger.info("order::route::postOrders");
            let orderObj = req.body;
            if(orderObj.shippingAddress.length > 350 ){
                response.serverError(res);
                return;
            }
            let userInfo = await userModel.getUsersByUserName(orderObj.user, orderObj.userPhone);
            orderObj.user = userInfo.email;
            logger.info("order::route::postOrder save products for given srach params", orderObj);
            const orderInfo = await ordersModel.saveOrder(orderObj);
            for (let i = 0; i < orderInfo.phoneNumbers.length; i++) {
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

                const msObj = {
                    phoneNo: orderInfo.phoneNumbers[i],
                    msg: orderMsg
                };
                var buf = Buffer.from(JSON.stringify(msObj), 'utf8');
                await rabitmq.publishMsg(buf);
            }
            response.success(res, orderInfo);

        } catch (err) {
            logger.error("order::route::postOrder something went wrong", err.stack);
            response.serverError(res);
        }
    },
    async updateOrderList(req, res) {
        try {
            logger.info("order::route::updateOrderList");
            const updateOrderList = req.body;

            for (let i = 0; i < updateOrderList.length; i++) {
                updateOrderList[i].user = req.userContext.email;
                await ordersModel.updateOrder(updateOrderList[i]);
            }
            response.success(res, 'orders are updated');
        } catch (err) {
            logger.error("order::route::getAllOrders something went wrong", err.stack);
            response.serverError(res);
        }
    },
    async updatTrackeOrder(req, res) {
        try {
            const orderNumber = req.params.orderNumber;
            logger.info('logged in user email ', req.userContext.email);
            const orderDetails = await ordersModel.getOrders({ orderNumber, user: req.userContext.email });
            orderInfo = {};
            orderInfo.trackId = req.body.trackId;
            orderInfo.orderStatus = 'dispatched';
            orderInfo.orderId = orderDetails[0].orderId;
            orderInfo.user = orderDetails[0].user;
            const updatedOrderInfo = await ordersModel.updateOrder(orderInfo);
            logger.info("order::route::updatTrackeOrder");

            for (let i = 0; i < orderDetails[0].phoneNumbers.length; i++) {
                const msObj = {
                    phoneNo: orderDetails[0].phoneNumbers[i],
                    msg: "Your order Been dispatche d, trackId:" + req.body.trackId + " THIS IS AUTO GENERATED MSG *** Please donot reply ***"
                };
                logger.info(msObj.phoneNo, '<=====>', msObj.msg);
                var buf = Buffer.from(JSON.stringify(msObj), 'utf8');
                await rabitmq.publishMsg(buf);
            }

            response.success(res, updatedOrderInfo);
        } catch (err) {
            logger.error("order::route::getAllOrders something went wrong", err.stack);
            response.serverError(res);
        }
    },
    async searchOrders(req, res) {
        try {
            logger.info("order::route::searchOrders");
            let searchObj = req.body;

            // non admins cant track orders
            if (req.userContext && req.userContext.role === constants.ADMINUSER) {
            } else if (!(searchObj.searchTerm.length === 10 && typeof (searchObj.searchTerm * 1) === "number")) {
                response.badRequest(res, { message: "Please provide valid search term" });
            }

            logger.info("order::route::searchOrders get products for given srach params", searchObj);
            const filterdOrders = await ordersModel.searchOrder(req.userContext, searchObj);
            response.success(res, filterdOrders);
        } catch (err) {
            logger.error("order::route::deleteOrder something went wrong", err.stack);
            response.serverError(res);
        }
    },
    async deleteOrder(req, res) {
        try {
            logger.info("order::route::deleteOrder");
            const orderId = +req.params.orderId;
            const a = await ordersModel.deleteOrder(orderId);
            response.success(res, a);
        } catch (err) {
            logger.error("order::route::deleteOrder something went wrong", err.stack);
            response.serverError(res);
        }
    }
};

router.get('/', catchAsync(routes.getOrders));
router.post('/', catchAsync(routes.postOrder));
router.post('/search', catchAsync(routes.searchOrders));
router.put('/', catchAsync(routes.updateOrderList));
router.put('/trackOrder/:orderNumber', catchAsync(routes.updatTrackeOrder));
// router.get('/:orderId', catchAsync(routes.deleteOrder));
router.get('/saveOrder', catchAsync(routes.saveOrderInfo));
router.delete('/:orderId', catchAsync(routes.deleteOrder));


module.exports = {
    uri: ROUTE_URI,
    routes,
    router
};
