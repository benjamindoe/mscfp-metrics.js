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
  if (cookie('mscfp_consent') == 1) {
    registerRecordingEvents();
  } else {
    var confirmed = showConfirmationModal();
    $('.button.confirm, .button.deny').click(function () {
      cookie('mscfp_consent', 0, 365);
      $('.modal').remove();
    });
    $('.button.confirm').click( function () {
      cookie('mscfp_consent', 1, 365);
      registerRecordingEvents();
    });
  }
  function registerRecordingEvents() {
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
      timeout = setTimeout(logMetrics, 300);
    });
    $(document).contextmenu(function () {
      rightClicks++;
      clearTimeout(timeout);
      timeout = setTimeout(logMetrics, 300);
    });
  }
  function logMetrics() {
    console.log('Posting data:', sessionId, keystrokes, userKeystrokes, passwordKeystrokes, distance, clicks, rightClicks);
    $.post('https://bendoe.uk/api/login-metrics', {
      'session_id': sessionId,
      'keystrokes': keystrokes,
      'username_keystrokes': userKeystrokes,
      'password_keystrokes': passwordKeystrokes,
      'distance': distance,
      'clicks': clicks,
      'right_clicks': rightClicks,
      'completed': completed,
      'user_agent': navigator.userAgent,
      'hostname': window.location.hostname
    }, function () {
      console.log('Data Posted');
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
  function showConfirmationModal() {
    var $overlay = $('<div class="modal overlay"></div>');
    $overlay.css({
      'position': 'absolute',
      'top': 0,
      'bottom': 0,
      'left': 0,
      'right': 0,
      'background-color': 'rgba(0,0,0,0.5)',
    });
    var $modal = $('<div class="modal-body"></div>');
    var modalHeight = 500;
    $modal.css({
      position: 'absolute',
      top: '50%',
      left: '0',
      right: '0',
      width: modalHeight + 'px',
      margin: '0 auto',
      transform: 'translateY(-50%)',
      'background-color': 'rgba(255,255,255,1)',
      padding: '15px'
    })
    var $heading = $('<h2 class="heading">Hi, can you help?</h2>').css({'font-size': '150%', 'text-align': 'center'})
    var $statement = $('<div class="statement"></div>');
    $statement.append('<p class="text">We\'re currently doing a bit of research about improving our login system. As such we would love your help. We would like to monitor how you currently use our login system which will allow us to see where we can improve.No personal data or sensitive data will be collected!</p>');
     $statement.append('<p class="text">Here\'s what information we want to collect:</p>');
    var $dataCollected = $('<ul class="data-collected"></ul>');
    var dataCollected = [
      'Time it takes to complete the login process',
      'How far your mouse travelled on our login screen',
      'Number of clicks you made',
      'Number of key presses you made',
      'Whether you have logged in using "Remember me" in the future',
      'Details about the type of browser and Operating System used'
    ];
    for (pt of dataCollected) {
      $dataCollected.append('<li>' + pt + '</li>');
    }
    $statement.append($dataCollected);
    $statement.append('<p class="text">Here\'s what information we WILL NOT collect:</p>');

    var dataNotCollected = [
      'Emails and usernames',
      'Passwords',
      'Names',
      'IP Address',
      'Any sensitive information that could be traced back to you',
    ];
    var $dataNotCollected = $('<ul class="data-not-collected"></ul>');
    for (pt of dataNotCollected) {
      $dataNotCollected.append('<li>' + pt + '</li>');
    }
    $statement.append($dataNotCollected);
    var buttonCSS = {
      padding: '10px 15px',
      margin: '0 10px',
      width: '100px',
      border: 'none',
      cursor: 'pointer'
    }
    var $confirm = $('<button class="confirm button">Yes</button>').css(buttonCSS).css({
      'background-color': '#32a852',
      'border': '1px solid #0c822d',
      'color': 'white',
      'font-weight': 'bold'
    });
    var $deny = $('<button class="deny button">No</button>').css(buttonCSS).css('border', '1px solid #d9d9d9');
    var $modalFooter = $('<div class="modal-footer"></div>').css({'text-align': 'center', 'margin-top': '30px'});
    $modalFooter.append($confirm, $deny)
    $modal.append($heading, $statement, $modalFooter);
    $overlay.append($modal);
    $('body').append($overlay);
    $('.modal .heading, .modal .statement > *').css('margin-bottom', '15px');
    $('.modal ul').css('padding-left', '40px');
  }
});

function cookie(key, value, days = 1) {
  if (value === undefined) {
    var cookies = decodeURIComponent(document.cookie).split(';');
    for (var i = cookies.length; i--;) {
      var cookie = cookies[i].split('=');
      cookieKey = cookie[0].trim();
      if (cookieKey == key) {
        return cookie[1];
      }
    }
    return undefined;
  } else {
    var date = new Date();
    if (days >= 0) {
      var milisecs = days * 24 * 60 * 60 * 1000;
      date.setTime(date.getTime() + milisecs);
    } else {
      date.setTime(0);
    }
    var expires = "expires="+ date.toUTCString();
    var cookieStr = key + "=" + value + ";" + expires + ";path=/";
    return document.cookie = cookieStr;
  }
}
