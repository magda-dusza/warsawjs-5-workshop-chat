const io = require('socket.io');
const server = io();

const USERS = {};

server.on('connection', (client) => {
    let clientName = '';
    console.log(`client with id: ${client.id}, connected`);
    client.on('message', (msg)=>{
        console.log(msg);
        //broadcast send to all clients, despite client who send message
        client.broadcast.emit('message', msg);
    });
    client.on('register', (user) => {
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
    });
    client.on('login', (userObject) => {
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
    })
    client.on('logout', (username) => {
        USERS[username].logged_in = false;
    });
});

server.listen(3000);

