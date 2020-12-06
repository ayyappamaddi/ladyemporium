const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: String,
    productType: String,
    productCategory: String,
    price: Number,
    productId: Number,
    color: Object,
    description: String,
    productImages: [{ fileName: String, visibility: Boolean, coverImg: Boolean, description: String }],
    isAvailable: Boolean,

});

const userSchema = new mongoose.Schema({
    name: String,
    role: String,
    status: String, // active or not
    userCategory: String, // it would not to create product in other category
    userName: String,
    phoneNumber: String,
    adress_state: Number,
    adress_pin: String,
    adress_distic: String,
    adress_full: String,
    hash: String
});


const counterSchema = new mongoose.Schema({
    productSeq: Number,
    userSeq: Number
});


module.exports = {
    products: productSchema,
    counter: counterSchema,
    user: userSchema
}