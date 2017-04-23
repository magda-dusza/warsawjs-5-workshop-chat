const io = require('socket.io-client');
const client = io('http://localhost:3000');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

function clearPrompt() {
    process.stdout.cursorTo(0);
    process.stdout.clearLine();
}

console.log('client started');

client.on('message', (msg)=>{
    clearPrompt();
    console.log(`>> ${msg}`);
    readline.prompt();
});

// display '>' sign
readline.prompt();

readline.on('line', (line)=>{
    if(line.trim()){
        client.emit('message', line);
    }
    //new line with '>'
    readline.prompt();
});