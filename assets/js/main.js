(function () {
  'use strict';
  const CFG = window.AFH_CONFIG || {};
  const page = document.body.dataset.page || 'index.html';

  const NAV = [
    ['index.html', 'Home'], ['about.html', 'About Us'], ['services.html', 'Our Care'],
    ['amenities.html', 'Amenities'], ['gallery.html', 'Gallery'], ['team.html', 'Our Team'],
    ['admission.html', 'Admission'], ['contact.html', 'Contact']
  ];

  const navLink = ([href, label]) =>
    `<li><a href="${href}"${href === page ? ' aria-current="page"' : ''}>${label}</a></li>`;

  function headerHTML() {
    return `
    <div class="announce-bar">
      <div class="container announce-inner">
        <p><i class="fa-solid fa-location-dot" aria-hidden="true"></i> Serving ${CFG.location}</p>
        <p><i class="fa-solid fa-phone" aria-hidden="true"></i> <a href="tel:${CFG.phoneHref}">${CFG.phone}</a></p>
      </div>
    </div>
    <div class="header-main">
      <div class="container header-inner">
        <a class="logo" href="index.html">
          <span class="logo-mark" aria-hidden="true"><i class="fa-solid fa-leaf"></i></span>
          <span>${CFG.name}<small>Adult Family Home</small></span>
        </a>
        <nav class="nav-desktop" aria-label="Primary"><ul>${NAV.map(navLink).join('')}</ul></nav>
        <a href="tour.html" class="btn btn-accent">Schedule a Tour</a>
        <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">
          <i class="fa-solid fa-bars" aria-hidden="true"></i>
        </button>
      </div>
    </div>
    <div class="menu-backdrop" id="menuBackdrop"></div>
    <nav class="mobile-menu" id="mobileMenu" aria-label="Mobile navigation" aria-hidden="true">
      <div class="mobile-menu-head">
        <strong>Menu</strong>
        <button class="nav-toggle" type="button" id="menuClose" aria-label="Close menu"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>
      </div>
      <ul>${NAV.map(navLink).join('')}<li><a href="faq.html"${page === 'faq.html' ? ' aria-current="page"' : ''}>FAQ</a></li></ul>
      <a href="tour.html" class="btn btn-accent">Schedule a Tour</a>
      <a href="tel:${CFG.phoneHref}" class="btn btn-outline"><i class="fa-solid fa-phone" aria-hidden="true"></i> Call ${CFG.phone}</a>
    </nav>`;
  }

  function footerHTML() {
    const year = new Date().getFullYear();
    return `
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="logo" href="index.html">
            <span class="logo-mark" aria-hidden="true"><i class="fa-solid fa-leaf"></i></span>
            <span>${CFG.name}<small>Adult Family Home</small></span>
          </a>
          <p>${CFG.description}</p>
          <div class="social-links">
            <a href="${CFG.social.facebook}" aria-label="Facebook"><i class="fa-brands fa-facebook-f" aria-hidden="true"></i></a>
            <a href="${CFG.social.instagram}" aria-label="Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i></a>
            <a href="${CFG.social.linkedin}" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in" aria-hidden="true"></i></a>
          </div>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul>${NAV.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}
            <li><a href="faq.html">FAQ</a></li>
            <li><a href="tour.html">Schedule a Tour</a></li>
            <li><a href="careers.html">Careers</a></li>
            <li><a href="costs.html">Costs</a></li>
          </ul>
        </div>
        <div>
          <h3>Our Care</h3>
          <ul>
            <li><a href="services.html">Personal Care</a></li>
            <li><a href="services.html">Daily Living Support</a></li>
            <li><a href="services.html">Medication Assistance</a></li>
            <li><a href="services.html">Memory Support</a></li>
            <li><a href="services.html">Companionship</a></li>
            <li><a href="services.html">Meals &amp; Nutrition</a></li>
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <ul>
            <li><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${CFG.address.line1}, ${CFG.address.city}, ${CFG.address.state} ${CFG.address.zip}</li>
            <li><i class="fa-solid fa-phone" aria-hidden="true"></i> <a href="tel:${CFG.phoneHref}">${CFG.phone}</a></li>
            <li><i class="fa-solid fa-envelope" aria-hidden="true"></i> <a href="mailto:${CFG.email}">${CFG.email}</a></li>
            <li><i class="fa-solid fa-clock" aria-hidden="true"></i> ${CFG.hours}</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${year} ${CFG.name}. All rights reserved. <span class="demo-tag">Journey With Love</span></p>
        <div class="footer-legal">
          <a href="privacy-policy.html">Privacy Policy</a>
          <a href="terms.html">Terms &amp; Conditions</a>
          <a href="accessibility.html">Accessibility</a>
        </div>
      </div>
    </div>`;
  }

  /* ---------- Toast ---------- */
  let region;
  function toast(message, type = 'info') {
    if (!region) {
      region = document.createElement('div');
      region.className = 'toast-region';
      region.setAttribute('role', 'status');
      region.setAttribute('aria-live', 'polite');
      document.body.appendChild(region);
    }
    const icons = { success: 'fa-circle-check', error: 'fa-circle-exclamation', info: 'fa-circle-info' };
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}" aria-hidden="true"></i><span></span>
      <button class="toast-close" type="button" aria-label="Dismiss notification"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>`;
    el.querySelector('span').textContent = message;
    region.appendChild(el);
    const remove = () => el.remove();
    el.querySelector('.toast-close').addEventListener('click', remove);
    setTimeout(remove, 5200);
  }

  /* ---------- Mount ---------- */
  function mount() {
    const header = document.getElementById('siteHeader');
    if (header) { header.className = 'site-header'; header.innerHTML = headerHTML(); }
    const footer = document.getElementById('siteFooter');
    if (footer) { footer.className = 'site-footer'; footer.innerHTML = footerHTML(); }

    const fab = document.createElement('div');
    fab.className = 'floating-actions';
    fab.innerHTML = `
      <a class="fab fab-call" href="tel:${CFG.phoneHref}" aria-label="Call ${CFG.name}"><i class="fa-solid fa-phone" aria-hidden="true"></i></a>
      <a class="fab fab-contact" href="contact.html" aria-label="Contact us"><i class="fa-solid fa-envelope" aria-hidden="true"></i></a>
      <button class="fab fab-top" type="button" id="backToTop" aria-label="Back to top"><i class="fa-solid fa-arrow-up" aria-hidden="true"></i></button>`;
    document.body.appendChild(fab);

    const top = document.getElementById('backToTop');
    window.addEventListener('scroll', () => top.classList.toggle('visible', window.scrollY > 480), { passive: true });
    top.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.querySelector('.skip-link')?.focus();
    });

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if (!id || id.length < 2) return;
        const t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        t.setAttribute('tabindex', '-1');
        t.focus({ preventScroll: true });
      });
    });
  }

  window.AFH = Object.assign(window.AFH || {}, { toast, config: CFG });
  document.addEventListener('DOMContentLoaded', mount);
})();