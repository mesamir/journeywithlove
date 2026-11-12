(function () {
  'use strict';
  const S = window.AFHStorage;
  const toast = (m, t) => window.AFH?.toast(m, t);
  const RE = {
    email: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i,
    phone: /^[\d\s()+.-]{7,}$/
  };

  function setError(field, msg) {
    field.classList.add('error');
    const err = field.querySelector('.field-error');
    if (err) err.textContent = msg;
    const input = field.querySelector('input,select,textarea');
    if (input) input.setAttribute('aria-invalid', 'true');
  }
  function clearError(field) {
    field.classList.remove('error');
    const err = field.querySelector('.field-error');
    if (err) err.textContent = '';
    const input = field.querySelector('input,select,textarea');
    if (input) input.removeAttribute('aria-invalid');
  }

  function validate(form) {
    let ok = true, firstBad = null;
    form.querySelectorAll('[data-required]').forEach(input => {
      const field = input.closest('.field, .checkbox-field');
      if (!field) return;
      clearError(field);
      const val = (input.value || '').trim();
      if (input.type === 'checkbox') {
        if (!input.checked) { setError(field, 'Please confirm to continue.'); ok = false; firstBad = firstBad || input; }
        return;
      }
      if (!val) { setError(field, 'This field is required.'); ok = false; firstBad = firstBad || input; return; }
      if (input.type === 'email' && !RE.email.test(val)) { setError(field, 'Enter a valid email address.'); ok = false; firstBad = firstBad || input; return; }
      if (input.type === 'tel' && !RE.phone.test(val)) { setError(field, 'Enter a valid phone number.'); ok = false; firstBad = firstBad || input; }
    });
    if (firstBad) firstBad.focus();
    return ok;
  }

  function serialize(form) {
    const data = {};
    new FormData(form).forEach((v, k) => { data[k] = typeof v === 'string' ? v.trim() : v; });
    form.querySelectorAll('input[type="checkbox"]').forEach(c => { data[c.name] = c.checked; });
    return data;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const contact = document.getElementById('contactForm');
    if (contact) {
      contact.addEventListener('submit', e => {
        e.preventDefault();
        if (!validate(contact)) { toast('Please fix the highlighted fields.', 'error'); return; }
        const entry = Object.assign(serialize(contact), {
          id: 'msg_' + Date.now(), created: new Date().toISOString(), type: 'contact'
        });
        const saved = S.push(S.KEYS.contact, entry);
        const box = document.getElementById('contactSuccess');
        if (box) {
          box.textContent = saved
            ? 'Thank you — your message has been saved as a demo submission. This prototype does not send emails.'
            : 'Message received (demo only — storage is unavailable in this browser).';
          box.classList.add('show');
        }
        toast('Message saved (demo only).', 'success');
        contact.reset();
        contact.querySelectorAll('.error').forEach(clearError);
      });
    }

    const adm = document.getElementById('admissionForm');
    if (adm) {
      adm.addEventListener('submit', e => {
        e.preventDefault();
        if (!validate(adm)) { toast('Please fix the highlighted fields.', 'error'); return; }
        const entry = Object.assign(serialize(adm), {
          id: 'adm_' + Date.now(), created: new Date().toISOString(), type: 'admission'
        });
        const saved = S.push(S.KEYS.admission, entry);
        const box = document.getElementById('admissionSuccess');
        if (box) {
          box.textContent = saved
            ? 'Your inquiry has been saved as a demo submission. No one will be contacted from this prototype.'
            : 'Inquiry received (demo only — storage is unavailable in this browser).';
          box.classList.add('show');
        }
        toast('Admission inquiry saved (demo only).', 'success');
        adm.reset();
        adm.querySelectorAll('.error').forEach(clearError);
      });
    }
  });
})();