import {
  AttachData, ResponseConfig, NotifyResponseConfig, WxpayBaseConfig, WxpayAllRequestConfig
  , WxUrl, WxApiResponse, WxpaySearchConfig
} from "../types/index";
let md5 = require("md5")
let uuid = require("uuid")
let jsonsort = require("jsonkeysort")
let request = require("request")
const jsonxml = require("jsonxml")
const to_json = require("xmljson").to_json


export default class WxpayTools {
  config:WxpayBaseConfig
  secert:string
  wxUrl:WxUrl

  constructor(config:WxpayBaseConfig,secert:string){
    this.config = config
    this.secert = secert
    this.wxUrl = {
      create:"https://api.mch.weixin.qq.com/pay/unifiedorder",
      search:"https://api.mch.weixin.qq.com/pay/orderquery"
    }
  }

  /**
   * 生成参数
   * 避免出现重复订单情况,传给微信的订单号是随机生成的
   */
  private getValue<T>(param:T):string{
    let strinfo:string = jsonsort.objKeySort(param)

    let str:string = `${strinfo}&key=${this.secert}`
    console.log('字符串',str)
    let sign:string = md5(str).toUpperCase()
    let jsoninfo:any = {...param,sign:sign}


    let temp = {
      xml:jsoninfo
    }

    return jsonxml(temp)
  }

  // 请求微信api
  private send_url(data:string,wxUrl:string){
    return new Promise((resolve,reject)=>{
      request({
        url:wxUrl,
        method: "POST",
        body: data
      },function (err:any,response:any,body:any) {
        if(!err && response.statusCode === 200){
          console.log(111,body)
          to_json(body,function (err:any,data:any) {
            if(!err){
              if(data.xml.return_code === "SUCCESS"){
                resolve(data.xml)
              }else{
                reject(data.xml)
              }
            }else {
              reject(err)
            }
          })
        }else{
          reject(body)
        }
      })
    })
  }

  // 统一下单
  async create_order<T>(param:T){
    let attach:AttachData = {
      order_id:(param as any).order_id
    }

    if((param as any).other_info){
      attach.other_info = (param as any).other_info
    }

    (param as any).attach = JSON.stringify(attach)

    {delete (param as any).order_id}

    {(param as any).out_trade_no = uuid.v1().split('-').join('')}

    param = {...this.config,...param}

    {(param as any).nonce_str = uuid.v1().split('-').join('')}

    let send = this.getValue<T>(param)

    try{
      let ajax = await this.send_url(send,this.wxUrl.create)
      console.log("请求完毕",ajax)
      return ajax
    }catch (err){
      console.log('统一下单错误信息',err)
      throw err
    }
  }

  // 查询订单
  async search_order(outTradeNo:string){
    let send:WxpaySearchConfig = {
      appid:this.config.appid,
      mch_id:this.config.mch_id,
      transaction_id:outTradeNo,
      nonce_str:uuid.v1().split('-').join('')
    }

    let data = this.getValue<WxpaySearchConfig>(send)
    try{
      let ajax = await this.send_url(data,this.wxUrl.search)
      console.log("请求完毕",ajax)
      return ajax
    }catch (err){
      console.log('统一下单错误信息',err)
      throw err
    }
  }

  // 退款接口
  async refundMoney(){
    // todo

  }


  // 小程序需要单独处理一下
  deal_mini(res:any):ResponseConfig{
    let time:string = new Date().getTime() +""

    let nonceJson = {
      appId:this.config.appid,
      timeStamp:time,
      nonceStr:res.nonce_str,
      package:`prepay_id=${res.prepay_id}`,
      signType:"MD5",
    }
    let nonceSign:string = md5(`${jsonsort.objKeySort(nonceJson)}&key=${this.secert}`)

    let response:ResponseConfig = {
      code:1,
      data:{
        paySign:nonceSign.toUpperCase(),
        timeStamp:time,
        signType:"MD5",
        nonceStr:res.nonce_str,
        package:`prepay_id=${res.prepay_id}`,
      }
    }
    return response
  }

  // 接受回调信息，验证是否是真实订单
  check_order(body:NotifyResponseConfig):boolean{
    let sign:string = body.sign
    delete body.sign
    // 排序
    let sort = md5(`${jsonsort.objKeySort(body)}&key=${this.secert}`)
    if(sort.toUpperCase() === sign){
      return true
    }else{
      return false
    }
  }

}
