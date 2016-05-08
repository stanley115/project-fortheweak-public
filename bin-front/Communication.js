var io = require('socket.io-client');
io.connect();
console.log("Communication API");
function roomList(){
}
function roomCreate(roomName){
}
function callbackRoomList(roomList){
  console.log(roomList);
}
function callbackRoomCreate(data){
}
