var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)
const routes = require('./routes')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

server.listen(8081, function () {
  console.log('Listening on port 8081')
})
routes(app)

io.on('connection', function (socket) {
  console.log('A user connected')

  socket.on('room', function (room) {
    console.log('Joining ' + room)
  })
  socket.on('draw', function (data) {
    io.emit('draw', data)
  })
  socket.on('disconnect', function () {
    console.log('A user disconnected')
  })
})
