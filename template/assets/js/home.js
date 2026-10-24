/* ==========================================================================
   Bếp Phù Sa – homepage only: hero slider, countdown, stats, reviews carousel, video modal
   ========================================================================== */
(function () {
  'use strict';

  /* The promo is "FLASH SALE CUỐI TUẦN", so it ends every Sunday at
     23:59:59 Vietnam time (UTC+7) and rolls over to the next weekend.
     Deriving it from the calendar (not "N days from page load", and not a
     one-off date that silently expires and freezes the timer at 00:00:00)
     means every visitor sees the same real deadline. A real deployment
     would source this from the backend/admin panel. */
  var VN_OFFSET_MS = 7 * 3600000;
  function flashSaleDeadline(now) {
    var vn = new Date(now + VN_OFFSET_MS); /* UTC fields now read as VN wall-clock */
    var daysToSunday = (7 - vn.getUTCDay()) % 7;
    return Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate() + daysToSunday, 23, 59, 59) - VN_OFFSET_MS;
  }

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
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === index);
        if (i === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
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

    var paused = false;
    function restart() {
      clearInterval(timer);
      if (!reducedMotion && !paused) timer = setInterval(function () { go(1); }, 5500);
    }

    /* Auto-rotation pauses while the shopper hovers or has keyboard focus
       inside the hero, so the headline doesn't change under them (WCAG 2.2.2). */
    function setPaused(value) { paused = value; restart(); }
    root.addEventListener('mouseenter', function () { setPaused(true); });
    root.addEventListener('mouseleave', function () { setPaused(root.contains(document.activeElement)); });
    root.addEventListener('focusin', function () { setPaused(true); });
    root.addEventListener('focusout', function (e) {
      if (!root.contains(e.relatedTarget)) setPaused(root.matches(':hover'));
    });

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
      var now = Date.now();
      var diff = Math.max(0, flashSaleDeadline(now) - now);
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
    var first = track.querySelector('[data-review-item]');
    var viewport = track.parentElement;
    var prevBtn = document.querySelector('[data-review-prev]');
    var nextBtn = document.querySelector('[data-review-next]');
    var index = 0;
    if (!first) return;

    /* Card width is 340px but capped at 82vw on phones, so the step and the
       last reachable position are measured instead of hard-coded: the track
       stops once its last card is fully in view rather than sliding into
       empty space. */
    function step() {
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return first.getBoundingClientRect().width + gap;
    }
    function maxOffset() {
      return Math.max(0, track.scrollWidth - viewport.clientWidth);
    }
    function maxIndex() {
      return Math.ceil(maxOffset() / step());
    }

    function render() {
      index = Math.max(0, Math.min(index, maxIndex()));
      var offset = Math.min(index * step(), maxOffset());
      track.style.transform = 'translateX(-' + offset + 'px)';
    }

    if (nextBtn) nextBtn.addEventListener('click', function () { index += 1; render(); });
    if (prevBtn) prevBtn.addEventListener('click', function () { index -= 1; render(); });
    window.addEventListener('resize', render);
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
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      /* aria-modal dialog: keep Tab cycling inside it instead of escaping
         to the (scroll-locked, covered) page behind. */
      if (e.key === 'Tab') {
        var focusables = modal.querySelectorAll('button, [href], iframe, video, [tabindex]:not([tabindex="-1"])');
        if (!focusables.length) return;
        var firstEl = focusables[0];
        var lastEl = focusables[focusables.length - 1];
        if (e.shiftKey && (document.activeElement === firstEl || !modal.contains(document.activeElement))) {
          e.preventDefault(); lastEl.focus();
        } else if (!e.shiftKey && (document.activeElement === lastEl || !modal.contains(document.activeElement))) {
          e.preventDefault(); firstEl.focus();
        }
      }
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
