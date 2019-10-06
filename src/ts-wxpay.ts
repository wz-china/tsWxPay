import {WxpayBaseConfig, WxpayMiniRequestConfig,ResponseConfig} from "./types/index"
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
      let res = await this.create_order(param)
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
}
