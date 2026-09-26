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
    if (totalEl) totalEl.textContent = formatPrice(order.total);
  }

  document.addEventListener('DOMContentLoaded', function () {
    initOrderSuccessPage();
  });
})();
