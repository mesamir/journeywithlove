(function () {
  'use strict';
  const S = window.AFHStorage;
  const toast = (m, t) => window.AFH?.toast(m, t);
  const SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'];
  const RE = { email: /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i, phone: /^[\d\s()+.-]{7,}$/ };
  let selectedSlot = null;

  const esc = s => String(s ?? '').replace(/[&<>"']/g,
    c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function todayISO() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 10);
  }

  function renderSlots(dateStr) {
    const wrap = document.getElementById('slotGrid');
    if (!wrap) return;
    selectedSlot = null;
    wrap.innerHTML = '';
    const booked = S.read(S.KEYS.tour)
      .filter(r => r.date === dateStr && r.status !== 'cancelled')
      .map(r => r.time);

    SLOTS.forEach(time => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'slot';
      b.textContent = time;
      b.disabled = booked.includes(time);
      b.setAttribute('aria-pressed', 'false');
      if (b.disabled) b.title = 'Already requested — please choose another time';
      b.addEventListener('click', () => {
        wrap.querySelectorAll('.slot').forEach(x => {
          x.classList.remove('selected');
          x.setAttribute('aria-pressed', 'false');
        });
        b.classList.add('selected');
        b.setAttribute('aria-pressed', 'true');
        selectedSlot = time;
        const err = document.getElementById('timeError');
        if (err) err.textContent = '';
      });
      wrap.appendChild(b);
    });
  }

  function renderSaved() {
    const list = document.getElementById('savedTours');
    if (!list) return;
    const all = S.read(S.KEYS.tour);
    list.innerHTML = '';
    if (!all.length) {
      list.innerHTML = '<p class="saved-meta">No demo tour requests saved on this device yet.</p>';
      return;
    }
    all.slice().reverse().forEach(r => {
      const cancelled = r.status === 'cancelled';
      const el = document.createElement('div');
      el.className = 'saved-item';
      el.innerHTML = `
        <div>
          <strong>${esc(r.name)}</strong> — ${esc(r.date)} at ${esc(r.time)}
          <div class="saved-meta">${esc(r.type)} · ${esc(r.email)} · ${cancelled ? 'Cancelled' : 'Pending confirmation'}</div>
        </div>
        <button class="btn btn-danger btn-sm" type="button" ${cancelled ? 'disabled' : ''} data-cancel="${esc(r.id)}">
          ${cancelled ? 'Cancelled' : 'Cancel request'}
        </button>`;
      list.appendChild(el);
    });
    list.querySelectorAll('[data-cancel]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.cancel;
        const updated = S.read(S.KEYS.tour)
          .map(r => r.id === id ? Object.assign({}, r, { status: 'cancelled' }) : r);
        S.write(S.KEYS.tour, updated);
        toast('Tour request cancelled (demo only).', 'info');
        renderSaved();
        const d = document.getElementById('tourDate');
        renderSlots(d && d.value ? d.value : todayISO());
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tourForm');
    if (!form) return;

    const dateInput = document.getElementById('tourDate');
    if (dateInput) {
      dateInput.min = todayISO();
      dateInput.addEventListener('change', () => {
        if (!dateInput.value) return;
        if (dateInput.value < todayISO()) {
          dateInput.value = '';
          toast('Please choose a date from today onward.', 'error');
          return;
        }
        const err = document.getElementById('dateError');
        if (err) err.textContent = '';
        renderSlots(dateInput.value);
      });
    }

    renderSlots(todayISO());
    renderSaved();

    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;

      form.querySelectorAll('[data-required]').forEach(input => {
        const field = input.closest('.field, .checkbox-field');
        if (!field) return;
        field.classList.remove('error');
        const err = field.querySelector('.field-error');
        if (err) err.textContent = '';
        const val = (input.value || '').trim();

        if (input.type === 'checkbox' && !input.checked) {
          ok = false; field.classList.add('error');
          if (err) err.textContent = 'Please confirm to continue.';
        } else if (!val) {
          ok = false; field.classList.add('error');
          if (err) err.textContent = 'This field is required.';
        } else if (input.type === 'email' && !RE.email.test(val)) {
          ok = false; field.classList.add('error');
          if (err) err.textContent = 'Enter a valid email address.';
        } else if (input.type === 'tel' && !RE.phone.test(val)) {
          ok = false; field.classList.add('error');
          if (err) err.textContent = 'Enter a valid phone number.';
        }
      });

      if (dateInput && !dateInput.value) {
        const err = document.getElementById('dateError');
        if (err) err.textContent = 'Please choose a date.';
        ok = false;
      }
      if (!selectedSlot) {
        const err = document.getElementById('timeError');
        if (err) err.textContent = 'Please choose an available time slot.';
        ok = false;
      }
      if (!ok) { toast('Please fix the highlighted fields.', 'error'); return; }

      const data = {};
      new FormData(form).forEach((v, k) => { data[k] = typeof v === 'string' ? v.trim() : v; });

      const entry = {
        id: 'tour_' + Date.now(),
        name: data.name, email: data.email, phone: data.phone,
        visitors: data.visitors || '1',
        date: data.date, time: selectedSlot, type: data.tourType,
        message: data.message || '',
        status: 'pending', created: new Date().toISOString()
      };
      S.push(S.KEYS.tour, entry);

      const box = document.getElementById('tourSuccess');
      if (box) {
        box.innerHTML = `<strong>Request received (demo only).</strong> Thank you, ${esc(entry.name)}.
          You requested <strong>${esc(entry.date)} at ${esc(entry.time)}</strong> for a ${esc(entry.type)}.
          This is <em>not</em> a confirmed appointment until the home responds.`;
        box.classList.add('show');
      }
      toast('Tour request saved. This is not a confirmed appointment.', 'success');

      form.reset();
      form.querySelectorAll('.error').forEach(f => f.classList.remove('error'));
      selectedSlot = null;
      renderSlots(todayISO());
      renderSaved();
    });
  });
})();