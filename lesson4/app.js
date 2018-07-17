var express = require('express')
var superagent = require('superagent');
var cheerio = require('cheerio');
var eventproxy = require('eventproxy');
var url = require('url');

var app = express();
var cnodeUrl = 'https://cnodejs.org';

app.get("/", function () {
    superagent.get("cnodeUrl")
        .end(function (err, res) {
            if (err) {
                app.send(err);
                return;
            }

            var topicUrls = [];
            var $ = cheerio.load(res.text);
            $("#topic_list .topic_title").each(function (id, ele) {
                var $ele = $(ele);
                topicUrls.push(url.resolve(cnodeUrl, $ele.attr("href")))
            })

            console.log(topicUrls);
        })
})