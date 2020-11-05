const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/message')
const user = require('./utils/user')
const { users, userJoined, getUsers, newUser, userLeave, getRoomUsers } = require('./utils/user')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = 3000

const botName = "Chat BOT"


// When clients connects
io.on('connection', socket => {
    var user = newUser(socket.id, "", socket.id)
    socket.emit("roomId", socket.id)

    // Welcome user
    socket.emit('message', formatMessage(botName, 'WELCOME'))
    
    // New user
    socket.on("new-user", name => {
        user.userName = name
        userJoined(user)
        io.to(user.roomId).emit('roomUsers',{users: getRoomUsers(user.roomId)})
    })

    // Client request joins room
    socket.on('join-room', (roomId) => {
        user = newUser(user.id, user.userName, roomId)
        userJoined(user)
        
        socket.join(user.roomId)
        
        // Broadcast when a user connects
        socket.broadcast.to(user.roomId).emit('message', formatMessage(botName, `${user.userName} has joined.`))
        
        // Send users info
        io.to(user.roomId).emit('roomUsers',{users: getRoomUsers(user.roomId)})
    })
    
    // Listen for chatMessage
    socket.on("submit", message => {
        io.to(user.roomId).emit('message', formatMessage(user.userName, message))
    })
    
    // Runs when client disconnects
    socket.on('disconnect', () => {
        userLeave(socket.id, u => {
            u.map(user => {
                socket.broadcast.to(user.roomId).emit('message', formatMessage(botName, `${user.userName} has left.`))
                
                // Send users info
                io.to(user.roomId).emit('roomUsers',{users: getRoomUsers(user.roomId)})
            })
        })
    })
})

server.listen(PORT, () => console.log(`localhost:${PORT}`))