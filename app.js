const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)

const shortid = require('shortid')

console.log('Server started')

//Serving stating files
app.use(express.static(__dirname))

//Array of chabels
let chanels = []


//socket
io.sockets.on('connection', (socket) => {

    console.log("a client is connected")
    //Create a chanel
        //add the chanel to the array of chanels
        //add the client to the chanel

    //Join  a chanel function
        //if the chanel exist we send the url to the client


})

server.listen(8080)