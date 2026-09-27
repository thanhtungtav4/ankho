/* ==========================================================================
   Bếp Phù Sa – cart page only
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------
     Cart page
     --------------------------------------------------------------------- */
  function cartLineHTML(product, qty) {
    var id = escapeHtml(product.id);
    var name = escapeHtml(product.name);
    var img = escapeHtml(product.img);
    return (
      '<div class="cart-line" data-cart-line data-id="' + id + '">' +
        '<span class="cart-line__img" role="img" aria-label="' + name + '">ảnh: ' + img + '</span>' +
        '<div class="cart-line__info">' +
          '<a href="product-detail.html?id=' + id + '" class="cart-line__name">' + name + '</a>' +
          '<span class="cart-line__price">' + formatPrice(product.price) + ' / sản phẩm</span>' +
        '</div>' +
        '<div class="qty-stepper cart-line__qty">' +
          '<button type="button" data-cart-dec aria-label="Giảm số lượng">−</button>' +
          '<span class="qty-stepper__value" data-cart-qty>' + qty + '</span>' +
          '<button type="button" data-cart-inc aria-label="Tăng số lượng">+</button>' +
        '</div>' +
        '<span class="cart-line__total">' + formatPrice(product.price * qty) + '</span>' +
        '<button type="button" class="cart-line__remove" data-cart-remove aria-label="Xóa ' + name + ' khỏi giỏ">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6"/></svg>' +
        '</button>' +
      '</div>'
    );
  }

  function initCartPage() {
    var container = document.querySelector('[data-cart-items]');
    if (!container) return;
    var summaryEls = {
      subtotal: document.querySelector('[data-cart-subtotal]'),
      shipping: document.querySelector('[data-cart-shipping]'),
      total: document.querySelector('[data-cart-total]'),
      discountRow: document.querySelector('[data-cart-discount-row]'),
      discount: document.querySelector('[data-cart-discount]'),
      couponNote: document.querySelector('[data-coupon-note]')
    };
    var summaryEl = document.querySelector('[data-cart-summary]');
    var layoutEl = document.querySelector('.cart-layout');
    var freeshipEl = document.querySelector('[data-freeship]');
    var freeshipText = document.querySelector('[data-freeship-text]');
    var freeshipBar = document.querySelector('[data-freeship-bar]');

    /* "Buy X more for free shipping" nudge: the single most effective lever
       for raising average order value on a free-shipping threshold. */
    function renderFreeship(totals) {
      if (!freeshipEl) return;
      // Free shipping can also come from a code (FREESHIP), not only the threshold.
      var remaining = totals.shipping === 0 ? 0 : FREE_SHIPPING_THRESHOLD - totals.subtotal;
      var pct = remaining <= 0 ? 100 : Math.round(totals.subtotal / FREE_SHIPPING_THRESHOLD * 100);
      freeshipEl.classList.toggle('is-done', remaining <= 0);
      if (freeshipBar) freeshipBar.style.setProperty('--freeship-progress', pct + '%');
      if (freeshipText) {
        freeshipText.innerHTML = remaining > 0
          ? 'Mua thêm <strong>' + formatPrice(remaining) + '</strong> để được <strong>miễn phí vận chuyển</strong>'
          : '<strong>Tuyệt vời!</strong> Đơn hàng của bạn được miễn phí vận chuyển';
      }
    }

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
        if (layoutEl) layoutEl.classList.add('is-empty');
        updateCartBadges();
        return;
      }

      if (summaryEl) summaryEl.hidden = false;
      if (layoutEl) layoutEl.classList.remove('is-empty');
      var subtotal = 0;
      container.innerHTML = ids.map(function (id) {
        var product = findProduct(id);
        if (!product) return '';
        subtotal += product.price * cart[id];
        return cartLineHTML(product, cart[id]);
      }).join('');

      var totals = computeTotals(subtotal, readCoupon());
      renderSummaryTotals(summaryEls, totals);
      renderFreeship(totals);

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

    initCouponForm(document.querySelector('[data-coupon]'), render);
    render();
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCartPage();
  });
})();
