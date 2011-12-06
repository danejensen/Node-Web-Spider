/**
 * spider.js
 */

var http = require("http"),
    sys = require("sys"),
    url = require("url");

var dom = require("../deps/jsdom/lib/jsdom/level1/core").dom.level1.core;
var htmlparser = require("../deps/htmlparser/lib/node-htmlparser");
var browser = require("../deps/jsdom/lib/jsdom/browser/index").windowAugmentation(dom, {parser: htmlparser});
var SIZZLE = require("../deps/sizzle");


/*-----------------------------------------------
  Spider Exports:
-----------------------------------------------*/



/*-----------------------------------------------
  Spider Implementation:
-----------------------------------------------*/
var Spider = exports.Spider = function() {};

Spider.prototype.crawl = function(qv, callback) {
  var href = qv.queue.shift();
  qv.visited.push(href);
  var uri = url.parse(href);
  var protocol = require('http');

  var req = protocol.get({host:uri.hostname, path: uri.pathname, method:'GET'}, function(response){
    var body = "";
    response.on("data", function(chunk) {
      body += chunk;
    });
    response.on("end", function() {
      var document = browser.document;
      document.innerHTML = body;

      var sizzle = SIZZLE.sizzleInit({}, document);
      var anchors = sizzle("a");
      anchors.forEach(function(a) {
        var link = a.href;
        var h = url.parse(link).hostname;
        if(h && h != uri.hostname){ console.log('Not following: '+ link)}
        else{
          console.log("Adding to queue: " + link);
          if ((qv.visited.indexOf(link) == -1) && (qv.queue.indexOf(link)== -1)){qv.queue.push(link);}
        }
      });
      callback(qv);
    });
  });
  
};




