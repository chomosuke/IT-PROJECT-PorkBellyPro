const net = require('net');
const { exit } = require('process');

const MAX_TRIES = 10;
const PING_TTL = 1000;
const port = process.env.SERVER_PORT || 8080;
let tries = 0;

console.log("Attempting TCP connection to localhost:%d", port);
let connsock = new net.Socket();
connsock.on('error', () => {
    tries++;
    console.error("No reponse -- tries: %d", tries);
    if (tries >= MAX_TRIES) {
        console.error("Unable to reach localhost:%d in %d seconds", port, MAX_TRIES * PING_TTL / 1000);
        exit(1);
    }
})
// gives ttl for connection

const interval = setInterval(() => {
    connsock.connect(port, () => {
        console.log("Connected to server");
        clearInterval(interval);
        exit(0);
    });
}, PING_TTL);