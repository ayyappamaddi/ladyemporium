const mongoose = require('mongoose');
const { config } = require('./config');
const models = require('./v1/models/app-schema');

// const a = require('./a');

let masterConnection;
let mongooseConn;
function registerSchema() {
    try {
        const db = mongoose.connection.useDb(config.MASTERDB);
        Object.keys(models).map((model) => {
            const schema = models[model];
            return db.modelNames().includes(model) ?
                db.model(model) :
                db.model(model, schema);
        });
        return db;
    } catch (err) {
        console.log(' error while registering schema', err);
        throw err;
    }
}
/**
    * initialise the mongo db
    * @returns {Promise.<void>}
    */
async function initialiseMongo() {
    try {
        // logger.info('initializing mongo');
        console.log("Mongodb::initialiseMongo");
        const dbConn = await mongoose.connect(config.MONGODB_URL,
            { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
        // logger.info('db object obtained');
        mongooseConn = registerSchema();
        console.log("mongodb connection established.");
        // logger.addContext('resourceName', 'Mongo');
        // logger.info('connected to mongodb host -', mongoUrlWithoutPassword);
        masterConnection = dbConn;

    } catch (err) {
        console.log('Failed to establish Mongo connection', err);
        // logger.fatal('Failed to connect to Mongo', JSON.stringify(err));
        throw err;
    }
}
function getModel(collection) {
    if (mongooseConn) {
        return mongooseConn.model(collection);
    }
}
async function getSequence(seqName, _this) {
    return _this.db.collection('counters').findOneAndUpdate({},
        {
            $inc: { [seqName]: 1 }
        },
        {
            new: true,
            upsert: true
        });




    // logger.info('Model :: deal:: getSequence: finding and updating sequence by one');
    // const allSeqInfo = await _this.db.models.counter.findOne({})
    // if (allSeqInfo && allSeqInfo[seqName]) {
    //     return _this.db.models.counter.findOneAndUpdate({},
    //         {
    //             $inc: { [seqName]: 1 }
    //         },
    //         {
    //             new: true,
    //             upsert: true
    //         });
    // } else {
    //     return _this.db.models.counter.findOneAndUpdate({},
    //         {
    //             $set: { seqName: 1 }
    //         });
    // }

}

module.exports = {
    initialiseMongo,
    getModel,
    getSequence
}