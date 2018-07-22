module.exports = (app) => {
  app.get('/server', function (req, res) {
    res.send({
      message: 'Hello World!'
    })
  })
}
