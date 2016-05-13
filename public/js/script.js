var socket;
  $('#username').keypress(function(e){
    if(e.keyCode==13)
    $('#submit-username').click();
  });
  $('#roomname').keypress(function(e){
    if(e.keyCode==13)
    $('#submit-roomname').click();
  });
  function krEncodeEntities(s){
    return $("<div/>").text(s).html();
  }
  function krDencodeEntities(s){
    return $("<div/>").html(s).text();
  }
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
    var roomBody = $("<li/>").addClass("text-block");
    roomBody.append($("<h4/>").html(krEncodeEntities("Room Name:"+data.name)));
    roomBody.append($("<h4/>").html(krEncodeEntities("Room ID:"+data.room_id)));
    var divClientList = $("<h4/>");
    for (var i in data.client_list){
      var pid = data.client_list[i];
      var tmpli = $("<div/>").html(krEncodeEntities("client_id:"+pid+":"+clientList[pid].name));
      divClientList.append(tmpli);
    }
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
  socket = io.connect();
  socket.on("roomList",function(data){
    updateRoomList(data);
  });
  socket.on("roomEntered",function(data){
    console.log("roomEntered",data);
    updateGameRoom(data);
    showGameRoom();
    loginAndDelayMakeCall(data['voice'].usr,data['voice'].pwd);
    $("#selectFloor").change();
    $("#selectBgm").change();
    $("#selectRole").change();
    $("#selectCar").change();
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
  $('#selectRole').on('change', function() {
    socket.emit("updateGameSetting",{key:"role",val:this.value});
  });
  $('#selectBgm').on('change', function() {
    socket.emit("updateGameSetting",{key:"bgm",val:this.value});
  });
  $('#selectFloor').on('change', function() {
    socket.emit("updateGameSetting",{key:"floor",val:this.value});
  });
  $('#selectCar').on('change', function() {
    socket.emit("updateGameSetting",{key:"car",val:this.value});
  });

