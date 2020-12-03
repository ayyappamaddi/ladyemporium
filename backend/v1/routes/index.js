const app = require('express');
const products = require('./products');
const users = require('./user');

const router = app.Router();

router.use(`/${products.uri}`, products.router);
router.use(`/${users.uri}`, users.router);
module.exports = {
    routes: router
};