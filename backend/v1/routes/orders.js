const ROUTE_URI = 'orders';
const express = require('express');
const ordersModel = require('../models/orders');
const logger = require('../../logger');
const response = require('../../response');
const { catchAsync } = require('../../middleware');
const constants = require('../../constants');
const rabitmq = require('../../rabitmq');
const router = express.Router();

const routes = {
    async getOrders(req, res) {
        try {
            logger.info("order::route::getOrders");
            const query = { user: req.userContext.name };
            if (req.query && req.query['orderIds']) {
                const orderIds = req.query['orderIds'];
                query.orderId = { $in: orderIds.split(',') };
            }
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
            logger.info("order::route::postOrder save products for given srach params", orderObj);
            const orderInfo = await ordersModel.saveOrder(orderObj);
            for (let i = 0; i < orderInfo.phoneNumbers.length; i++) {
                const msObj = { phoneNo: orderInfo.phoneNumbers[i], msg: "Your order Been confirmed i=>" + i + " orderId=>" + orderInfo.orderId };
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
            const orderId = +req.params.orderId;
            const orderDetails = await ordersModel.getOrders({ orderId, user: req.userContext.name });
            orderInfo = {};
            orderInfo.trackId = req.body.trackId;
            orderInfo.orderStatus = 'dispatched';
            orderInfo.orderId = orderDetails[0].orderId;
            const updatedOrderInfo = await ordersModel.updateOrder(orderInfo);
            logger.info("order::route::updatTrackeOrder");

            for (let i = 0; i < orderDetails[0].phoneNumbers.length; i++) {
                const msObj = { phoneNo: orderDetails[0].phoneNumbers[i], msg: "Your order Been dispatched, trackId:" + orderInfo.trackId};
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
router.put('/trackOrder/:orderId', catchAsync(routes.updatTrackeOrder));
router.get('/:orderId', catchAsync(routes.deleteOrder));
router.get('/saveOrder', catchAsync(routes.saveOrderInfo));
router.delete('/:orderId', catchAsync(routes.deleteOrder));


module.exports = {
    uri: ROUTE_URI,
    routes,
    router
};
