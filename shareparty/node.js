//1
//node中的异步操作通过回调函数和事件监听来处理。
//这里以settimeout为例
var a = 0;
setTimeout(() => a++, 1000);  //不会阻塞
console.log(a); //0
setTimeout(() => console.log(a), 1000);

//2
//最简单的一个Web应用，接收到请求后，返回一个Hello World
var http = require('http'); //require导入http包。
var server = http.createServer(); //创建一个http服务器。

server.on('request', function (req, res) { //添加监听器，监听‘request’事件。
  res.writeHead(200, { 'Content-Type': 'text/plain' }); //写响应头
  res.end('Hello World\n'); //写响应体并发送。
});

server.listen(3000);  //监听3000端口
console.log('Server running at http://localhost:3000/');

//3
//假设我们现在有一个需求，收到请求后，读取三个文件，并依次写入到响应中。
//很自然的，为了确保在读取完毕之后再写入响应，我们会这么写。
//如果有更多的业务逻辑需要嵌套执行，就产生了回调金字塔。
var http = require('http');
var fs = require('fs'); //导入fs包，封装了对文件的操作
http.createServer(function (req, res) {
res.writeHead(200, {'Content-Type': 'text/plain'}); 
fs.readFile('a.txt', 'utf8', (err, data) => {  //读取文件a.txt
  if (err) throw err;
  var a = data;
  fs.readFile('b.txt', 'utf8', (err, data) => { //读取文件b.txt
    if (err) throw err;
    var b = data;
    fs.readFile('c.txt', 'utf8', (err, data) => { //读取文件c.txt
      if (err) throw err;
      var c = data;
      res.write(a + b + c + '\n');  //写data
      res.end('Hello World\n'); //写hello world 并发送
    });
  });
});
}).listen(3000);
console.log('Server running at http://localhost:3000/');

//4
//改写之前的例子，来体会一下中间件的思想。

var http = require('http');
var fs = require('fs'); //导入fs包，封装了对文件的操作
http.createServer(requestHandler).listen(3000);
console.log('Server running at http://localhost:3000/');

var middlewares = [ //middlewares存储三个中间件。
  function fun1(req, res, next) {
    fs.readFile('a.txt', 'utf8', (err, data) => {
      if (err) next(err);
      res.write(data + '\n');  //写入data
      next();
    });
  },
  function fun2(req, res, next) {
    fs.readFile('b.txt', 'utf8', (err, data) => {
      if (err) next(err);
      res.write(data + '\n');  //写入data
      next();
    });
  },
  function fun3(req, res, next) {
    fs.readFile('c.txt', 'utf8', (err, data) => {
      if (err) next(err);
      res.write(data + '\n');  //写入data
      res.end('Hello World\n'); //写入hello world 并发送
      next();
    });
  }
]

function requestHandler(req, res) {
  var i=0;
function next(err) {    //由middlewares链式调用
    if (err) {
      return res.end('error:', err.message);
    }
    if (i<middlewares.length) { //不断调用下一个函数。
      middlewares[i++](req, res, next);
    } else {
      return ;
    }
  }
  next(); //触发第一个middleware
}

//5
//简单的connect应用，收到请求后，先打印request的method和url，再返回hello world；
var connect = require('connect'); //导入connect包
function logger(req, res, next) { 
  console.log('%s %s', req.method, req.url);
  next();
}
function hello(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.end('hello world');
}
var app = connect() //创建http服务器
  .use(logger)  //use()方法，加载中间件logger
  .use(hello)   //加载中间件hello
  .listen(3000);  //监听


 //6  generator
 //Generators are functions which can be exited and later re-entered. 
 //Their context (variable bindings) will be saved across re-entrances
function* gen() { // *标志这是一个generator函数
  console.log(1);
  yield 2;
  var a = 2;
  console.log(a);
  yield (a + 3);
  var b = 3;
  console.log(b);
}

var g = gen(); //调用函数生成generator遍历器

