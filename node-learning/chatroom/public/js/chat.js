//16.12.2 
//emit 3个事件 message,join,nameAttempt三个事件
//功能细节

class Chat {
  constructor(socket) {
    this.socket = socket;
  }

  sendMessage(room,text) {  //发消息
    const message = {room,text};
    this.socket.emit('message', message); //{"room"："Lobby", "text": "Hi"}
  }

  changeRoom(room) {  //{"newroom": "dragonfly"}
    this.socket.emit('join', {newRoom: room});
  }

  processCommand(commands) { //处理命令
    let words = commands.split(' ');
    const command = words[0].substring(1, words[0].length).toLowerCase();
    let message = false;

    switch(command) {
      case 'join':
        words.shift();
        let room = words.join(' ');
        this.changeRoom(room);
        break;
      case 'nick':
        words.shift();
        let nickName = words.join(' ');
        this.socket.emit('nameAttempt', nickName); 
        break;
      default:
        message = "invalid command";
        break;
      }
      return message;
    }

}