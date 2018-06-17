const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const dirRoutes = require('./server/api/directory')
const fileRoutes = require('./server/api/file')

const env = process.env.NODE_ENV || 'development'

const app = express()

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'server', 'public')))
if (env !== 'development') {
  app.use(express.static('./dist'))
}

// view engine setup
var ejs = require('ejs');
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.set('views', __dirname);
app.set('view engine', 'ejs');

app.use('/', dirRoutes)
app.use('/', fileRoutes)

app.listen(3000, () => {
  console.log('this server are running on localhost:3000!')
})

// 错误处理
// app.use((err, req, res, next) => {
//   // res.status(442).send({ error: err.message })
//   console.log(err.message)
// })

module.exports = app
