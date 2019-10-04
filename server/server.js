let express = require("express")

const app = express();

let wxpay = require("./routes/wxpay")

import tsWxpay from "../src/ts-wxpay"
console.log(tsWxpay)

app.use("/pay",wxpay)

app.get('/',function(req:any,res:any){
  res.send('Hello World!');
});

app.listen(8888,function() {
  console.log('Example app listening on port 8888!');
})
