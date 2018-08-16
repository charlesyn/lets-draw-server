const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const routes = require('./routes')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

server.listen(8081, function () {
  console.log('Listening on port 8081')
})
routes(app)

io.on('connection', function (socket) {
  let connectedClients = Object.keys(io.of('/').clients().connected)
  let currentRoom = ''
  let username = ''
  console.log(connectedClients)
  socket.on('room', function (roomInfo) {
    username = roomInfo.username
    socket.broadcast.to(currentRoom).emit('removeUser', username)
    socket.emit('clearUserList')
    socket.join(roomInfo.room)
    currentRoom = roomInfo.room
    socket.broadcast.to(currentRoom).emit('pollUsers', socket.id)
    socket.broadcast.to(currentRoom).emit('updateUserList', roomInfo.username)
  })
  socket.on('getUserList', function (data) {
    console.log('Recipient: ' + data.recipient)
    io.to(data.recipient).emit('updateUserList', data.username)
  })
  socket.on('draw', function (data) {
    socket.broadcast.to(currentRoom).emit('draw', data)
  })
  socket.on('clearCanvas', function (data) {
    socket.broadcast.to(currentRoom).emit('clearCanvas')
  })
  socket.on('disconnect', function () {
    socket.broadcast.to(currentRoom).emit('removeUser', username)
    console.log('A user disconnected')
  })
})
