var Welcome = function(config){
  document.getElementById("fullscreen").addEventListener("click", goFullscreen.bind(null));
  document.getElementById("submit-username").addEventListener("click", submitUsername.bind(null));
  document.getElementById("btnCreateRoom").addEventListener("click", createRoom.bind(null));
  //document.getElementById("submit-roomname").addEventListener("click", submitRoomname.bind(null));

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
  //fadeOut
  function fadeOut(el){
    el.style.opacity = 1;
    (function fade() {
      if ((el.style.opacity -= .05) < 0) {
        el.style.display = "none";
      } else {
        requestAnimationFrame(fade);
      }
    })();
  }
  // fade in
  function fadeIn(el, display){
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += .05) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  }
  function goFullscreen() {
    // Get the element that we want to take into fullscreen mode
    var element = document.body;
    //var element = document.getElementById('welcome-page')
    console.log(element);
    // These function will not exist in the browsers that don't support fullscreen mode yet,
    // so we'll have to check to see if they're available before callingublic them.
    if (element.mozRequestFullScreen) {
      // This is how to go into fullscren mode in Firefox
      // Note the "moz" prefix, which is short for Mozilla.
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullScreen) {
      // This is how to go into fullscreen mode in Chrome and Safari
      // Both of those browsers are based on the Webkit project, hence the same prefix.
      element.webkitRequestFullScreen();
    }
    // Hooray, now we're in fullscreen mode!
    if (detectmob()){
      var lockFunction =  window.screen.orientation.lock;
      if (lockFunction.call(window.screen.orientation, 'landscape')) {
        console.log('Orientation locked')
      } else {
        console.error('There was a problem in locking the orientation')
      }
    }

    //      var divid = document.getElementById('welcome-div');
    //      $(divid).fadeOut("slow");
    var ele = document.getElementById('welcome-page');
    fadeOut(ele);
    var ele = document.getElementById('welcome-page-background');
    fadeIn(ele);
    //    var ele = document.getElementById('CUHK-logo-background');
    //  fadeIn(ele);

    document.getElementById("audiobgm").play();
    setTimeout(
        function() {
          var ele = document.getElementById('welcome-page-background');
          fadeOut(ele);
        },
        1200);
    setTimeout(
        function() {
          var ele = document.getElementById('logo-background');
          fadeIn(ele);
        },
        2100);
    setTimeout(
        function() {
          var ele = document.getElementById('logo-background');
          fadeOut(ele);
        },
        4000);
    setTimeout(
        function() {
          //document.getElementById("myModal").style.display = "block";
          // jQuery(document).ready(function($) {
          //   $('#myModal').modal("show")
          // });
          document.getElementById('btn-openModalUsername').click();
          //var playerName = prompt("Enter Player Name:","default");
          //socket.emit("clientNew",playerName);
          var ele = document.getElementById('welcome-div');
          ele.classList.add("remove");
          showLobby();
          //document.getElementById('lobby-div').style.display = 'block';
        },
        4500);
    //$(document.getElementById('welcome-div')).fadeOut("slow");
    //document.getElementById('welcome-div').style.display='none'
  }
  function submitUsername(){
    document.getElementById('btn-closeModalUsername').click();
    var ele = document.getElementById('username').value;
    socket.emit("clientNew",ele);
    console.log("HIHIHIHI register event send");
  }
  function createRoom(){
    document.getElementById('btn-openModalRoom').click();
  }
}
Welcome.prototype.start = function(){
}
module.exports = Welcome
