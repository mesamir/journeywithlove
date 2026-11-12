(function () {
  'use strict';

  function initAccordions(root) {
    root.querySelectorAll('[data-accordion]').forEach(acc => {
      acc.querySelectorAll('.accordion-trigger').forEach(btn => {
        btn.addEventListener('click', () => {
          const panel = document.getElementById(btn.getAttribute('aria-controls'));
          const isOpen = btn.getAttribute('aria-expanded') === 'true';
          if (!acc.hasAttribute('data-multi')) {
            acc.querySelectorAll('.accordion-trigger').forEach(o => {
              if (o === btn) return;
              o.setAttribute('aria-expanded', 'false');
              const p = document.getElementById(o.getAttribute('aria-controls'));
              if (p) p.hidden = true;
            });
          }
          btn.setAttribute('aria-expanded', String(!isOpen));
          if (panel) panel.hidden = isOpen;
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initAccordions(document);

    const search = document.getElementById('faqSearch');
    const items = Array.from(document.querySelectorAll('[data-faq-item]'));
    const catBtns = Array.from(document.querySelectorAll('[data-faq-filter]'));
    const empty = document.getElementById('faqEmpty');
    let cat = 'all';

    function apply() {
      const q = (search?.value || '').trim().toLowerCase();
      let shown = 0;
      items.forEach(item => {
        const matchQ = !q || item.textContent.toLowerCase().includes(q);
        const matchC = cat === 'all' || item.dataset.category === cat;
        const show = matchQ && matchC;
        item.hidden = !show;
        if (show) shown++;
      });
      if (empty) empty.classList.toggle('show', shown === 0);
      document.querySelectorAll('[data-faq-group]').forEach(group => {
        group.hidden = !Array.from(group.querySelectorAll('[data-faq-item]')).some(i => !i.hidden);
      });
    }

    search?.addEventListener('input', apply);
    catBtns.forEach(b => b.addEventListener('click', () => {
      cat = b.dataset.faqFilter;
      catBtns.forEach(x => {
        x.classList.toggle('active', x === b);
        x.setAttribute('aria-pressed', String(x === b));
      });
      apply();
    }));
    if (items.length) apply();
  });
})();