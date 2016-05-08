/**
 *  Main application
 */
module.exports = function(app){
    //use the same object to store room info & client info;
  console.log("Init socketio");
    var globalData = {};
    globalData.client = {};
    globalData.room = {};
    var io = require('socket.io').listen(app);
    var client_id_pool = 0 ;
    var room_id_pool = 0;
    io.on('connection', function(socket){
      var client_id = ++client_id_pool;
      console.log("client_id:"+client_id);
      socket.on('disconnect',function(){
        console.log('disconnect');
      });
      socket.on('roomCreate',function(roomName){
        console.log('roomCreate');
        var room_id = ++room_id_pool;
        console.log('room_id:'+room_id);
        globalData.room_id.name = roomName;
      });
      socket.on('roomJoin',function(){
        console.log('roomJoin');
      });
      socket.on('roomLeave',function(){
        console.log('roomLeave');
      });
      socket.on('roomList',function(){
        console.log('roomList');
      });
      socket.on('roomUpdate',function(){
        console.log('roomUpdate');
      });
    });
};
