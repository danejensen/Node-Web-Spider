/**
 * spider-server.js
 */

require.paths.unshift("lib/");
var lazy = require("lazy"),
     fs  = require("fs");
var url = require("url");
var Spider = require("spider").Spider;

var spider = new Spider();
crawler = function(qv){
  if (qv.queue.length != 0){
    spider.crawl(qv, function(qv){crawler(qv);});
  }
}


new lazy(fs.createReadStream('/home/rhett/harvest-email/designblogs.txt'))
    .lines
    .forEach(function(line){
        var uri = url.parse(line.toString());
        crawler({h:uri.hostname, queue: [line.toString()], visited: [], matchcount: 0})
    }
);
