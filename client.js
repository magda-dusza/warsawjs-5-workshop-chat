const io = require('socket.io-client');
const client = io('http://localhost:3000');

console.log('client started');

client.emit('message', 'PODAJE HASLO: OKON');

client.on('message', (msg)=>{
    console.log(`from server: ${msg}`);
});