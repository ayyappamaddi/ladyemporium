const app = require('express');
const products = require('./products');
const users = require('./user');
const twilio = require('./twilio');

const router = app.Router();

router.use(`/${products.uri}`, products.router);
router.use(`/${users.uri}`, users.router);
router.use(`/${twilio.uri}`, twilio.router);
module.exports = {
    routes: router
};