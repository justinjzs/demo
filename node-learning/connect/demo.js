var connect = require('connect');
var app = connect();
app.listen(3000);

function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
  console.log('executied');
}
function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}

function restrict(req, res, next) {
  var authorization = req.headers.authorization;
  if (!authorization) return next(new Error('Unauthorized'));
  var parts = authorization.split(' ')
  var scheme = parts[0]
  var auth = new Buffer(parts[1], 'base64').toString().split(':')
  var user = auth[0]
  var pass = auth[1];
  if (user =="jin" && pass =="jinzs")
    next();
  else next(new Error('xixi'));
}

function admin(req, res, next) {
  console.log(req.url);
  switch (req.url) {
    case '/':
      res.end('try /users');
      break;
    case '/:id':
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(['tobi', 'loki', 'jane']));
      break;
  }
}

app.use(logger).use('/admin', restrict).use('/admin', admin).use(hello);
