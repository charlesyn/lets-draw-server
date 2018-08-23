const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const routes = require('./routes')
const socket = require('./socket')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

server.listen(8081, function () {
  console.log('Listening on port 8081')
})
// Attach routes to app
routes(app)
// Socket.io server communication
socket(io)
