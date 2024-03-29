const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    name: String,
    productType: String,
    productCategory: String,
    productMaterial: String,
    productId: Number,
    color: Object,
    description: String,
    productImages: [{ fileName: String, visibility: Boolean, coverImg: Boolean, description: String }],
    isAvailable: Boolean,
    origin: String,
    creationDate: Date,
    updatedTimeStamp: Date,
    postalCode: String,
    price: Number
});

const userSchema = new mongoose.Schema({
    name: String,
    role: String,
    status: String, // active or not
    userCategory: String, // it would not to create product in other category
    email: String,
    phoneNumber: String,
    adress_state: Number,
    adress_pin: String,
    adress_distic: String,
    adress_full: String,
    hash: String,
    userId: Number,
    shortName: String,
    notification: { notifyOnOrderConfirm: String }
});


const ordersSchema = new mongoose.Schema({
    orderId: Number,
    orderNumber: String,
    shippingAddress: String,
    orderImages: [String],
    msgIds: [],
    orderDate: Date,
    orderStatus: String,
    phoneNumbers: [String],
    msgPhoneNumbers: [String],
    trackId: String,
    user: String,
    msgFrom: String,
    orderTime:String, 

}, {
  timestamps: { createdAt: true, updatedAt: true }
}
);


const twilioMsgSchema = new mongoose.Schema({
    msgId: Number,
    messageSid: String,
    msgBody: String,
    msgFrom: String,
    msgTo: String,
    mediaUrl: String,
    MediaContentType: String,
    processed: Boolean
});


const counterSchema = new mongoose.Schema({
    productSeq: Number,
    userSeq: Number,
    twilioMsgSeq: Number,
    orderSeq: Number,
    AMSeq: Number,
    VPSeq: Number
});


module.exports = {
    products: productSchema,
    counter: counterSchema,
    user: userSchema,
    twilioMsg: twilioMsgSchema,
    orders: ordersSchema
}