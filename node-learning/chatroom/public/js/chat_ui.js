//16.12.2
//on 4个事件: nameResult,joinResult,message,rooms
function divEscapedContentElement(message) { //change to html entries
  return $('<div></div>').text(message);
}
function divSystemContentElement(message) {
return $('<div></div>').html('<i>' + message + '</i>');
}

function processUserInput(chatApp, socket) {  //处理用户输入信息
  var message = $('#send-message').val();
  var systemMessage;

  if (message.charAt(0) == '/') {
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) { //"invalid command"
      $('messages').append(divSystemContentElement(systemMessage));
    }
  } else {  //正常信息
    chatApp.sendMessage($('#room').text(), message);
    $('#messages').append(divEscapedContentElement(message));
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  }
  $('#send-message').val('');
}

var socket = io.connect();
$(document).ready(function() {  //负责前端功能逻辑
  var chatApp = new Chat(socket);
  socket.on('nameResult', function(result) {  //{success: true, name: "Guest1"}
    var message;
    if (result.success) { 
      message = 'You are now known as ' + result.name + '.';
    } else {
      message = result.message;
    }
    $('#messages').append(divSystemContentElement(message));
  });

  socket.on('joinResult', function(result) {  //{room: "Lobby"}
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room changed'));
  });

  socket.on('message', function(message) {  //{text: "some words or some notice"}
    var newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  });

  socket.on('rooms', function(rooms){ //room 数组
    $('#room-list').empty();
    for (var room in rooms) {
      room = room.substring(1,room.length);
      if (room != '') {
        $('#room-list').append(divEscapedContentElement(room));
      }
    }
    $('#room-list div').click(function() {  //点击room名字等于切换room
      chatApp.processCommand('/join ' + $(this).text());
      $('#send-message').focus();
    });
  });
  setInterval(function() { //每秒更新room列表
    socket.emit('rooms');
  }, 1000);
  $('#send-message').focus();
  $('#send-form').submit(function () {
    processUserInput(chatApp,socket);
    return false;
  });

});