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
            var visitLimit = 3;
            var $ = cheerio.load(res.text);
            $("#topic_list .topic_title").each(function (id, ele) {
                var $ele = $(ele);
                topicUrls.push(url.resolve(cnodeUrl, $ele.attr("href")))
            })

            console.log(topicUrls); //获得了一个页面的40个URl

            //下面对40个URl进行并发访问
            topicUrls.forEach(function (topicUrl, index) {
                if (index <= visitLimit) { //改为3，因为访问过于频繁网站会拦截
                    superagent.get(topicUrl)
                        .end(function (err, res) {
                            console.log('fetch ' + topicUrl + ' successful');
                            ep.emit('topic_visited', [topicUrl, res.text])
                        })
                }
            })

            var ep = new eventproxy();
            //注册所有topic都访问完成的事件
            ep.after('topic_visited', visitLimit, function (topics) { //改为3，因为访问过于频繁网站会拦截
                //topics里是所有40个topic访问后的数据，进行处理
                //var result = [];
                topics.forEach(function (topic) {
                    var htmlContent = cheerio.load(topic[1]);
                    // result.push({
                    //     "title": htmlContent(".topic_full_title").text().trim(),
                    //     "href": topic[0],
                    //     "comment1": htmlContent(".reply_content p").eq(0).text().trim()
                    // })
                    var authorUrl = htmlContent(".author_content .user_avatar").attr("href");
                    if (authorUrl != undefined) { //有可能没有评论,没评论的话直接传空值处理
                        superagent.get(url.resolve(cnodeUrl, authorUrl))
                            .end(function (err, result) {
                                ep.emit("author_visited", [topic, result])
                            })
                    } else {
                        ep.emit("author_visited", [topic, undefined])
                    }
                })
                //response.send(result);
            })

            ep.after('author_visited', visitLimit, function (allDatas) {
                var result = [];
                allDatas.forEach(function (allData) {
                    var topicContent = cheerio.load(allData[0][1]);
                    if (allData[1] == undefined) {
                        result.push({
                            "title": topicContent(".topic_full_title").text().trim(),
                            "href": allData[0][0],
                            "comment1": topicContent(".reply_content p").eq(0).text().trim(),
                            "author1": "",
                            "score1": ""
                        })
                    } else {
                        var authorContent = cheerio.load(allData[1].text);
                        result.push({
                            "title": topicContent(".topic_full_title").text().trim(),
                            "href": allData[0][0],
                            "comment1": topicContent(".reply_content p").eq(0).text().trim(),
                            "author1": authorContent(".userinfo >.dark").text().trim(),
                            "score1": authorContent(".user_profile >ul> span").text().trim()
                        })
                    }
                })
                response.send(result);

            })
        })



})
app.listen(3000, function () {
    console.log('app is running at port 3000');
})