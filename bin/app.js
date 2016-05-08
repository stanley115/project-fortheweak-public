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
  //console.log('room_id:'+room_id);
  //console.log("Create new room with name:"+roomName);
  globalData.room[room_id]={};//create obj
  globalData.room[room_id].name = roomName;
  globalData.room[room_id].client_list = [];
  roomJoin(socket,cid,room_id);
}
function roomJoin(socket,cid,rid){
  globalData.room[rid].client_list.push(cid);
  socket.join(rid);
  //console.log(cid+" join "+rid);
  //console.log("Room name:"+globalData.room[rid].name);
  var client_self = 'client-'+cid;
  console.log(globalData.room[rid]);
  globalData.client[cid].inRoom = rid;
  //Need notify any one in the room 
  socket.to(rid).emit('roomEntered',globalData.room[rid]);
  
}

function roomLeave(socket,cid){
  var orgRoom = globalData.client[cid].inRoom;
  if(parseInt(orgRoom) > 0 ){
    var filteredAry = globalData.room[orgRoom].client_list.filter(function(e){return e!=cid;});
    globalData.room[orgRoom].client_list = filteredAry;
    console.log(globalData.room[orgRoom]);
    console.log(cid+"(cid) leave "+orgRoom+"(rid)");
    if(filteredAry.length === 0){
      console.log("Remove Empty Room");
      delete globalData.room[orgRoom];
    }
    //remove this client from that room List ;
    globalData.client[cid].inRoom = -1; // reset Status
    //Undo : Need notify others in room , for leaver need go to lobby
  }
}

function roomList(socket,cid){
  var client_self = 'client-'+cid;
  console.log(globalData.room);
  socket.to(client_self).emit('roomList',globalData.room);
}

module.exports = function(app){
  //use the same object to store room info & client info;
  console.log("Init socketio");
  var io = require('socket.io').listen(app);
  io.on('connection', function(socket){
    var client_id = ++client_id_pool; // **** closure for each client to capture client_id;
    var client_channel = "CLIENT-"+client_id;
    socket.join(client_channel); // so that we can broadcast roomList/pref to individual clients when not in room
    console.log("client_id:"+client_id);
    var client_name; // another var in closure
    socket.on('clientNew',function(name){
      globalData.client[client_id]={};
      globalData.client[client_id].cid = client_id;
      globalData.client[client_id].name = name;
      globalData.client[client_id].inRoom = -1;
      console.log(globalData.client[client_id]);
      socket.emit(client_channel,globalData.client[client_id]);
    });
    socket.on('disconnect',function(){
      console.log('disconnect:'+client_id);
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
      roomLeave(socket,client_id);
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
