const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3001

const publicDirPath = path.join(__dirname,'../public')
app.use(express.static(publicDirPath))

io.on('connection',(socket)=>{
    console.log('New websocket connection')
    
    socket.on('sendMessage',(message, callback)=>{
      const filter = new Filter()
      if(filter.isProfane(message)){
       return  callback('Profanity is not allowed')
      }
        io.emit('welcomeMessage', message)
        callback()
    })


    socket.emit('welcomeMessage', "Welcome!!")
    socket.broadcast.emit('welcomeMessage', ' A new user has joined')

    socket.on('sendLocation',(coords, callback)=>{
   io.emit('welcomeMessage',`https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
   callback()
    })
     socket.on('disconnect',()=>{
         io.emit('welcomeMessage','A user left the chat')
     })
})

server.listen(port, ()=>{
    console.log('the server is up running on '+port)
})