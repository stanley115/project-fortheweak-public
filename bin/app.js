/**
 *  Main application
 */
var client_id_pool = 0 ;
var room_id_pool = 0;
var globalData = {};
globalData.client = {};
globalData.room = {};
function roomCreate(socket,cid,roomName){
  var room_id = ++room_id_pool;
  console.log('room_id:'+room_id);
  globalData.room_id.name = roomName;
  globalData.room_id.client_list = [];
  globalData.room_id.client_list.push(cid);//room master
  socket.join(room_id);// receive message for this room
}
function roomJoin(socket,cid,rid){
  globalData.rid.client_list.push(cid);
  socket.join(rid);
}
function roomList(socket,cid){
  var client_self = 'client-'+cid;
  io.to(client_self).emit(globalData);
}

module.exports = function(app){
  //use the same object to store room info & client info;
  console.log("Init socketio");
  var io = require('socket.io').listen(app);
  io.on('connection', function(socket){
    var client_id = ++client_id_pool; // **** closure for each client to capture client_id;
    socket.join("CLIENT-"+client_id); // so that we can broadcast roomList/pref to individual clients when not in room
    console.log("client_id:"+client_id);
    socket.on('disconnect',function(){
      console.log('disconnect');
    });
    socket.on('roomCreate',function(roomName){
      console.log('roomCreate');
      roomCreate(socket,client_id,roomName);
    });
    socket.on('roomJoin',function(room_id){
      console.log('roomJoin');
      roomJoin(socket,client_id,room_id);
    });
    socket.on('roomLeave',function(){
      console.log('roomLeave');
    });
    socket.on('roomList',function(){
      console.log('roomList');
      roomList(socket,client_id);
    });
    socket.on('roomUpdate',function(){
      console.log('roomUpdate');
    });
  });
};
