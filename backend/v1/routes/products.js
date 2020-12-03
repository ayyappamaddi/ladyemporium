const ROUTE_URI = 'products';
const express = require('express');
const products = require('../models/products');
const { prarameterValidator, bodyValidator } = require('../validators/product-validator');
const logger = require('../../logger');
const response = require('../../response');
const { catchAsync } = require('../../middleware');
const AWS = require('aws-sdk');

const { S3, CreateBucketCommand, DeleteObjectCommand, PutObjectCommand, DeleteBucketCommand } = require("@aws-sdk/client-s3");
const { S3RequestPresigner } = require("@aws-sdk/s3-request-presigner");
const { createRequest } = require("@aws-sdk/util-create-request");
const { formatUrl } = require("@aws-sdk/util-format-url");


const { config } = require('../../config');
const router = express.Router();

const routes = {
    async getAllProducts(req, res) {
        try {
            logger.info("product::route::getAllProducts");
            const productList = await products.getProducts();
            response.success(res, productList);
        } catch (err) {
            logger.error("product::route::getAllProducts something went wrong", err.stack);
            response.serverError(res);
        }
    },
    async getProductById(req, res) {
        try {
            logger.info("product::route::getProductById");
            const productId = +req.params.productId;
            const product = await products.getProductById(productId);
            if (product) {
                response.success(res, product);
            } else {
                response.badRequest(res);
            }
        } catch (err) {
            logger.error("product::route::getProductById something went wrong in getPrdouctById", err.stack);
            response.serverError(res);
        }
    },
    async updateProduct(req, res) {
        try {
            logger.info("product::route::updateProduct");
            const context = req.userContext;
            const productId = +req.params.productId;
            const product = req.body;
            const updatedProduct = await products.updateProduct(context, productId, product);
            if (updatedProduct) {
                response.success(res, updatedProduct);
            } else {
                response.badRequest(res);
            }

        } catch (err) {
            logger.error("product::route::updateProduct something went wrong ", err.stack);
            response.serverError(res);
        }

    },
    async saveProduct(req, res) {
        try {
            logger.info("product::route::saveProduct");
            const context = req.userContext;
            const product = req.body;
            const newProduct = await products.saveProduct(context, product);
            if (newProduct) {
                response.success(res, newProduct);
            } else {
                response.badRequest(res);
            }
        } catch (err) {
            logger.error("product::route::saveProduct something went wrong", err.stack);
            response.serverError(res);
        }
    },
    async deleteProduct(req, res) {
        try {
            logger.info("product::route::deleteProduct");
            const context = req.userContext;
            const productId = +req.params.productId;
            const deletedProduct = await products.deleteProduct(context, productId);
            if (deletedProduct) {
                response.success(res);
            } else {
                response.badRequest(res);
            }

        } catch (err) {
            logger.error("product::route::deleteProduct something went wrong ", err.stack);
            response.serverError(res);
        }
    },

    async upload(req, res) {
        file = req.files.uploaded_file;
        file.mv("/uploads/" + file.name, (err, result) => {
            if (err) throw err;
            response.success(res, 'file uploaded successfully');
        });
    },
    async getFileUploadURL(req, res) {
        const s3 = new AWS.S3();
        const fileName = req.query.fileName;
        const fileType = req.query.fileType;
        s3.config.update({
            accessKeyId: config.AWS_ACCESS_KEY,
            secretAccessKey: config.AWS_SECRET_KEY,
            region: 'eu-west-1'
        });
        var params = { Bucket: 'i-0d2da3be9c27bae0b', Key: fileName};
        var signedURL = await s3.getSignedUrlPromise('putObject', params);
        response.success(res, signedURL)
    }
};

router.get('/', catchAsync(routes.getAllProducts));
router.get('/upload', catchAsync(routes.getFileUploadURL));
router.get('/:productId', prarameterValidator(), catchAsync(routes.getProductById));
router.put('/:productId', prarameterValidator(), catchAsync(routes.updateProduct));
router.delete('/:productId', prarameterValidator(), catchAsync(routes.deleteProduct));
router.post('/', bodyValidator(), catchAsync(routes.saveProduct));
router.post('/upload', catchAsync(routes.upload));
module.exports = {
    uri: ROUTE_URI,
    routes,
    router
};
