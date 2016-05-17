/**
 * stacktable.js
 * Author & copyright (c) 2012: John Polacek
 * Dual MIT & GPL license
 *
 * Page: http://johnpolacek.github.com/stacktable.js
 * Repo: https://github.com/johnpolacek/stacktable.js/
 *
 * jQuery plugin for stacking tables on small screens
 *
 */
;(function($) {
  $.fn.stacktable = function(options) {
    var $tables = this,
        defaults = {id:'stacktable',hideOriginal:false},
        settings = $.extend({}, defaults, options);

    return $tables.each(function() {
      var $stacktable = $('<table class="'+settings.id+'"><tbody></tbody></table>');
      if (typeof settings.myClass !== undefined) $stacktable.addClass(settings.myClass);
      var markup = '';
      $table = $(this);
      $topRow = $table.find('tr').eq(0);
      $table.find('tr').each(function(index,value) {
        markup += '<tr>';
        // for the first row, top left table cell is the head of the table
        if (index===0) {
          //markup += '<tr class="st-name"><th class="st-head-row st-head-row-main" colspan="2">'+$(this).find('th,td').eq(0).html()+'</th></tr>';
        }
        // for the other rows, put the left table cell as the head for that row
        // then iterate through the key/values
        else {
          $(this).find('td').each(function(index,value) {
            if (index===0) {
              markup += '<tr><th class="st-head-row" colspan="2">Name:'+$(this).html()+'</th></tr>';
            } else {
              if ($(this).html() !== ''){
                markup += '<tr>';
                if ($topRow.find('td,th').eq(index).html()){
                  markup += '<td class="st-key" style="padding-left:5em">'+$topRow.find('td,th').eq(index).html()+'</td>';
                } else {
                  markup += '<td class="st-key"></td>';
                }
                markup += '<td class="st-val">'+$(this).html()+'</td>';
                markup += '</tr>';
              }
            }
          });
        }
      });
      $stacktable.append($(markup));
      $table.before($stacktable);
      if (settings.hideOriginal) $table.hide();
    });
  };

}(jQuery));

function detectmob() {
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}

