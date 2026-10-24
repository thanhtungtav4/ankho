/* ==========================================================================
   Bếp Phù Sa – product detail page only: gallery, quantity stepper, tabs, related products
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Render the product named in ?id= (the markup ships khô cá lóc as the
     default, which is also what shows without JS or for an unknown id).
     Copy is per category until the backend supplies per-product content;
     it only repeats promises already made elsewhere on the site.
     --------------------------------------------------------------------- */
  var DEFAULT_PRODUCT_ID = 'kho-ca-loc';

  var CATEGORY_COPY = {
    mam: {
      highlights: ['Ủ theo công thức gia truyền, đậm đà vừa ăn', 'Không chất bảo quản, không phẩm màu', 'Hũ đóng kín, tem nhãn xuất xứ đầy đủ', 'Ăn kèm cơm nóng, rau sống hoặc chưng thịt'],
      desc: ['{name} được Bếp Phù Sa ủ theo công thức gia truyền, từ nguyên liệu thu mua trực tiếp của bà con miền Tây.', 'Không chất bảo quản, không phẩm màu. Ngon nhất khi ăn kèm cơm nóng và rau sống, hoặc chưng cùng thịt ba chỉ.'],
      spec: [['Thành phần', 'Nguyên liệu tươi, muối, gia vị tự nhiên'], ['Bảo quản', 'Ngăn mát tủ lạnh sau khi mở nắp'], ['Cách dùng', 'Ăn trực tiếp, chưng hoặc kho']]
    },
    khoca: {
      highlights: ['Phơi nắng tự nhiên, thịt dẻo thơm', 'Không hàn the, không phẩm màu', 'Đóng gói hút chân không', 'Thích hợp chiên, nướng, kho'],
      desc: ['{name} được làm từ cá tươi thu mua trực tiếp của bà con miền Tây, ướp gia vị theo công thức gia truyền rồi phơi nắng tự nhiên.', 'Không hàn the, không phẩm màu. Chiên giòn, nướng than hoặc kho tiêu đều đậm đà, đưa cơm.'],
      spec: [['Thành phần', 'Cá, muối, gia vị tự nhiên'], ['Bảo quản', 'Ngăn mát 15 ngày, ngăn đông đến 3 tháng'], ['Cách dùng', 'Chiên, nướng hoặc kho']]
    },
    khomuc: {
      highlights: ['Mực tuyển chọn, thịt dày, ngọt tự nhiên', 'Không tẩy trắng, không hóa chất bảo quản', 'Đóng gói hút chân không', 'Nướng than, xé sợi chấm tương ớt'],
      desc: ['{name} được tuyển chọn từ mực biển Cà Mau, phơi nắng gió biển để giữ vị ngọt tự nhiên.', 'Không tẩy trắng, không hóa chất bảo quản. Nướng than rồi xé sợi, chấm tương ớt là ngon nhất.'],
      spec: [['Thành phần', 'Mực biển'], ['Bảo quản', 'Nơi khô ráo 2 tháng, ngăn đông đến 6 tháng'], ['Cách dùng', 'Nướng, chiên hoặc xé sợi']]
    },
    dacsan: {
      highlights: ['Đặc sản chính gốc miền Tây', 'Không chất bảo quản, không phẩm màu', 'Đóng gói kỹ, tem nhãn xuất xứ đầy đủ', 'Thích hợp dùng hằng ngày hoặc làm quà biếu'],
      desc: ['{name} là đặc sản được Bếp Phù Sa tuyển chọn trực tiếp tại vùng nguyên liệu miền Tây.', 'Không chất bảo quản, không phẩm màu. Đóng gói kỹ, giao tận nơi khắp cả nước.'],
      spec: [['Xuất xứ', 'Miền Tây Nam Bộ'], ['Bảo quản', 'Theo hướng dẫn trên bao bì'], ['Cách dùng', 'Chế biến theo khẩu vị gia đình']]
    },
    combo: {
      highlights: ['Gói trọn nhiều đặc sản miền Tây trong một hộp', 'Hộp quà trang nhã, sẵn sàng để biếu tặng', 'Mỗi món đóng gói riêng, hút chân không', 'Giao tận nơi khắp cả nước'],
      desc: ['{name} gói trọn những đặc sản bán chạy của Bếp Phù Sa trong một hộp quà, phù hợp biếu người thân, đối tác dịp lễ Tết.', 'Mỗi món đóng gói riêng, hút chân không, có tem nhãn xuất xứ đầy đủ.'],
      spec: [['Quy cách', 'Hộp quà nhiều món'], ['Bảo quản', 'Theo hướng dẫn trên từng món'], ['Phù hợp', 'Biếu tặng dịp lễ Tết']]
    }
  };

  var STORY_LINKS = {
    'kho-muc-loai1': ['story-kho-muc.html', 'Những đêm câu mực ngoài biển Cà Mau.', 'Đọc câu chuyện khô mực →'],
    'tom-kho': ['story-tom-kho.html', 'Tôm nuôi quảng canh giữa rừng ngập mặn Đất Mũi.', 'Đọc câu chuyện tôm khô →'],
    mam: ['founder-story.html', 'Mắm Bếp Phù Sa bắt đầu từ công thức của má chị Hạnh.', 'Đọc câu chuyện →'],
    other: ['founder-story.html', 'Bếp Phù Sa bắt đầu từ một góc chợ nhỏ ở Cần Thơ.', 'Đọc câu chuyện của chúng tôi →']
  };

  function setText(sel, text) {
    var el = document.querySelector(sel);
    if (el) el.textContent = text;
    return el;
  }

  function renderProduct() {
    var id = new URLSearchParams(window.location.search).get('id');
    var p = id && id !== DEFAULT_PRODUCT_ID ? findProduct(id) : null;
    if (!p) return;
    var copy = CATEGORY_COPY[p.cat] || CATEGORY_COPY.dacsan;
    var name = escapeHtml(p.name);

    document.title = p.name + ' — Bếp Phù Sa';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', copy.desc[0].replace('{name}', p.name));

    var catLink = document.querySelector('[data-pd-cat-link]');
    if (catLink) { catLink.textContent = p.catLabel; catLink.setAttribute('href', 'products.html?cat=' + p.cat); }
    document.querySelectorAll('.desktop-nav__link').forEach(function (a) {
      a.classList.toggle('is-active', a.getAttribute('href') === 'products.html?cat=' + p.cat);
    });
    setText('[data-pd-crumb]', p.name);
    setText('[data-pd-name]', p.name);
    var image = setText('[data-pd-image]', 'ảnh chính: ' + p.img);
    if (image) image.setAttribute('aria-label', p.name);

    var tag = { best: 'Bán chạy', sale: 'Đang giảm giá' }[p.badgeType];
    setText('[data-pd-kicker]', p.catLabel + (tag ? ' · ' + tag : ''));
    var stars = document.querySelector('[data-pd-stars]');
    if (stars) stars.setAttribute('aria-label', p.rating.toFixed(1) + ' trên 5 sao');
    setText('[data-pd-rating]', p.rating.toFixed(1) + ' · (' + p.reviews + ' đánh giá)');
    setText('[data-pd-sold]', 'Đã bán ' + p.sold.toLocaleString('vi-VN'));

    setText('[data-pd-price]', formatPrice(p.price));
    setText('[data-pd-sticky-price]', formatPrice(p.price));
    var oldEls = document.querySelectorAll('[data-pd-old], [data-pd-sticky-old], [data-pd-discount]');
    oldEls.forEach(function (el) { el.hidden = !p.oldPrice; });
    if (p.oldPrice) {
      setText('[data-pd-old]', formatPrice(p.oldPrice));
      setText('[data-pd-sticky-old]', formatPrice(p.oldPrice));
      // Rounded down so the badge never overstates the saving (and matches the cards).
      setText('[data-pd-discount]', '-' + Math.floor((p.oldPrice - p.price) / p.oldPrice * 100) + '%');
    }

    var highlights = document.querySelector('[data-pd-highlights]');
    if (highlights) {
      var tick = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg>';
      highlights.innerHTML = copy.highlights.map(function (h) { return '<li>' + tick + escapeHtml(h) + '</li>'; }).join('');
    }

    document.querySelectorAll('[data-add-to-cart][data-use-qty], [data-buy-now][data-use-qty]').forEach(function (btn) {
      btn.setAttribute('data-product-id', p.id);
      btn.setAttribute('data-product-name', p.name);
      if (btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', 'Thêm ' + p.name + ' vào giỏ');
    });
    setText('[data-pd-sticky-name]', p.name);

    var story = STORY_LINKS[p.id] || (p.cat === 'mam' ? STORY_LINKS.mam : STORY_LINKS.other);
    var storyEl = document.querySelector('[data-pd-story]');
    if (storyEl) {
      storyEl.innerHTML = escapeHtml(story[1]) + ' <a href="' + story[0] + '"><strong>' + escapeHtml(story[2]) + '</strong></a>';
    }

    var desc = document.querySelector('[data-pd-desc]');
    if (desc) {
      desc.innerHTML = copy.desc.map(function (d) { return '<p>' + escapeHtml(d.replace('{name}', p.name)) + '</p>'; }).join('');
    }
    var spec = document.querySelector('[data-pd-spec]');
    if (spec) {
      spec.innerHTML = [['Danh mục', p.catLabel]].concat(copy.spec).map(function (row) {
        return '<tr><th scope="row">' + escapeHtml(row[0]) + '</th><td>' + escapeHtml(row[1]) + '</td></tr>';
      }).join('');
    }
    setText('[data-pd-reviews-tab]', 'Đánh giá (' + p.reviews + ')');
    var reviews = document.querySelector('[data-pd-reviews]');
    if (reviews) {
      reviews.innerHTML = '<li class="review-list-item"><p class="review-list-item__text">Điểm trung bình <strong>' +
        p.rating.toFixed(1) + '/5</strong> từ ' + p.reviews + ' đánh giá của khách hàng cho ' + name + '.</p></li>';
    }

    var related = document.querySelector('[data-related-grid]');
    if (related) related.setAttribute('data-exclude-id', p.id);
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
    var current = findProduct(currentId);
    var others = PRODUCTS.filter(function (p) { return p.id !== currentId; });
    // Same category first (cross-sell), then gift combos (upsell), then the rest.
    function rank(p) {
      if (current && p.cat === current.cat) return 0;
      if (p.cat === 'combo') return 1;
      return 2;
    }
    // Array#sort is stable, so catalog order is kept within each rank.
    var related = others
      .sort(function (a, b) { return rank(a) - rank(b); })
      .slice(0, 4);
    grid.innerHTML = related.map(productCardHTML).join('');
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
    renderProduct();
    initGalleryThumbs();
    initQtyStepper();
    initTabs();
    initRelatedProducts();
    initStickyBuyBar();
  });
})();
