# wx支付工具

## 封装了基本的请求接口，包括统一下单、查询订单、支付结果回调

## 使用
整个项目有一个点需要注意：每次发起的支付交给微信的订单号是随机生成的，真实的订单号放在attach参数里面，如果有其他需要传递的参数请传入
other_info,这样在接受微信异步回调通知时可以通过attach参数获取到传递的值。

### 1.实例化对象
let wxpay = new wxPay({
  appid:appid,
  mch_id:mch_id,
  sign_type:"MD5",
  notify_url:notify_url,
},mch_secert)

### 2.发起小程序支付
let pay = await wxpay.miniPay({
  openid:openid,
  body:'商品测试支付',
  total_fee:1,
  spbill_create_ip:ip,
  order_id:order_id
})
返回的参数直接交给前台发起支付请求即可

### 3.接受微信的异步通知回调
将微信的通知结果进行转义json格式，传递xml内的内容，进行真实性验证
let check = wxpay.check_order(req.body.xml)



