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
    var priceFilter = document.querySelector('[data-price-filter]');
    var paginationEl = document.querySelector('.pagination');
    /* Read the controls' current values rather than assuming defaults: the
       browser can restore a previously checked radio / selected option on
       reload or back-navigation, and the grid must match what is shown. */
    var checkedPrice = priceFilter && priceFilter.querySelector('input[name="price"]:checked');
    var state = {
      cat: params.get('cat') || 'all',
      sort: sortSelect ? sortSelect.value : 'popular',
      price: checkedPrice ? checkedPrice.value : 'all',
      query: (params.get('q') || '').trim()
    };
    var PRICE_RANGES = {
      lt150: function (p) { return p < 150000; },
      '150-300': function (p) { return p >= 150000 && p <= 300000; },
      gt300: function (p) { return p > 300000; }
    };

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
      if (PRICE_RANGES[state.price]) {
        list = list.filter(function (p) { return PRICE_RANGES[state.price](p.price); });
      }
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
      if (paginationEl) paginationEl.hidden = !list.length;
      if (searchInfoEl) {
        searchInfoEl.textContent = state.query ? ' cho "' + state.query + '"' : '';
      }
    }

    if (state.query) {
      var clearLink = document.querySelector('[data-clear-search]');
      if (clearLink) clearLink.hidden = false;
    }

    if (priceFilter) {
      priceFilter.addEventListener('change', function (e) {
        if (e.target.name !== 'price') return;
        state.price = e.target.value;
        renderGrid();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        state.sort = sortSelect.value;
        renderGrid();
      });
    }

    renderFilters();
    renderGrid();

    /* On phones the filters are horizontal chip rows; arriving with
       ?cat=combo (or a restored price choice) would leave the active chip
       off-screen to the right. Only the row is scrolled (scrollIntoView
       could also jump the page). */
    function revealChip(row, chip) {
      if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
      row.scrollLeft += chip.getBoundingClientRect().left - row.getBoundingClientRect().left - 24;
    }
    if (state.cat !== 'all') revealChip(filterList, filterList && filterList.querySelector('.is-active'));
    if (state.price !== 'all') {
      var checked = priceFilter && priceFilter.querySelector('input[name="price"]:checked');
      revealChip(priceFilter, checked && checked.closest('li'));
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initProductListing();
  });
})();
