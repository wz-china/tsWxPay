let express = require("express")

const app = express();

let wxpay = require("./routes/wxpay")

app.use("/pay",wxpay)

app.get('/',function(req,res){
  res.send('Hello World!');
});

app.listen(8888,function() {
  console.log('Example app listening on port 8888!');
})
