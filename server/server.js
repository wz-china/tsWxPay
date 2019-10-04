const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const WebpackConfig = require('./webpack.config')

const app = express()

const compiler = webpack(WebpackConfig)

const router = express.Router()

wxpayRouter()

app.use(webpackDevMiddleware(compiler, {
  publicPath: '/__build__/',
  stats: {
    colors: true,
    chunks: false
  }
}))

app.use(webpackHotMiddleware(compiler))

app.use(express.static(__dirname))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 路由注册需要放在解析后面，否则body娶不到json数据
app.use(router)

const port = process.env.PORT || 7001
module.exports = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}, Ctrl+C to stop`)
})


function wxpayRouter() {
  router.post('/extend/test', function(req, res) {
    res.json(req.body)
  })
  router.get('/extend/get', function(req, res) {
    res.json({msg:"ok"})
  })


}
