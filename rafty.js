(function (window) {
var FPS = 50,
    ONE_FRAME = 1000 / FPS,
    handlers = [],
    start = 864e5,
    t;
    RealDate = window.Date,
    originalPerformance = window.performance,
    originalRaf = window.requestAnimationFrame;

function fakeRaf (handler) {
  handlers.push(handler);
}

function enable () {
  t = start; // 2nd Jan 1970
  window.requestAnimationFrame = fakeRaf;
  window.performance = fakePerformance;
  window.Date = FakeDate;
}

function disable () {
  handlers.length = 0;
  window.requestAnimationFrame = originalRaf;
  window.performance = originalPerformance;
  window.Date = RealDate;
}

function tick (millis) {
  millis = millis || ONE_FRAME;
  var n = Math.round(millis / ONE_FRAME),
      now = t,
      stack = handlers.slice(0);
  handlers.length = 0;
  for(var i = 0; i < n; i++) {
    t += ONE_FRAME;
    stack.forEach(invoke);
  }
  t = now + millis;
}

function invoke (handler) {
  handler(fakePerformance.now());
}

fakePerformance = {
  now: function () {
    return t;
  },
  timing: { navigationStart: start }
};

var FakeDate = function () {
  if (arguments.length === 0) return new RealDate(FakeDate.now());
  var args = Array.prototype.slice.call(arguments, 0);
  var Constructor = RealDate.bind.apply(RealDate, [null].concat(args));
  return new Constructor();
};

FakeDate.now = function () {
  return Math.round(t);
};

var rafty = { enable: enable, disable: disable, tick: tick };

if (typeof define === 'function' && define.amd) {
  define(rafty);
} else if (typeof exports === 'object') {
  module.exports = rafty;
} else {
  window.rafty = rafty;
}

})(this);
