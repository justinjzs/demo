//16.12.4
const EventEmitter = require('events');
const fs = require('fs');

class Watcher extends EventEmitter {
  constructor(watchDir, processedDir) {
    super();
    this.watchDir = watchDir;
    this.processedDir = processedDir;
  }
  watch() {
    let watcher = this;
    fs.readdir(this.watchDir, (err, files) => {
      if (err) throw err;
      for (let index in files) {
        watcher.emit('process', files[index]);
      }
    });
  }
  start() {
    let watcher = this;
    fs.watchFile(this.watchDir, () => {
      watcher.watch();
    })
  }
};

let watcher = new Watcher('./watch', './processed');

watcher.on('process', function(file){
  var watchFile = this.watchDir + '/' + file;
  var processedFile = this.processedDir + '/' + file.toLowerCase();
  fs.rename(watchFile, processedFile, err => {
    if(err) throw err;
  });
});

watcher.start();

// const fs = require('fs');
// fs.watchFile('./watch', () => {
// });