var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var domain = 'localhost';
var domain_port = 3000;

const TEMPLATEURL = __dirname + "/storage/template"

//=====URL START====================================


app.get('/', function(req, res) {
    res.sendFile(TEMPLATEURL + '/');
});

app.get('/public', function(req, res) {
    res.sendFile(TEMPLATEURL + '/public_chat.html');
});

app.get('/private', function(req, res) {
    res.sendFile(TEMPLATEURL + '/private_chat.html');
});

app.use("/node_modules", express.static(__dirname + '/node_modules/'));
app.use("/storage", express.static(__dirname + '/storage/'));

//=====URL END======================================


io.on('connection', function(socket) {
    socket.on('chat message', function(msg) {
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();
        io.emit('chat message', msg, h + ':' + m);
    });

    socket.on('disconnect', function() {
        io.emit('disconnect', 'User Disconnected');
    });
});

http.listen(domain_port, domain, function() {
    console.log('Service Started.');
});
