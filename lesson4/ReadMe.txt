# 目标
建立一个 lesson4 项目，在其中编写代码。

代码的入口是 app.js，当调用 node app.js 时，它会输出 CNode(https://cnodejs.org/ ) 社区首页的所有主题的标题，链接和第一条评论，以 json 的格式。

输出示例：

[
  {
    "title": "【公告】发招聘帖的同学留意一下这里",
    "href": "http://cnodejs.org/topic/541ed2d05e28155f24676a12",
    "comment1": "呵呵呵呵"
  },
  {
    "title": "发布一款 Sublime Text 下的 JavaScript 语法高亮插件",
    "href": "http://cnodejs.org/topic/54207e2efffeb6de3d61f68f",
    "comment1": "沙发！"
  }
]

# 挑战
以上文目标为基础，输出 comment1 的作者，以及他在 cnode 社区的积分值。

示例：

[
  {
    "title": "【公告】发招聘帖的同学留意一下这里",
    "href": "http://cnodejs.org/topic/541ed2d05e28155f24676a12",
    "comment1": "呵呵呵呵",
    "author1": "auser",
    "score1": 80
  },
  ...
]

# 知识点
1、体会 Node.js 的 callback hell 之美
2、学习使用 eventproxy 这一利器控制并发