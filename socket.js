var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});


io.on('connection', (socket) => {

    socket.on('dao-update', function(data){
        io.emit('dao-update', data);
    });

    socket.on('dao-create', function(data){
        io.emit('dao-create', data);
    });

    socket.on('budget-update', function(data){
        io.emit('budget-update', data);
    });

    socket.on('budget-create', function(data){
        io.emit('budget-create', data);
    });

    socket.on('vote-update', function(data){
        io.emit('vote-update', data);
    });

    socket.on('vote-create', function(data){
        io.emit('vote-create', data);
    });

    socket.on('member-update', function(data){
        io.emit('member-update', data);
    });


});

http.listen(5555, () => {
    console.log('Websocket listening on *:5555');
});
