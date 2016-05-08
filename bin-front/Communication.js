var Communication=function(){
  var socket = require('socket.io-client');
  socket.connect();
  console.log("Communication API");
  return {
    initCallback:function(){
      socket.on('roomList',callbackRoomList);
    },
    roomList:function(){
    },
    roomCreate:function(roomName){
      socket.emit('roomCreate',roomName);
    },
    callbackRoomList:function(roomList){
      console.log(roomList);
    },
    callbackRoomCreate:function(data){
    }
  };
};
module.exports = Communication;
