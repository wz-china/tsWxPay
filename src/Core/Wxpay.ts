import {
  AttachData, ResponseConfig, NotifyResponseConfig, WxpayBaseConfig, WxpayMiniAndBaseConfig,
  WxpayMiniRequestConfig, WxUrl
} from "../types/index";
let md5 = require("md5")
let uuid = require("uuid")
let jsonsort = require("jsonkeysort")
let request = require("request")
const jsonxml = require("jsonxml")
const to_json = require("xmljson").to_json

interface JsonInfo{
  strinfo:string
  jsoninfo:WxpayMiniAndBaseConfig
}

export default class WxpayTools {
  config:WxpayBaseConfig
  secert:string
  wxUrl:WxUrl

  constructor(config:WxpayBaseConfig,secert:string){
    this.config = config
    this.secert = secert
    this.wxUrl = {
      create:"https://api.mch.weixin.qq.com/pay/unifiedorder",
    }
  }

  // 生成加密sign
  private create_sign(data:JsonInfo):string{
    let {strinfo,jsoninfo} = data
    let str:string = `${strinfo}&key=${this.secert}`
    console.log('字符串',str)
    let sign = md5(str).toUpperCase()
    jsoninfo.sign = sign
    let temp = {
      xml:jsoninfo
    }
    return jsonxml(temp)
  }

  /**
   * 生成参数
   * 避免出现重复订单情况,传给微信的订单号是随机生成的
   */
  private getValue(param:WxpayMiniRequestConfig):JsonInfo{
    let nonceStr:string = uuid.v1().split('-').join('')
    let info:WxpayMiniAndBaseConfig = {...param,...this.config}
    let attach:AttachData = {
      order_id:param.order_id!
    }
    if(param.other_info) attach.other_info = param.other_info
    info.attach = JSON.stringify(attach)
    info.nonce_str = nonceStr
    delete info.order_id
    info.out_trade_no = uuid.v1().split('-').join('')
    console.log(info)
    return {strinfo:jsonsort.objKeySort(info),jsoninfo:info}
  }

  // 请求微信api
  private send_url(data:string){
    return new Promise((resolve,reject)=>{
      request({
        url:this.wxUrl.create,
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
  async create_order(param:WxpayMiniRequestConfig){
    let send = this.create_sign(this.getValue(param))
    try{
      let ajax = await this.send_url(send)
      console.log("请求完毕",ajax)
      return ajax
    }catch (err){
      console.log('统一下单错误信息',err)
      throw err
    }
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
