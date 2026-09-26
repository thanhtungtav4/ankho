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
          '<a href="product-detail.html" class="cart-line__name">' + name + '</a>' +
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

  document.addEventListener('DOMContentLoaded', function () {
    initCartPage();
  });
})();
