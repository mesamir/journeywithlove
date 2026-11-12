(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    const toggle = header.querySelector('.nav-toggle');
    const menu = document.getElementById('mobileMenu');
    const backdrop = document.getElementById('menuBackdrop');
    const closeBtn = document.getElementById('menuClose');
    let lastFocus = null;

    function open() {
      lastFocus = document.activeElement;
      menu.classList.add('open');
      backdrop.classList.add('show');
      menu.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      (menu.querySelector('a,button') || menu).focus();
    }
    function close() {
      menu.classList.remove('open');
      backdrop.classList.remove('show');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    toggle.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);

    document.addEventListener('keydown', e => {
      if (!menu.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {
        const f = menu.querySelectorAll('a[href],button:not([disabled])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  });
})();