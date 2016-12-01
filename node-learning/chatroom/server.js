var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

function send404(response) { //404 function
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.write('Error 404: response not found');
    response.end();
}

function sendFile(response, filePath, fileContents) {  //sendfile function
    response.writeHead(200, { 'Content-Type': mime.lookup(path.basename(filePath)) });
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {    //static page
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exist) {
            if (exist) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, cache[absPath]);
                    }
                });
            } else {
                send404(response);
            }
        });
    }

}

var server = http.createServer(function (request, response) { 
    var filePath = false;
    if (request.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public'+ request.url;
    }
    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);
});

server.listen(2016, function () {
    console.log("Sever running at http://localhost:2016/");
});

var chatServer = require('./lib/chat_server');
chatServer.listen(server);