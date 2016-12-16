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