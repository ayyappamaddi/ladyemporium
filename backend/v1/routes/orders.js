const ROUTE_URI = 'orders';
const express = require('express');
const ordersModel = require('../models/orders');
const logger = require('../../logger');
const response = require('../../response');
const { catchAsync } = require('../../middleware');
const router = express.Router();

const routes = {
    async getOrders(req, res) {
        try {
            logger.info("order::route::getOrders");
            const query = {};
            if(req.query && req.query['orderIds']){
                const orderIds = req.query['orderIds'];
                query.orderId = {$in:orderIds.split(',')};
               }
            const ordersList = await ordersModel.getOrders(query);
            response.success(res, ordersList);
        } catch (err) {
            logger.error("order::route::getAllOrders something went wrong", err.stack);
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
    async updateOrder(req, res) {
        try {
            logger.info("order::route::updateOrder");
            const ordersList = await ordersModel.getOrders();
            response.success(res, ordersList);
        } catch (err) {
            logger.error("order::route::getAllOrders something went wrong", err.stack);
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
router.put('/', catchAsync(routes.updateOrderList));
router.put('/:orderId', catchAsync(routes.updateOrder));
router.delete('/:orderId', catchAsync(routes.deleteOrder));


module.exports = {
    uri: ROUTE_URI,
    routes,
    router
};
