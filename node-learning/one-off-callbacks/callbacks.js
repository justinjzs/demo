//16.12.2
//js in action chapter 3。

var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
  if (req.url == '/') {
    fs.readFile('./titles.json', function(err, data) {  //  读取文件
      if (err) {  //读取出错
        console.log(err);
        res.end('Server Error');
      } else {  //读取成功
        var titles = JSON.parse(data.toString());
        fs.readFile('./template.html', function(err, data) {  //读取template
          if (err) {
            console.log(err);
            res.end('Server Error');
          } else {
            var tmpl = data.toString();
            var html = tmpl.replace('%', titles.join('</li><li>'));
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);
          }          
          
        });
      }
    });
  }
}).listen(2016);
