/* ==========================================================================
   Bếp Phù Sa – common (loaded on every page: cart, header/drawer, back-to-top, newsletter)
   ========================================================================== */
'use strict';

var CART_KEY = 'bps_cart';
var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function formatPrice(n) {
  return n.toLocaleString('vi-VN') + 'đ';
}

function starString() {
  return '★★★★★';
}

/* Escape any value before interpolating it into an innerHTML template.
   Every string below is static/trusted today, but this stays required
   once product data or the search query is ever rendered from user
   input or a real backend. */
var ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) { return ESCAPE_MAP[c]; });
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

function orderSummaryLineHTML(name, qty, lineTotal) {
  return (
    '<div class="order-summary-item"><span class="order-summary-item__name">' + escapeHtml(name) +
    ' <span class="order-summary-item__qty">× ' + qty + '</span></span>' +
    '<span class="order-summary-item__price">' + formatPrice(lineTotal) + '</span></div>'
  );
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

/* ---------------------------------------------------------------------
 Boot: behavior needed on every page (header, cart badge, drawer, back
 to top, newsletter form). Page-specific scripts add their own
 DOMContentLoaded boot for whatever else that page needs.
 --------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
updateCartBadges();
initAddToCartButtons();
initBuyNowButtons();
initDrawer();
initBackToTop();
initScrollToProducts();
initFocusSearch();
initNewsletterForms();
});
