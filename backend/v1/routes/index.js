const app = require('express');
const products = require('./products');
const users = require('./user');
const twilio = require('./twilio');
const orders = require('./orders');

const router = app.Router();

router.use(`/${products.uri}`, products.router);
router.use(`/${users.uri}`, users.router);
router.use(`/${twilio.uri}`, twilio.router);
router.use(`/${orders.uri}`, orders.router);
module.exports = {
    routes: router
};