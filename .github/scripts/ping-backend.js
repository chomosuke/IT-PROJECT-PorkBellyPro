const net = require('net');
const { exit } = require('process');

const CONN_TIME = 10000;

const connsock = new net.Socket();
console.error("pinging localhost:%d", process.env.SERVER_PORT);
connsock.on('error', () => { });
setTimeout(() => {
    console.error('Unable to connect to server in %d sec', CONN_TIME / 1000);
    exit(1);
}, CONN_TIME);

connsock.connect(process.env.SERVER_PORT, () => {
    connsock.end();
    console.log("Connected!")
    exit(0);
})