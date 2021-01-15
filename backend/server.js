
const express = require('express');
var fs = require('fs');
var https = require('https');
const { config } = require('./config');
const routers = require('./v1/routes');
const { middlewares } = require('./middleware');
const mongo = require('./mongodb');
const logger = require('./logger');
const rabitmq = require('./rabitmq');
const app = express();

connect();

function startHttpServer() {
    try{
        var privateKey  = fs.readFileSync(__dirname+'/sslcert/privkey.pem', 'utf8');
        var certificate = fs.readFileSync(__dirname+'/sslcert/cert.pem', 'utf8');
        var ca = fs.readFileSync(__dirname+'/sslcert/chain.pem', 'utf8');
    
        var credentials = {key: privateKey, cert: certificate, ca};
    
        var httpsServer = https.createServer(credentials, app);
        httpsServer.listen(config.PORT);
    
        console.log('Express app started on port ' + config.PORT);
    }catch(err){
        console.log('Error occured while starting https server..',err);
    }

}

function errorHandler(err, req, res, next){
    console.error(err.stack)
    res.status(500).send('Something broke!')
}
function initializeExpress() {
    app.use(middlewares);
    app.use('/v1/', routers.routes);
    app.use(errorHandler);
}

function globalErrorHandler(){
    process.on('UncaughtException', ((err) => {
        logger.fatal('Uncaught Exception %s', err);
        process.exit(1);
    }));
}

async function connect() {
    try {
        await mongo.initialiseMongo();
        initializeExpress();
        startHttpServer();
        rabitmq.subscribeToRabbitmq();
        globalErrorHandler();
    } catch (err) {
        console.log('error while starting application');
    };
}