/* ==========================================================================
   Bếp Phù Sa – checkout page only
   ========================================================================== */
(function () {
  'use strict';

  /* CSS drives the selected payment-method highlight via :has(), which
     Safari < 15.4 and older Firefox don't support. This keeps the same
     highlight working everywhere by toggling a class instead. */
  function initPaymentMethodSync(form) {
    if (!form) return;
    var labels = form.querySelectorAll('.payment-method');
    if (!labels.length) return;

    function sync() {
      labels.forEach(function (label) {
        var input = label.querySelector('input[type="radio"]');
        label.classList.toggle('is-selected', !!(input && input.checked));
      });
    }

    labels.forEach(function (label) {
      var input = label.querySelector('input[type="radio"]');
      if (input) input.addEventListener('change', sync);
    });
    sync();
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

    var summaryEls = {
      subtotal: document.querySelector('[data-order-subtotal]'),
      shipping: document.querySelector('[data-order-shipping]'),
      total: document.querySelector('[data-order-total]'),
      discountRow: document.querySelector('[data-order-discount-row]'),
      discount: document.querySelector('[data-order-discount]'),
      couponNote: document.querySelector('[data-coupon-note]')
    };
    var totals = null;

    function renderTotals() {
      totals = computeTotals(subtotal, readCoupon());
      renderSummaryTotals(summaryEls, totals);
    }

    initCouponForm(document.querySelector('[data-coupon]'), renderTotals);
    renderTotals();

    initPaymentMethodSync(form);

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
        subtotal: totals.subtotal,
        discount: totals.discount,
        coupon: totals.coupon,
        shipping: totals.shipping,
        total: totals.total,
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
      writeCoupon('');
      window.location.href = 'order-success.html';
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initCheckoutPage();
  });
})();
