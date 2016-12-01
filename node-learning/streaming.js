var fs = require('fs');

// fs.readFile('./test.json', function (er, data) { //filr reading
//     console.log(data.toString());
// });

// var stream = fs.createReadStream('./test.json');  //streaming 
// stream.on('data', function (chunk) {
//     console.log(chunk.toString());
// });
// stream.on('end', function () {
//     console.log('finished');
// });

var http = require('http');                         //readfiles pipe to res
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    fs.createReadStream('test.json').pipe(res);
}).listen(2016);
console.log('Server running on http://localhost:2016/');