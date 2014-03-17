var originalRaf = window.requestAnimationFrame;

describe('rafty', function () {
  describe('.enable', function () {
    it('replaces requestAnimationFrame', function () {
      rafty.enable();
      expect(window.requestAnimationFrame).not.to.equal(originalRaf);
      rafty.disable();
    });
  });

  describe('.disable', function () {
    it('restores requestAnimationFrame', function () {
      rafty.enable();
      rafty.disable();
      expect(window.requestAnimationFrame).to.equal(originalRaf);
    });
  });

  describe('.tick', function () {
    var i;
    beforeEach(function () {
      i = 0;
      rafty.enable();
      requestAnimationFrame(function () {
        i++;
      });
    });

    afterEach(function () {
      rafty.disable();
    });

    it('plays the next frame', function () {
      rafty.tick();
      expect(i).to.equal(1);
    });

    describe('when given an integer', function () {
      it('plays frames for that number of millis', function () {
        rafty.tick(1000);
        expect(i).to.equal(60);
      });
    });
  });
});
