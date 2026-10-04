(() => {
  'use strict';

  const TOKEN_KEY = 'mulakat.bookingToken';
  const REFRESH_MS = 15000;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = {
    config: null,
    slots: [],
    totals: { total: 0, available: 0, booked: 0 },
    selected: null,
    myBooking: null,
    submitting: false,
    lastUpdated: null,
  };

  const tokenStore = {
    get() { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } },
    set(v) { try { localStorage.setItem(TOKEN_KEY, v); } catch { /* yoksay */ } },
    clear() { try { localStorage.removeItem(TOKEN_KEY); } catch { /* yoksay */ } },
  };

  async function api(path, options = {}) {
    let res;
    try {
      res = await fetch(path, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        cache: 'no-store',
      });
    } catch {
      const err = new Error('Sunucuya ulaşılamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.');
      err.code = 'network';
      throw err;
    }
    let data = null;
    try { data = await res.json(); } catch { /* boş yanıt */ }
    if (!res.ok) {
      const err = new Error((data && data.message) || 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.');
      err.status = res.status;
      err.code = data && data.error;
      err.fields = data && data.fields;
      throw err;
    }
    return data;
  }

  // ---------- Biçimlendirme ----------

  function dateLabel(isoDate) {
    if (!isoDate) return '';
    const d = new Date(`${isoDate}T12:00:00`);
    return new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  }

  function timeLabel(slot) {
    return `${slot.start} – ${slot.end}`;
  }

  let toastTimer;
  function toast(message, kind = 'error') {
    const el = $('#toast');
    el.textContent = message;
    el.className = `toast${kind === 'ok' ? ' toast--ok' : ''}`;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 6000);
  }

  // ---------- Yapılandırma ----------

  function applyConfig(config) {
    const values = {
      clubName: config.clubName,
      title: config.title,
      subtitle: config.subtitle,
      startTime: config.startTime,
      endTime: config.endTime,
      slotMinutes: String(config.slotMinutes),
      slotCapacity: String(config.slotCapacity),
      location: config.location || '',
      contact: config.contact || '',
      dateLabel: dateLabel(config.interviewDate),
      interviewDate: config.interviewDate || '',
    };
    $$('[data-bind]').forEach((el) => { el.textContent = values[el.dataset.bind] || ''; });
    $$('[data-show]').forEach((el) => { el.hidden = !values[el.dataset.show]; });
    document.title = config.title;
    $('#year').textContent = String(new Date().getFullYear());
  }

  // ---------- Kontenjan ve saatler ----------

  function renderStats() {
    const { total, available, booked } = state.totals; // kişi (yer) sayıları
    const fill = total ? Math.round((booked / total) * 100) : 0;

    $('#statAvailable').textContent = String(available);
    $('#statTotal').textContent = String(total);
    $('#statFill').textContent = `%${fill}`;
    $('#fillBar').style.width = `${fill}%`;
    $('#fillMeter').setAttribute('aria-valuenow', String(fill));

    let note;
    if (available === 0) note = 'Tüm kontenjan dolmuştur. İlginiz için teşekkür ederiz.';
    else if (available <= 3) note = `Son ${available} kişilik yer kaldı! Hemen seçiminizi yapın.`;
    else note = `${booked} aday randevusunu aldı. Saatler ilk gelen alır esasına göre dağıtılır.`;
    $('#capacityNote').textContent = note;
  }

  function slotState(slot) {
    if (state.myBooking && state.myBooking.slotId === slot.id) return { cls: 'mine', text: 'Sizin randevunuz' };
    if (slot.status === 'booked') return { cls: 'booked', text: 'Dolu' };
    if (slot.status === 'closed') return { cls: 'closed', text: 'Kapandı' };
    if (state.selected === slot.id) return { cls: 'selected', text: 'Seçildi' };
    if (slot.remaining === 1) return { cls: 'available slot--last', text: 'Son 1 yer' };
    return { cls: 'available', text: `${slot.remaining} yer boş` };
  }

  function renderSlots() {
    const container = $('#slotGroups');
    const groups = new Map();
    for (const slot of state.slots) {
      const hour = slot.start.slice(0, 2);
      if (!groups.has(hour)) groups.set(hour, []);
      groups.get(hour).push(slot);
    }

    const fragment = document.createDocumentFragment();
    for (const [hour, slots] of groups) {
      const group = document.createElement('div');
      group.className = 'slot-group';

      const head = document.createElement('div');
      head.className = 'slot-group__head';
      const title = document.createElement('h3');
      title.className = 'slot-group__title';
      const nextHour = String((Number(hour) + 1) % 24).padStart(2, '0');
      title.textContent = `${hour}:00 – ${nextHour}:00`;
      const count = document.createElement('p');
      count.className = 'slot-group__count';
      const free = slots.reduce((n, s) => n + (s.status === 'available' ? s.remaining : 0), 0);
      const capacity = slots.length * ((state.config && state.config.slotCapacity) || 1);
      if (free > 0) {
        const strong = document.createElement('strong');
        strong.textContent = `${free} boş yer`;
        count.append(strong, ` / ${capacity}`);
      } else {
        count.textContent = 'Bu saat dilimi doldu';
      }
      head.append(title, count);

      const list = document.createElement('div');
      list.className = 'slots';
      for (const slot of slots) {
        const { cls, text } = slotState(slot);
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `slot slot--${cls}`;
        button.dataset.slot = slot.id;
        const selectable = cls.startsWith('available') || cls === 'selected';
        button.disabled = !selectable || Boolean(state.myBooking);
        if (cls === 'mine') button.disabled = false; // görünür kalsın, tıklanınca bir şey yapmaz
        button.setAttribute('aria-pressed', String(cls === 'selected'));
        button.setAttribute('aria-label', `${timeLabel(slot)}, ${text}`);
        const time = document.createElement('span');
        time.className = 'slot__time';
        time.textContent = slot.start;
        const label = document.createElement('span');
        label.className = 'slot__state';
        label.textContent = text;
        button.append(time, label);
        list.append(button);
      }

      group.append(head, list);
      fragment.append(group);
    }
    container.replaceChildren(fragment);

    if (state.lastUpdated) {
      const t = state.lastUpdated.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      $('#lastUpdated').textContent = `Son güncelleme: ${t} · Liste otomatik olarak yenilenir.`;
    }
  }

  function renderSelection() {
    const box = $('#selectionBox');
    const value = $('#selectionValue');
    const slot = state.slots.find((s) => s.id === state.selected);
    box.classList.toggle('selection--active', Boolean(slot));
    value.textContent = slot ? timeLabel(slot) : 'Henüz saat seçilmedi';
    $('#submitButton').disabled = !slot || state.submitting;
  }

  function renderConfirmation() {
    const booking = state.myBooking;
    $('#formView').hidden = Boolean(booking);
    $('#confirmView').hidden = !booking;
    if (!booking) return;

    $('#confirmName').textContent = booking.fullName;
    $('#confirmTime').textContent = `${booking.start} – ${booking.end}`;

    const hasCalendar = Boolean(booking.startsAt && state.config);
    $('#calendarActions').hidden = !hasCalendar;
    if (hasCalendar) $('#googleCalendar').href = googleCalendarUrl(booking);
  }

  function render() {
    renderStats();
    renderSlots();
    renderSelection();
    renderConfirmation();
  }

  async function refreshSlots({ silent = true } = {}) {
    try {
      const data = await api('/api/slots');
      state.slots = data.slots;
      state.totals = { total: data.total, available: data.available, booked: data.booked };
      state.lastUpdated = new Date();

      if (state.selected) {
        const slot = state.slots.find((s) => s.id === state.selected);
        if (!slot || slot.status !== 'available') {
          toast(`Seçtiğiniz ${state.selected} saati artık müsait değil. Lütfen başka bir saat seçin.`);
          state.selected = null;
        }
      }
      render();
    } catch (err) {
      if (!silent) {
        const box = document.createElement('p');
        box.className = 'load-error';
        box.textContent = `${err.message} Sayfa birkaç saniye içinde tekrar denenecek.`;
        $('#slotGroups').replaceChildren(box);
      }
    }
  }

  // ---------- Form ----------

  function setFieldErrors(fields = {}) {
    $$('[data-error-for]').forEach((el) => {
      const name = el.dataset.errorFor;
      el.textContent = fields[name] || '';
      const input = document.getElementById(name);
      if (input && input.tagName === 'INPUT') {
        if (fields[name]) input.setAttribute('aria-invalid', 'true');
        else input.removeAttribute('aria-invalid');
      }
    });
  }

  function clientValidate(values) {
    const errors = {};
    if (!values.slotId) errors.slotId = 'Lütfen takvimden bir saat seçin.';
    if (values.fullName.trim().length < 3) errors.fullName = 'Lütfen adınızı ve soyadınızı yazın.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = 'Geçerli bir e-posta adresi girin.';
    const digits = values.phone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 15) errors.phone = 'Geçerli bir telefon numarası girin (örn. 0532 123 45 67).';
    if (!values.consent) errors.consent = 'Devam etmek için onay kutusunu işaretleyin.';
    return errors;
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (state.submitting || state.myBooking) return;

    const form = event.currentTarget;
    const values = {
      slotId: state.selected,
      fullName: form.fullName.value,
      email: form.email.value,
      phone: form.phone.value,
      department: form.department.value,
      consent: form.consent.checked,
    };
    const errors = clientValidate(values);
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      const first = Object.keys(errors).find((k) => document.getElementById(k));
      if (first) document.getElementById(first).focus();
      return;
    }

    const button = $('#submitButton');
    state.submitting = true;
    button.classList.add('is-loading');
    button.disabled = true;
    button.querySelector('.button__label').textContent = 'Randevunuz oluşturuluyor';

    try {
      const data = await api('/api/bookings', { method: 'POST', body: JSON.stringify(values) });
      tokenStore.set(data.token);
      state.myBooking = data.booking;
      state.selected = null;
      form.reset();
      setFieldErrors();
      toast('Randevunuz başarıyla oluşturuldu.', 'ok');
      await refreshSlots();
      render();
      const confirmView = $('#confirmView');
      confirmView.scrollIntoView({ behavior: 'smooth', block: 'center' });
      confirmView.focus({ preventScroll: true });
    } catch (err) {
      if (err.fields) setFieldErrors(err.fields);
      toast(err.message);
      if (err.code === 'slot_taken' || err.code === 'slot_closed') {
        state.selected = null;
        await refreshSlots();
      }
    } finally {
      state.submitting = false;
      button.classList.remove('is-loading');
      button.querySelector('.button__label').textContent = 'Randevuyu Onayla';
      renderSelection();
    }
  }

  function onSlotClick(event) {
    const button = event.target.closest('.slot');
    if (!button || state.myBooking) return;
    const slot = state.slots.find((s) => s.id === button.dataset.slot);
    if (!slot || slot.status !== 'available') return;
    state.selected = state.selected === slot.id ? null : slot.id;
    setFieldErrors();
    renderSlots();
    renderSelection();
    if (state.selected && window.matchMedia('(max-width: 959px)').matches) {
      $('#selectionBox').scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // ---------- Takvim ----------

  const icsDate = (iso) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const icsText = (s) => String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

  function googleCalendarUrl(booking) {
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: state.config.title,
      dates: `${icsDate(booking.startsAt)}/${icsDate(booking.endsAt)}`,
      details: `${state.config.clubName} üye mülakatı (${state.config.slotMinutes} dakika).`,
    });
    if (state.config.location) params.set('location', state.config.location);
    return `https://calendar.google.com/calendar/render?${params}`;
  }

  function downloadIcs() {
    const b = state.myBooking;
    if (!b || !b.startsAt || !state.config) return;
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Otomotiv Kulubu//Mulakat Randevu//TR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${icsDate(b.startsAt)}-${b.slotId.replace(':', '')}@mulakat`,
      `DTSTAMP:${icsDate(new Date().toISOString())}`,
      `DTSTART:${icsDate(b.startsAt)}`,
      `DTEND:${icsDate(b.endsAt)}`,
      `SUMMARY:${icsText(state.config.title)}`,
      `DESCRIPTION:${icsText(`${state.config.clubName} üye mülakatı (${state.config.slotMinutes} dakika).`)}`,
      state.config.location ? `LOCATION:${icsText(state.config.location)}` : '',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Mülakatınız 15 dakika sonra başlıyor',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].filter(Boolean);
    const blob = new Blob([`${lines.join('\r\n')}\r\n`], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mulakat-randevusu.ics';
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ---------- Başlangıç ----------

  async function loadMyBooking() {
    const token = tokenStore.get();
    if (!token) return;
    try {
      const data = await api('/api/bookings/me', { headers: { 'X-Booking-Token': token } });
      state.myBooking = data.booking;
    } catch (err) {
      if (err.status === 404) tokenStore.clear(); // randevu iptal edilmiş
    }
  }

  async function init() {
    $('#slotGroups').addEventListener('click', onSlotClick);
    $('#bookingForm').addEventListener('submit', onSubmit);
    $('#icsDownload').addEventListener('click', downloadIcs);

    try {
      state.config = await api('/api/config');
      applyConfig(state.config);
    } catch (err) {
      toast(err.message);
    }

    await loadMyBooking();
    await refreshSlots({ silent: false });

    setInterval(() => {
      if (document.visibilityState === 'visible') refreshSlots();
    }, REFRESH_MS);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') refreshSlots();
    });
  }

  init();
})();
