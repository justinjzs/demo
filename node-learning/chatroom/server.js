//16.12.1
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var chatServer = require('./lib/chat_server');  //导入chat服务器
var cache = {};

function send404(response) { //404 Not Found
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('Error 404: response not found');
    response.end();
}

function sendFile(response, filePath, fileContents) {  //发送页面
    response.writeHead(200, { 'Content-Type': mime.lookup(path.basename(filePath)) });
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {    //路由不同页面的请求
    if (cache[absPath]) {   //如果缓存里有
        sendFile(response, absPath, cache[absPath]);
    } else {    //如果没有
        fs.exists(absPath, function(exist) {    //请求页面是否存在
            if (exist) {    //存在
                fs.readFile(absPath, function(err, data) {  //读取页面
                    if (err) {  //读取出错
                        send404(response);
                    } else {    //读取成功，缓存并发送
                        cache[absPath] = data;  
                        sendFile(response, absPath, cache[absPath]);
                    }
                });
            } else {    //不存在
                send404(response); 
            }
        });
    }

}

var server = http.createServer(function (request, response) {   //建立http服务器
    var filePath = false;      //将请求的url转换成实际的路径
    if (request.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public'+ request.url;
    }
    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);
});

server.listen(2016, function () {   //监听端口
    console.log("Sever running at http://localhost:2016/");
});

chatServer.listen(server);  //把已经开启的http服务器传入，共享端口