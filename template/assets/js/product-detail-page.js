/* ==========================================================================
   Bếp Phù Sa – product detail page only: gallery, quantity stepper, tabs, related products
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Product detail page: gallery thumbs, quantity stepper, tabs, related
     --------------------------------------------------------------------- */
  function initGalleryThumbs() {
    var thumbs = document.querySelectorAll('[data-gallery-thumb]');
    if (!thumbs.length) return;
    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        thumbs.forEach(function (t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
      });
    });
  }

  function initQtyStepper() {
    var wrap = document.querySelector('[data-qty-stepper]');
    if (!wrap) return;
    var valueEl = wrap.querySelector('[data-qty-value]');
    var inc = wrap.querySelector('[data-qty-inc]');
    var dec = wrap.querySelector('[data-qty-dec]');

    function get() { return parseInt(valueEl.textContent, 10) || 1; }
    function set(n) { valueEl.textContent = String(Math.max(1, n)); }

    if (inc) inc.addEventListener('click', function () { set(get() + 1); });
    if (dec) dec.addEventListener('click', function () { set(get() - 1); });
  }

  function initTabs() {
    var tabButtons = document.querySelectorAll('[data-tab-btn]');
    if (!tabButtons.length) return;
    var panes = document.querySelectorAll('[data-tab-pane]');

    tabButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-tab-btn');
        tabButtons.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-selected', String(active));
        });
        panes.forEach(function (pane) {
          pane.classList.toggle('is-active', pane.getAttribute('data-tab-pane') === key);
        });
      });
    });
  }

  function initRelatedProducts() {
    var grid = document.querySelector('[data-related-grid]');
    if (!grid) return;
    var currentId = grid.getAttribute('data-exclude-id');
    var current = findProduct(currentId);
    var others = PRODUCTS.filter(function (p) { return p.id !== currentId; });
    // Same category first (cross-sell), then gift combos (upsell), then the rest.
    function rank(p) {
      if (current && p.cat === current.cat) return 0;
      if (p.cat === 'combo') return 1;
      return 2;
    }
    var related = others
      .map(function (p, i) { return { p: p, r: rank(p), i: i }; })
      .sort(function (a, b) { return a.r - b.r || a.i - b.i; })
      .slice(0, 4)
      .map(function (x) { return x.p; });
    grid.innerHTML = related.map(productCardHTML).join('');
    initAddToCartButtons();
  }

  /* Mobile: once the main price/CTA block has scrolled above the viewport,
     slide in a compact buy bar so the shopper never has to scroll back up. */
  function initStickyBuyBar() {
    var bar = document.querySelector('[data-sticky-buy]');
    var anchor = document.querySelector('.detail-actions');
    if (!bar || !anchor) return;

    // A scroll check rather than IntersectionObserver: a fast fling can jump
    // from "below the fold" to "above the viewport" without any
    // intersection change, and the bar would never appear.
    var ticking = false;
    function update() {
      ticking = false;
      var passed = anchor.getBoundingClientRect().bottom < 0;
      bar.classList.toggle('is-visible', passed);
      document.body.classList.toggle('has-sticky-buy', passed);
    }
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initGalleryThumbs();
    initQtyStepper();
    initTabs();
    initRelatedProducts();
    initStickyBuyBar();
  });
})();
