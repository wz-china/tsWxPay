type SignType = "MD5" | "HMAC-SHA256"
type TradeType = "JSAPI" | 'MWEB'


export interface WxpayBaseConfig{
  appid:string
  mch_id:string
  sign_type?:SignType
  notify_url:string
}

export interface WxpayMiniRequestConfig{
  nonce_str:string
  trade_type:TradeType
  product_id?:string
  openid?:string
  body:string
  detail?:string
  attach?:string
  out_trade_no:string
  total_fee:number
  spbill_create_ip?:string        // 调用微信支付api的机器ip
  order_id?:string                // 真实订单号，放到attach里面
  other_info?:string             // 其他信息，放到attach里面
  sign:string

}

export interface WxpayMiniAndBaseConfig extends WxpayBaseConfig,WxpayMiniRequestConfig{

}

export interface AttachData{
  order_id:string,
  other_info?:any
}

export interface WxUrl{
  create:string
}

export interface ResponseConfig{
  code:number
  data?:any
  msg?:string
}

export interface WxApiResponse{
  return_code:string
  return_msg?:string
  appid?:string
  appid?:string
  mch_id?:string
  nonce_str?:string
  sign?:string
  result_code?:string
  prepay_id?:string
  trade_type?:string
  code_url?:string
}

export interface NotifyResponseConfig{
  appid:string
  attach: string
  bank_type: string
  cash_fee: string
  fee_type: string
  is_subscribe:string
  mch_id: string
  nonce_str: string
  openid: string
  out_trade_no: string
  result_code: string
  return_code: string
  sign:string
  time_end:string
  total_fee:string
  trade_type: string
  transaction_id: string
}
