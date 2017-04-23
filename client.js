const io = require('socket.io-client');
const client = io('http://localhost:3000');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('client started');

client.on('message', (msg)=>{
    console.log(`from server: ${msg}`);
});

// display '>' sign, allow user to type in console
readline.prompt();

readline.on('line', (line)=>{
    client.emit('message', line);
});