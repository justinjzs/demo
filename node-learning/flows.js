//a flows control example
var flow = require('nimble');
flow.series([
  function (callback) {
    setTimeout(function () {
      console.log('I execute first.');
      callback();
    }, 1000);
  },
  function (callback) {
    setTimeout(function () {
      console.log('I execute next.');
      callback();
    }, 3000);
  },
  function (callback) {
    setTimeout(function () {
      console.log('I execute last.');
      callback();
    }, 4000);
  }
]);