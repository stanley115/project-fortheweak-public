var Welcome = function(config){
  document.getElementById("fullscreen").addEventListener("click", goFullscreen.bind(null));
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
    //      var divid = document.getElementById('welcome-div');
    //      $(divid).fadeOut("slow");
    var ele = document.getElementById('welcome-page');
    fadeOut(ele);
    var ele = document.getElementById('welcome-page-background');
    fadeIn(ele);
    //    var ele = document.getElementById('CUHK-logo-background');
    //  fadeIn(ele);
    setTimeout(
        function() {
          var ele = document.getElementById('welcome-page-background');
          fadeOut(ele);
        },
        1200);
    setTimeout(
        function() {
          var ele = document.getElementById('CUHK-logo-background');
          fadeIn(ele)
        },
        1900);
    setTimeout(
        function() {
          var ele = document.getElementById('CUHK-logo-background');
          fadeOut(ele)
        },
        3100);
    setTimeout(
        function() {
          prompt("Enter something","default");
          var ele = document.getElementById('welcome-div');
          ele.classList.add("remove");
          document.getElementById('lobby-div').style.display = 'block'
        },
        3800);
    //$(document.getElementById('welcome-div')).fadeOut("slow");
    //document.getElementById('welcome-div').style.display='none'
  }
}
Welcome.prototype.start = function(){
}
module.exports = Welcome
