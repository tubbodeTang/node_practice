var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var app = express();

app.get('/', function (request, response, next) {
    //用superagent抓取 https://cnodejs.org/ 的内容
    superagent.get("https://cnodejs.org/")
        .end(function (error, sres) {
            //错误处理
            if (error) {
                return next(error);
            }
            // sres.text 里面存储着网页的 html 内容，将它传给 cheerio.load 之后
            // 就可以得到一个实现了 jquery 接口的变量，
            var $ = cheerio.load(sres.text);
            var items = [];
            $("#topic_list .cell").each(function (id, cell) {
                var $cell = $(cell)[0];
                var nodeA = $cell.childNodes[1].childNodes[1]
                var nodeB = $cell.childNodes[7].childNodes[3]
                
                items.push({
                    "title":nodeB.attribs.title,
                    "href": nodeB.attribs.href,
                    "author":nodeA.attribs.title
                });
            })
            // $("#topic_list .topic_title").each(function (id, ele) {
            //     var $ele = $(ele);
            //     items.push({
            //         "title": $ele.attr("title"),
            //         "href": $ele.attr("href")
            //     });
            // })

            response.send(items);
        })

})

app.listen(process.env.PORT ||3000, function () {
    console.log("app is running at port 3000");
})