var async = require('async');


//并发计数
var concurrencyCount = 0;

//伪造访问函数，用延时来模拟访问返回的过程
var fetchUrl = function (url, callback) {
    var delay = parseInt((Math.random() * 10000000) % 2000, 10);
    concurrencyCount++;
    console.log('现在的并发数是：', concurrencyCount, ",正在抓取的是：", url, ',耗时', delay, "ms");
    setTimeout(function () {
        concurrencyCount--;
        callback(null, url + 'html content');
    }, delay);
}


fetchUrl('http://www.baidu.com', function (err, content) {

})


//创造一组连接，并通过假方法模拟访问，看async的能力
var urls = [];
for (var i = 0; i < 30; i++) {
    urls.push('http://datasource_' + i);
}

async.mapLimit(urls, 5, function (url, callback) {
    fetchUrl(url, callback)
}, function (err, result) {
    console.log("final:");
    console.log(result);
})

//——————————————————————————以上是对async的初步演示、了解
//——————————————————————————下面开始做真正的目标

var express = require("express");
var superagent = require("superagent");
var cheerio = require("cheerio");
var url = require("url");

var app = express()
var cnodeUrl = 'https://cnodejs.org';

app.get("/", function (require, response) {
    superagent.get(cnodeUrl).end(function (err, res) {
        if (err) {
            response.send(err);
            return;
        }
        var topicUrls = [];
        var $ = cheerio.load(res.text);
        $("#topic_list .topic_title").each(function (id, ele) {
            var $ele = $(ele);
            topicUrls.push(url.resolve(cnodeUrl, $ele.attr("href")))
        })
        console.log(topicUrls); //获得了一个页面的40个URl

        async.mapLimit(topicUrls, 3, function (url, callback) {
            superagent.get(url).end(function (err, res) {
                var single_result = {};
                if (err) {
                    response.send(err);
                    return;
                }
                var topic$ = cheerio.load(res.text);
                single_result ={
                    "title": topic$(".topic_full_title").text().trim(),
                    "href": url,
                    "comment1": topic$(".reply_content p").eq(0).text().trim()
                }
                callback(null, single_result);
            })
        }, function (err, result) {
           // console.log("final:");
           // console.log(result);
            response.send(result);
        })


    })
})


app.listen(3000, function () {
    console.log('app is running at port 3000')
})