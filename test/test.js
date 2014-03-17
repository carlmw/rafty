var originalRaf = window.requestAnimationFrame,
    originalPerformance = window.performance,
    OriginalDate = window.Date;

describe('rafty', function () {
  describe('.enable', function () {
    it('suspends time', function () {
      rafty.enable();
      expect(Date.now()).to.equal(864e5);
      expect((new Date()).toString()).to.equal((new OriginalDate(864e5)).toString());
      expect(performance.now()).to.equal(864e5);
      expect(performance.timing.navigationStart).to.equal(864e5);
      rafty.disable();
    });

    it('does not mess with date creation', function () {
      rafty.enable();
      expect((new Date(2013, 3, 16)).toString()).to.equal((new OriginalDate(2013, 3, 16)).toString());
    });
  });

  describe('.disable', function () {
    beforeEach(function () {
      rafty.enable();
      rafty.disable();
    });

    it('restores requestAnimationFrame', function () {
      expect(window.requestAnimationFrame).to.equal(originalRaf);
    });

    it('restores Date', function () {
      expect(window.Date).to.equal(OriginalDate);
    });

    it('restores performance', function () {
      expect(window.performance).to.equal(originalPerformance);
    });
  });

  describe('.tick', function () {
    var i,
        loop = function () {
          i++;
          requestAnimationFrame(loop);
        };
    beforeEach(function () {
      i = 0;
      rafty.enable();
      requestAnimationFrame(loop);
    });

    afterEach(function () {
      rafty.disable();
    });

    it('plays the next frame', function () {
      rafty.tick();
      expect(i).to.equal(1);
    });

    it('advances time', function () {
      rafty.tick();
      expect(Date.now()).to.equal(864e5 + 17);
      expect(performance.now()).to.equal(864e5 + 16.6666666667);
      rafty.tick();
      expect(Date.now()).to.equal(864e5 + 33);
      expect(performance.now()).to.equal(864e5 + 33.33333334);
      rafty.tick(500);
      expect(Date.now()).to.equal(864e5 + 533);
      expect(performance.now()).to.equal(864e5 + 533.33333334);
    });

    it('passes performance.now to the handler', function () {
      var t;
      requestAnimationFrame(function (now) {
        t = now;
      });
      rafty.tick();
      expect(t).to.equal(86400016.66666667);
    });

    describe('when given an integer', function () {
      it('plays frames for that number of millis', function () {
        rafty.tick(1000);
        expect(i).to.equal(60);
      });

      it('advances times', function () {
        rafty.tick(1000);
        expect(Date.now()).to.equal(86401000);
        expect(performance.now()).to.equal(86401000);
      });
    });
  });
});
