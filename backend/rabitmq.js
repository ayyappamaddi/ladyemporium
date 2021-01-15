const amqp = require('amqplib');
const { func } = require('joi');
const amqpurl = "amqps://lwfovwpk:Mn8VFOAi_0UbAvLhAVU-LkuPjZ0jL-UH@jellyfish.rmq.cloudamqp.com/lwfovwpk";
let channel;
async function queueOperation() {
    console.log('subscriber - queue operation called for org provisioning');
    try {
        // channel.assertQueue('order_msg_queue', { durable: true });
        // const onMsg = (msg) => {
        //   console.log();
        // };
        // console.log(`Listening to the order_msg_queue`);
        // channel.consume("order_msg_queue", onMsg, { noAck: false });

    } catch (e) {
        console.log('An error occured while channel operations during queue consume', e.message);
    }
}
async function publishMsg( msgBuffer, opts = {}   ){
    console.log('subscriber - publishing message');
    return new Promise((resolve, reject) => {
        try {
            const options = { persistent: true, ...opts };
            channel.sendToQueue("order_msg_queue",  msgBuffer, options);
            resolve();
        } catch (e) {
            console.error('Unable to Publish msg to exchange:', exchange, ' where routing key is:', routingKey);
            console.error('Unable to Publish message to exchange - ', e);
            reject(e);
        }
    });
}
async function msgChannel(connection) {
    try {
        console.log('creating channel');
        await connection.createChannel()
            .then(async (ch) => {
                channel = ch;
                await queueOperation();
            })
            .catch(e => {
                return logger.error('An error occured while subscriber operations.', JSON.stringify(e));
            });

    } catch (err) {
        console.log('An err occured while provisioner operations.', JSON.stringify(err));
        rej(err);
    }
}
async function subscribeToRabbitmq() {
    let connection = null;
    console.log('Establishing connection with the rabbitmq for Org-Provision');
    await amqp.connect(amqpurl)
        .then(async (conn) => {
            console.log('connection established with the rabbitmq for Org-Provision');
            connection = conn;
            await msgChannel(conn);
        })
        .catch(async (e) => {
            console.log('An error occured while connecting to rabbitmq , retrying connecting after 3 secs..', e.stack);
        });
    return connection;
}


module.exports = {
    subscribeToRabbitmq,
    publishMsg
}