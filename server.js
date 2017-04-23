const io = require('socket.io');

const server = io();

server.on('connection', (client) => {
    console.log(`client with id: ${client.id}, connected`);
    client.on('message', (msg)=>{
        console.log(msg);
        client.emit('message', msg);
    });
});

server.listen(3000);

