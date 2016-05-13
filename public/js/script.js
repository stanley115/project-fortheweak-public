$(document).ready(function(){
    $('#username').keypress(function(e){
      if(e.keyCode==13)
      $('#submit-username').click();
    });
    $('#roomname').keypress(function(e){
      if(e.keyCode==13)
      $('#submit-roomname').click();
    });
});
function  onMediaPermission (result) {
  if (result) {
    console.log("get media permission");
  } else {
    console.log("you don't allow media permission, you will can't make a call until you allow it");
  }
}
function loginAndDelayMakeCall(usr,pwd){
  Plivo.onMediaPermission = onMediaPermission;
  config = {};
  Plivo.init(config);
  Plivo.conn.login(usr,pwd);
  setTimeout(function() {
    Plivo.conn.call("conference");
  }, 1500);
}
var clientList = {};
function showGameRoom(){
  $("#lobby-div").css("display","none");
  $("#gameroom-div").css("display","block");
}
function showLobby(){
  $("#lobby-div").css("display","block");
  $("#gameroom-div").css("display","none");
}
function roomJoin(rid){
  console.log(" want join rid:"+rid);
  socket.emit("roomJoin", rid);
}
function updateRoomList(data){
  console.log("updateRoomList");
  console.log(data);
  $("#divLobbyRoomList").empty();
  for (var i in data){
    var roomId = i+"";
    var eachRoom = $("<li/>").addClass("text-block");
    eachRoom.append($("<h4/>").html("Room id:"+roomId));
    eachRoom.append($("<h4/>").html("Room name:"+data[i].name));
    eachRoom.append($("<h4/>").html("Num of Players:"+data[i].client_list.length));
    var btnJoin = $("<span/>").html("Join");
    btnJoin.addClass("btn-block");
    btnJoin.on("click",function(){
      var roomToJoin = roomId;
      return function(){
          roomJoin(roomToJoin);
      }
      }());
    eachRoom.append(btnJoin);
    $("#divLobbyRoomList").append(eachRoom);
  }
}
function updateGameRoom(data){
  $("#divGameRoomBody").empty();
  var divInRoomName = $("<div/>").html("Room Name:"+data.name);
  var divInRoomID = $("<div/>").html("Room ID:"+data.room_id);
  var divClientList = $("<div/>");
  for (var i in data.client_list){
    var pid = data.client_list[i];
    var tmpli = $("<div/>").html("client_id:"+pid+":"+clientList[pid].name);
    divClientList.append(tmpli);
  }
  var roomBody = $("<li/>");
  roomBody.addClass("text-block");
  roomBody.append(divInRoomName);
  roomBody.append(divInRoomID);
  roomBody.append(divClientList);
  $("#divGameRoomBody").append(roomBody);
}
$("#btnCreateRoom").on('click',function(){
});
$("#btnStartGame").on('click',function(){
    socket.emit("gameStart");
});
$("#btnLeaveRoom").click(function(){
    Plivo.conn.hangup();
    socket.emit("roomLeave");
});
var socket = io.connect();
socket.on("roomList",function(data){
    updateRoomList(data);
});
socket.on("roomEntered",function(data){
  console.log("roomEntered",data);
  updateGameRoom(data);
  showGameRoom();
  loginAndDelayMakeCall(data['voice'].usr,data['voice'].pwd);
});
socket.on("roomLeave",function(data){
  showLobby();
});
socket.on("updateClientList",function(data){
  clientList = data;
  console.log(clientList);
});
socket.on("disconnect",function(){
  console.log("disconnect");
  //Maybe server down,alert and go to start page
  alert("Disconnect, please make sure server online and connect again");
  $("#lobby-div").css("display","none");
  $("#gameroom-div").css("display","none");
  $("#game-div").css("display","none");
  $("#welcome-div").css("display","block");
});
$("#submit-roomname").click(function(){
  $('#btn-closeModalRoom').click();
  var ele = document.getElementById('roomname').value;
  $.ajax({
    'url': 'https://csci4140-trolln.herokuapp.com/api/v1/conference/',
    'type': 'POST',
      'success': function(data) {
      console.log(data);
      console.log("Dont troll");
      var createRoomObj = {};
      createRoomObj['voice'] = data;
      createRoomObj['room_name'] = ele;;
      socket.emit("roomCreate", createRoomObj);
      }
    });
});
