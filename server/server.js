let express = require("express")
const bodyParser = require('body-parser')
require("body-parser-xml")(bodyParser)
const app = express();

//设置http请求的请求体
app.use(bodyParser.xml({
  limit: "1MB",   // Reject payload bigger than 1 MB
  xmlParseOptions: {
    normalize: true,     // Trim whitespace inside text nodes
    normalizeTags: true, // Transform tags to lowercase
    explicitArray: false // Only put nodes in array if >1
  },
  verify: function(req, res, buf, encoding) {
    if(buf && buf.length) {
      // Store the raw XML
      req.rawBody = buf.toString(encoding || "utf8");
    }
  }
}));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

let wxpay = require("./routes/wxpay")

app.use("/pay",wxpay)

app.get('/',function(req,res){
  res.send('Hello World!');
});


app.listen(8888,function() {
  console.log('Example app listening on port 8888!');
})
