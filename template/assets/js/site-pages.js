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

      if (!name || !message) {
        setFormMsg(msgEl, 'Vui lòng nhập họ tên và nội dung.', false);
        return;
      }
      if (!isValidEmail(email)) {
        setFormMsg(msgEl, 'Vui lòng nhập email hợp lệ.', false);
        return;
      }
      setFormMsg(msgEl, 'Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn và sẽ phản hồi sớm.', true);
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

    function show(key) {
      buttons.forEach(function (b) {
        var active = b.getAttribute('data-policy-nav-btn') === key;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-current', String(active));
      });
      panels.forEach(function (panel) {
        panel.classList.toggle('is-active', panel.getAttribute('data-policy-panel') === key);
      });
    }

    function hasPanel(key) {
      return Array.prototype.some.call(panels, function (p) { return p.getAttribute('data-policy-panel') === key; });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-policy-nav-btn');
        show(key);
        /* keep the URL in sync so the open policy can be linked/shared */
        if (window.history && history.replaceState) history.replaceState(null, '', '#' + key);
      });
    });

    /* Footer links deep-link to a policy (policy.html#baomat, #faq, ...). */
    function fromHash() {
      var key = window.location.hash.slice(1);
      if (key && hasPanel(key)) show(key);
    }
    fromHash();
    window.addEventListener('hashchange', fromHash);
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
        if (!isValidEmail(emailVal)) {
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
