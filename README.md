rafty
=====

Fake requestAnimationFrame for sensible unit testing

    rafty.enable();

    var then = performance.now();
    var diff;
    var frames = 0;
    requestAnimationFrame(function () {
      frames++;
      diff = performance.now() - then;
    });

    rafty.tick(1000);

    console.log(frames) // 60
    console.log(diff); // ~1000

    rafty.disable();

API
===

### .enable
Replaces `requestAnimationFrame` with a fake and freezes time at the 2nd Jan 1970.

`new Date()`, `Date.now()` and `performance.now()` can be used deterministically.

### .disable
Restores the fake `requestAnimationFrame` and unfreezes time.

### .tick(millis)
Advances time incrementally by the given milliseconds. At every 16.666 millis (60FPS) any `requestAnimationFrame` handlers you've registered will be called.

