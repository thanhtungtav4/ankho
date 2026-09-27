/* ==========================================================================
   Bếp Phù Sa – order success page only
   ========================================================================== */
(function () {
  'use strict';

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
    /* Show how the lines add up to the total (discount code, shipping),
       otherwise a discounted total looks lower than the items listed. */
    function showRow(key, text) {
      var row = document.querySelector('[data-order-success-' + key + '-row]');
      var valueEl = document.querySelector('[data-order-success-' + key + ']');
      if (!row || !valueEl) return;
      valueEl.textContent = text;
      row.hidden = false;
    }
    if (typeof order.subtotal === 'number') showRow('subtotal', formatPrice(order.subtotal));
    if (order.discount) showRow('discount', '−' + formatPrice(order.discount) + (order.coupon ? ' (' + order.coupon + ')' : ''));
    if (typeof order.shipping === 'number') showRow('shipping', order.shipping === 0 ? 'Miễn phí' : formatPrice(order.shipping));
    if (totalEl) totalEl.textContent = formatPrice(order.total);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initOrderSuccessPage();
  });
})();
