/* ==========================================================================
   Bếp Phù Sa – storytelling landing pages only (founder story + per-product
   deep-dive pages): scroll-reveal on narrative sections, FAQ accordion
   ========================================================================== */
(function () {
  'use strict';

  function initScrollReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    els.forEach(function (el) { io.observe(el); });
  }

  function initFaqAccordion() {
    var items = document.querySelectorAll('.story-faq-item');
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = item.querySelector('.story-faq-item__q');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var wasOpen = item.classList.contains('is-open');
        items.forEach(function (other) {
          other.classList.remove('is-open');
          var otherBtn = other.querySelector('.story-faq-item__q');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        });
        if (!wasOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initFaqAccordion();
  });
})();
