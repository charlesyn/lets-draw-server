const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())

app.get('/status', function (req, res) {
  res.send({
    message: 'Hello World!'
  })
})

app.listen(8081)
