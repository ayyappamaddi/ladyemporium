

const { getModel, getSequence } = require('../../mongodb');
const { getUsersByUserName } = require('./user');
const logger = require('../../logger');
const ordersSchema = require('./app-schema').orders;
const constants = require('../../constants');
const utils = require('../utils');
async function preSaveHook(next) {
    try {
        const seqName = 'orderSeq';
        const result = (await getSequence(seqName, this)).value
        const userInfo = await getUsersByUserName(this.user);
        const orderSeqInfo = (await getSequence(userInfo.shortName + 'Seq', this)).value;
        const orderSeq = orderSeqInfo[userInfo.shortName + 'Seq'] + '';
        const orderNumb = userInfo.shortName + new Array(6 - orderSeq.length).join('0') + orderSeq;
        this.orderId = result[seqName];
        this.orderNumber = orderNumb;
        next();
    } catch (ex) {
        next(ex);
    }
}
ordersSchema.pre('save', preSaveHook);

async function getOrders(query = {}) {
    try {
        const ordersModel = getModel('orders');
        return ordersModel.find(query, { _id: 0, __v: 0 }).sort({ orderId: -1 }).limit(250)

    } catch (err) {
        logger.error('twilio::model getTwilioMsgs  Error occured while getting the twiliomsg', err.stack)
        throw err;
    }
}


async function saveOrder(order) {
    try {
        logger.info("orders::model::saveOrder");
        const ordersModel = getModel('orders');
        if (order.shippingAddress) {
            order.phoneNumbers = utils.getPhoneNumbers(order.shippingAddress) || [];
        }
        if (order.shippingAddress) {
            order.postalCode = utils.getPostalCode(order.shippingAddress);
        }

        const newOrder = new ordersModel(order);
        return newOrder.save()
            .then(res => {
                const data = res.toJSON();
                delete data._id;
                delete data.__v;
                return data;
            })
    } catch (err) {
        logger.error('order::model saveOrder  Error occured while saveing the order', err.stack)
        throw err;
    }
}
async function updateOrder(order) {
    try {
        const ordersModel = getModel('orders');
        return ordersModel.updateOne({ orderId: order.orderId, user: order.user }, { $set: order })
    } catch (err) {
        logger.error('order::model updateOrder  Error occured while updating the order', err.stack)
        throw err;
    }
}

async function searchOrder(conn, searchObj) {
    try {
        const ordersModel = getModel('orders');
        const query = [{
            $match: {
                shippingAddress: { $regex: `.*${searchObj.searchTerm}.*`, $options: 'i' }
            }
        }];
        const filteredOrders = await ordersModel.aggregate(query);
        if (filteredOrders.length && !(conn && conn.role === constants.ADMINUSER)) {
            for (let i = 0; i < filteredOrders.length; i++) {
                filteredOrders[i].shippingAddress = filteredOrders[i].shippingAddress.replace(/[0-9]{10}/g, function (match) {
                    return "xxxxxxx" + match.substr(7, 3);
                })
            }
        }
        return filteredOrders;

    } catch (err) {
        logger.error('order::model searchOrder  Error occured while fetching the order', err.stack)
        throw err;
    }
}

async function deleteOrder(orderId) {
    const ordersModel = getModel('orders');
    return ordersModel.findOneAndDelete({ orderId });
}
module.exports = {
    saveOrder,
    getOrders,
    deleteOrder,
    updateOrder,
    searchOrder
}