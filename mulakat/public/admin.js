(() => {
  'use strict';

  const PASSWORD_KEY = 'mulakat.adminPassword';
  const REFRESH_MS = 20000;
  const $ = (sel) => document.querySelector(sel);

  let password = null;
  let refreshTimer = null;

  const session = {
    get() { try { return sessionStorage.getItem(PASSWORD_KEY); } catch { return null; } },
    set(v) { try { sessionStorage.setItem(PASSWORD_KEY, v); } catch { /* yoksay */ } },
    clear() { try { sessionStorage.removeItem(PASSWORD_KEY); } catch { /* yoksay */ } },
  };

  let toastTimer;
  function toast(message, kind = 'error') {
    const el = $('#toast');
    el.textContent = message;
    el.className = `toast${kind === 'ok' ? ' toast--ok' : ''}`;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 5000);
  }

  async function request(path, options = {}) {
    let res;
    try {
      res = await fetch(path, { ...options, cache: 'no-store', headers: { Authorization: `Bearer ${password}`, ...(options.headers || {}) } });
    } catch {
      throw Object.assign(new Error('Sunucuya ulaşılamadı.'), { status: 0 });
    }
    if (!res.ok) {
      let data = null;
      try { data = await res.json(); } catch { /* boş yanıt */ }
      throw Object.assign(new Error((data && data.message) || 'İşlem başarısız oldu.'), { status: res.status });
    }
    return res;
  }

  function cell(text, className, label) {
    const td = document.createElement('td');
    if (className) td.className = className;
    if (label) td.dataset.label = label; // telefonda kart görünümünde başlık olarak gösterilir
    td.textContent = text;
    return td;
  }

  const STATUS = {
    booked: ['Dolu', 'badge--booked'],
    available: ['Boş', 'badge--available'],
    closed: ['Süresi geçti', 'badge--closed'],
  };

  function render(data) {
    const { slots, config } = data;
    const booked = slots.filter((s) => s.booking).length;
    const free = slots.filter((s) => s.status === 'available').length;

    $('#clubName').textContent = config.clubName;
    document.title = `${config.title} · Yönetim`;
    const date = config.interviewDate
      ? new Intl.DateTimeFormat('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${config.interviewDate}T12:00:00`))
      : 'Tarih belirtilmedi';
    $('#dashSub').textContent = `${date} · ${config.startTime} – ${config.endTime} · ${config.slotMinutes} dakikalık görüşmeler`;

    $('#statTotal').textContent = String(slots.length);
    $('#statBooked').textContent = String(booked);
    $('#statFree').textContent = String(free);
    $('#statFill').textContent = `%${slots.length ? Math.round((booked / slots.length) * 100) : 0}`;

    const rows = slots.map((slot) => {
      const tr = document.createElement('tr');
      tr.className = slot.booking ? 'row--booked' : 'row--empty';
      tr.append(cell(`${slot.start} – ${slot.end}`, 'time'));

      const statusTd = document.createElement('td');
      statusTd.className = 'status';
      const [label, cls] = STATUS[slot.status];
      const badge = document.createElement('span');
      badge.className = `badge ${cls}`;
      badge.textContent = label;
      statusTd.append(badge);
      tr.append(statusTd);

      const b = slot.booking;
      if (b) {
        const created = new Date(b.createdAt).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
        tr.append(
          cell(b.fullName, 'name', 'Ad Soyad'),
          cell(b.email, '', 'E-posta'),
          cell(b.phone, 'nowrap', 'Telefon'),
          cell(b.department || '—', b.department ? '' : 'muted', 'Bölüm / Sınıf'),
          cell(created, 'muted nowrap', 'Kayıt'),
        );
        const actionTd = document.createElement('td');
        actionTd.className = 'action';
        const cancel = document.createElement('button');
        cancel.type = 'button';
        cancel.className = 'link-button';
        cancel.textContent = 'Randevuyu iptal et';
        cancel.addEventListener('click', () => cancelBooking(slot, b, cancel));
        actionTd.append(cancel);
        tr.append(actionTd);
      } else {
        tr.append(cell('—', 'muted empty'), cell('', 'empty'), cell('', 'empty'), cell('', 'empty'), cell('', 'empty'), cell('', 'empty'));
      }
      return tr;
    });
    $('#rows').replaceChildren(...rows);
    $('#lastUpdated').textContent = `Son güncelleme: ${new Date().toLocaleTimeString('tr-TR')} · Liste her 20 saniyede bir yenilenir.`;
  }

  async function load({ fromLogin = false } = {}) {
    try {
      const res = await request('/api/admin/bookings');
      render(await res.json());
      $('#loginView').hidden = true;
      $('#dashboard').hidden = false;
      if (!refreshTimer) refreshTimer = setInterval(() => load(), REFRESH_MS);
      return true;
    } catch (err) {
      if (err.status === 401 || err.status === 429 || err.status === 503) {
        logout();
        $('#loginError').textContent = err.message;
      } else if (!fromLogin) {
        toast(err.message);
      } else {
        $('#loginError').textContent = err.message;
      }
      return false;
    }
  }

  async function cancelBooking(slot, booking, button) {
    const ok = window.confirm(`${slot.start} saatindeki ${booking.fullName} randevusu iptal edilsin mi?\n\nBu saat tekrar seçime açılır ve aday yeniden randevu alabilir.`);
    if (!ok) return;
    button.disabled = true;
    button.textContent = 'İptal ediliyor…';
    try {
      await request(`/api/admin/bookings/${encodeURIComponent(slot.id)}`, { method: 'DELETE' });
      toast(`${slot.start} randevusu iptal edildi; saat tekrar seçime açıldı.`, 'ok');
    } catch (err) {
      toast(err.message);
    }
    load();
  }

  async function downloadCsv() {
    try {
      const res = await request('/api/admin/bookings.csv');
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mulakat-randevulari.csv';
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      toast(err.message);
    }
  }

  function logout() {
    password = null;
    session.clear();
    clearInterval(refreshTimer);
    refreshTimer = null;
    $('#dashboard').hidden = true;
    $('#loginView').hidden = false;
  }

  $('#loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    $('#loginError').textContent = '';
    password = $('#password').value;
    if (!password) {
      $('#loginError').textContent = 'Lütfen şifreyi girin.';
      return;
    }
    if (await load({ fromLogin: true })) {
      session.set(password);
      $('#password').value = '';
    }
  });
  $('#refreshButton').addEventListener('click', () => load());
  $('#csvButton').addEventListener('click', downloadCsv);
  $('#logoutButton').addEventListener('click', logout);

  const saved = session.get();
  if (saved) {
    password = saved;
    load();
  }
})();
