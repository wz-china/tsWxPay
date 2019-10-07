let express = require("express")
let route = express.Router()
let wxPay = require("../../dist/ts-wxpays.umd")
let orderId = require("order-id")("8u2jdjy83b2h8s92j2gd83h")
const jsonxml = require("jsonxml")

let wxpay = new wxPay({
  appid:"wx725a9590e7ddf9d0111",
  mch_id:"1504787541111",
  sign_type:"MD5",
  notify_url:'http://pay.mynatapp.cc/pay/notify_back',
},"437990e4ed605c140e25107150b524f612231")


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

//微H5支付
route.all('/h5pay',async (req,res,next) =>{
  let {openid,totalFee} = req.body
  let order_id = orderId.generate()
  let ip = '113.124.236.94'

  let pay = await wxpay.h5Pay({
    body:'商品测试支付',
    total_fee:1,
    spbill_create_ip:ip,
    order_id:order_id
  })

  res.send(pay)


})

//微信内部支付
route.all('/inner',async (req,res,next) =>{
  let {openid,totalFee} = req.body
  let order_id = orderId.generate()
  let ip = '113.124.236.94'

  let pay = await wxpay.JSAPIPay('APP',{
    openid:'oYx6w0hsXeFuWXZ2XdTAG6o_Wj4g',
    body:'商品测试支付',
    total_fee:1,
    spbill_create_ip:ip,
    order_id:order_id
  })

  res.send(pay)


})

// 查询订单
route.all('/search',function (req,res) {
  // 4200000402201910061693919630
  let order = wxpay.search_order('4200000402201910061693919630')
  console.log(order)
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
