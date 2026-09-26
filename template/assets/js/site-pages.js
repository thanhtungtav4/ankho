/* ==========================================================================
   Bếp Phù Sa – small content pages: contact form, news tag filter, policy sidebar, auth forms
   ========================================================================== */
(function () {
  'use strict';

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

  document.addEventListener('DOMContentLoaded', function () {
    initContactForm();
    initNewsFilter();
    initPolicyNav();
    initAuthForms();
  });
})();
