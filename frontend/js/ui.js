/**
 * ui.js
 * Ambient dynamic UI effects and micro-interactions:
 * - Fluid ambient cursor spotlight (#mouse-spotlight)
 * - Hero simulated cinema timecode (#hero-timecode)
 * - Footer live IST timecode clock (#footer-ist-clock)
 * 
 * Depends on: none
 */
(function () {
  function initSpotlight() {
    var spotlight = document.getElementById('mouse-spotlight');
    if (spotlight && window.matchMedia('(pointer: fine)').matches) {
      var mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
      var curX = mouseX, curY = mouseY, isMoving = false;

      window.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isMoving) {
          spotlight.style.opacity = '1';
          isMoving = true;
        }
      });

      (function animate() {
        curX += (mouseX - curX) * 0.12;
        curY += (mouseY - curY) * 0.12;
        spotlight.style.transform = 'translate3d(' + curX + 'px, ' + curY + 'px, 0) translate(-50%, -50%)';
        requestAnimationFrame(animate);
      })();
    }
  }

  function initTimecode() {
    var timecodeEl = document.getElementById('hero-timecode');
    if (timecodeEl) {
      var frame = 4, sec = 18, min = 24;
      setInterval(function () {
        frame++;
        if (frame >= 24) {
          frame = 0;
          sec++;
          if (sec >= 60) {
            sec = 0;
            min = (min + 1) % 60;
          }
        }
        var pad = function (n) { return String(n).padStart(2, '0'); };
        timecodeEl.textContent = '00:' + pad(min) + ':' + pad(sec) + ':' + pad(frame);
      }, 1000 / 24);
    }
  }

  function initFooterClock() {
    var footerClock = document.getElementById('footer-ist-clock');
    if (footerClock) {
      var updateTime = function () {
        try {
          var now = new Date();
          var options = { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false };
          footerClock.textContent = new Intl.DateTimeFormat('en-GB', options).format(now);
        } catch (e) {
          footerClock.textContent = '20:41';
        }
      };
      updateTime();
      setInterval(updateTime, 10000);
    }
  }

  function initUI() {
    initSpotlight();
    initTimecode();
    initFooterClock();
  }

  window.initUI = initUI;
})();
