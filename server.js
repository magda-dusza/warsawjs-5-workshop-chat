const io = require('socket.io');
const server = io();

const USERS = {};

function handleMessage(client) {
    return (msgObject)=>{
        console.log(msgObject.username, msgObject.msg);
        //broadcast send to all clients, despite client who send message
        client.broadcast.emit('message', {username: msgObject.username, msg: msgObject.msg});
    }
}

function handleRegister(client) {
    return (user) =>{
        console.log('register', user);
        if(USERS[user.username]){
            client.emit('register', false);
        }else {
            USERS[user.username] = {
                password: user.password,
                logged_in: false
            };
            client.emit('register', true);
        }
    }
}

function handleLogin(client) {
    return (userObject) =>{
        console.log('login', userObject);
        const user = USERS[userObject.username];
        if(!user){
            console.log('USER DOES NOT EXIST!!!');
            client.emit('login', false);
            return;
        }
        if(user.password === userObject.password){
            user.logged_in = true;
            client.emit('login', userObject.username);
        } else {
            client.emit('login', false);
        }
    }
}

function handleLogout(username) {
    USERS[username].logged_in = false;
}

server.on('connection', (client) => {
    console.log(`client with id: ${client.id}, connected`);
    client.on('message', handleMessage(client));
    client.on('register', handleRegister(client));
    client.on('login', handleLogin(client));
    client.on('logout', handleLogout);
});

server.listen(3000);

