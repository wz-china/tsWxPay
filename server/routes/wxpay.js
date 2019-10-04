let express = require("express")
let route = express.Router()
let wxPay = require("../../dist/ts-wxpay.umd")

let wxpay = new wxPay()


//统一下单
route.all('/start',function (req,res) {
  wxpay.test()
  res.send("ok1")
})

// 查询订单
route.all('/search',function (req,res) {
  wxpay.test()
  res.send("ok2")
})

// 接受回调
route.all('/search',function (req,res) {
  wxpay.test()
  res.send("ok3")
})

module.exports = route
