const io = require('socket.io-client');
const client = io(`http://${process.argv[2] || 'localhost'}:3000`);
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
let LOGGED_USER = '';

console.log('client started');

function clearPrompt() {
    process.stdout.cursorTo(0);
    process.stdout.clearLine();
}

function handleMessage(msgObject) {
    clearPrompt();
    console.log(`${msgObject.username || 'unknown'}: ${msgObject.msg}`);
    readline.prompt();
}

function handleLogin(username) {
    console.log(username);
    if(username){
        readline.setPrompt(`${username}: `)
        LOGGED_USER = username;
    } else {
        console.log('>> LOGIN FAILED!!!');
    }
    readline.prompt();
}

function handleRegister(registerStatus) {
    clearPrompt();
    if(registerStatus){
        console.log('>> register success');
    } else {
        console.log('>> register failed');
    }
    readline.prompt();
}

// display '>' sign
readline.prompt();

client.on('message', handleMessage);

client.on('login', handleLogin);

client.on('register', handleRegister);

readline.on('line', (line)=>{
    let lineArgs = line.split(/\s+/);
    let firstWord = lineArgs[0];
    if(firstWord === '/exit'){
        readline.close();
        process.exit();
    } else if (firstWord === '/register') {
        if(lineArgs.length === 3) {
            client.emit('register', {username: lineArgs[1], password: lineArgs[2]});
        }
    } else if(firstWord === '/login') {
        if(lineArgs.length === 3) {
            client.emit('login', {username: lineArgs[1], password: lineArgs[2]} );
        } else {
            client.emit('login', false );
        }
    } else if(firstWord === '/logout') {
        readline.setPrompt('> ');
        client.emit('logout', LOGGED_USER);
    }
     else if(line.trim()){
        client.emit('message', {username: LOGGED_USER, msg : line});
    }
    //new line with '>'
    readline.prompt();
});