$(document).ready(function(){
  if (detectmob()){
    var choice = '<option selected value="player">Player</option><option value="viewer">Viewer</option>'
  }
  else {
    var choice = '<option selected value="viewer">Viewer</option>'
  }
  $("#selectRole").append(choice)
});
// enable vibration support
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
var socket;
var cid;
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
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
    $("#gameroom-div").css("overflow","scroll");
    $("#gameroom-div").css("display","block");
  }
  function showLobby(){
    $("#lobby-div").css("display","block");
    $("#lobby-div").css("overflow","scroll");
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
      if(data[i].started == true)continue; // client side hiding started game
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
  function rebuildGameRoom(rid){
    var mapRole = {};
    mapRole["player"] = "Player";
    mapRole["viewer"] = "Viewer";
    var mapCar = {};
    mapCar["tron"] = "Tron";
    mapCar["black"] = "Black Tron"
    mapCar["nyan"] = "Nyan Cat"

    console.log(clientList);
    $("#divGameRoomBodyPre").empty();
    $("#divGameRoomBodyPost").empty();
    var divClientList = $("#divGameRoomBodyPre");
    var id =1;
    for (var i in clientList){
      if (clientList[i].inRoom != rid) continue;
      var pid = clientList[i].cid;
    //      var tmpli = $("<div/>").html(krEncodeEntities("client_id:"+pid+":"+clientList[pid].name));
      var username = krEncodeEntities((id)+". "+clientList[pid].name);
      id++;
      console.log(username);
      if (cid!=pid){
        var tmpli = $("<tr/>")
        tmpli.append($("<th/>").text(username));
        tmpli.append($("<th/>").text(mapRole[clientList[pid].setting.role]));
        tmpli.append($("<th/>").text(mapCar[clientList[pid].setting.car]));
        var div = $("<div/>").css("background-color", clientList[pid].setting.wall)
        div.css("width","44px");
        div.css("height","23px");
        div.css("border", "3px solid");
        div.css("border-color","rgba(21,171,195,1.0)");
        tmpli.append($("<th/>").html(div));
        divClientList.append(tmpli);
      }
      else {
          $("#divPlayerName").html((id-1)+". "+clientList[pid].name);
          //$("#divGameRoomBodyPre").append(divClientList);
          divClientList = $("#divGameRoomBodyPost");
      }
    }
    console.log(divClientList);
  }
  function updateGameRoom(data){
    $("#troll-divGameRoomHead").empty();
    $("#divGameRoomBodyPre").empty();
    $("#divGameRoomBodyPost").empty();
    $("#divPlayerName").empty();
    var roomBody = $("<li/>").addClass("troll-troll-text-block");
    var roomHead = $("<div/>");
    roomHead.append($("<h4/>").html(krEncodeEntities("Room Name:"+data.name)));
    roomHead.append($("<h4/>").html(krEncodeEntities("Room ID:"+data.room_id)));
    $("#troll-divGameRoomHead").append(roomHead);
//    var divClientList = $("<div/>").html("Player List:");
//    var id = 1;
//     for (var i in data.client_list){
//       var pid = data.client_list[i];
// //      var tmpli = $("<div/>").html(krEncodeEntities("client_id:"+pid+":"+clientList[pid].name));
//       var tmpli = $("<div/>").html(krEncodeEntities((id++)+". "+clientList[pid].name + pid + " "+ cid));
//       if (cid!=pid){
//         tmpli.append(clientList[pid].setting.role);
//         tmpli.append(clientList[pid].setting.car);
//         tmpli.append(clientList[pid].setting.wall);
//         divClientList.append(tmpli);
//       }
//       else {
//           $("#divPlayerName").html((id-1)+". "+clientList[pid].name);
//           $("#divGameRoomBodyPre").html(divClientList);
//           divClientList = $("<div/>").html("");
//       }
//     }
//     $("#divGameRoomBodyPost").html(divClientList);
//     $("#troll-divGameRoomHead").append(roomHead);
    if (clientList[cid].inRoom!=-1) rebuildGameRoom(clientList[cid].inRoom);
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
    if(data.setting.floor != undefined){
      $("#selectFloor").val(data.setting.floor);
    }
    if(data.setting.room_bgm != undefined){
      $("#selectBgm").val(data.setting.room_bgm);
    }
    // remove wall as it becomes client setting
    $("#selectFloor").change();
    $("#selectBgm").change();
    /* move default player setting to server
    $("#selectRole").change();
    $("#selectCar").change();
    $("#selectWall").change();
    */
  });
  socket.on("roomLeave",function(data){
    showLobby();
  });
  socket.on("updateClientList",function(data){
    clientList = data;
    console.log(clientList);
    if(clientList[cid] != undefined && clientList[cid].setting != undefined){
      if ($("#selectCar")!=undefined) $("#selectCar").val(clientList[cid].setting.car);
      if ($("#selectRole")!=undefined){
        if (clientList[cid].setting.role=='default'){
          if (detectmob()){
              clientList[cid].setting.role = 'player'
              $("#selectCar").css("display", "block");
              $("#selectWall").css("display", "block");

          }
          else {
            clientList[cid].setting.role = 'viewer'
            $("#selectCar").css("display", "none");
            $("#selectWall").css("display", "none");
          }
          $("#selectRole").val(clientList[cid].setting.role);
          console.log(clientList[cid].setting.role);
          socket.emit("updateGameSetting",{key:"role",val:clientList[cid].setting.role});

        }
      }
      if ($("#selectWall")!=undefined) $("#selectWall").val(clientList[cid].setting.wall);
      if (clientList[cid] != undefined && clientList[cid].inRoom!=-1) rebuildGameRoom(clientList[cid].inRoom);
    }
  });
  socket.on("gameNoPlayer",function(data){
    alert("No Player, play AOC?");
  });
  socket.on("gameStart",function(data){
    $("#loading-div").css("display","none");
    $("#loading-div2").css("display","none");
    $("#game-div").css("display","block");
  });
  socket.on("gameLoading", function(data){
    if (clientList[cid].setting.role=='player') $("#loading-div2").css("display","block");
    if (clientList[cid].setting.role=='viewer') $("#loading-div").css("display","block");
    $("#lobby-div").css("display","none");
    $("#gameroom-div").css("display","none");
    $("#welcome-div").css("display","none");
  });
  socket.on("gameEnd",function(data){
    //console.log(data[0].dead);
    //console.log(data[0].props);
    //console.log(data[0].time);
    var head = $("<tr/>");

    head.addClass("large-only-header");
    head.append($("<td/>").html("Name"));
    head.append($("<td/>").html("Time"));
    for (var j in data[0].props){
        if(!data[0].props.hasOwnProperty(j)) continue;
        head.append($("<td/>").html(j.capitalizeFirstLetter()));
    }
    head.append($("<td/>").html("Status"));
    $("#troll-result").empty();
    $("#troll-result").css("text-align","center")
    $("#troll-result").append(head);
    for (i = 0; i < data.length; i++){
      var record = $("<tr/>");
      record.append($("<td/>").html(krEncodeEntities(data[i].name)));//M9W: Name你當住有先啦
      record.append($("<td/>").html(krEncodeEntities(data[i].time.toFixed(3))));
      for (var j in data[i].props){
        if(!data[i].props.hasOwnProperty(j)) continue;
        record.append($("<td/>").html(krEncodeEntities(data[i].props[j])));
      }
      record.append($("<td/>").html(krEncodeEntities(data[i].status)));
      $("#troll-result").append(record);
      $(".small-only").remove()
      $('#troll-result').stacktable({myClass:'small-only table table-borderless'});

    }
    //$('#troll-result').stacktable({myClass:'stacktable small-only'});
    $("#result-div").css("display","block");
    $("#gameroom-div").css("display","none");
    $("#welcome-div").css("display","none");
    $("#lobby-div").css("display","none");
    $("#game-div").css("display","none");
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
  $("#btnBackLobby").click(function(){
    $("#result-div").css("display","none");
    $("#gameroom-div").css("display","none");
    $("#welcome-div").css("display","none");
    $("#game-div").css("display","none");
    $("#lobby-div").css("display","block");
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
  $('#selectBgm').on('change', function() {
    socket.emit("updateGameSetting",{key:"bgm",val:this.value});
  });
  $('#selectFloor').on('change', function() {
    socket.emit("updateGameSetting",{key:"floor",val:this.value});
  });
  $('#selectCar').on('change', function() {
    socket.emit("updateGameSetting",{key:"car",val:this.value});
  });
  $('#selectWall').on('change', function() {
    socket.emit("updateGameSetting",{key:"wall",val:this.value});
  });
  $('#selectRole').on('change', function() {
    //alert(this.value);
    if (this.value=="player"){
      $("#selectCar").css("display", "block");
      $("#selectWall").css("display", "block");
    }
    if (this.value=="viewer") {
      $("#selectCar").css("display", "none");
      $("#selectWall").css("display", "none");
    }
    socket.emit("updateGameSetting",{key:"role",val:this.value});
  });
socket.on('updateClientId',function(data){
  cid=data;
  console.log("my cid = "+cid);
})
  socket.on("syncRoomSetting",function(settingObj){
    var settingKey = settingObj.key;
    var settingVal = settingObj.val;
    switch(settingKey){
      case "bgm":
        $("#selectBgm").val(settingVal);
        break;
      case "floor":
        $("#selectFloor").val(settingVal);
        break;
      default:
        break;
    }
  });
