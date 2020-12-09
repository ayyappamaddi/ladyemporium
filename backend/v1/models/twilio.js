

const { getModel, getSequence } = require('../../mongodb');
const logger = require('../../logger');
const twilioMsgSchema = require('./app-schema').twilioMsg;
async function preSaveHook(next) {
    try {
        const seqName = 'twilioMsgSeq';
        const result = await getSequence(seqName, this);
        this.msgId = result[seqName];
        next();
    } catch (ex) {
        next(ex);
    }
}
twilioMsgSchema.pre('save', preSaveHook);

async function getTwilioMsgs(query = {}) {
    try {
        const twilioModel = getModel('twilioMsg');
        return twilioModel.find({ ...query }, { _id: 0, __v: 0 });

    } catch (err) {
        logger.error('twilio::model getTwilioMsgs  Error occured while getting the twiliomsg', err.stack)
        throw err;
    }
}

async function updateUnprocessedMsg(msg) {
    try {
        const twilioModel = getModel('twilioMsg');
        return twilioModel.findOneAndUpdate({ msgId: msg.msgId }, { $set: { processed: true } });

    } catch (err) {
        logger.error('twilio::model updateUnprocessedMsg  Error occured while updating the twiliomsg', err.stack)
        throw err;
    }
}


async function saveTwilioMsg(context, twilioMsg) {
    try {
        logger.info("twilio::model::saveMsg");
        const twilioMsgModel = getModel('twilioMsg');
        const newMsg = new twilioMsgModel(twilioMsg);
        return newMsg.save()
            .then(res => {
                const data = res.toJSON();
                delete data._id;
                delete data.__v;
                return data;
            })
    } catch (err) {
        logger.error('twilio::model saveTwilioMsg  Error occured while saveing the twiliomsg', err.stack)
        throw err;
    }
}
module.exports = {
    getTwilioMsgs,
    saveTwilioMsg,
    updateUnprocessedMsg
}