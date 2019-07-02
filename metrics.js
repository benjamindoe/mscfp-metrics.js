$(function () {
  var keystrokes = 0;
  var passwordKeystrokes = 0;
  var userKeystrokes = 0;
  var timeout = false;
  var distance = 0;
  var location = 0;
  var clicks = 0;
  var rightClicks = 0;
  $(document).keyup(function (event) {
    keystrokes++;
    clearTimeout(timeout);
    timeout = setTimeout(logTimeout, 500);
  });
  $('input[type=password]').keydown(function (event) {
    passwordKeystrokes++;
  });
  $('input[type=email]').keydown(function (event) {
    userKeystrokes++;
  });
  $(document).mousemove(function(event) {
    var oldLoc = location
    location = getMouseLoc(event);
    if (oldLoc) {
      distance += Math.abs(oldLoc - location);
    }
    clearTimeout(timeout);
    timeout = setTimeout(logTimeout, 500);
  });
  $(document).click(function () {
    clicks++;
    clearTimeout(timeout);
    timeout = setTimeout(logTimeout, 500);
  });
  $(document).contextmenu(function () {
    rightClicks++;
    clearTimeout(timeout);
    timeout = setTimeout(logTimeout, 500);
  });
  function logTimeout() {
    console.log(keystrokes, userKeystrokes, passwordKeystrokes, distance, clicks, rightClicks);
  }
  function getMouseLoc(event) {
    var startingTop = 0;
    var startingLeft = 0;
    return Math.round(Math.sqrt(Math.pow(startingTop - event.clientY, 2) +
                                    Math.pow(startingLeft - event.clientX, 2)));
  }
});
