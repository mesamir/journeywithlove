(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    const items = Array.from(grid.querySelectorAll('.gallery-item'));
    const filters = Array.from(document.querySelectorAll('[data-gallery-filter]'));
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImage');
    const lbCap = document.getElementById('lbCaption');
    const closeBtn = document.getElementById('lbClose');
    const prevBtn = document.getElementById('lbPrev');
    const nextBtn = document.getElementById('lbNext');

    let visible = items.slice();
    let index = 0;
    let lastFocus = null;

    filters.forEach(btn => btn.addEventListener('click', () => {
      const cat = btn.dataset.galleryFilter;
      filters.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-pressed', String(b === btn));
      });
      items.forEach(it => it.classList.toggle('hidden', !(cat === 'all' || it.dataset.category === cat)));
      visible = items.filter(it => !it.classList.contains('hidden'));
    }));

    function open(i) {
      if (!visible.length) return;
      index = (i + visible.length) % visible.length;
      const it = visible[index];
      const img = it.querySelector('img');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = it.querySelector('figcaption')?.textContent || '';
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lastFocus = document.activeElement;
      closeBtn.focus();
    }
    function close() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    }

    items.forEach(it => {
      it.setAttribute('tabindex', '0');
      it.setAttribute('role', 'button');
      it.setAttribute('aria-label', 'Open image: ' + (it.querySelector('figcaption')?.textContent || ''));
      it.addEventListener('click', () => open(visible.indexOf(it)));
      it.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(visible.indexOf(it)); }
      });
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => open(index - 1));
    nextBtn.addEventListener('click', () => open(index + 1));
    lb.addEventListener('click', e => { if (e.target === lb) close(); });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') open(index - 1);
      if (e.key === 'ArrowRight') open(index + 1);
      if (e.key === 'Tab') {
        const f = lb.querySelectorAll('button');
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  });
})();