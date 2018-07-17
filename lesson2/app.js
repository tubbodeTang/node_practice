var express = require('express');
var utility = require('utility');

var app = express();

app.get("/", function (require, response) {
    var q = require.query.q; //取出q查询参数

    if (q != undefined) {
        var md5Value = utility.md5(q); //利用utility查到q的md5值
        var sha1Value = utility.sha1(q); //利用utility查到q的sha1值
        response.send(md5Value + ";" + sha1Value);
    } else {
        response.send("no query string");
    }
})

app.listen(3000, function (require, response) {
    console.log('app is running at port 3000');
})