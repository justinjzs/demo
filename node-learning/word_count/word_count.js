//16.12.5
//word count example
const fs = require('fs')
const textDir = './text';
let taskNumber = 0
var taskArray = [];
let wordNumber = {};


function countWord(text) {
  let words = text.toString().toLowerCase().split(/\W+/).sort();
  for (let word of words) {
    wordNumber[word] = wordNumber[word] ? wordNumber[word]++ : 1;
  }
}

function checkComplete() {
  taskNumber--;
  if (taskNumber == 0) {
    for (let word in wordNumber) {
      console.log(word + ' : ' + wordNumber[word]);
    }
  }
}

fs.readdir(textDir, (err,files) => {
  if (err) throw err;
  taskNumber = files.length;
  for (let file of files) {
    let task = (function (fileDir) {
      return function() {
        fs.readFile(fileDir, (err, text) => {
          if (err) throw err;
          countWord(text);
          checkComplete();
        });
      }
    })(textDir + '/' + file);
    taskArray.push(task);
  }
  for (let task of taskArray) { //由于异步，绝对不能放在fs.readdir的后面。
  task();
}
});




