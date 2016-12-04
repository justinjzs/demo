//16.12.4
//a example of serial flow control
const fs = require('fs');
const request = require('request');
const htmlparser = require('htmlparser');
const configFilename = './rss_feeds.txt';
const recordFilename = './rss_record.txt';

function checkRSSFile() { //the file exists or not
  fs.exists(configFilename, exist => {
    if (!exist) return next(new Error('Missing RSS File: ' + configFilename));
    next(undefined, configFilename);
  });
}  

function readRSSFile(configFilename) {  //load the content of the file
  fs.readFile(configFilename, (err, feedList) => {
    if (err) return next(err);
    feedList = feedList.toString().replace(/^\s+|\s$/g, '').split('\n');
    const random = Math.floor(Math.random() * feedList.length); //random chosen
    next(undefined, feedList[random]);
  });
} 

function downloadRSSFeed(feedUrl) {   //download the feed
  request({uri: feedUrl}, function(err, res, body) {
    if (err) return next(err);
    if (res.statusCode != 200) return next(new Error('the response statusCode is not 200'));
    next(undefined, body);
  });
}

function parseRSSFeed(rss) {  //parse the response
  const handler = new htmlparser.RssHandler();
  const parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);
  if (!handler.dom.items.length) return next(new Error('no rss items found'));
  const items = handler.dom.items;
  const writeStream = fs.createWriteStream(recordFilename, {flags: "a"});
  for (let item of items) {
    writeStream.write(item.title + '\r\n' + item.link + '\r\n');
    console.log(item.title);
    console.log(item.link);
  }
  writeStream.end();

}

var tasks = [checkRSSFile, readRSSFile, downloadRSSFeed, parseRSSFeed]; //task array

function next(err, result) { //serial flow control
  if (err) throw err;
  const task = tasks.shift();
  if (task) {
    task(result);
  }
}

next();

//------------for debug----------
// const fs = require('fs')
// fs.exists('./rss_feeds.txt', exist => console.log(exist));