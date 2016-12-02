var http = require('http');
http.createServer(function (req,res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World\n');
}).listen(2016);
console.log('Server running at http://localhost:2016/');