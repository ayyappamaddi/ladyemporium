

const { getModel, getSequence } = require('../../mongodb');
const logger = require('../../logger');
const ordersSchema = require('./app-schema').orders;
async function preSaveHook(next) {
    try {
        const seqName = 'orderSeq';
        const result = await getSequence(seqName, this);
        this.orderId = result[seqName];
        next();
    } catch (ex) {
        next(ex);
    }
}
ordersSchema.pre('save', preSaveHook);

async function getOrders(query = {}) {
    try {
        const twilioModel = getModel('orders');
        return twilioModel.find({ }, { _id: 0, __v: 0 });

    } catch (err) {
        logger.error('twilio::model getTwilioMsgs  Error occured while getting the twiliomsg', err.stack)
        throw err;
    }
}


async function saveOrder(order) {
    try {
        logger.info("orders::model::saveOrder");
        const ordersModel = getModel('orders');
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

async function deleteOrder( orderId) {
    const ordersModel = getModel('orders');
    return ordersModel.findOneAndDelete({ orderId });
}
module.exports = {
    saveOrder,
    getOrders,
    deleteOrder
}