g.next(); //{ value: 2, done: false }
g.next(); //{ value: 5, done: false }
g.next();//{ value: undefined, done: true }

// generator 函数的定义，是通过 function *(){} 实现的
// 对 generator 函数的调用返回的实际是一个遍历器，随后代码通过使用遍历器的 next() 方法来获得函数的输出
// 通过使用yield语句来中断 generator 函数的运行，并且可以返回一个中间结果
// 每次调用next()方法，generator 函数将执行到下一个yield语句或者是return语句。

// 7
//一个co自动执行generator函数的例子
//把异步的操作转化为同步的写法
var co = require('co');
var fs = require('co-fs');

co(function* (next) {
  var data = yield fs.readFile('a.txt', 'utf8');//同步的写法！
  console.log(data + '\n');
  data = yield fs.readFile('b.txt', 'utf8');
  console.log(data + '\n');
  data = yield fs.readFile('c.txt', 'utf8');
  console.log(data + '\n');
});


//8
//简单的koa应用，收到request后，打印处理的时间，返回hello world。
//写法上与Connect/Express的主要区别是 ：
//1.所有的中间件都是generator函数。
//2.函数的参数只有next，并通过yield next来调用下一个中间件
//主要看一下koa中间件的执行顺序。
var koa = require('koa'); //导入koa包
var app = koa();  //创建http服务器

app.use(function* responseTime(next) {  //x-response-time 中间件
  var start = new Date; //1
  yield next; //调用下一个中间件
  var ms = new Date - start; //8
  this.set('X-Response-Time', ms + 'ms'); //写响应头
});

app.use(function* logger(next) {  //logger 中间件
  var start = new Date; //2
  yield next; //调用下一个中间件
  var used = new Date - start;  //7
  console.log('used: ' + used);
});
app.use(function* contentLength(next) { //contentlength 中间件
  yield next; //3
  if (!this.body) return; //6
  this.set('Content-Length', this.body.length);
});
app.use(function* body(next) {  //response 中间件
  yield next;  //4
  if (this.path != '/') return; //5
  this.body = 'Hello World!'; //写响应体
});

app.listen(3000);


//9
//比较koa在错误处理上的优化。(也是co带来的。)
//第二个中间件中异步读取文件的操作throw一个err。
var koa = require('koa');
var fs = require('fs');
var cofs = require('co-fs');

var app = koa();

app.use(function* (next) {  //first
  try {
    yield next;
  } catch (err) {
    console.log(err.message + 'catched by first')
  }
}
)

app.use(function* (next) { 
  try {
    //  var data = yield cofs.readFile('aa.txt', 'utf8');
    //  console.log(data);
    fs.readFile('aa.txt', 'utf8', (err, data) => {
      if (err) throw err;
      console.log(data);
    });
  } catch (err) {
    console.log(err.message + 'catched by second');
  }
}
)

app.listen(3000);

//10 
//一个自己实现的Koa，来解释为什么downstream后会upstream
var co = require('co');
class Koa {
  constructor() {
    this.middlewares = [];
  }
  
  use(middleware) {
    this.middlewares.push(middleware);
  }

  run() {
    var ctx = this;
    var middlewares = ctx.middlewares;
    return co(function* () {
      var pre = null;
      var i = middlewares.length;
      while (i--) { //从后往前遍历
        pre = middlewares[i].call(ctx, pre); //将后一个中间件传给当前中间件
      }
      yield pre; //执行第一个中间件
    })
  }
}
  var app = new Koa();
 	 app.use(function *a(next){
	 	 this.body = '1';
	  	yield next;
	 	 this.body += '6';
      yield next;
      this.body += '7';
	  	console.log(this.body);
 	 });
 	 app.use(function *b(next){
	  	this.body += '2';
	  	yield next;
	 	 this.body += '4';
      yield next;
      this.body += '5'
 	 });
  	app.use(function *c(next){
	 	 this.body += '3';
  		});
	  app.run();