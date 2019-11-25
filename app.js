const express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    bodyParser = require('body-parser'),
    shortid = require('shortid'),
    path = require('path')
    

console.log('Server started')

//Serving stating files
app.use(express.static(__dirname))

//Array of chabels
let channels = []

//socket
io.sockets.on('connection', (socket) => 
{
    const thisClientId = socket.id

    console.log('a client is connected', thisClientId)

    socket.on('createChannel', (data) => 
    {
        //create the Id of the chanel
        const thisUserChannelId = '#' + shortid.generate()
        
        //We create the object of the chanel
        const userChannel = 
        {
            id: thisUserChannelId,
            videoLink: data.videoLink,
            clientsConnected: [thisClientId] // Array of the Id of the different users connected to  the channel
        }

        //console.log('Client id in the channel:' + userChannel.clientsConnected[0])

        channels[thisUserChannelId] = userChannel

        socket.emit('setChannelId', { channelId: thisUserChannelId })

        console.log(`A client has created a channel id: ${ thisUserChannelId }, video url: ${ data.videoLink }`)
    })
    
    
    //if an user is disconnected
    socket.on('disconnect', () => 
    {
        console.log('user disconnected')
    })
})

server.listen(8080)