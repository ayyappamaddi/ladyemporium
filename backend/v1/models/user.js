

const bcrypt = require('bcrypt');
const { getModel, getSequence } = require('../../mongodb');
const logger = require('../../logger');
const userSchema = require('./app-schema').user;
const saltRounds = 10;
async function preSaveHook(next) {
    try {
        const seqName = 'usertSeq';
        const result = await getSequence(seqName, this);
        this.userId = result[seqName];
        next();
    } catch (ex) {
        next(ex);
    }
}
userSchema.pre('save', preSaveHook);

async function getUsers() {
    logger.info("user::model::getAllUsers");
    const userModel = getModel('user');
    return userModel.find({}, { _id: 0, __v: 0 });
}

async function createNewUser(context, user) {
    try {
        logger.info("user::model::saveProduct");
        if (user.source) {
            return saveUser(user);
        } else {
            bcrypt.hash(user.password, saltRounds, function (err, hash) {
                user.hash = hash;
                return saveUser(user);
            });
        }
    } catch (err) {
        logger.error('user::model saveProduct  Error occured while saveing the newUser', err.stack)
        throw err;
    }
}

async function saveUser(user) {
    try {
        logger.info('user::model saveUser');
        const userModel = getModel('user');
        let shortNameInfo = user.name.split(' ');
        user.shortName = shortNameInfo[0][0] + (shortNameInfo.length > 1 ? shortNameInfo[1][0] : shortNameInfo[0][1]);
        const newUser = new userModel(user);
        return newUser.save()
            .then(res => {
                const data = res.toJSON();
                delete data._id;
                delete data.__v;
                return data;
            });
    } catch (err) {
        logger.error('user::model saveProduct  Error occured while saving the newUser', err.stack)
        throw err;
    }
}
async function getUsersByUserName(userName, mobileNumber) {
    try {
        logger.info('user::model getUserBy userName ');
        const userModel = getModel('user');
        mobileNumber = mobileNumber || userName;
        const query = { $or: [{ 'email': userName }, { 'phoneNumber': mobileNumber }] }
        return userModel.findOne(query, { _id: 0, __v: 0 }).lean()
            .exec()
            .then(res => res);
    } catch (err) {
        logger.error('user::model getUsersByUserName  Error occured while fetching the user', err)
        throw err;
    }
}



module.exports = {
    getUsers,
    getUsersByUserName,
    createNewUser
}