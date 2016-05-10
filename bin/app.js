/**
 *  Main application
 */
var client_prefix = "client-";
var client_id_pool = 0 ;
var room_id_pool = 0;
var globalData = {};
globalData.client = {};
globalData.room = {};
function roomCreate(serverSocket,socket,cid,roomName){
  var room_id = ++room_id_pool;
  //console.log('room_id:'+room_id);
  //console.log("Create new room with name:"+roomName);
  globalData.room[room_id]={};//create obj
  globalData.room[room_id].name = roomName;
  globalData.room[room_id].room_id = room_id;
  globalData.room[room_id].client_list = [];
  roomJoin(serverSocket,socket,cid,room_id);
  serverSocket.emit('roomList',globalData.room);
}
function roomJoin(serverSocket,socket,cid,rid){
  //If client is in other room ,leave it first
  //This step will also remove empty room
  roomLeave(serverSocket,socket,cid);
  socket.join(rid);
  globalData.room[rid].client_list.push(cid);
  //console.log(cid+" join "+rid);
  //console.log("Room name:"+globalData.room[rid].name);
  var client_self = client_prefix+cid;
  console.log(globalData.room[rid]);
  globalData.client[cid].inRoom = rid;
  //Need notify any one in the room 
  serverSocket.to(rid).emit('roomEntered',globalData.room[rid]);
  //As this step may also remove room List, notify the world
  serverSocket.emit('roomList',globalData.room);
  
}

function roomLeave(serverSocket,socket,cid){
  var rid = globalData.client[cid].inRoom;
  if(parseInt(rid) > 0 ){
    socket.leave(rid);//leave the socket channel too
    var filteredAry = globalData.room[rid].client_list.filter(function(e){return e!=cid;});
    globalData.room[rid].client_list = filteredAry;
    //Need to update everyone ,excluding left player
    console.log(globalData.room[rid]);
    console.log(cid+"(cid) leave "+rid+"(rid)");
    if(filteredAry.length === 0){
      console.log("Remove Empty Room");
      delete globalData.room[rid];
    }
    //remove this client from that room List ;
    globalData.client[cid].inRoom = -1; // reset Status
    // Need notify others in room , for leaver need go to lobby, done my reuse
    // enter room func
    serverSocket.to(rid).emit('roomEntered',globalData.room[rid]);
    var client_self = client_prefix+cid;
    //In fact need notify all client so that info updated on lobby too 
    //Update on left client lobby too so that it won't click on empty room 
    /*
    serverSocket.to(client_self).emit('roomList',globalData.room);
    serverSocket.to(client_self).emit('roomLeave');
    */
    serverSocket.emit('roomList',globalData.room);
    serverSocket.to(client_self).emit('roomLeave');
  }
}

function roomList(serverSocket,cid){
  var client_self = client_prefix+cid;
  console.log(globalData.room);
  serverSocket.to(client_self).emit('roomList',globalData.room);
}

module.exports = function(app){
  //use the same object to store room info & client info;
  console.log("Init socketio");
  var io = require('socket.io').listen(app);
  io.on('connection', function(socket){
    var client_id = ++client_id_pool; // **** closure for each client to capture client_id;
    var client_channel = client_prefix+client_id;
    socket.join(client_channel); // so that we can broadcast roomList/pref to individual clients when not in room
    console.log("client_id:"+client_id);
    var client_name; // another var in closure
    socket.on('clientNew',function(name){
      globalData.client[client_id]={};
      globalData.client[client_id].cid = client_id;
      globalData.client[client_id].name = name;
      globalData.client[client_id].inRoom = -1;
      console.log(globalData.client[client_id]);
      io.to(client_channel).emit('clientNew',client_channel,globalData.client[client_id]);
      io.emit('roomList',globalData.room);
    });
    socket.on('disconnect',function(){
      console.log('disconnect:'+client_id);
      try{
        var rid = globalData.client[client_id].inRoom;
        if(rid>-1){
          roomLeave(io,socket,client_id);
          delete globalData.client_id[client_id];
          //room client list also updated , notify other users in same room
        }
      }catch(e){
      }
    });
    socket.on('roomCreate',function(roomName){
      console.log('roomCreate');
      roomCreate(io,socket,client_id,roomName);
    });
    socket.on('roomJoin',function(room_id){
      console.log('roomJoin');
      roomJoin(io,socket,client_id,room_id);
    });
    socket.on('roomLeave',function(){
      console.log('roomLeave');
      roomLeave(io,socket,client_id);
    });
    socket.on('roomList',function(){
      console.log('roomList');
      roomList(io,client_id);
    });
    socket.on('roomUpdate',function(){
      console.log('roomUpdate');
    });
  });
};
