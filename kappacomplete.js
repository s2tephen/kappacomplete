'use strict';

// emotes for autocomplete
var allEmotes = [];

// counts for each emote
var emoteCounts = {};
if (localStorage['kc-counts']) {
  emoteCounts = JSON.parse(localStorage['kc-counts']);
}

// setup extension and call functions when ready
var setupExtension = function(cleanRegexes, bindEvents) {
  localStorage.setItem('kc-ready', false);

  // inject script to access page javascript
  var tempCode = function() {
    // get list of valid emotes from TMI.js
    localStorage.setItem('kc-regexes', JSON.stringify(TMI._sessions[0]._emotesParser.emoticonRegexToIds));
    
    // wait for Ember to render — implementation by NightDev/BTTV
    var renderingCounter = 0;

    var waitForLoad = function(callback, count) {
      count = count || 0;
      if (count > 5) {
        callback(false);
      }
      setTimeout(function() {
        if (renderingCounter === 0) {
            callback(true);
        } else {
            waitForLoad(callback, ++count);
        }
      }, 1000);
    };

    Ember.subscribe('render', {
      before: function() {
        renderingCounter++;
      },
      after: function(name, ts, payload) {
        renderingCounter--;
        // check that user is on a channel page
        if (App.__container__.lookup('controller:application').get('currentRouteName') === 'channel.index.index') {
          waitForLoad(function(ready) {
            // use local storage to notify extension when ready
            if (ready && localStorage['kc-ready'] === 'false') {
              localStorage.removeItem('kc-ready');
              localStorage.setItem('kc-ready', true);
              // manually fire storage event to trigger listener
              window.dispatchEvent(new StorageEvent('storage', {
                key: 'kc-ready',
                newValue: 'true'
              }));
            }
          });
        } else { // user navigates to non-channel page
          localStorage.removeItem('kc-ready');
          localStorage.setItem('kc-ready', false);
        }
      }
    });
  };

  var tempScript = document.createElement('script');
  tempScript.textContent = '(' + tempCode + ')()';
  (document.body || document.head || document.documentElement).appendChild(tempScript);
  tempScript.parentNode.removeChild(tempScript);

  // run scripts once everything is ready
  window.addEventListener('storage', function(e) {
    if (e.key === 'kc-ready' && e.newValue === 'true') {
      cleanRegexes();
      bindEvents();
    }
  }, false);
}

// clean emote regexes, add all variations
var cleanRegexes = function() {
  var regexes = JSON.parse(localStorage['kc-regexes']);
  Object.keys(regexes).forEach(function(k) {
    if (regexes[k]['isRegex']) {
      allEmotes = allEmotes.concat(clean(k));
    } else {
      allEmotes.push(k);
    }
  });
}

// clean a single regex
var clean = function(regex) {
  var cleaned = [];
  var base = regex.replace(/\\{1}/g, '').replace(/\//, '\\\/')
                  .replace(/\^/, '').replace(/\$/, '');
  if (/-\?/.test(base)) {
    cleaned.push(base.replace(/-\?/, '-'));
    cleaned.push(base.replace(/-\?/, ''));
  } else {
    cleaned.push(base);
  }
  cleaned.forEach(function(v, i) {
    if (/\(.\|.\)/.test(v)) {
      cleaned[i] = null; // for easy removal later
      if (/\(_\|\.\)/.test(v)) {
        cleaned.push(v.replace(/\((.)\|(.)\)/g, '$1'));
        cleaned.push(v.replace(/\((.)\|(.)\)/g, '$2'));
      } else {
        cleaned.push(v.replace(/\((.)\|(.)\)/g, '$2'));
      }
    }
  });
  cleaned.forEach(function(v, i) {
    if (/\[.(\|.\|)?.\]/.test(v)) {
      cleaned[i] = null;
      cleaned.push(v.replace(/\[(.)(\|(.)\|)?(.)\]/g, '$4'));
    }
  });
  return cleaned.filter(function(v) {
    return v !== null;
  });
};

// escape regex string
function escapeRegex(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

// return emotes that match substring
var matchEmotes = function(substr) {
  var regex = new RegExp('^' + escapeRegex(substr), 'i');
  return allEmotes.filter(function(v) {
    return regex.test(v);
  }).sort(function(a, b) { // sort by count
    if (b in emoteCounts) {
      if (a in emoteCounts) {
        return emoteCounts[b] - emoteCounts[a]; 
      } else {
        return 1; // b first
      }
    } else {
      return -1; // a first
    }
  });
};

// bind events to chatbox
var bindEvents = function() {
  var chatbox = document.querySelector('.chat_text_input');
  var wrapper = document.querySelector('.chat-input');
  var button = document.querySelector('.chat-buttons-container > .primary');
  var curStr = '';
  var emotes = [];

  // intercept tab keydown via parent element
  var interceptKeyDown = function(e) {
    if (e.target.className.indexOf('chat_text_input') > -1 && e.which === 9) {
      e.preventDefault();
      e.stopImmediatePropagation(); // don't trigger default keydown event
      if (emotes.length > 0) {
        chatbox.value = chatbox.value.replace(/(^| )\S+$/i, '$1' + emotes[0]);
        emotes.push(emotes.shift()); // cycle through all valid emotes
      }
    } else if (e.target.className.indexOf('chat_text_input') > -1 && e.which === 13) {
      updateEmoteCounts(chatbox.value);
    }
  };

  // update predictions based on text input
  var onChatInput = function(e) {
    curStr = e.target.value.split(' ').splice(-1)[0];
    if (curStr.length > 1) {
      emotes = matchEmotes(curStr);
    } else {
      emotes = [];
    }
  };

  // send message via button
  var onButtonClick = function(e) {
    updateEmoteCounts(chatbox.value);
  }

  wrapper.addEventListener('keydown', interceptKeyDown, true);
  chatbox.addEventListener('input', onChatInput, false);
  button.addEventListener('click', onButtonClick, false);
};

// update emote counts
// assuming all emotes are being input via this extension and not handling variants 
var updateEmoteCounts = function(message) {
  var counts = {};
  message.split(' ').forEach(function(v) {
    if (allEmotes.indexOf(v) > -1) {
      if (v in emoteCounts) {
        emoteCounts[v]++;
      } else {
        emoteCounts[v] = 1;
      }
      localStorage.setItem('kc-counts', JSON.stringify(emoteCounts));
    }
  });
};

// wait until DOM (and Ember) is loaded
if (document.readyState === 'complete') {
  setupExtension(cleanRegexes, bindEvents);
} else {
  document.addEventListener('readystatechange', function() {
    if (document.readyState === 'complete') {
      setupExtension(cleanRegexes, bindEvents);
    }
  }, false);
}