var express = require('express');

var app = express();

app.get("/", function (require, response) {
    response.send("你好 世界");
})
//get大概是响应“/”这个地址的get请求的意思吧，
//require里是请求信息，response用来组织返回信息

app.listen(3000, function () {
    console.log('app is listening at port 3000');
})