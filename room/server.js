const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/message')
const user = require('./utils/user')
const { users, userJoined, getUsers, newUser, userLeave, getRoomUsers, checkReady, getRoomPagaraph } = require('./utils/user')

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
    socket.on("new-user", ({name, pagaraph}) => {
        user.userName = name
        user.pagaraph = pagaraph
        user.progress = ""
        userJoined(user)
        io.to(user.roomId).emit('roomUsers',{users: getRoomUsers(user.roomId)})
    })

    // Client request joins room
    socket.on('join-room', async (roomId) => {
        user.roomId = await roomId
        user.pagaraph = await getRoomPagaraph(roomId)

        socket.join(user.roomId)
        
        // Broadcast when a user connects
        socket.broadcast.to(user.roomId).emit('message', formatMessage(botName, `${user.userName} has joined.`))
        
        // Send users info
        io.to(user.roomId).emit('roomUsers',{users: getRoomUsers(user.roomId)})
        io.to(user.roomId).emit('roomPagaraph',getRoomPagaraph(user.roomId))
    })

    socket.on("ready", async isReady => {
        user.isReady = isReady
        if (await checkReady(user.roomId)) {
            io.to(user.roomId).emit('start-game')
        }
    })
    
    // Listen for chatMessage
    socket.on("submit", message => {
        io.to(user.roomId).emit('message', formatMessage(user.userName, message))
    })

    // Listen for on progress
    socket.on("on-progress", progress => {
        user.progress = progress
        io.to(user.roomId).emit("on-progress", {users: getRoomUsers(user.roomId)})
    })
    
    // Runs when client disconnects
    socket.on('disconnect', () => {
        userLeave(socket.id, u => {
            u.map(user => {
                socket.broadcast.to(user.roomId).emit('message', formatMessage(botName, `${user.userName} has left.`))
                
                // Send users info
                io.to(user.roomId).emit('roomUsers', {users: getRoomUsers(user.roomId)})
            })
        })
    })
})

server.listen(PORT)