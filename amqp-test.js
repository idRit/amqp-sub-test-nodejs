const amqp = require('amqplib/callback_api');
var socket = require('socket.io-client')('http://localhost:3000');

const CONN_URL = "amqps://ehvbnoeu:MHHB_MhHLDBlpMJPWyPefVW7Ihbi_jol@fox.rmq.cloudamqp.com/ehvbnoeu";

let ch = null;
amqp.connect(CONN_URL, function (err, conn) {
    conn.createChannel(function (err, channel) {
        ch = channel;
        ch.consume('nodemcu_data_queue', function (msg) {
                console.log('.....');
                setTimeout(function(){
                    console.log(JSON.parse(msg.content.toString()));
                    socket.emit("fwdPkt", JSON.parse(msg.content.toString()));
                    ch.ack(msg);
                },8000);
            },{ noAck: false }
        );
    });
});

process.on('exit', (code) => {
    ch.close();
    console.log(`Closing rabbitmq channel`);
});