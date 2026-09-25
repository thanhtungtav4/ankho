/* ==========================================================================
   Bếp Phù Sa – shared front-end logic (no framework, no inline scripts)
   ========================================================================== */
(function () {
  'use strict';

  var CART_KEY = 'bps_cart';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     Product catalog (shared by home, listing and detail-related sections)
     --------------------------------------------------------------------- */
  var PRODUCTS = [
    { id: 'mam-ca-linh', name: 'Mắm cá linh chưng sả ớt', img: 'mắm cá linh', cat: 'mam', catLabel: 'Mắm', price: 120000, oldPrice: null, rating: 5, reviews: 128, sold: 1250, badge: 'BEST SELLER', badgeType: 'best' },
    { id: 'mam-thai', name: 'Mắm thái chua ngọt', img: 'mắm thái', cat: 'mam', catLabel: 'Mắm', price: 115000, oldPrice: null, rating: 5, reviews: 96, sold: 980, badge: null },
    { id: 'mam-ca-sac', name: 'Mắm cá sặc đặc biệt', img: 'mắm cá sặc', cat: 'mam', catLabel: 'Mắm', price: 110000, oldPrice: null, rating: 4.5, reviews: 74, sold: 650, badge: null },
    { id: 'mam-tom-cha', name: 'Mắm tôm chà Gò Công', img: 'mắm tôm chà', cat: 'mam', catLabel: 'Mắm', price: 135000, oldPrice: null, rating: 5, reviews: 62, sold: 540, badge: null },
    { id: 'kho-ca-loc', name: 'Khô cá lóc dẻo ngon', img: 'khô cá lóc', cat: 'khoca', catLabel: 'Khô cá', price: 155000, oldPrice: 172000, rating: 4.5, reviews: 218, sold: 1160, badge: '-10%', badgeType: 'sale' },
    { id: 'kho-ca-dua', name: 'Khô cá dứa 1 nắng', img: 'khô cá dứa', cat: 'khoca', catLabel: 'Khô cá', price: 135000, oldPrice: null, rating: 5, reviews: 156, sold: 1240, badge: null },
    { id: 'kho-ca-keo', name: 'Khô cá kèo loại 1', img: 'khô cá kèo', cat: 'khoca', catLabel: 'Khô cá', price: 180000, oldPrice: null, rating: 5, reviews: 88, sold: 720, badge: null },
    { id: 'kho-ca-sac', name: 'Khô cá sặc bổi', img: 'khô cá sặc bổi', cat: 'khoca', catLabel: 'Khô cá', price: 165000, oldPrice: 185000, rating: 4.5, reviews: 110, sold: 830, badge: '-10%', badgeType: 'sale' },
    { id: 'kho-muc-loai1', name: 'Khô mực loại 1 Cà Mau', img: 'khô mực loại 1', cat: 'khomuc', catLabel: 'Khô mực', price: 420000, oldPrice: null, rating: 5, reviews: 134, sold: 610, badge: 'BEST SELLER', badgeType: 'best' },
    { id: 'kho-muc-tam', name: 'Khô mực tẩm ăn liền', img: 'khô mực tẩm', cat: 'khomuc', catLabel: 'Khô mực', price: 290000, oldPrice: null, rating: 4.5, reviews: 76, sold: 480, badge: null },
    { id: 'tom-kho', name: 'Tôm khô đất Cà Mau', img: 'tôm khô đất', cat: 'dacsan', catLabel: 'Đặc sản', price: 520000, oldPrice: null, rating: 5, reviews: 142, sold: 560, badge: null },
    { id: 'lap-xuong', name: 'Lạp xưởng tươi Sóc Trăng', img: 'lạp xưởng', cat: 'dacsan', catLabel: 'Đặc sản', price: 145000, oldPrice: null, rating: 4.5, reviews: 98, sold: 910, badge: null },
    { id: 'combo-qua-tang', name: 'Combo quà tặng 4 món đặc sản', img: 'combo quà tặng', cat: 'combo', catLabel: 'Combo - Quà tặng', price: 450000, oldPrice: null, rating: 5, reviews: 82, sold: 420, badge: 'COMBO', badgeType: 'combo' },
    { id: 'combo-tet', name: 'Combo Tết sum vầy 6 món', img: 'combo Tết', cat: 'combo', catLabel: 'Combo - Quà tặng', price: 680000, oldPrice: 750000, rating: 5, reviews: 54, sold: 260, badge: 'COMBO', badgeType: 'combo' }
  ];

  var CATEGORY_LABELS = { all: 'Tất cả', mam: 'Mắm', khoca: 'Khô cá', khomuc: 'Khô mực', dacsan: 'Đặc sản', combo: 'Combo - Quà tặng' };

  function formatPrice(n) {
    return n.toLocaleString('vi-VN') + 'đ';
  }

  function starString() {
    return '★★★★★';
  }

  /* ---------------------------------------------------------------------
     Cart (persisted in localStorage, shared across every page)
     --------------------------------------------------------------------- */
  function readCart() {
    var cart = null;
    try { cart = JSON.parse(localStorage.getItem(CART_KEY) || 'null'); } catch (e) { cart = null; }
    return cart && typeof cart === 'object' ? cart : {};
  }

  function writeCart(cart) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ }
  }

  function cartCount(cart) {
    return Object.keys(cart).reduce(function (sum, key) { return sum + cart[key]; }, 0);
  }

  function updateCartBadges() {
    var count = cartCount(readCart());
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = String(count);
    });
  }

  var toastTimer = null;
  function showToast(message) {
    var wraps = document.querySelectorAll('[data-toast-wrap]');
    wraps.forEach(function (wrap) {
      wrap.innerHTML = '';
      var toast = document.createElement('div');
      toast.className = 'toast';
      toast.innerHTML =
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c99a48" stroke-width="2.4">' +
        '<circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/></svg>' +
        '<span></span>';
      toast.querySelector('span').textContent = message;
      wrap.appendChild(toast);
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      document.querySelectorAll('[data-toast-wrap]').forEach(function (wrap) { wrap.innerHTML = ''; });
    }, 2800);
  }

  function addToCart(id, qty, name) {
    qty = qty || 1;
    var cart = readCart();
    cart[id] = (cart[id] || 0) + qty;
    writeCart(cart);
    updateCartBadges();
    showToast('Đã thêm "' + name + '" vào giỏ hàng');
  }

  /* Wire up every [data-add-to-cart] button declared in the markup */
  function initAddToCartButtons() {
    document.querySelectorAll('[data-add-to-cart]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-product-id');
        var name = btn.getAttribute('data-product-name') || 'sản phẩm';
        var qtyInput = document.querySelector('[data-qty-value]');
        var qty = 1;
        if (qtyInput && btn.hasAttribute('data-use-qty')) {
          qty = parseInt(qtyInput.textContent, 10) || 1;
        }
        addToCart(id, qty, name);
      });
    });
  }

  /* "Mua ngay": add to cart then jump straight to checkout */
  function initBuyNowButtons() {
    document.querySelectorAll('[data-buy-now]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-product-id');
        var name = btn.getAttribute('data-product-name') || 'sản phẩm';
        var qtyInput = document.querySelector('[data-qty-value]');
        var qty = 1;
        if (qtyInput && btn.hasAttribute('data-use-qty')) {
          qty = parseInt(qtyInput.textContent, 10) || 1;
        }
        var cart = readCart();
        cart[id] = (cart[id] || 0) + qty;
        writeCart(cart);
        window.location.href = 'checkout.html';
      });
    });
  }

  /* ---------------------------------------------------------------------
     Header: scroll shadow, hamburger drawer, mobile bottom nav actions
     --------------------------------------------------------------------- */
  function initDrawer() {
    var overlay = document.querySelector('[data-drawer-overlay]');
    var drawer = document.querySelector('[data-drawer]');
    var openers = document.querySelectorAll('[data-drawer-open]');
    var closers = document.querySelectorAll('[data-drawer-close]');
    if (!drawer || !overlay) return;

    function open() {
      drawer.classList.add('is-open');
      overlay.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    openers.forEach(function (btn) { btn.addEventListener('click', open); });
    closers.forEach(function (btn) { btn.addEventListener('click', close); });
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
    });
  }

  function initBackToTop() {
    var btn = document.querySelector('[data-back-top]');
    if (!btn) return;
    function onScroll() {
      if (window.scrollY > 400) btn.classList.add('is-visible');
      else btn.classList.remove('is-visible');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  function initScrollToProducts() {
    document.querySelectorAll('[data-scroll-to]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = document.getElementById(btn.getAttribute('data-scroll-to'));
        if (!target) return;
        var top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: top, behavior: reducedMotion ? 'auto' : 'smooth' });
      });
    });
  }

  function initFocusSearch() {
    document.querySelectorAll('[data-focus-search]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = document.getElementById('siteSearchInput');
        if (input) input.focus();
      });
    });
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
    var deadline = Date.now() + ((2 * 86400) + (14 * 3600) + (35 * 60) + 28) * 1000;

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
      var diff = Math.max(0, deadline - Date.now());
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

  /* ---------------------------------------------------------------------
     Newsletter form
     --------------------------------------------------------------------- */
  function initNewsletterForms() {
    document.querySelectorAll('[data-newsletter-form]').forEach(function (form) {
      var input = form.querySelector('input[type="email"]');
      var msg = form.parentElement.querySelector('[data-newsletter-msg]');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var val = input ? input.value.trim() : '';
        var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (!msg) return;
        if (!ok) {
          msg.textContent = 'Vui lòng nhập email hợp lệ.';
          msg.classList.remove('is-ok');
          msg.classList.add('is-error');
          return;
        }
        msg.textContent = 'Cảm ơn bạn! Đăng ký nhận tin thành công.';
        msg.classList.remove('is-error');
        msg.classList.add('is-ok');
        if (input) input.value = '';
      });
    });
  }

  /* ---------------------------------------------------------------------
     Products listing page: category filter + sort
     --------------------------------------------------------------------- */
  function productCardHTML(p) {
    var oldPriceHTML = p.oldPrice
      ? '<span class="price price--old">' + formatPrice(p.oldPrice) + '</span>'
      : '';
    var badgeHTML = p.badge
      ? '<span class="product-card__badge badge--' + p.badgeType + '">' + p.badge + '</span>'
      : '';
    return (
      '<article class="product-card">' +
        '<a href="product-detail.html?id=' + p.id + '" class="product-card__media">' +
          '<span role="img" aria-label="' + p.name + '" class="product-card__img">ảnh: ' + p.img + '</span>' +
          badgeHTML +
        '</a>' +
        '<div class="product-card__body">' +
          '<span class="product-card__cat">' + p.catLabel + '</span>' +
          '<h3 class="product-card__name"><a href="product-detail.html?id=' + p.id + '">' + p.name + '</a></h3>' +
          '<div class="product-card__rating"><span class="stars" aria-label="Đánh giá ' + p.rating + '/5">' + starString() + '</span><span>(' + p.reviews + ')</span></div>' +
          '<div class="product-card__price-row"><span class="price">' + formatPrice(p.price) + '</span>' + oldPriceHTML + '</div>' +
          '<button type="button" class="btn-add" data-add-to-cart data-product-id="' + p.id + '" data-product-name="' + p.name + '" aria-label="Thêm ' + p.name + ' vào giỏ">' +
            '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6L5 2H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg>' +
            'Thêm vào giỏ' +
          '</button>' +
        '</div>' +
      '</article>'
    );
  }

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
        : '<p class="empty-state">Không tìm thấy sản phẩm phù hợp' + (state.query ? ' với "' + state.query + '"' : '') + '.</p>';
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

  /* ---------------------------------------------------------------------
     Contact page: message form validation
     --------------------------------------------------------------------- */
  function initContactForm() {
    var form = document.querySelector('[data-contact-form]');
    if (!form) return;
    var nameInput = form.querySelector('[data-field-name]');
    var emailInput = form.querySelector('[data-field-email]');
    var msgInput = form.querySelector('[data-field-message]');
    var msgEl = form.querySelector('[data-form-msg]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = nameInput ? nameInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var message = msgInput ? msgInput.value.trim() : '';

      if (!msgEl) return;
      if (!name || !message) {
        msgEl.textContent = 'Vui lòng nhập họ tên và nội dung.';
        msgEl.classList.remove('is-ok');
        msgEl.classList.add('is-error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        msgEl.textContent = 'Vui lòng nhập email hợp lệ.';
        msgEl.classList.remove('is-ok');
        msgEl.classList.add('is-error');
        return;
      }
      msgEl.textContent = 'Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn và sẽ phản hồi sớm.';
      msgEl.classList.remove('is-error');
      msgEl.classList.add('is-ok');
      form.reset();
    });
  }

  /* ---------------------------------------------------------------------
     News listing page: tag filter (client-side show/hide)
     --------------------------------------------------------------------- */
  function initNewsFilter() {
    var buttons = document.querySelectorAll('[data-tag-btn]');
    if (!buttons.length) return;
    var cards = document.querySelectorAll('[data-news-card]');

    function apply(tag) {
      cards.forEach(function (card) {
        var match = tag === 'all' || card.getAttribute('data-news-card') === tag;
        card.classList.toggle('is-hidden', !match);
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        apply(btn.getAttribute('data-tag-btn'));
      });
    });
  }

  /* ---------------------------------------------------------------------
     Policy page: sidebar category switcher
     --------------------------------------------------------------------- */
  function initPolicyNav() {
    var buttons = document.querySelectorAll('[data-policy-nav-btn]');
    if (!buttons.length) return;
    var panels = document.querySelectorAll('[data-policy-panel]');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-policy-nav-btn');
        buttons.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-current', String(active));
        });
        panels.forEach(function (panel) {
          panel.classList.toggle('is-active', panel.getAttribute('data-policy-panel') === key);
        });
      });
    });
  }

  function findProduct(id) {
    return PRODUCTS.filter(function (p) { return p.id === id; })[0] || null;
  }

  var SHIPPING_FEE = 30000;
  var FREE_SHIPPING_THRESHOLD = 500000;

  function orderSummaryLineHTML(name, qty, lineTotal) {
    return (
      '<div class="order-summary-item"><span class="order-summary-item__name">' + name +
      ' <span class="order-summary-item__qty">× ' + qty + '</span></span>' +
      '<span class="order-summary-item__price">' + formatPrice(lineTotal) + '</span></div>'
    );
  }

  /* ---------------------------------------------------------------------
     Cart page
     --------------------------------------------------------------------- */
  function cartLineHTML(product, qty) {
    return (
      '<div class="cart-line" data-cart-line data-id="' + product.id + '">' +
        '<span class="cart-line__img" role="img" aria-label="' + product.name + '">ảnh: ' + product.img + '</span>' +
        '<div class="cart-line__info">' +
          '<a href="product-detail.html" class="cart-line__name">' + product.name + '</a>' +
          '<span class="cart-line__price">' + formatPrice(product.price) + ' / sản phẩm</span>' +
        '</div>' +
        '<div class="qty-stepper cart-line__qty">' +
          '<button type="button" data-cart-dec aria-label="Giảm số lượng">−</button>' +
          '<span class="qty-stepper__value" data-cart-qty>' + qty + '</span>' +
          '<button type="button" data-cart-inc aria-label="Tăng số lượng">+</button>' +
        '</div>' +
        '<span class="cart-line__total">' + formatPrice(product.price * qty) + '</span>' +
        '<button type="button" class="cart-line__remove" data-cart-remove aria-label="Xóa ' + product.name + ' khỏi giỏ">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>' +
        '</button>' +
      '</div>'
    );
  }

  function initCartPage() {
    var container = document.querySelector('[data-cart-items]');
    if (!container) return;
    var subtotalEl = document.querySelector('[data-cart-subtotal]');
    var shippingEl = document.querySelector('[data-cart-shipping]');
    var totalEl = document.querySelector('[data-cart-total]');
    var summaryEl = document.querySelector('[data-cart-summary]');

    function changeQty(id, delta) {
      var cart = readCart();
      var next = (cart[id] || 0) + delta;
      if (next <= 0) delete cart[id]; else cart[id] = next;
      writeCart(cart);
      render();
    }

    function removeItem(id) {
      var cart = readCart();
      delete cart[id];
      writeCart(cart);
      render();
    }

    function render() {
      var cart = readCart();
      var ids = Object.keys(cart).filter(function (id) { return cart[id] > 0; });

      if (!ids.length) {
        container.innerHTML =
          '<div class="cart-empty">' +
            '<span class="cart-empty__icon"><svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6h15l-1.5 9h-12z"/><path d="M6 6L5 2H2"/><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/></svg></span>' +
            '<p class="cart-empty__title">Giỏ hàng của bạn đang trống</p>' +
            '<p>Hãy khám phá các đặc sản miền Tây của Bếp Phù Sa.</p>' +
            '<a href="products.html" class="btn-solid-cta cart-empty__cta">Tiếp tục mua sắm</a>' +
          '</div>';
        if (summaryEl) summaryEl.hidden = true;
        updateCartBadges();
        return;
      }

      if (summaryEl) summaryEl.hidden = false;
      var subtotal = 0;
      container.innerHTML = ids.map(function (id) {
        var product = findProduct(id);
        if (!product) return '';
        subtotal += product.price * cart[id];
        return cartLineHTML(product, cart[id]);
      }).join('');

      var shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
      if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
      if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Miễn phí' : formatPrice(shipping);
      if (totalEl) totalEl.textContent = formatPrice(subtotal + shipping);

      container.querySelectorAll('[data-cart-line]').forEach(function (line) {
        var id = line.getAttribute('data-id');
        var incBtn = line.querySelector('[data-cart-inc]');
        var decBtn = line.querySelector('[data-cart-dec]');
        var removeBtn = line.querySelector('[data-cart-remove]');
        if (incBtn) incBtn.addEventListener('click', function () { changeQty(id, 1); });
        if (decBtn) decBtn.addEventListener('click', function () { changeQty(id, -1); });
        if (removeBtn) removeBtn.addEventListener('click', function () { removeItem(id); });
      });

      updateCartBadges();
    }

    render();
  }

  /* ---------------------------------------------------------------------
     Checkout page (front-end only: order is stored in localStorage,
     ready to be swapped for a real API call once the backend exists)
     --------------------------------------------------------------------- */
  function setFormMsg(el, text, ok) {
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('is-ok', ok);
    el.classList.toggle('is-error', !ok);
  }

  function initCheckoutPage() {
    var layout = document.querySelector('[data-checkout-layout]');
    var emptyEl = document.querySelector('[data-checkout-empty]');
    var form = document.querySelector('[data-checkout-form]');
    if (!layout && !form) return;

    var cart = readCart();
    var ids = Object.keys(cart).filter(function (id) { return cart[id] > 0; });

    if (!ids.length) {
      if (layout) layout.hidden = true;
      if (emptyEl) emptyEl.hidden = false;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;
    if (layout) layout.hidden = false;

    var items = [];
    var subtotal = 0;
    var listEl = document.querySelector('[data-order-summary-list]');
    var rows = ids.map(function (id) {
      var product = findProduct(id);
      if (!product) return '';
      var qty = cart[id];
      subtotal += product.price * qty;
      items.push({ id: id, name: product.name, qty: qty, price: product.price });
      return orderSummaryLineHTML(product.name, qty, product.price * qty);
    });
    if (listEl) listEl.innerHTML = rows.join('');

    var shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    var total = subtotal + shipping;
    var subtotalEl = document.querySelector('[data-order-subtotal]');
    var shippingEl = document.querySelector('[data-order-shipping]');
    var totalEl = document.querySelector('[data-order-total]');
    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Miễn phí' : formatPrice(shipping);
    if (totalEl) totalEl.textContent = formatPrice(total);

    if (!form) return;
    var msgEl = form.querySelector('[data-form-msg]');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('[data-field-name]').value.trim();
      var phone = form.querySelector('[data-field-phone]').value.trim();
      var address = form.querySelector('[data-field-address]').value.trim();
      var emailField = form.querySelector('[data-field-email]');
      var noteField = form.querySelector('[data-field-note]');
      var paymentField = form.querySelector('input[name="payment"]:checked');

      if (!name || !phone || !address) {
        setFormMsg(msgEl, 'Vui lòng điền đầy đủ họ tên, số điện thoại và địa chỉ.', false);
        return;
      }
      if (!/^[0-9+ ]{9,15}$/.test(phone)) {
        setFormMsg(msgEl, 'Số điện thoại không hợp lệ.', false);
        return;
      }

      var order = {
        id: 'DH' + Date.now(),
        items: items,
        subtotal: subtotal,
        shipping: shipping,
        total: total,
        customer: {
          name: name, phone: phone, address: address,
          email: emailField ? emailField.value.trim() : '',
          note: noteField ? noteField.value.trim() : ''
        },
        payment: paymentField ? paymentField.value : 'cod',
        createdAt: new Date().toISOString()
      };

      try {
        var orders = JSON.parse(localStorage.getItem('bps_orders') || '[]');
        orders.push(order);
        localStorage.setItem('bps_orders', JSON.stringify(orders));
        localStorage.setItem('bps_last_order', JSON.stringify(order));
      } catch (err) { /* storage unavailable */ }

      writeCart({});
      window.location.href = 'order-success.html';
    });
  }

  /* ---------------------------------------------------------------------
     Order success page
     --------------------------------------------------------------------- */
  function initOrderSuccessPage() {
    var box = document.querySelector('[data-order-success]');
    if (!box) return;

    var order = null;
    try { order = JSON.parse(localStorage.getItem('bps_last_order') || 'null'); } catch (e) { order = null; }

    var idEl = document.querySelector('[data-order-id]');
    var listEl = document.querySelector('[data-order-success-list]');
    var totalEl = document.querySelector('[data-order-success-total]');

    if (!order) {
      if (idEl) idEl.hidden = true;
      if (listEl) listEl.innerHTML = '<p>Không tìm thấy thông tin đơn hàng gần đây.</p>';
      if (totalEl) totalEl.textContent = '';
      return;
    }

    if (idEl) idEl.textContent = 'Mã đơn: ' + order.id;
    if (listEl) {
      listEl.innerHTML = order.items.map(function (it) {
        return orderSummaryLineHTML(it.name, it.qty, it.price * it.qty);
      }).join('');
    }
    if (totalEl) totalEl.textContent = formatPrice(order.total);
  }

  /* ---------------------------------------------------------------------
     Auth pages (login / register) — client-side validation only;
     wire the real submit handler up once the backend exists
     --------------------------------------------------------------------- */
  function initAuthForms() {
    document.querySelectorAll('[data-login-form], [data-register-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var msgEl = form.querySelector('[data-form-msg]');
        var isRegister = form.hasAttribute('data-register-form');
        var nameField = form.querySelector('[data-field-name]');
        var emailField = form.querySelector('[data-field-email]');
        var passwordField = form.querySelector('[data-field-password]');
        var confirmField = form.querySelector('[data-field-confirm]');

        if (isRegister && nameField && !nameField.value.trim()) {
          setFormMsg(msgEl, 'Vui lòng nhập họ tên.', false);
          return;
        }
        var emailVal = emailField ? emailField.value.trim() : '';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
          setFormMsg(msgEl, 'Vui lòng nhập email hợp lệ.', false);
          return;
        }
        var passwordVal = passwordField ? passwordField.value : '';
        if (passwordVal.length < 6) {
          setFormMsg(msgEl, 'Mật khẩu phải có ít nhất 6 ký tự.', false);
          return;
        }
        if (isRegister && confirmField && confirmField.value !== passwordVal) {
          setFormMsg(msgEl, 'Mật khẩu nhập lại không khớp.', false);
          return;
        }

        setFormMsg(
          msgEl,
          'Thông tin hợp lệ. Chức năng ' + (isRegister ? 'đăng ký' : 'đăng nhập') + ' sẽ được kích hoạt khi kết nối hệ thống backend.',
          true
        );
      });
    });
  }

  /* ---------------------------------------------------------------------
     Boot
     --------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    updateCartBadges();
    initAddToCartButtons();
    initBuyNowButtons();
    initDrawer();
    initBackToTop();
    initScrollToProducts();
    initFocusSearch();
    initHeroSlider();
    initCountdown();
    initStatsCountUp();
    initReviewsCarousel();
    initVideoModal();
    initNewsletterForms();
    initProductListing();
    initGalleryThumbs();
    initQtyStepper();
    initTabs();
    initRelatedProducts();
    initContactForm();
    initNewsFilter();
    initPolicyNav();
    initCartPage();
    initCheckoutPage();
    initOrderSuccessPage();
    initAuthForms();
  });
})();
