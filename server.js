const io = require('socket.io');
const server = io();

server.on('connection', (client) => {
    console.log(`client with id: ${client.id}, connected`);
    client.on('message', (msg)=>{
        console.log(msg);
        //broadcast send to all clients, despite client who send message
        client.broadcast.emit('message', msg);
    });
});

server.listen(3000);

