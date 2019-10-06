let express = require("express")
let route = express.Router()
let wxPay = require("../../dist/ts-wxpay.umd")
let orderId = require("order-id")("8u2jdjy83b2h8s92j2gd83h")
const jsonxml = require("jsonxml")

let wxpay = new wxPay({
  appid:"wxdb09b73fb76b2b01",
  mch_id:"1495674662",
  sign_type:"MD5",
  notify_url:'http://pay.mynatapp.cc/pay/notify_back',
},"1A12B25123463C0D8377B22C1D0FD66A")


//统一下单
//微信小程序支付
route.all('/minipay',async (req,res,next) =>{
  let {openid,totalFee} = req.body
  let order_id = orderId.generate()
  let ip = '113.124.236.94'

  let pay = await wxpay.miniPay({
    openid:openid,
    body:'商品测试支付',
    total_fee:1,
    spbill_create_ip:ip,
    order_id:order_id
  })

  res.send(pay)


})

// 查询订单
route.all('/search',function (req,res) {
  wxpay.test()
  res.send("ok2")
})

// 接受回调
route.all('/notify_back',async (req,res) =>{
  console.log("接收到回调",req.body)
  let check = wxpay.check_order(req.body.xml)
  console.log("检查订单是否真实",check)
  if(check){
    res.send(jsonxml({
      xml:{
        return_code:"SUCCESS",
        return_msg:"OK"
      }
    }))
  }
})

module.exports = route
