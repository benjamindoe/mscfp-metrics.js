$(function () {
  var keystrokes = 0;
  var passwordKeystrokes = 0;
  var userKeystrokes = 0;
  var timeout = false;
  var distance = 0;
  var location = 0;
  var clicks = 0;
  var rightClicks = 0;
  var sessionId = generateSessionKey();
  var completed = 0;
  $(document).keyup(function (e) {
    keystrokes++;
    clearTimeout(timeout);
    timeout = setTimeout(logMetrics, 500);
  });
  $('input[type=password]').keydown(function (e) {
    passwordKeystrokes++;
  });
  $('input[type=email]').keydown(function (e) {
    userKeystrokes++;
  });
  $('form').submit(function (e) {
    completed = 1;
    logMetrics();
  });
  $(document).mousemove(function(e) {
    var oldLoc = location
    location = getMouseLoc(e);
    if (oldLoc) {
      distance += Math.abs(oldLoc - location);
    }
    clearTimeout(timeout);
    timeout = setTimeout(logMetrics, 3000);
  });
  $(document).click(function () {
    clicks++;
    clearTimeout(timeout);
    timeout = setTimeout(logMetrics, 3000);
  });
  $(document).contextmenu(function () {
    rightClicks++;
    clearTimeout(timeout);
    timeout = setTimeout(logMetrics, 3000);
  });
  function logMetrics() {
    console.log(sessionId, keystrokes, userKeystrokes, passwordKeystrokes, distance, clicks, rightClicks);
    $.post('https://bendoe.uk/api/login-metrics', {
      'session_id': sessionId,
      'keystrokes': keystrokes,
      'username_keystrokes': userKeystrokes,
      'password_keystrokes': passwordKeystrokes,
      'distance': distance,
      'clicks': clicks,
      'right_clicks': rightClicks,
      'completed': completed,
      'user_agents': navigator.userAgent,
    }, function (output) {
      console.log(output);
    });
  }
  function getMouseLoc(e) {
    var startingTop = 0;
    var startingLeft = 0;
    return Math.round(Math.sqrt(Math.pow(startingTop - e.clientY, 2) + Math.pow(startingLeft - e.clientX, 2)));
  }
  function generateSessionKey() {
    var rndArray = new Uint32Array(3);
    window.crypto.getRandomValues(rndArray);
    hex = '';
    for (var rndNum of rndArray) {
      hex += rndNum.toString(16);
    }
    return hex;
  }
});
