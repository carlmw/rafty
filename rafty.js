(function (window) {
var handlers = [],
    originalRaf = window.requestAnimationFrame;


function fakeRaf (handler) {
  handlers.push(handler);
}

function enable () {
  window.requestAnimationFrame = fakeRaf;
}

function disable () {
  handlers.length = 0;
  window.requestAnimationFrame = originalRaf;
}

function tick (millis) {
  var n = Math.floor((millis / 1000) * 60) || 1;
  for(var i = 0; i < n; i++) handlers.forEach(invoke);
}

function invoke (handler) {
  handler();
}

window.rafty = {
  enable: enable,
  disable: disable,
  tick: tick
};

})(window);
