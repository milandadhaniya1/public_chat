var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var domain = '192.168.3.10';
var domain_port = 3000;

const TEMPLATEURL = __dirname + "/storage/template"

// Smiley
var smiley_arr = new Array();
smiley_arr.push([">:(","persevering-face_1f623.png"]);
smiley_arr.push(["3:)","smiling-face-with-horns_1f608.png"]);
smiley_arr.push([">:O","persevering-face_1f623.png"]);
smiley_arr.push([":)","slightly-smiling-face_1f642.png"]);
smiley_arr.push([":(","slightly-frowning-face_1f641.png"]);
smiley_arr.push([":P","face-with-stuck-out-tongue-and-tightly-closed-eyes_1f61d.png"]);
smiley_arr.push([":D","grinning-face-with-smiling-eyes_1f601.png"]);
smiley_arr.push([":O","face-with-open-mouth_1f62e.png"]);
smiley_arr.push([";)","winking-face_1f609.png"]);
smiley_arr.push(["B-)","smiling-face-with-sunglasses_1f60e.png"]);
smiley_arr.push([":l","pouting-face_1f621.png"]);
smiley_arr.push([":'(","crying-face_1f622.png"]);
smiley_arr.push([":*","kissing-face-with-smiling-eyes_1f619.png"]);
smiley_arr.push(["<3","black-heart-suit_2665.png"]);
smiley_arr.push(["^_^","smiling-face-with-smiling-eyes_1f60a.png"]);
smiley_arr.push(["-_-","neutral-face_1f610.png"]);
smiley_arr.push(["(y)","thumbs-up-sign_emoji-modifier-fitzpatrick-type-1-2_1f44d-1f3fb_1f3fb.png"]);
smiley_arr.push([":poop:","pile-of-poo_1f4a9.png"]);

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

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

io.on('connection', function(socket) {
    
    // Message
    socket.on('chat message', function(user,msg) {
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();

        smiley_arr.forEach(function(key){
          msg = msg.replaceAll(key[0], "<img src='/storage/theme/img/smiley/"+key[1]+"' class='smiley_txt'></img>");
        });

        io.emit('chat message', user, msg, h + ':' + m);
    });

    // Image
    socket.on('uploaded_image', function(user,image) {
        var d = new Date();
        var h = d.getHours();
        var m = d.getMinutes();

        io.emit('uploaded_image', user, { image: true, buffer: image.toString('base64') }, h + ':' + m);
    });

    socket.on('disconnect', function() {
        io.emit('disconnect', 'User Disconnected');
    });
});

http.listen(domain_port, domain, function() {
    console.log('Service Started On http://'+domain+':'+domain_port);
});
