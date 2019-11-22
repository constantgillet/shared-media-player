const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    bodyParser = require('body-parser'),
    shortid = require('shortid'),
    path = require('path')
    

console.log('Server started')

//Parse the body
app.use(bodyParser.urlencoded({ extended: false }));

//Serving stating files
app.use(express.static(__dirname))

app.get('/video-player.html', function (req, res) {
    res.sendFile(path.join(__dirname + '/video-player.html'))
})

app.post('/submit-videoLink', function (req, res) {
    const name = req.body.videoLink
    
    console.log(name + ' Submitted Successfully!')
    res.redirect('/video-player.html')
})

//Array of chabels
let chanels = []

let clientCound = 0

//socket
io.sockets.on('connection', (socket) => {

    const clientId = clientCound++
    console.log("a client is connected", clientId)
    //Create a chanel
        //add the chanel to the array of chanels
        //add the client to the chanel

    //Join  a chanel function
        //if the chanel exist we send the url to the client

    
})

server.listen(8080)