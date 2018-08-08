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
  console.log(connectedClients)
  socket.on('room', function (roomInfo) {
    console.log(roomInfo.username + ' has joined ' + roomInfo.room)
    socket.join(roomInfo.room)
    currentRoom = roomInfo.room
  })
  socket.on('draw', function (data) {
    socket.broadcast.to(currentRoom).emit('draw', data)
  })
  socket.on('disconnect', function () {
    console.log('A user disconnected')
  })
})
