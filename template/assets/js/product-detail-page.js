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
    var related = PRODUCTS.filter(function (p) { return p.id !== currentId; }).slice(0, 4);
    grid.innerHTML = related.map(productCardHTML).join('');
    initAddToCartButtons();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initGalleryThumbs();
    initQtyStepper();
    initTabs();
    initRelatedProducts();
  });
})();
