import {WxpayBaseConfig, WxpayMiniRequestConfig,ResponseConfig,TradeType} from "./types/index"
import WxpayTools from "./Core/Wxpay"


// 向外暴露一个类
export default class TsWxpay extends WxpayTools {

  constructor(config:WxpayBaseConfig,secert:string) {
    super(config,secert)
  }

  // 小程序支付
  async miniPay(param:WxpayMiniRequestConfig):Promise<ResponseConfig>{
    param.trade_type = "JSAPI"
    try{
      let res = await this.create_order<WxpayMiniRequestConfig>(param)
      let data = this.deal_mini(res)
      return data
    }catch (err){
      console.log(err)
      let errs:ResponseConfig = {
        code:0,
        msg:err
      }
      return errs
    }
  }

  // H5支付
  async h5Pay(param:WxpayMiniRequestConfig):Promise<ResponseConfig>{
    // todo
    param.trade_type = "MWEB"
    try{
      let res = await this.create_order<WxpayMiniRequestConfig>(param)
      let data:ResponseConfig = {
        code:1,
        data:res
      }
      return data
    }catch (err){
      console.log(err)
      let errs:ResponseConfig = {
        code:0,
        msg:err
      }
      return errs
    }

  }

  // 微信JSAPI支付集合
  async JSAPIPay(type:TradeType,param:WxpayMiniRequestConfig):Promise<ResponseConfig>{
    param.trade_type = type
    try{
      let res = await this.create_order<WxpayMiniRequestConfig>(param)
      let data:ResponseConfig = {
        code:1,
        data:res
      }
      return data
    }catch (err){
      console.log(err)
      let errs:ResponseConfig = {
        code:0,
        msg:err
      }
      return errs
    }

  }




}
