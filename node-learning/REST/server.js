//16.12.5
//a RESTful web application
const http = require('http');
const url = require('url');
let items = [];
let server = http.createServer((req, res) => {
  switch (req.method) {
    case 'GET':
      let body = items.map((item, i) => i + ') ' + item).join('\n');
      res.setHeader('Content-Length', Buffer.byteLength(body));
      res.setHeader('Content-Type', 'type/plain; charset="utf-8"');
      res.end(body);
      break;
    case 'POST':
      let item = '';
      req.setEncoding('utf8');
      req.on('data', chunk => item += chunk);
      req.on('end', () => {items.push(item); res.end('Post successful!\n');});
      break;
    case 'DELETE':
      let path = url.parse(req.url).pathname;
      const i = parseInt(path.slice(1), 10);
      if (isNaN(i)) {
        res.statusCode = 400;
        res.end('Invalid item id');
      } else if (!items[i]) {
        res.statusCode = 404;
        res.end('Item not found');
      } else {
        items.splice(i, 1);
        res.end("Delete successful!\n");
      }
      break;
    case "PUT":
      let change = '';
      let pathPut = url.parse(req.url).pathname;
      const index = parseInt(pathPut.slice(1), 10);
      req.on('data', chunk => change += chunk);
      req.on('end', () => {
        if (isNaN(index)) {
          res.statusCode = 400;
          res.end('Invalid item id');
        } else if (!items[index]) {
          res.statusCode = 404;
          res.end('Item not found');
        } else {
          items[index] = change;
          res.end("update successful!\n");
        }
      });
      break;

  }
});
server.listen(2016);