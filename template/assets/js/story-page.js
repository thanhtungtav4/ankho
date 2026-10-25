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

    /* Collapsed answers are only visually clipped (max-height animation),
       so they are also hidden from screen readers until opened. */
    function setOpen(item, open) {
      item.classList.toggle('is-open', open);
      var q = item.querySelector('.story-faq-item__q');
      var a = item.querySelector('.story-faq-item__a');
      if (q) q.setAttribute('aria-expanded', String(open));
      if (a) {
        a.setAttribute('aria-hidden', String(!open));
        a.inert = !open; // links inside a collapsed answer must not be tabbable
      }
    }

    items.forEach(function (item) {
      setOpen(item, item.classList.contains('is-open'));
      var btn = item.querySelector('.story-faq-item__q');
      if (!btn) return;
      btn.addEventListener('click', function () {
        var wasOpen = item.classList.contains('is-open');
        items.forEach(function (other) { setOpen(other, false); });
        if (!wasOpen) setOpen(item, true);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initFaqAccordion();
  });
})();
