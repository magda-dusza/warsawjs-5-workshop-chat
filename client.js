const io = require('socket.io-client');
const client = io(`http://${process.argv[2] || 'localhost'}:3000`);
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

let LOGGED_USER = '';

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
        client.emit('message', line);
    }
    //new line with '>'
    readline.prompt();
});

client.on('login', (username) =>{
    console.log(username);
    if(username){
        readline.setPrompt(`${username} :`)
        LOGGED_USER = username;
    } else {
        console.log('>> LOGIN FAILED!!!');
    }
    readline.prompt();
})

client.on('register', (registerStatus) => {
    clearPrompt();
    if(registerStatus){
        console.log('>> register success');
    } else {
        console.log('>> register failed');
    }
    readline.prompt();
});