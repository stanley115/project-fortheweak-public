var Room = function(config){
  document.getElementById("fullscreen").addEventListener("click", goFullscreen.bind(null));
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
      var elem = document.getElementById('welcome-div');
      elem.classList.add("hide");

      setTimeout(
        function Remove() {
            elem.classList.add("remove");
            document.getElementById('game-div').style.display = 'block'
        },
      1500 );
      //$(document.getElementById('welcome-div')).fadeOut("slow");
      //document.getElementById('welcome-div').style.display='none'
  }
}

Room.prototype.start = function(){

}

module.exports = Room
