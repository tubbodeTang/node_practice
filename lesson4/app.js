var express = require('express')
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var url = require('url');

var app = express();
var cnodeUrl = 'https://cnodejs.org';


app.get("/", function (require, response) {
    superagent.get(cnodeUrl)
        .end(function (err, res) {
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

            //下面对40个URl进行并发访问
            topicUrls.forEach(function (topicUrl, index) {
                if (index <= 3) { //改为3，因为访问过于频繁网站会拦截
                    superagent.get(topicUrl)
                        .end(function (err, res) {
                            console.log('fetch ' + topicUrl + ' successful');
                            ep.emit('topic_visited', [topicUrl, res.text])
                        })
                }
            })

            var ep = new eventproxy();
            //注册所有topic都访问完成的事件
            ep.after('topic_visited', 3, function (topics) { //改为3，因为访问过于频繁网站会拦截
                //topics里是所有40个topic访问后的数据，进行处理
                var result = [];
                topics.forEach(function (topic) {
                    debugger;
                    var htmlContent = cheerio.load(topic[1]);
                    result.push({
                        "title": htmlContent(".topic_full_title").text().trim(),
                        "href": topic[0],
                        "comment1": htmlContent(".reply_content p").eq(0).text().trim()
                    })
                })
                response.send(result);
                //console.log()
            })
        })



})
app.listen(3000, function () {
    console.log('app is running at port 3000');
})