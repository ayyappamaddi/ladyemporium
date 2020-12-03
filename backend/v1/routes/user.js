const ROUTE_URI = 'user';
const express = require('express');
const bcrypt = require ('bcrypt');
const userModel = require('../models/user');
const { prarameterValidator, bodyValidator } = require('../validators/product-validator');
const logger = require('../../logger');
const response = require('../../response');
const { catchAsync } = require('../../middleware');
const router = express.Router();

const routes = {
    async loginUser(req, res) {
        try {
            const userInfo = req.body;
            const emailUser = await userModel.getUsersByUserName(userInfo.userName);
            if(!emailUser){
                response.badRequest(res, 'Please enter valid username & password');
            }
            bcrypt.compare(userInfo.password, emailUser.hash, function(err, result) {
                if(result){
                    response.success(res, {userName:emailUser.userName, role:emailUser.role});
                }else{
                    response.badRequest(res, 'Please enter valid username & password');
                }
              });

        } catch (err) {
            logger.error("user::route::loginUser something went wrong", err.stack);
            response.serverError(res);
        }
    },
    async createNewUser(req, res) {
        try {
            logger.info("user::route::createNewUser");
            const context = req.userContext;
            const newUserObj = req.body;
            
            const emailUser = await userModel.getUsersByUserName(newUserObj.userName);
            if(!emailUser){
                const newUser = await userModel.createNewUser(context, newUserObj);
                response.success(res, newUser);
            }else{
                response.badRequest(res, 'given userName exists');
            }
        } catch (err) {
            logger.error("user::route::createNewUser something went wrong", err.stack);
            response.serverError(res);
        }
    },
    async getAllUsers(req, res) {
        try {
            logger.info("user::route::getAllUsers");
            // const user = req.body;
            const usersList = await userModel.getUsers();
            if (usersList) {
                response.success(res, usersList);
            } else {
                response.badRequest(res);
            }
        } catch (err) {
            logger.error("user::route::getAllUsers something went wrong", err.stack);
            response.serverError(res);
        }
    }
};

router.get('/', catchAsync(routes.getAllUsers));
router.post('/userLogin', catchAsync(routes.loginUser));
router.post('/newUesr', catchAsync(routes.createNewUser));

module.exports = {
    uri: ROUTE_URI,
    routes,
    router
};