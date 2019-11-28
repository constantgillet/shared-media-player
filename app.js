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
    let currentChannel

    console.log('a client is connected', thisClientId)

    //if a user send the parameter createChannel
    socket.on('createChannel', (data) => 
    {
        //create the Id of the chanel
        const thisUserChannelId = '#' + shortid.generate()
        
        //We create the object of the chanel
        const userChannel = 
        {
            videoLink: data.videoLink,
            videoStatus: 'pause',
            clientsConnected: [thisClientId] // Array of the Id of the different users connected to  the channel
        }

        //console.log('Client id in the channel:' + userChannel.clientsConnected[0])

        channels[thisUserChannelId] = userChannel

        currentChannel = thisUserChannelId

        //join the room called thisUserChannelId
        socket.join(currentChannel)

        socket.emit('setChannelId', { channelId: thisUserChannelId })

        console.log(`A client has created a channel id: ${ thisUserChannelId }, video url: ${ data.videoLink }`)
    })

    socket.on('joinChannel', (data) => 
    {
        //We check that the channel exist
        if(channels[data.channelId])
        {
            console.log(`A client is joigning ${ data.channelId }`)
            
            currentChannel = data.channelId

            // We add the client Id to the array of the connected clients
            channels[data.channelId].clientsConnected.push(thisClientId)

            socket.emit('joinChannel', { channelId: data.channelId, videoUrl: channels[data.channelId].videoLink })
            
            socket.emit('setPlayPause', { action: channels[currentChannel].videoStatus })  

            //joining the room with the room with the channel id 
            socket.join(data.channelId)
            
            //We send a notification that an user joined the channel of the other users
            socket.to(currentChannel).emit('successSend', { SuccessId: 'userJoinedChannel' })
        }
        else 
        {
            socket.emit('errorSend', { ErrorId: 'channelDoesntExist' })
        }
    })

    socket.on('setPlayPause', (data) => 
    {
        channels[currentChannel].videoStatus = data.action
        socket.to(currentChannel).emit('setPlayPause', { action: data.action })        
    })
    
    //if an user is disconnected
    socket.on('disconnect', () => 
    {
        console.log('user disconnected')
    })
})

server.listen(8080)