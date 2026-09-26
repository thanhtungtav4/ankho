/* ==========================================================================
   Bếp Phù Sa – homepage only: hero slider, countdown, stats, reviews carousel, video modal
   ========================================================================== */
(function () {
  'use strict';

  /* Fixed end time for the homepage flash-sale countdown. A real deployment
     would source this from the backend/admin panel; keeping it a fixed
     timestamp (instead of "N days from whenever the page loads") means the
     countdown actually counts down to something instead of resetting on
     every reload. */
  var FLASH_SALE_DEADLINE = new Date('2026-10-05T23:59:59+07:00').getTime();

  /* ---------------------------------------------------------------------
     Hero slider (home page)
     --------------------------------------------------------------------- */
  function initHeroSlider() {
    var root = document.querySelector('[data-hero]');
    if (!root) return;
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(root.querySelectorAll('[data-hero-dot]'));
    var prevBtn = root.querySelector('[data-hero-prev]');
    var nextBtn = root.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function render() {
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === index); s.hidden = i !== index; });
      dots.forEach(function (d, i) { d.classList.toggle('is-active', i === index); });
    }

    function go(dir) {
      index = (index + dir + slides.length) % slides.length;
      render();
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { index = i; render(); restart(); });
    });
    if (prevBtn) prevBtn.addEventListener('click', function () { go(-1); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { go(1); restart(); });

    function restart() {
      clearInterval(timer);
      if (!reducedMotion) timer = setInterval(function () { go(1); }, 5500);
    }

    render();
    restart();
  }

  /* ---------------------------------------------------------------------
     Countdown timer (flash-sale promo card)
     --------------------------------------------------------------------- */
  function initCountdown() {
    var els = document.querySelectorAll('[data-countdown]');
    if (!els.length) return;

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      var diff = Math.max(0, FLASH_SALE_DEADLINE - Date.now());
      var d = Math.floor(diff / 86400000); diff -= d * 86400000;
      var h = Math.floor(diff / 3600000); diff -= h * 3600000;
      var m = Math.floor(diff / 60000); diff -= m * 60000;
      var s = Math.floor(diff / 1000);
      els.forEach(function (wrap) {
        var vals = wrap.querySelectorAll('[data-countdown-value]');
        if (vals.length >= 4) {
          vals[0].textContent = pad(d);
          vals[1].textContent = pad(h);
          vals[2].textContent = pad(m);
          vals[3].textContent = pad(s);
        }
      });
    }

    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------------------
     Stats count-up on scroll into view
     --------------------------------------------------------------------- */
  function initStatsCountUp() {
    var section = document.querySelector('[data-stats-section]');
    if (!section) return;
    var items = Array.prototype.slice.call(section.querySelectorAll('[data-stat-value]'));
    var done = false;

    function countUp() {
      if (reducedMotion) {
        items.forEach(function (el) {
          el.textContent = el.getAttribute('data-stat-suffix-target');
        });
        return;
      }
      var dur = 1300;
      var start = performance.now();
      function step(now) {
        var t = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        items.forEach(function (el) {
          var target = parseFloat(el.getAttribute('data-stat-target'));
          var suffix = el.getAttribute('data-stat-suffix') || '';
          var value = Math.round(target * eased);
          el.textContent = value.toLocaleString('vi-VN') + suffix;
        });
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !done) {
            done = true;
            countUp();
            io.disconnect();
          }
        });
      }, { threshold: 0.35 });
      io.observe(section);
    } else {
      countUp();
    }
  }

  /* ---------------------------------------------------------------------
     Reviews carousel
     --------------------------------------------------------------------- */
  function initReviewsCarousel() {
    var track = document.querySelector('[data-reviews-track]');
    if (!track) return;
    var items = track.querySelectorAll('[data-review-item]');
    var prevBtn = document.querySelector('[data-review-prev]');
    var nextBtn = document.querySelector('[data-review-next]');
    var index = 0;
    var step = 360;

    function render() {
      track.style.transform = 'translateX(-' + (index * step) + 'px)';
    }

    if (nextBtn) nextBtn.addEventListener('click', function () {
      index = Math.min(items.length - 1, index + 1);
      render();
    });
    if (prevBtn) prevBtn.addEventListener('click', function () {
      index = Math.max(0, index - 1);
      render();
    });
  }

  /* ---------------------------------------------------------------------
     Video modal
     --------------------------------------------------------------------- */
  function initVideoModal() {
    var modal = document.querySelector('[data-video-modal]');
    if (!modal) return;
    var openers = document.querySelectorAll('[data-video-open]');
    var closeBtn = modal.querySelector('[data-video-close]');
    var lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      setTimeout(function () { if (closeBtn) closeBtn.focus(); }, 60);
    }

    function close() {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    openers.forEach(function (btn) { btn.addEventListener('click', open); });
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeroSlider();
    initCountdown();
    initStatsCountUp();
    initReviewsCarousel();
    initVideoModal();
  });
})();
