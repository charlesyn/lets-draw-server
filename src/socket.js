module.exports = (io) => {
  io.on('connection', function (socket) {
    // Log the sockets connected to the server
    let connectedClients = Object.keys(io.of('/').clients().connected)
    // Save current room of socket
    let currentRoom = ''
    // Save username of socket
    let username = ''
    console.log(connectedClients)
    // Logic for on room join
    socket.on('room', function (roomInfo) {
      username = roomInfo.username
      // Remove username from previous room
      socket.broadcast.to(currentRoom).emit('removeUser', username)
      // Clear user's server user list
      socket.emit('clearUserList')
      // Join current room
      socket.join(roomInfo.room)
      currentRoom = roomInfo.room
      // Get list of users in current room
      socket.broadcast.to(currentRoom).emit('pollUsers', socket.id)
      // Send out username to other users
      socket.broadcast.to(currentRoom).emit('updateUserList', roomInfo.username)
    })
    // Get list of users in server for user
    socket.on('getUserList', function (data) {
      console.log('Recipient: ' + data.recipient)
      io.to(data.recipient).emit('updateUserList', data.username)
    })
    // Send 'brush strokes' to all other users
    socket.on('draw', function (data) {
      socket.broadcast.to(currentRoom).emit('draw', data)
    })
    // Clear the canvas for all users in server
    socket.on('clearCanvas', function (data) {
      socket.broadcast.to(currentRoom).emit('clearCanvas')
    })
    // Disconnect from server, remove user from room
    socket.on('disconnect', function () {
      socket.broadcast.to(currentRoom).emit('removeUser', username)
      console.log('A user disconnected')
    })
  })
}
