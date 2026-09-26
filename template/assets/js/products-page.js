/* ==========================================================================
   Bếp Phù Sa – products listing page only: category filter, search, sort
   ========================================================================== */
(function () {
  'use strict';

  function initProductListing() {
    var grid = document.querySelector('[data-listing-grid]');
    if (!grid) return;

    var filterList = document.querySelector('[data-filter-list]');
    var sortSelect = document.querySelector('[data-sort-select]');
    var countEl = document.querySelector('[data-results-count]');
    var searchInfoEl = document.querySelector('[data-search-info]');

    var params = new URLSearchParams(window.location.search);
    var state = { cat: params.get('cat') || 'all', sort: 'popular', query: (params.get('q') || '').trim() };

    var searchInput = document.getElementById('siteSearchInput');
    if (searchInput && state.query) searchInput.value = state.query;

    function renderFilters() {
      if (!filterList) return;
      var cats = ['all', 'mam', 'khoca', 'khomuc', 'dacsan', 'combo'];
      filterList.innerHTML = cats.map(function (key) {
        var count = key === 'all' ? PRODUCTS.length : PRODUCTS.filter(function (p) { return p.cat === key; }).length;
        var active = state.cat === key;
        return (
          '<li><button type="button" class="filter-btn' + (active ? ' is-active' : '') + '" data-cat="' + key + '" aria-pressed="' + active + '">' +
            CATEGORY_LABELS[key] + '<span class="filter-btn__count">' + count + '</span>' +
          '</button></li>'
        );
      }).join('');
      filterList.querySelectorAll('[data-cat]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          state.cat = btn.getAttribute('data-cat');
          renderFilters();
          renderGrid();
        });
      });
    }

    function renderGrid() {
      var list = state.cat === 'all' ? PRODUCTS.slice() : PRODUCTS.filter(function (p) { return p.cat === state.cat; });
      if (state.query) {
        var q = state.query.toLowerCase();
        list = list.filter(function (p) { return p.name.toLowerCase().indexOf(q) !== -1; });
      }
      if (state.sort === 'asc') list.sort(function (a, b) { return a.price - b.price; });
      else if (state.sort === 'desc') list.sort(function (a, b) { return b.price - a.price; });
      else list.sort(function (a, b) { return b.sold - a.sold; });

      grid.innerHTML = list.length
        ? list.map(productCardHTML).join('')
        : '<p class="empty-state">Không tìm thấy sản phẩm phù hợp' + (state.query ? ' với "' + escapeHtml(state.query) + '"' : '') + '.</p>';
      if (countEl) countEl.textContent = String(list.length);
      if (searchInfoEl) {
        searchInfoEl.textContent = state.query ? ' cho "' + state.query + '"' : '';
      }
      initAddToCartButtons();
    }

    if (state.query) {
      var clearLink = document.querySelector('[data-clear-search]');
      if (clearLink) clearLink.hidden = false;
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        state.sort = sortSelect.value;
        renderGrid();
      });
    }

    renderFilters();
    renderGrid();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initProductListing();
  });
})();
