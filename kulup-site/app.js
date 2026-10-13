
"use strict";
/* =========================================================
   ESOGÜ Otomotiv Kulübü · yönetim sitesi
   Veri: Firebase Firestore (veri.js). Koleksiyonlar:
     kisiler/<id>      ekip üyeleri
     gorevler/<id>     görevlendirmeler (sorumlu, atayan)
     etkinlikler/<id>  kulüp takvimi
     dosyalar/<id>     tablolar: kolonlar[] + satirlar{} (hücre düzeyinde birleştirme)
     belgeler/<id>     Drive ve diğer linkler
     musaitlik/<kisiId>  haftalık müsaitlik ızgarası
     hareketler/<id>   son değişiklikler
     ayarlar/yetkililer  düzenleyebilen e-postalar (yalnızca yetkililer okur)
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const trl = s => String(s ?? "").toLocaleLowerCase("tr");
const rnd = () => Math.random().toString(36).slice(2, 7);
const newId = p => p + Date.now().toString(36) + rnd();
const nowISO = () => new Date().toISOString();
const clone = o => o === undefined ? undefined : JSON.parse(JSON.stringify(o));
const isObj = x => x !== null && typeof x === "object" && !Array.isArray(x);
const pad = n => String(n).padStart(2, "0");
function deepMerge(a, b) {
  if (!isObj(a) || !isObj(b)) return clone(b);
  const o = { ...a };
  for (const k in b) o[k] = isObj(b[k]) && isObj(a[k]) ? deepMerge(a[k], b[k]) : clone(b[k]);
  return o;
}
function slug(s) {
  return trl(s).replace(/[çğıöşü]/g, c => ({ ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u" }[c]))
    .normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 36) || "dosya";
}

/* ---------- sabitler ---------- */
// Dört kurucu departman sabittir (kimlikleri kişi ve görev kayıtlarında kullanılır).
// Yönetim kurulunun açtığı yeni birimler veritabanındaki birimler koleksiyonundan gelir.
const SABIT_BIRIMLER = [
  { id: "kurumsal", no: "01", ad: "Kurumsal İlişkiler", k: "k1" },
  { id: "iletisim", no: "02", ad: "İletişim ve Sosyal Medya", k: "k2" },
  { id: "organizasyon", no: "03", ad: "Organizasyon", k: "k3" },
  { id: "erasmus", no: "04", ad: "Erasmus+", k: "k4" },
];
let DEPTS = SABIT_BIRIMLER.slice();
let DEP = Object.fromEntries(DEPTS.map(d => [d.id, d]));
const SEVIYE = { baskan: "Departman Başkanı", yardimci: "Başkan Yardımcısı", ekip: "Ekip üyesi" };
const SEVORD = { baskan: 0, yardimci: 1, ekip: 2 };
const TURLER = [["metin", "Metin"], ["uzun", "Uzun not"], ["tik", "Onay kutusu"], ["tarih", "Tarih"], ["sayi", "Sayı"], ["secim", "Seçim listesi"], ["kisi", "Ekipten kişi"], ["link", "Link"], ["belge", "Belge"]];
const TURAD = Object.fromEntries(TURLER);
const GENISLIK = { metin: 180, uzun: 280, tik: 104, tarih: 128, sayi: 104, para: 126, secim: 160, kisi: 170, link: 180, belge: 180 };
const GUNLER = [["pzt", "Pzt", "Pazartesi"], ["sal", "Sal", "Salı"], ["car", "Çar", "Çarşamba"], ["per", "Per", "Perşembe"], ["cum", "Cum", "Cuma"], ["cmt", "Cmt", "Cumartesi"], ["paz", "Paz", "Pazar"]];
const SAAT0 = 8, SAATN = 14; // 08:00–22:00, saatlik
const hh = s => pad(SAAT0 + s) + ":00";
const GDURUM = [["yapilacak", "Yapılacak"], ["devam", "Devam ediyor"], ["bitti", "Bitti"]];
const ONCELIK = { yuksek: "Yüksek", orta: "Orta", dusuk: "Düşük" };
const TONLAR = [
  [/reddetti|reddedildi|^ret$|iptal|olumsuz|uygun değil|arızalı|kayıp/, "bad"],
  [/anlaşıldı|gerçekleşti|onaylandı|yayınlandı|tamamlandı|^tamam$|^kabul|teslim edildi|konuştu|olumlu|sağlam|seçildi|bitti/, "ok"],
  [/bekl|teklif|imzada|revize|hazırlanıyor|planlanıyor|çalışılıyor|ödünç|inceleniyor/, "warn"],
  [/görüşüldü|iletişime geçildi|planlandı|duyuruldu|davet edildi|gönderildi|başvuruldu|ortak etkinlik|devam/, "info"],
];
const TONRENK = { ok: "var(--ok)", warn: "var(--warn)", bad: "var(--bad)", info: "var(--info)", neu: "var(--faint)" };

/* ---------- durum ---------- */
const S = {
  db: null, auth: null, kullanici: null, uid: null, sahip: false, sahipEposta: "", yetkililer: null, hata: "", gecmisHepsi: false, jsonYedek: null,
  canWrite: null, readOnly: false, noDb: false, booted: false, uploading: 0,
  kisiler: new Map(), dosyalar: new Map(), gorevler: new Map(), belgeler: new Map(), musaitlik: new Map(), etkinlikler: new Map(), birimler: new Map(), hareketler: [], depo: null, yuklenen: null,
  loaded: {}, subErr: null,
  view: "genel", dosyaId: null,
  deptTab: {}, drafts: {}, dFiltre: {}, bitenAcik: {},
  sh: yeniSh(null),
  m: { tab: "ozet", grup: "hepsi", slot: null, kisi: null, firca: "m", painting: null },
  imp: null, pending: false,
};
function yeniSh(id) { return { id, q: "", f: "", sort: null, sel: null, editing: null, rows: [], cols: [] }; }
const editable = () => !!S.db && S.canWrite === true && !S.readOnly;
const kisi = id => S.kisiler.get(id);
const curDosya = () => S.dosyalar.get(S.dosyaId);

/* ---------- biçimlendirme ---------- */
const NF = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 2 });
const fmtTL = v => (v === "" || v == null || isNaN(v)) ? "" : "₺" + NF.format(v);
const fmtNum = v => (v === "" || v == null || isNaN(v)) ? "" : NF.format(v);
function bugun() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function tarihParca(iso) { const m = String(iso || "").match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
function gunFark(iso) { const t = tarihParca(iso); if (!t) return null; const n = new Date(); n.setHours(0, 0, 0, 0); return Math.round((t - n) / 864e5); }
function fmtTarih(iso, yil) {
  const t = tarihParca(iso); if (!t) return esc(iso || "");
  const o = { day: "numeric", month: "short" }; if (yil || t.getFullYear() !== new Date().getFullYear()) o.year = "numeric";
  return t.toLocaleDateString("tr-TR", o);
}
function gunEtiketi(iso) {
  const f = gunFark(iso); if (f == null) return "";
  if (f === 0) return "Bugün"; if (f === 1) return "Yarın"; if (f === -1) return "Dün";
  return fmtTarih(iso);
}
function goreli(iso) {
  if (!iso) return ""; const t = new Date(iso); if (isNaN(t)) return "";
  const s = (Date.now() - t) / 1000;
  if (s < 60) return "az önce"; if (s < 3600) return Math.floor(s / 60) + " dk önce";
  if (s < 86400) return Math.floor(s / 3600) + " sa önce"; if (s < 172800) return "dün";
  if (s < 604800) return Math.floor(s / 86400) + " gün önce";
  return t.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}
function sayiOku(v) {
  if (typeof v === "number") return v;
  let s = String(v ?? "").trim().replace(/[₺\s]/g, "").replace(/(tl|try)$/i, ""); if (!s) return "";
  if (/,\d{1,2}$/.test(s)) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  else s = s.replace(/,/g, ".");
  const n = Number(s); return isNaN(n) ? "" : n;
}
function tikOku(v) { if (typeof v === "boolean") return v; const s = trl(v).trim(); return ["✓", "✔", "☑", "x", "evet", "true", "doğru", "1", "var", "tamam", "+", "yes", "ok"].includes(s); }
function tarihOku(v) {
  if (v instanceof Date && !isNaN(v)) return `${v.getFullYear()}-${pad(v.getMonth() + 1)}-${pad(v.getDate())}`;
  const s = String(v ?? "").trim(); let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${pad(m[2])}-${pad(m[3])}`;
  m = s.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/);
  if (m) { let y = +m[3]; if (y < 100) y += 2000; return `${y}-${pad(m[2])}-${pad(m[1])}`; }
  return s;
}
function kisiBul(v) { const s = trl(v).trim(); if (!s) return ""; if (S.kisiler.has(v)) return v; for (const [id, k] of S.kisiler) if (trl(k.ad) === s) return id; for (const [id, k] of S.kisiler) if (trl(k.ad).startsWith(s)) return id; return ""; }
function deger(col, raw) {
  switch (col.tur) {
    case "tik": return tikOku(raw);
    case "sayi": case "para": return sayiOku(raw);
    case "tarih": return tarihOku(raw);
    case "kisi": return kisiBul(raw);
    case "belge": return S.belgeler.has(raw) ? raw : "";
    default: return raw instanceof Date ? tarihOku(raw) : String(raw ?? "").trim();
  }
}
function displayText(col, v) {
  if (!col) return "";
  switch (col.tur) {
    case "tik": return v ? "✓" : "";
    case "para": return fmtTL(v);
    case "sayi": return fmtNum(v);
    case "kisi": return v ? (kisi(v)?.ad || "") : "";
    case "belge": return v ? (S.belgeler.get(v)?.ad || "") : "";
    default: return String(v ?? "");
  }
}
function ton(v) { const s = trl(v).trim(); for (const [re, t] of TONLAR) if (re.test(s)) return t; return "neu"; }
const pill = v => v ? `<span class="pill ${ton(v)}">${esc(v)}</span>` : "";
function safeUrl(u) {
  u = String(u || "").trim(); if (!u) return "";
  if (/^https?:\/\//i.test(u)) return u;
  if (/^[\w-]+(\.[\w-]+)+([/?#].*)?$/i.test(u)) return "https://" + u;
  return "";
}
function host(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } }
function chip(kid) {
  if (!kid) return ""; const k = kisi(kid);
  if (!k) return `<span class="chip faint">(silinmiş kişi)</span>`;
  return `<span class="chip"><i class="dot" style="background:var(--${DEP[k.departman]?.k || "faint"})"></i>${esc(k.ad)}</span>`;
}
function belgeHref(b) { return b.tur === "link" ? safeUrl(b.url) : String(b.url || ""); }
function cellHTML(col, v) {
  if (v === undefined || v === null || v === "") { return col.tur === "tik" ? `<span class="tick"></span>` : ""; }
  switch (col.tur) {
    case "tik": return `<span class="tick${v ? " on" : ""}"></span>`;
    case "para": return esc(fmtTL(v));
    case "sayi": return esc(fmtNum(v));
    case "tarih": { const f = gunFark(v); return `<span${f != null && f < 0 && col.gecikme ? ' class="late"' : ""}>${esc(fmtTarih(v))}</span>`; }
    case "secim": return pill(v);
    case "kisi": return chip(v);
    case "link": { const u = safeUrl(v); return u ? `<a class="cell-link" href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(host(u))} ↗</a>` : esc(v); }
    case "belge": { const b = S.belgeler.get(v); if (!b) return `<span class="faint">(silinmiş belge)</span>`; const h = belgeHref(b); return h ? `<a class="cell-link" href="${esc(h)}" target="_blank" rel="noopener noreferrer">${esc(b.ad)} ↗</a>` : esc(b.ad); }
    default: return esc(String(v).split("\n")[0]);
  }
}

/* ---------- veri yazma ---------- */
async function yaz(fn) {
  try { await fn(); return true; }
  catch (e) {
    const c = e && e.code;
    if (c === "izin") { S.readOnly = true; toast(S.kullanici ? "Bu işlem için yetkin yok. Site sahibi seni yetkili listesinden çıkarmış olabilir; sayfayı yenile." : "Değişiklik yapmak için Google ile giriş yap."); schedule(); }
    else if (c === "invalid_argument") toast("Kaydedilemedi. Tablo 1 MB sınırını aşmış olabilir; eski satırları yeni bir tabloya taşıyın.");
    else if (c === "unavailable") {
      await new Promise(r => setTimeout(r, 400 + Math.random() * 700));
      try { await fn(); return true; } catch { toast("Bağlantı sorunu, değişiklik kaydedilemedi. İnternetini kontrol edip tekrar dene."); }
    } else if (c === "resource_exhausted") toast("Günlük ücretsiz kullanım sınırına ulaşıldı ya da çok hızlı yazılıyor. Biraz sonra tekrar dene.");
    else toast("Kaydedilemedi: " + (e && e.message || e));
    return false;
  }
}
const Q = new Map();
function enqueue(path, op, data) {
  let q = Q.get(path); if (!q) { q = { ops: [], busy: false }; Q.set(path, q); }
  const last = q.ops[q.ops.length - 1];
  if (op === "update" && last && last.op !== "delete") last.data = deepMerge(last.data, data);
  else if (op !== "update") q.ops = [{ op, data }];
  else q.ops.push({ op, data });
  if (!q.busy) drain(path, q);
}
async function drain(path, q) {
  q.busy = true;
  while (q.ops.length) {
    const { op, data } = q.ops.shift(); const ref = S.db.doc(path);
    const ok = await yaz(() => op === "set" ? ref.set(data) : op === "delete" ? ref.delete() : ref.update(data));
    if (!ok) {
      q.ops = []; const [col, id] = path.split("/");
      try { const s = await ref.get(); if (s.exists) S[col].set(id, s.data()); else S[col].delete(id); } catch { }
      schedule();
    }
  }
  q.busy = false;
}
function localApply(col, id, op, data) {
  const m = S[col];
  if (op === "delete") m.delete(id);
  else if (op === "set") m.set(id, clone(data));
  else m.set(id, deepMerge(clone(m.get(id) || {}), data));
}
function write(col, id, op, data) {
  if (!S.db) return;
  localApply(col, id, op, data); enqueue(`${col}/${id}`, op, data); schedule();
}
function reapplyPending(col, m) {
  for (const [path, q] of Q) {
    if (!path.startsWith(col + "/") || !q.ops.length) continue;
    const id = path.slice(col.length + 1); let base = clone(m.get(id));
    for (const o of q.ops) base = o.op === "set" ? clone(o.data) : o.op === "delete" ? undefined : deepMerge(base || {}, o.data);
    if (base === undefined) m.delete(id); else m.set(id, base);
  }
}
function patchDosya(id, p) { write("dosyalar", id, "update", { ...p, guncelleme: nowISO(), guncelleyen: S.uid || "" }); }

const logMem = {};
function logla(key, metin, dep) {
  if (!S.db || !editable()) return;
  const t = Date.now(); let m = logMem[key];
  if (!m || t - m.t > 6e5) { m = logMem[key] = { id: "h" + t.toString(36) + rnd(), t }; }
  m.t = t; m.body = { zaman: new Date(t).toISOString(), kim: S.uid || "", kimAd: S.kullanici?.ad || "", metin, departman: dep || "" };
  clearTimeout(m.timer);
  m.timer = setTimeout(() => { S.db.doc("hareketler/" + m.id).set(m.body).catch(() => { }); }, 1500);
}

/* ---------- açılış ---------- */
function subCol(name) {
  S.db.collection(name).onSnapshot(snap => {
    const m = new Map(); for (const d of snap.docs) if (d.exists) m.set(d.id, d.data());
    reapplyPending(name, m);
    S[name] = m; S.loaded[name] = true; schedule();
  }, e => { S.subErr = e && e.code; schedule(); });
}
async function init() {
  let ad;
  try { ad = window.KULUP_ADAPTOR || await (await import("./veri.js")).baglan(); }
  catch (e) { console.error(e); S.noDb = true; S.booted = true; S.hata = String(e && e.message || e); render(); return; }
  S.db = ad.db; S.auth = ad.auth; S.depo = ad.depo || null; S.booted = true;
  ["kisiler", "dosyalar", "gorevler", "belgeler", "musaitlik", "etkinlikler", "birimler"].forEach(subCol);
  S.db.collection("hareketler").orderBy("zaman", "desc").limit(40).onSnapshot(s => {
    S.hareketler = s.docs.filter(d => d.exists).map(d => ({ id: d.id, ...d.data() })); S.loaded.hareketler = true; schedule();
  }, () => { });
  S.auth.izle(async u => {
    S.kullanici = u; S.uid = u ? u.uid : null;
    S.canWrite = false; S.sahip = false; S.sahipEposta = ""; S.yetkililer = null; S.readOnly = false;
    if (u) await yetkiKontrol();
    render();
  });
  render();
}
async function yetkiKontrol() {
  // Kurallar ayarlar/yetkililer belgesini yalnızca yetkililere okutur; okunabiliyorsa düzenleme açıktır.
  const ref = S.db.doc("ayarlar/yetkililer");
  try {
    const s = await ref.get();
    S.canWrite = true;
    if (s.exists) { const d = s.data(); S.sahipEposta = String(d.sahip || "").toLowerCase(); S.yetkililer = d.emails || []; S.sahip = S.sahipEposta === S.kullanici.eposta; }
    else { // belge yoksa onu yalnızca site sahibi okuyabilir: ilk girişte listeyi oluştur
      S.sahip = true; S.sahipEposta = S.kullanici.eposta; S.yetkililer = [];
      await yaz(() => ref.set({ sahip: S.sahipEposta, emails: [] }));
    }
  } catch { S.canWrite = false; }
}

/* ---------- yönlendirme ve çizim ---------- */
const main = $("#main");
function hashOku() {
  const h = decodeURIComponent(location.hash.slice(1) || "");
  if (h.startsWith("d-")) { S.view = "dosya"; S.dosyaId = h.slice(2); S.sh = yeniSh(S.dosyaId); }
  else if (h) S.view = h; // bilinmeyen adres (henüz yüklenmemiş birim) yüklenene kadar genel bakışı gösterir
}
function go(v) {
  if (S.sh.editing) commitEdit();
  if (v.startsWith("d-")) { const id = v.slice(2); if (S.sh.id !== id) S.sh = yeniSh(id); S.view = "dosya"; S.dosyaId = id; }
  else { S.view = v; S.dosyaId = null; }
  try { history.replaceState(null, "", "#" + v); } catch { }
  closeModal(); render(); window.scrollTo({ top: 0 });
}
let rTimer = 0;
function schedule() { if (rTimer) return; rTimer = setTimeout(() => { rTimer = 0; render(); }, 30); }
function render() {
  birimleriKur(); renderNav(); renderMe();
  if (S.sh.editing || S.m.painting) { S.pending = true; return; }
  S.pending = false;
  const a = document.activeElement; let keep = null;
  if (a && a.id && main.contains(a)) keep = { id: a.id, v: a.value, s: a.selectionStart, e: a.selectionEnd };
  const g = $("#grid"); const gs = g ? [g.scrollTop, g.scrollLeft] : null;
  let html;
  try {
    switch (S.view) {
      case "genel": html = vGenel(); break;
      case "musaitlik": html = vMusait(); break;
      case "ekip": html = vEkip(); break;
      case "etkinlikler": html = vEtkinlik(); break;
      case "yetkililer": html = vYetki(); break;
      case "dosya": html = vDosya(); break;
      default: html = DEP[S.view] ? vDept(DEP[S.view]) : vGenel();
    }
  } catch (e) { html = `<div class="empty"><h3>Bir şeyler ters gitti</h3><p>${esc(e.message)}</p></div>`; console.error(e); }
  main.innerHTML = `<div class="wrap">${html}</div>`;
  const g2 = $("#grid"); if (g2 && gs) { g2.scrollTop = gs[0]; g2.scrollLeft = gs[1]; }
  if (keep) {
    const el = document.getElementById(keep.id);
    if (el) { if (keep.v !== undefined && el.value !== keep.v && el.tagName !== "SELECT") el.value = keep.v; el.focus({ preventScroll: true }); try { if (keep.s != null) el.setSelectionRange(keep.s, keep.e); } catch { } }
  }
  if (S.view === "dosya") paintSel();
  fillNames(main);
}
function renderNav() {
  const open = dep => [...S.gorevler.values()].filter(g => g.departman === dep && g.durum !== "bitti").length;
  const item = (v, no, ad, color, ct, tt = "Açık görev") => `<button class="nav-i${(S.view === v || (S.view === "dosya" && curDosya()?.departman === v)) ? " on" : ""}" data-act="nav" data-v="${v}"><span class="nav-no"${color ? ` style="color:var(--${color})"` : ""}>${no}</span>${esc(ad)}${ct ? `<span class="nav-ct" title="${tt}">${ct}</span>` : ""}</button>`;
  $("#nav").innerHTML = item("genel", "—", "Genel bakış") + item("etkinlikler", "◇", "Etkinlikler", "", yaklasanEtk().length, "Yaklaşan etkinlik") +
    DEPTS.map(d => item(d.id, d.no, d.ad, d.k + "t", open(d.id))).join("") +
    (editable() ? `<button class="nav-i nav-add" data-act="birim-new"><span class="nav-no">+</span>Birim ekle</button>` : "") +
    `<div class="nav-sep"></div>` + item("musaitlik", "◷", "Müsaitlik") + item("ekip", "▤", "Yönetim şeması");
}
const LS = {
  get(k) { try { return localStorage.getItem("kulup:" + k); } catch { return null; } },
  set(k, v) { try { if (v == null) localStorage.removeItem("kulup:" + k); else localStorage.setItem("kulup:" + k, v); } catch { } },
};
function benKisi() {
  if (S.uid) for (const [id, k] of S.kisiler) if (k.hesap === S.uid) return { id, ...k };
  const yerel = LS.get("ben"); // salt okunur görüntüleyenler için seçim yalnızca bu tarayıcıda tutulur
  return yerel && kisi(yerel) ? { id: yerel, ...kisi(yerel) } : null;
}
function renderMe() {
  const ed = editable(); const ben = benKisi(); const u = S.kullanici;
  const acc = S.noDb ? `<span class="access"><i></i>Bağlantı yok</span>` : !u ? `<span class="access"><i></i>Görüntüleme modu</span>` : `<span class="access${ed ? " on" : ""}"><i></i>${ed ? (S.sahip ? "Site sahibi" : "Düzenleme açık") : "Salt okunur"}</span>`;
  const who = u ? `<div class="me-row">${u.foto ? `<img src="${esc(u.foto)}" alt="" referrerpolicy="no-referrer">` : ""}<div><b>${esc(ben?.ad || u.ad)}</b><small>${esc(u.eposta)}</small></div></div>` : "";
  $("#me").innerHTML = who + acc +
    (S.noDb ? "" : u ? `<button class="linkbtn" data-act="cikis">Çıkış yap</button>` : `<button class="btn sm" data-act="giris">Google ile giriş yap</button>`) +
    (ed ? `<button class="linkbtn" data-act="nav" data-v="yetkililer">Yetkililer</button>` : "") +
    (!ben && S.kisiler.size ? `<button class="linkbtn" data-act="ben-sec">Ekipte ben kimim?</button>` : "") +
    (S.dosyalar.size ? `<button class="linkbtn" data-act="backup">Tüm tabloları Excel'e yedekle</button>` : "") +
    `<button class="linkbtn" data-act="help">Nasıl kullanılır?</button>`;
}
function fillNames(root) {
  const els = $$("[data-uid]", root || document); if (!els.length) return;
  const m = {};
  S.kisiler.forEach(k => { if (k.hesap) m[k.hesap] = k.ad; });
  S.hareketler.forEach(h => { if (h.kim && h.kimAd && !m[h.kim]) m[h.kim] = h.kimAd; });
  for (const c of ["gorevler", "etkinlikler", "belgeler"]) S[c].forEach(x => { const u = x.olusturan || x.yukleyen, a = x.olusturanAd || x.yukleyenAd; if (u && a && !m[u]) m[u] = a; });
  if (S.kullanici && !m[S.uid]) m[S.uid] = S.kullanici.ad;
  els.forEach(e => { const u = e.dataset.uid; e.textContent = (u && m[u]) || "Bir üye"; });
}

/* ---------- ortak sorgular ---------- */
function kisilerSirali(dep) {
  const di = id => { const i = DEPTS.findIndex(d => d.id === id); return i < 0 ? 9 : i; };
  return [...S.kisiler.entries()].map(([id, k]) => ({ ...k, id })).filter(k => !dep || k.departman === dep)
    .sort((a, b) => di(a.departman) - di(b.departman) || (SEVORD[a.seviye] ?? 3) - (SEVORD[b.seviye] ?? 3) || (a.sira ?? 99) - (b.sira ?? 99) || String(a.ad).localeCompare(b.ad, "tr"));
}
function kisiOptions(sel, onceDep) {
  const all = kisilerSirali(); let h = `<option value="">—</option>`;
  const deps = onceDep && DEP[onceDep] ? [DEP[onceDep], ...DEPTS.filter(d => d.id !== onceDep)] : DEPTS;
  for (const d of deps) {
    const ps = all.filter(p => p.departman === d.id); if (!ps.length) continue;
    h += `<optgroup label="${esc(d.ad)}">${ps.map(p => `<option value="${esc(p.id)}"${p.id === sel ? " selected" : ""}>${esc(p.ad)}</option>`).join("")}</optgroup>`;
  }
  if (sel && !kisi(sel)) h += `<option value="${esc(sel)}" selected>(silinmiş kişi)</option>`;
  return h;
}
function satirlar(d) {
  const o = d?.satirlar || {}; const out = [];
  for (const k in o) { const v = o[k]; if (isObj(v)) out.push({ ...v, _id: k }); }
  return out.sort((a, b) => (a._s || 0) - (b._s || 0));
}
function dosyalarOf(dep) { return [...S.dosyalar.entries()].map(([id, d]) => ({ ...d, id })).filter(d => d.departman === dep).sort((a, b) => (a.sira ?? 99) - (b.sira ?? 99) || String(a.baslik).localeCompare(b.baslik, "tr")); }
function gorevlerOf(dep) { return [...S.gorevler.entries()].map(([id, g]) => ({ ...g, id })).filter(g => !dep || g.departman === dep); }
const sum = a => a.reduce((s, x) => s + (Number(x) || 0), 0);
const ORD = { yuksek: 0, orta: 1, dusuk: 2 };
const DORD = { devam: 0, yapilacak: 1, bitti: 2 };
const acik = g => (g.durum || "yapilacak") !== "bitti";
const gecikti = g => acik(g) && !!g.son_tarih && gunFark(g.son_tarih) < 0;
const kartKey = g => (g.sorumlu && kisi(g.sorumlu)) ? g.sorumlu : "";
function gorevSirala(list) {
  return list.slice().sort((a, b) => (DORD[a.durum || "yapilacak"] ?? 1) - (DORD[b.durum || "yapilacak"] ?? 1) || (ORD[a.oncelik] ?? 1) - (ORD[b.oncelik] ?? 1) || String(a.son_tarih || "9").localeCompare(b.son_tarih || "9"));
}
function benAtadim(g, ben) { return g.atayan ? g.atayan === ben.id : (!!g.olusturan && g.olusturan === S.uid); }
function atayanHTML(g) {
  if (g.atayan && kisi(g.atayan)) return esc(kisi(g.atayan).ad);
  if (g.olusturan) return `<span data-uid="${esc(g.olusturan)}">Bir üye</span>`;
  return "";
}
function vadeHTML(g) {
  if (!g.son_tarih) return ""; const f = gunFark(g.son_tarih);
  if (acik(g) && f < 0) return `<span class="late">${-f} gün gecikti</span>`;
  return `<span>${esc(gunEtiketi(g.son_tarih))}</span>`;
}
function durumBtn(g) {
  const d = g.durum || "yapilacak"; const lbl = { yapilacak: "Yapılacak", devam: "Devam ediyor", bitti: "Bitti" }[d] || "Yapılacak";
  return editable()
    ? `<button class="dbtn d-${d}" data-act="task-step" data-id="${esc(g.id)}" title="${lbl} · tıklayınca sonraki duruma geçer" aria-label="Durum: ${lbl}. Değiştir"></button>`
    : `<span class="dbtn d-${d}" title="${lbl}"></span>`;
}
function gorevSatir(g, o = {}) {
  const meta = [];
  if (g.oncelik === "yuksek" && acik(g)) meta.push(`<span class="pill bad">Öncelikli</span>`);
  if (g.durum === "devam") meta.push(`<span class="pill warn">Devam ediyor</span>`);
  if (o.kisi) meta.push(g.sorumlu ? chip(g.sorumlu) : `<span class="faint">Atanmadı</span>`);
  if (o.dep && DEP[g.departman]) meta.push(`<span class="chip"><i class="dot" style="background:var(--${DEP[g.departman].k})"></i>${esc(DEP[g.departman].ad)}</span>`);
  const v = vadeHTML(g); if (v) meta.push(v);
  if (o.atayan !== false) { const a = atayanHTML(g); if (a) meta.push(`<span>Atayan: ${a}</span>`); }
  return `<li class="gs${acik(g) ? "" : " bitti"}">${durumBtn(g)}<button class="gs-t" data-act="task" data-id="${esc(g.id)}"><span class="tt">${esc(g.baslik)}</span>${meta.length ? `<span class="tmeta">${meta.join("")}</span>` : ""}</button></li>`;
}

/* ---------- GENEL BAKIŞ ---------- */
function vGenel() {
  const yuk = !S.booted || (S.db && !(S.loaded.kisiler && S.loaded.gorevler));
  const all = gorevlerOf(); const open = all.filter(acik); const late = open.filter(gecikti);
  const hafta = all.filter(g => !acik(g) && g.tamamlanma && Date.now() - new Date(g.tamamlanma) < 7 * 864e5);
  const stat = (lbl, val, sub, cls) => `<div class="stat ${cls || ""}"><b>${val}</b><span>${lbl}</span><small>${esc(sub || "")}</small></div>`;
  const items = yaklasan();
  return `
  ${banner()}
  <header class="hero-row"><div>
    <div class="eyebrow">ESOGÜ Otomotiv Kulübü <i>•</i> 2026–2027 dönemi</div>
    <h1 class="h-xl">Yönetim paneli</h1>
    <p class="lead">Kim ne yapıyor, kime ne atandı, hangi iş gecikti. Bütün birimler tek ekranda.</p>
  </div></header>
  <section class="stats three">
    ${stat("Açık görev", yuk ? "…" : open.length, `${open.filter(g => g.durum === "devam").length} tanesi devam ediyor`)}
    ${stat("Süresi geçen", yuk ? "…" : late.length, late.length ? "Bunlara bakılmalı" : "Gecikmiş görev yok", late.length ? "alert" : "")}
    ${stat("Son 7 günde biten", yuk ? "…" : hafta.length, "")}
  </section>
  ${gorevlerimBlok()}
  <section class="block" style="margin-top:36px"><div class="sec-h"><h2 class="h-md">Yaklaşan etkinlikler</h2><button class="linkbtn" data-act="nav" data-v="etkinlikler">Tüm etkinlikler</button></div>
    ${yaklasanEtk().length ? `<div class="etk-list">${yaklasanEtk().slice(0, 4).map(etkKart).join("")}</div>` : `<div class="panel"><p class="faint">Yaklaşan etkinlik yok.${editable() ? ` <button class="linkbtn" data-act="etk-new">Etkinlik ekle</button>` : ""}</p></div>`}</section>
  <div class="lane"></div>
  <h2 class="h-md">Kim ne yapıyor?</h2>
  <section class="dcols">${DEPTS.map(depCol).join("")}</section>
  <section class="two">
    <div class="block"><h2 class="h-md">Yaklaşan son tarihler</h2><div class="panel">${items.length ? `<ul class="rows">${items.slice(0, 14).map(g => {
      const f = gunFark(g.son_tarih);
      return `<li><span class="when${f < 0 ? " bad" : ""}">${esc(gunEtiketi(g.son_tarih))}</span><span class="what"><button data-act="task" data-id="${esc(g.id)}">${esc(g.baslik)}</button><small>${esc(kisi(g.sorumlu)?.ad || "Atanmadı")} · ${esc(DEP[g.departman]?.ad || "")}</small></span><i class="dot" style="background:var(--${DEP[g.departman]?.k || "faint"})"></i></li>`;
    }).join("")}</ul>${items.length > 14 ? `<p class="faint">ve ${items.length - 14} görev daha</p>` : ""}` : `<p class="faint">Önümüzdeki 21 günde son tarihi olan açık görev yok.</p>`}</div></div>
    <div class="block"><h2 class="h-md">Son hareketler</h2><div class="panel">${S.hareketler.length ? `<ul class="rows">${S.hareketler.slice(0, 12).map(h => `<li><span class="what"><b data-uid="${esc(h.kim || "")}">Bir üye</b> <span class="faint">·</span> ${esc(h.metin)}</span><time>${esc(goreli(h.zaman))}</time></li>`).join("")}</ul>` : `<p class="faint">Henüz kayıt yok. Görevlerde, tablolarda ve belgelerde yapılan değişiklikler burada görünür.</p>`}</div></div>
  </section>
  <section class="block" style="margin-top:40px"><h2 class="h-md">Şu an kim müsait?</h2><div class="panel">${suAn()}</div></section>`;
}
function yaklasan(gun = 21) {
  return gorevlerOf().filter(g => acik(g) && g.son_tarih && gunFark(g.son_tarih) <= gun).sort((a, b) => String(a.son_tarih).localeCompare(b.son_tarih));
}
function gorevlerimBlok() {
  const ben = benKisi();
  if (!ben) return `<div class="banner" style="margin-top:24px"><b>Sana atanan ve senin atadığın görevler</b> ekipteki yerini seçince burada görünür. <button class="linkbtn" data-act="ben-sec">Ekipteki yerimi seç</button></div>`;
  const bana = gorevSirala(gorevlerOf().filter(g => g.sorumlu === ben.id && acik(g)));
  const benim = gorevSirala(gorevlerOf().filter(g => benAtadim(g, ben) && acik(g)));
  return `<section class="two" style="margin-top:28px">
    <div class="block"><h2 class="h-md">Bana atanan <span class="faint">${bana.length}</span></h2><div class="panel">${bana.length ? `<ul class="gl flush">${bana.map(g => gorevSatir(g, { dep: true })).join("")}</ul>` : `<p class="faint">Sana atanmış açık görev yok.</p>`}</div></div>
    <div class="block"><h2 class="h-md">Benim atadıklarım <span class="faint">${benim.length}</span></h2><div class="panel">${benim.length ? `<ul class="gl flush">${benim.map(g => gorevSatir(g, { dep: true, kisi: true, atayan: false })).join("")}</ul>` : `<p class="faint">Senin atadığın açık görev yok.</p>`}</div></div>
  </section>`;
}
function banner() {
  if (S.noDb && S.booted) return `<div class="banner"><b>Site veritabanına bağlanamadı.</b> ${/firebase-config/.test(S.hata) ? "Kurulum tamamlanmamış: firebase-config.js dosyası doldurulmalı." : "İnternet bağlantını kontrol edip sayfayı yenile."}</div>`;
  if (S.kullanici && S.canWrite === false) return `<div class="banner"><b>${esc(S.kullanici.eposta)}</b> hesabı yetkili listesinde değil. Siteyi görüntüleyebilirsin; değişiklik yapmak için site sahibinden eklenmeyi iste.</div>`;
  if (S.subErr === "revoked") return `<div class="banner"><b>Erişim değişti.</b> Güncel veriler için sayfayı yenileyin.</div>`;
  if (S.readOnly) return `<div class="banner"><b>Salt okunur görünüm.</b> Değişiklik yapma yetkin kaldırılmış olabilir; sayfayı yenile.</div>`;
  return "";
}
function depCol(d) {
  const ps = kisilerSirali(d.id); const yuk = !S.booted || (S.db && !S.loaded.kisiler);
  const open = gorevlerOf(d.id).filter(acik).length;
  return `<div class="dcol" style="--dc:var(--${d.k});--dct:var(--${d.k}t)">
    <div class="dcol-top"><span class="dno">${d.no}</span><span class="mini-lbl">${open} açık görev</span></div>
    <h3><button class="dlink" data-act="nav" data-v="${d.id}">${esc(d.ad)}</button></h3>
    <ul class="who">${ps.map(p => {
      const gs = gorevSirala(gorevlerOf().filter(g => g.sorumlu === p.id && acik(g))); const g0 = gs[0]; const late = gs.filter(gecikti).length;
      return `<li class="${p.seviye === "baskan" ? "baskan" : ""}"><button data-act="kisi" data-id="${esc(p.id)}">
        <span class="w-r">${esc(p.rol || SEVIYE[p.seviye] || "")}</span>
        <span class="w-n">${esc(p.ad)}${gs.length ? `<b title="Açık görev">${gs.length}</b>` : ""}</span>
        <span class="w-t">${g0 ? `${g0.durum === "devam" ? "Üzerinde: " : "Sırada: "}${esc(g0.baslik)}` : "Açık görevi yok"}</span>
        ${late ? `<span class="w-l">${late} gecikmiş görev</span>` : ""}
      </button></li>`;
    }).join("") || `<li class="faint">${yuk ? "Yükleniyor…" : "Henüz kimse yok."}</li>`}</ul>
  </div>`;
}
function simdi() { const n = new Date(); return { day: (n.getDay() + 6) % 7, slot: n.getHours() - SAAT0, saat: `${pad(n.getHours())}:${pad(n.getMinutes())}` }; }
function suAn() {
  const ps = kisilerSirali().filter(p => mVar(p.id));
  if (!ps.length) return `<p class="faint">Müsaitlik bilgileri henüz girilmedi. Girildiğinde o anda boş olanlar burada listelenir.</p>`;
  const n = simdi();
  if (n.slot < 0 || n.slot >= SAATN) return `<p class="faint">Şu an ${n.saat}. Müsaitlik çizelgesi 08:00–22:00 arasını kapsıyor.</p>`;
  const by = { m: [], d: [], x: [] };
  ps.forEach(p => { const c = mgrid(p.id)[n.day][n.slot]; if (by[c]) by[c].push(p.id); });
  const list = (ids, bos) => ids.length ? `<div class="chips">${ids.map(id => `<button class="pchip" data-act="kisi" data-id="${esc(id)}">${chip(id)}</button>`).join("")}</div>` : `<p class="faint">${bos}</p>`;
  return `<p class="mini-lbl">${GUNLER[n.day][2]} ${hh(n.slot)}–${hh(n.slot + 1)} · müsait (${by.m.length})</p>${list(by.m, "Bu saatte müsait görünen kimse yok.")}
    <p class="mini-lbl" style="margin-top:16px">Derste (${by.d.length})</p>${list(by.d, "Bu saatte derste olan yok.")}`;
}

/* ---------- DEPARTMAN ---------- */
function vDept(d) {
  const tab = S.deptTab[d.id] || "ekip";
  const files = dosyalarOf(d.id), tasks = gorevlerOf(d.id), docs = belgelerOf(d.id, "belgeler"), ekler = belgelerOf(d.id, "tablolar");
  const ps = kisilerSirali(d.id);
  const openN = tasks.filter(acik).length, lateN = tasks.filter(gecikti).length;
  const t = (k, ad, n) => `<button class="tab${tab === k ? " on" : ""}" data-act="dtab" data-dep="${d.id}" data-tab="${k}">${ad}<b>${n}</b></button>`;
  let body;
  if (S.db && !(S.loaded.kisiler && S.loaded.gorevler && S.loaded.dosyalar)) body = `<p class="loading">Yükleniyor…</p>`;
  else body = tab === "tablolar" ? tDosyalar(d, files, ekler) : tab === "belgeler" ? tBelgeler(d, docs) : tEkip(d);
  return `<div style="--dc:var(--${d.k});--dct:var(--${d.k}t)">
  ${banner()}
  <header class="dhero">
    <div class="dcol-top" style="justify-content:flex-start;gap:14px"><span class="dno">${d.no}</span><span class="eyebrow">${d.ozel ? "Birim" : "Departman"}</span>${d.ozel && editable() ? `<button class="btn ghost sm" data-act="birim-ayar" data-id="${esc(d.id)}" style="margin-left:auto">Birim ayarları</button>` : ""}</div>
    <h1 class="h-xl">${esc(d.ad)}</h1>
    <div class="dhero-bar"></div>
    <p class="lead">${ps.length} kişi · ${openN} açık görev${lateN ? ` · <span class="late">${lateN} gecikmiş</span>` : ""} · ${files.length} tablo${ekler.length ? ` · ${ekler.length} ek` : ""} · ${docs.length} belge</p>
  </header>
  <nav class="tabs" aria-label="Departman bölümleri">${t("ekip", "Ekip ve görevler", openN)}${t("tablolar", "Tablolar", files.length + ekler.length)}${t("belgeler", "Belgeler", docs.length)}</nav>
  ${body}</div>`;
}
function tEkip(d) {
  const f = S.dFiltre[d.id] || "hepsi"; const ben = benKisi(); const ed = editable();
  let tasks = gorevlerOf(d.id);
  if (f === "bana") tasks = ben ? tasks.filter(g => g.sorumlu === ben.id) : [];
  if (f === "benim") tasks = ben ? tasks.filter(g => benAtadim(g, ben)) : [];
  const uyeler = kisilerSirali(d.id); const ids = new Set(uyeler.map(p => p.id));
  const disari = kisilerSirali().filter(p => !ids.has(p.id) && tasks.some(g => g.sorumlu === p.id));
  let kartlar = [...uyeler, ...disari];
  if (tasks.some(g => !kartKey(g))) kartlar.push({ id: "", ad: "Atanmamış görevler", rol: "Sorumlusu seçilmedi" });
  if (f.startsWith("k:")) kartlar = kartlar.filter(p => p.id === f.slice(2));
  else if (f === "bana" || f === "benim") kartlar = kartlar.filter(p => tasks.some(g => kartKey(g) === p.id));
  const c = (v, ad) => `<button class="gchip${f === v ? " on" : ""}" data-act="dfiltre" data-dep="${d.id}" data-f="${esc(v)}">${ad}</button>`;
  const filtre = `<div class="gchips">${c("hepsi", "Herkes")}${ben ? c("bana", "Bana atanan") + c("benim", "Benim atadıklarım") : ""}${uyeler.map(p => c("k:" + p.id, esc(p.ad))).join("")}</div>`;
  const ust = `<div class="toolbar">${ed ? `<button class="btn" data-act="task-new" data-dep="${d.id}">+ Görev ata</button>` : ""}${!ben && S.kisiler.size ? `<span class="faint">Bana atanan ve benim atadıklarım görünümleri için</span><button class="linkbtn" data-act="ben-sec">ekipteki yerini seç</button>` : ""}</div>`;
  let govde;
  if (!kartlar.length) govde = `<div class="empty"><h3>${f === "bana" ? "Bu departmanda sana atanmış görev yok" : f === "benim" ? "Bu departmanda senin atadığın görev yok" : "Bu departmanda henüz kimse yok"}</h3><p>${ed && f === "hepsi" ? "Yönetim şeması sayfasından kişi ekleyebilirsiniz." : ""}</p></div>`;
  else govde = `<div class="pcards">${kartlar.map(p => kisiKart(p, tasks.filter(g => kartKey(g) === p.id), d)).join("")}</div>`;
  return ust + filtre + govde;
}
function kisiKart(p, tasks, d) {
  const ed = editable(); const acikG = gorevSirala(tasks.filter(acik));
  const biten = tasks.filter(g => !acik(g)).sort((a, b) => String(b.tamamlanma || "").localeCompare(a.tamamlanma || ""));
  const late = acikG.filter(gecikti).length; const key = d.id + ":" + p.id;
  const goster = S.bitenAcik[key] ? biten.slice(0, 12) : [];
  const rol = (p.rol || SEVIYE[p.seviye] || "") + (p.departman && p.departman !== d.id ? " · " + (DEP[p.departman]?.ad || "") : "");
  const bas = `<span class="ol">${esc(rol)}</span><span class="on">${esc(p.ad)}</span><span class="pc-c">${acikG.length ? `${acikG.length} açık görev` : "Açık görevi yok"}${late ? ` · <em>${late} gecikmiş</em>` : ""}</span>`;
  return `<article class="pcard${p.seviye === "baskan" && p.departman === d.id ? " baskan" : ""}">
    ${p.id ? `<button class="pc-h" data-act="kisi" data-id="${esc(p.id)}">${bas}</button>` : `<div class="pc-h">${bas}</div>`}
    ${acikG.length || goster.length ? `<ul class="gl">${acikG.map(g => gorevSatir(g)).join("")}${goster.map(g => gorevSatir(g)).join("")}</ul>` : ""}
    <div class="pc-f">${ed ? `<button class="btn ghost sm" data-act="task-new" data-dep="${d.id}" data-kisi="${esc(p.id)}">+ Görev ata</button>` : ""}${biten.length ? `<button class="linkbtn" data-act="biten" data-key="${esc(key)}">${S.bitenAcik[key] ? "Biten görevleri gizle" : `Biten görevler (${biten.length})`}</button>` : ""}</div>
  </article>`;
}
function tDosyalar(d, files, ekler = []) {
  const ed = editable();
  return `${ed ? `<div class="toolbar"><button class="btn" data-act="sheet-new" data-dep="${d.id}">+ Yeni tablo</button><button class="btn ghost" data-act="import" data-dep="${d.id}">Excel / CSV içe aktar</button><label class="btn ghost filebtn">PDF / JPG ekle<input type="file" multiple data-up="${d.id}" data-alan="tablolar" aria-label="PDF ya da görsel ekle"></label></div>` : ""}
  ${yuklemeHTML()}
  ${files.length || ekler.length ? `<div class="fcards" data-drop="${d.id}" data-alan="tablolar">${files.map(f => fcard(f)).join("")}${ekler.map(([id, b]) => ekKart(id, b)).join("")}</div>` : `<div class="empty" data-drop="${d.id}" data-alan="tablolar"><h3>Bu birimde henüz tablo yok</h3><p>${ed ? "Boş bir tablo açın, elinizdeki Excel dosyasını içe aktarın ya da PDF ve JPG ekleyin. Dosyaları buraya sürükleyip bırakabilirsiniz." : "Tablolar ve dosyalar eklendiğinde burada görünür."}</p></div>`}`;
}
function fcard(f) {
  const rs = satirlar(f); const tik = (f.kolonlar || []).find(c => c.tur === "tik");
  const n = tik ? rs.filter(r => r[tik.id]).length : 0;
  return `<button class="fcard" data-act="open" data-id="${esc(f.id)}">
    <h3>${esc(f.baslik)}</h3>${f.aciklama ? `<p>${esc(f.aciklama)}</p>` : ""}
    ${tik && rs.length ? `<div class="bar" title="${esc(tik.ad)}"><i style="width:${Math.round(n / rs.length * 100)}%"></i></div>` : ""}
    <div class="fmeta"><span><b>${rs.length}</b> satır</span>${tik && rs.length ? `<span>${esc(tik.ad)} <b>${n}/${rs.length}</b></span>` : ""}${f.guncelleme ? `<span>${esc(goreli(f.guncelleme))}</span>` : ""}</div>
  </button>`;
}
function tBelgeler(d, docs) {
  const ed = editable();
  const tip = b => b.tur === "link" ? "LİNK" : (uzanti(b) || "DOSYA");
  return `${ed ? `<label class="drop" data-drop="${d.id}" data-alan="belgeler"><input type="file" multiple data-up="${d.id}" data-alan="belgeler" aria-label="Bilgisayardan dosya yükle"><b>Bilgisayardan dosya yükle</b><span>Tıklayıp seçin ya da dosyaları buraya sürükleyip bırakın. Her türden dosya yüklenebilir (Word, Excel, PowerPoint, PDF, görsel, video, ZIP…); boyut sınırı yok. Birden çok dosyayı aynı anda seçebilirsiniz.</span></label>` : ""}
  ${yuklemeHTML()}
  ${ed ? `<form class="qadd" data-form="link-add" data-dep="${d.id}"><input class="inp grow" name="ad" placeholder="Link adı" required aria-label="Link adı"><input class="inp grow" name="url" placeholder="https://drive.google.com/…" required aria-label="Link"><button class="btn ghost">Link ekle</button></form>` : ""}
  ${docs.length ? `<div class="tbl-wrap"><table class="list"><thead><tr><th>Tür</th><th>Belge</th><th>Boyut</th><th>Ekleyen</th><th>Tarih</th><th>Not</th><th></th></tr></thead><tbody>
    ${docs.map(([id, b]) => { const h = belgeHref(b); return `<tr><td><span class="ftype">${esc(tip(b))}</span></td><td>${h ? `<a href="${esc(h)}" target="_blank" rel="noopener noreferrer">${esc(b.ad)}</a>` : esc(b.ad)}</td><td class="faint">${esc(boyutYaz(b.boyut))}</td><td><span data-uid="${esc(b.yukleyen || "")}">Bir üye</span></td><td class="faint">${esc(fmtTarih(String(b.tarih || "").slice(0, 10)))}</td><td class="faint">${esc(b.not || "")}</td><td>${ed ? `<button class="btn ghost sm" data-act="belge" data-id="${esc(id)}">Düzenle</button>` : ""}</td></tr>`; }).join("")}
  </tbody></table></div>` : `<div class="empty"><h3>Henüz belge yok</h3><p>${ed ? "Bilgisayarınızdan dosya yükleyin ya da Drive linki ekleyin." : "Belgeler eklendiğinde burada görünür."}</p></div>`}`;
}

/* ---------- TABLO ---------- */
function vDosya() {
  const d = curDosya();
  if (!d) return S.db && !S.loaded.dosyalar ? `<p class="loading">Yükleniyor…</p>` : `<div class="empty"><h3>Bu tablo bulunamadı</h3><p>Silinmiş olabilir.</p><p style="margin-top:14px"><button class="btn" data-act="nav" data-v="genel">Genel bakışa dön</button></p></div>`;
  const dep = DEP[d.departman] || DEPTS[0];
  const cols = d.kolonlar || []; const all = satirlar(d); const vr = gorunen(cols, all);
  S.sh.rows = vr.map(r => r._id); S.sh.cols = cols.map(c => c.id);
  const ed = editable(); const size = JSON.stringify(d).length;
  const wOf = (c, i) => c.gen || (i === 0 && c.tur === "metin" ? 210 : GENISLIK[c.tur] || 170);
  const tw = 48 + sum(cols.map(wOf)) + (ed ? 44 : 0);
  return `<div style="--dc:var(--${dep.k});--dct:var(--${dep.k}t)">
  ${banner()}
  <button class="crumb" data-act="nav" data-v="${dep.id}">← ${dep.no} ${esc(dep.ad)}</button>
  <div class="sh-title"><h1 class="h-lg">${esc(d.baslik)}</h1>${ed ? `<button class="btn ghost sm" data-act="sheet-settings">Tablo ayarları</button>` : ""}</div>
  ${d.aciklama ? `<p class="lead sm">${esc(d.aciklama)}</p>` : ""}
  ${ozetSerit(cols, all)}
  <div class="sh-tools">
    <input id="sh-q" class="inp" type="search" placeholder="Tabloda ara" value="${esc(S.sh.q)}" aria-label="Tabloda ara">
    <select id="sh-f" class="inp" aria-label="Filtre">${filtreOptions(cols, all)}</select>
    <span class="sp"></span>
    ${ed ? `<button class="btn" data-act="add-row">+ Satır</button><button class="btn ghost" data-act="import" data-dep="${dep.id}" data-into="${esc(S.dosyaId)}">Excel'den satır ekle</button>` : ""}
    <button class="btn ghost" data-act="export">Excel indir</button>
  </div>
  ${size > 800000 ? `<div class="warnbar">Bu tablo ${Math.round(size / 1024)} KB oldu; sınır yaklaşık 1 MB. Eski satırları “Tablo ayarları → Kopyasını oluştur” ile yeni bir tabloya taşıyın.</div>` : ""}
  <div class="grid-wrap" id="grid" tabindex="0" aria-label="${esc(d.baslik)} tablosu">
    <table class="sheet" style="width:${tw}px">
      <colgroup><col style="width:48px">${cols.map((c, i) => `<col style="width:${wOf(c, i)}px">`).join("")}${ed ? `<col style="width:44px">` : ""}</colgroup>
      <thead><tr><th class="rn">#</th>${cols.map(th).join("")}${ed ? `<th class="addc"><button data-act="col-new" title="Sütun ekle" aria-label="Sütun ekle">+</button></th>` : ""}</tr></thead>
      <tbody>${vr.map((r, i) => `<tr data-r="${esc(r._id)}"><td class="rn"><button data-act="row" data-r="${esc(r._id)}" title="Satırı aç">${i + 1}</button></td>${cols.map(c => `<td data-c="${esc(c.id)}" class="t-${c.tur}"${c.tur === "uzun" && r[c.id] ? ` title="${esc(r[c.id])}"` : ""}>${cellHTML(c, r[c.id])}</td>`).join("")}${ed ? `<td class="rdel"><button data-act="row-del" data-r="${esc(r._id)}" title="Satırı sil" aria-label="Satırı sil">×</button></td>` : ""}</tr>`).join("")}</tbody>
    </table>
    ${vr.length ? "" : `<div class="sh-empty">${all.length ? "Arama ya da filtreye uyan satır yok." : ed ? "Henüz satır yok. “+ Satır” ile ekleyin ya da Excel'de bir alanı kopyalayıp bir hücre seçerek yapıştırın (Ctrl+V)." : "Henüz satır yok."}</div>`}
  </div>
  ${ed ? `<button class="addrow" data-act="add-row">+ Yeni satır</button>` : ""}
  <p class="hint">${ed ? "Hücreye tıklayıp yazmaya başlayın. Enter kaydeder ve aşağı iner, Tab sağa geçer, Esc vazgeçer, oklarla gezinirsiniz. Onay kutularına tek tıkla işaret koyulur. Excel'den kopyaladığınız alanı seçili hücreye yapıştırabilirsiniz. Satır numarasına tıklayınca satırın tüm alanları ve notu açılır; sütun başlığına tıklayınca sütun ayarları açılır." : "Satır numarasına tıklayınca satırın tüm alanları açılır."}</p>
  </div>`;
}
function th(c) {
  const s = S.sh.sort && S.sh.sort.c === c.id ? S.sh.sort.dir : 0;
  return `<th><div class="th-in"><button class="th-name" data-act="col" data-c="${esc(c.id)}" title="${esc(c.ad)} · ${esc(TURAD[c.tur] || "")}">${esc(c.ad)}</button><button class="th-sort${s ? " on" : ""}" data-act="sort" data-c="${esc(c.id)}" aria-label="${esc(c.ad)} sütununa göre sırala">${s === 1 ? "▲" : s === -1 ? "▼" : "↕"}</button></div></th>`;
}
function gorunen(cols, all) {
  let rs = all;
  const q = trl(S.sh.q.trim());
  if (q) rs = rs.filter(r => cols.some(c => trl(displayText(c, r[c.id])).includes(q)));
  if (S.sh.f) {
    const i = S.sh.f.indexOf("::"); const cid = S.sh.f.slice(0, i), val = S.sh.f.slice(i + 2); const c = cols.find(x => x.id === cid);
    if (c) rs = rs.filter(r => c.tur === "tik" ? (!!r[cid]) === (val === "1") : String(r[cid] ?? "") === val);
  }
  if (S.sh.sort) {
    const c = cols.find(x => x.id === S.sh.sort.c), dir = S.sh.sort.dir;
    if (c) rs = rs.slice().sort((a, b) => {
      const x = a[c.id], y = b[c.id]; const ex = x === "" || x == null || x === false, ey = y === "" || y == null || y === false;
      if (ex && ey) return 0; if (ex) return 1; if (ey) return -1;
      if (c.tur === "sayi" || c.tur === "para") return (x - y) * dir;
      if (c.tur === "secim") { const o = c.secenekler || []; return (o.indexOf(x) - o.indexOf(y)) * dir || String(x).localeCompare(y, "tr") * dir; }
      return displayText(c, x).localeCompare(displayText(c, y), "tr", { numeric: true }) * dir;
    });
  }
  return rs;
}
function filtreOptions(cols, rows) {
  const o = (v, l) => `<option value="${esc(v)}"${S.sh.f === v ? " selected" : ""}>${esc(l)}</option>`;
  let h = o("", "Tüm satırlar");
  for (const c of cols) {
    if (c.tur === "tik") h += `<optgroup label="${esc(c.ad)}">${o(c.id + "::1", "✓ " + c.ad)}${o(c.id + "::0", "✗ " + c.ad + " değil")}</optgroup>`;
    else if (c.tur === "secim" && (c.secenekler || []).length) h += `<optgroup label="${esc(c.ad)}">${c.secenekler.map(x => o(c.id + "::" + x, x)).join("")}</optgroup>`;
    else if (c.tur === "kisi") { const ids = [...new Set(rows.map(r => r[c.id]).filter(Boolean))]; if (ids.length) h += `<optgroup label="${esc(c.ad)}">${ids.map(i => o(c.id + "::" + i, kisi(i)?.ad || "(silinmiş)")).join("")}</optgroup>`; }
  }
  return h;
}
function ozetSerit(cols, rs) {
  const parts = [`<div class="ost"><b>${rs.length}</b><span>Satır</span></div>`];
  for (const c of cols.filter(c => c.tur === "tik").slice(0, 4)) {
    const n = rs.filter(r => r[c.id]).length;
    parts.push(`<div class="ost"><b>${n}<small>/${rs.length}</small></b><span>${esc(c.ad)}</span><div class="bar"><i style="width:${rs.length ? Math.round(n / rs.length * 100) : 0}%"></i></div></div>`);
  }
  const sc = cols.find(c => c.id === "durum" && c.tur === "secim") || cols.find(c => c.tur === "secim");
  if (sc && rs.length) {
    const cnt = {}; rs.forEach(r => { const v = r[sc.id]; if (v) cnt[v] = (cnt[v] || 0) + 1; });
    const ent = (sc.secenekler || []).filter(o => cnt[o]).map(o => [o, cnt[o]]).concat(Object.entries(cnt).filter(([k]) => !(sc.secenekler || []).includes(k)));
    if (ent.length) {
      const tot = sum(ent.map(e => e[1]));
      parts.push(`<div class="ost" style="max-width:420px;flex:1 1 300px"><span style="margin-top:0">${esc(sc.ad)}</span><div class="stack">${ent.map(([k, n]) => `<i title="${esc(k)}: ${n}" style="width:${n / tot * 100}%;background:${TONRENK[ton(k)]};opacity:${ton(k) === "neu" ? .55 : 1}"></i>`).join("")}</div><div class="legend">${ent.slice(0, 6).map(([k, n]) => `<span>${esc(k)} <em>${n}</em></span>`).join("")}</div></div>`);
    }
  }
  return `<div class="ostrip">${parts.join("")}</div>`;
}
const colById = id => (curDosya()?.kolonlar || []).find(c => c.id === id);
function cellEl(r, c) { return $(`#grid tr[data-r="${CSS.escape(r)}"] td[data-c="${CSS.escape(c)}"]`); }
function paintSel() {
  $$("#grid td.sel").forEach(t => t.classList.remove("sel"));
  const s = S.sh.sel; if (!s) return; const td = cellEl(s.r, s.c); if (td) td.classList.add("sel");
}
function moveSel(dr, dc) {
  const s = S.sh.sel; if (!s) return;
  let ri = S.sh.rows.indexOf(s.r), ci = S.sh.cols.indexOf(s.c); if (ri < 0 || ci < 0) return;
  ri = Math.max(0, Math.min(S.sh.rows.length - 1, ri + dr)); ci = Math.max(0, Math.min(S.sh.cols.length - 1, ci + dc));
  S.sh.sel = { r: S.sh.rows[ri], c: S.sh.cols[ci] }; paintSel();
  cellEl(S.sh.sel.r, S.sh.sel.c)?.scrollIntoView({ block: "nearest", inline: "nearest" });
}
function setCell(r, c, val) {
  const d = curDosya(); if (!d) return;
  patchDosya(S.dosyaId, { satirlar: { [r]: { [c]: val, _t: nowISO(), _by: S.uid || "" } } });
  logla("cell:" + S.dosyaId, `${d.baslik} tablosunu güncelledi`, d.departman);
}
const esit = (a, b) => (a ?? "") === (b ?? "") || (a === false && (b === undefined || b === ""));
function belgeOptions(dep, sel) {
  const docs = [...S.belgeler.entries()].sort((a, b) => (a[1].departman === dep ? 0 : 1) - (b[1].departman === dep ? 0 : 1) || String(a[1].ad).localeCompare(b[1].ad, "tr"));
  return `<option value="">—</option>` + docs.map(([id, b]) => `<option value="${esc(id)}"${id === sel ? " selected" : ""}>${esc(b.ad)}${b.departman !== dep ? ` (${esc(DEP[b.departman]?.ad || "")})` : ""}</option>`).join("");
}
function startEdit(ch) {
  const s = S.sh.sel; if (!s || !editable()) return;
  const d = curDosya(); const col = colById(s.c); const row = d?.satirlar?.[s.r]; if (!row || !col) return;
  if (col.tur === "tik") { setCell(s.r, s.c, !row[s.c]); render(); return; }
  const td = cellEl(s.r, s.c); if (!td) return;
  S.sh.editing = { r: s.r, c: s.c };
  const v = row[s.c]; const start = ch != null ? ch : null; let h;
  switch (col.tur) {
    case "secim": h = `<select class="ced" id="ced">${["", ...(col.secenekler || [])].map(o => `<option value="${esc(o)}"${o === (v || "") ? " selected" : ""}>${o ? esc(o) : "—"}</option>`).join("")}${v && !(col.secenekler || []).includes(v) ? `<option selected>${esc(v)}</option>` : ""}</select>`; break;
    case "kisi": h = `<select class="ced" id="ced">${kisiOptions(v, d.departman)}</select>`; break;
    case "belge": h = `<select class="ced" id="ced">${belgeOptions(d.departman, v)}</select>`; break;
    case "tarih": h = `<input class="ced" id="ced" type="date" value="${esc(v || "")}">`; break;
    case "sayi": case "para": h = `<input class="ced" id="ced" inputmode="decimal" value="${esc(start ?? (v === "" || v == null ? "" : String(v).replace(".", ",")))}">`; break;
    case "uzun": h = `<textarea class="ced" id="ced">${esc(start ?? (v || ""))}</textarea>`; break;
    default: h = `<input class="ced" id="ced" value="${esc(start ?? (v || ""))}"${col.tur === "link" ? ' inputmode="url"' : ""}>`;
  }
  td.classList.add("editing"); td.innerHTML = h;
  const el = $("#ced"); el.focus({ preventScroll: true });
  if (el.tagName !== "SELECT" && el.type !== "date") { const L = el.value.length; try { el.setSelectionRange(L, L); } catch { } }
  if (el.tagName === "SELECT") el.addEventListener("change", () => commitEdit());
  el.addEventListener("blur", () => { if (S.sh.editing) commitEdit(); });
  el.addEventListener("keydown", e => {
    if (e.key === "Escape") { e.preventDefault(); S.sh.editing = null; render(); $("#grid")?.focus({ preventScroll: true }); }
    else if (e.key === "Enter" && !(el.tagName === "TEXTAREA" && (e.shiftKey || e.altKey))) { e.preventDefault(); commitEdit([1, 0]); }
    else if (e.key === "Tab") { e.preventDefault(); commitEdit([0, e.shiftKey ? -1 : 1]); }
  });
}
function commitEdit(move) {
  const ed = S.sh.editing; if (!ed) return; const el = $("#ced"); const col = colById(ed.c);
  S.sh.editing = null;
  if (el && col) {
    const val = deger(col, el.value); const old = curDosya()?.satirlar?.[ed.r]?.[ed.c];
    if (!esit(val, old)) setCell(ed.r, ed.c, val);
  }
  render();
  if (move) moveSel(...move);
  $("#grid")?.focus({ preventScroll: true });
}
function addRow() {
  const d = curDosya(); if (!d) return;
  const id = newId("r"); const mx = Math.max(0, ...satirlar(d).map(r => r._s || 0));
  S.sh.q = ""; S.sh.f = ""; S.sh.sort = null;
  patchDosya(S.dosyaId, { satirlar: { [id]: { _s: mx + 1, _t: nowISO(), _by: S.uid || "" } } });
  logla("cell:" + S.dosyaId, `${d.baslik} tablosuna satır ekledi`, d.departman);
  render();
  const c = (d.kolonlar || [])[0]; if (!c) return;
  S.sh.sel = { r: id, c: c.id }; paintSel(); cellEl(id, c.id)?.scrollIntoView({ block: "nearest" }); startEdit();
}
function delRow(rid) {
  const d = curDosya(); const r = d?.satirlar?.[rid]; if (!r) return; const backup = clone(r); const did = S.dosyaId;
  patchDosya(did, { satirlar: { [rid]: null } });
  logla("del:" + did, `${d.baslik} tablosundan satır sildi`, d.departman);
  if (S.sh.sel && S.sh.sel.r === rid) S.sh.sel = null;
  closeModal(); render();
  toast("Satır silindi", { label: "Geri al", fn: () => { patchDosya(did, { satirlar: { [rid]: backup } }); render(); } });
}
function tsv(text, sep = "\t") {
  const rows = []; let row = [], cell = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"' && cell === "") q = true;
    else if (ch === sep) { row.push(cell); cell = ""; }
    else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cell); rows.push(row); row = []; cell = ""; }
    else cell += ch;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
function pasteGrid(text) {
  const d = curDosya(); const s = S.sh.sel; if (!d || !s) return;
  const data = tsv(text.replace(/\n$/, "")); if (!data.length) return;
  const cols = d.kolonlar || []; const ci = cols.findIndex(c => c.id === s.c); let ri = S.sh.rows.indexOf(s.r);
  if (ci < 0 || ri < 0) return;
  let mx = Math.max(0, ...satirlar(d).map(r => r._s || 0));
  const patch = {}; let cells = 0, yeni = 0; const newOpts = {};
  data.forEach((vals, k) => {
    let rid = S.sh.rows[ri + k];
    if (!rid) { rid = newId("r"); patch[rid] = { _s: ++mx }; yeni++; }
    const o = patch[rid] || (patch[rid] = {});
    vals.forEach((raw, j) => {
      const c = cols[ci + j]; if (!c) return;
      const v = deger(c, raw);
      if (c.tur === "secim" && v && !(c.secenekler || []).includes(v)) (newOpts[c.id] ||= new Set()).add(v);
      o[c.id] = v; cells++;
    });
    o._t = nowISO(); o._by = S.uid || "";
  });
  const p = { satirlar: patch };
  if (Object.keys(newOpts).length) p.kolonlar = cols.map(c => newOpts[c.id] ? { ...c, secenekler: [...(c.secenekler || []), ...newOpts[c.id]] } : c);
  patchDosya(S.dosyaId, p);
  logla("cell:" + S.dosyaId, `${d.baslik} tablosuna veri yapıştırdı`, d.departman);
  render(); toast(`${cells} hücre yapıştırıldı${yeni ? `, ${yeni} yeni satır` : ""}`);
}
function rowModal(rid) {
  const d = curDosya(); const r = d?.satirlar?.[rid]; if (!r) return; const cols = d.kolonlar || []; const ed = editable(); const dep = DEP[d.departman] || DEPTS[0];
  const f = c => {
    const v = r[c.id]; const at = `data-rf data-r="${esc(rid)}" data-c="${esc(c.id)}" id="rf-${esc(c.id)}"${ed ? "" : " disabled"}`;
    let inp;
    switch (c.tur) {
      case "tik": return `<label class="field check"><input type="checkbox" ${at}${v ? " checked" : ""}><span>${esc(c.ad)}</span></label>`;
      case "uzun": inp = `<textarea class="inp" rows="5" ${at}>${esc(v || "")}</textarea>`; break;
      case "secim": inp = `<select class="inp" ${at}>${["", ...(c.secenekler || [])].map(o => `<option value="${esc(o)}"${o === (v || "") ? " selected" : ""}>${o ? esc(o) : "—"}</option>`).join("")}</select>`; break;
      case "kisi": inp = `<select class="inp" ${at}>${kisiOptions(v, d.departman)}</select>`; break;
      case "belge": inp = `<select class="inp" ${at}>${belgeOptions(d.departman, v)}</select>`; break;
      case "tarih": inp = `<input class="inp" type="date" value="${esc(v || "")}" ${at}>`; break;
      case "sayi": case "para": inp = `<input class="inp" inputmode="decimal" value="${esc(v === "" || v == null ? "" : String(v).replace(".", ","))}" ${at}>`; break;
      default: inp = `<input class="inp" value="${esc(v || "")}" ${at}>`;
    }
    if (c.tur === "link" && safeUrl(v)) inp += `<a class="cell-link" href="${esc(safeUrl(v))}" target="_blank" rel="noopener noreferrer">Linki aç ↗</a>`;
    return `<label class="field"${c.tur === "uzun" ? ' style="grid-column:1/-1"' : ""}><span>${esc(c.ad)}</span>${inp}</label>`;
  };
  modal(`<div style="--dc:var(--${dep.k});--dct:var(--${dep.k}t)">
    <div class="eyebrow">${esc(d.baslik)}</div>
    <h2>${esc(displayText(cols[0], r[cols[0]?.id]) || "Yeni satır")}</h2>
    ${r._t ? `<p class="mtext faint">Son düzenleme ${esc(goreli(r._t))}${r._by ? ` · <span data-uid="${esc(r._by)}"></span>` : ""}</p>` : ""}
    <div class="fgrid" style="margin-top:18px">${cols.map(f).join("")}</div>
    <div class="mact">${ed ? `<button class="btn danger" data-act="row-del" data-r="${esc(rid)}">Satırı sil</button>` : ""}<span class="sp"></span><button class="btn" data-act="modal-close">Tamam</button></div>
  </div>`, { wide: true });
  fillNames($("#modal-root"));
}
function colModal(cid) {
  const d = curDosya(); if (!d) return; const c = cid ? colById(cid) : { ad: "", tur: "metin", secenekler: [] }; if (!c) return;
  const gens = [[100, "Dar"], [160, "Orta"], [230, "Geniş"], [320, "Çok geniş"]];
  const cur = c.gen || GENISLIK[c.tur] || 170;
  modal(`<form data-form="col-save" data-c="${esc(cid || "")}">
    <h2>${cid ? "Sütun ayarları" : "Yeni sütun"}</h2>
    <div class="form">
      <div class="fgrid">
        <label class="field"><span>Sütun adı</span><input class="inp" name="ad" required value="${esc(c.ad)}" autofocus></label>
        <label class="field"><span>Tür</span><select class="inp" name="tur" id="col-tur">${TURLER.map(([k, a]) => `<option value="${k}"${k === c.tur ? " selected" : ""}>${a}</option>`).join("")}</select></label>
      </div>
      <label class="field" id="col-sec"${c.tur === "secim" ? "" : " hidden"}><span>Seçenekler (her satıra bir tane)</span><textarea class="inp" name="secenekler" rows="6">${esc((c.secenekler || []).join("\n"))}</textarea></label>
      <label class="field"><span>Genişlik</span><select class="inp" name="gen">${gens.map(([w, a]) => `<option value="${w}"${Math.abs(w - cur) < 36 ? " selected" : ""}>${a}</option>`).join("")}</select></label>
      ${cid ? `<div class="mrow"><button type="button" class="btn ghost sm" data-act="col-move" data-c="${esc(cid)}" data-dir="-1">← Sola taşı</button><button type="button" class="btn ghost sm" data-act="col-move" data-c="${esc(cid)}" data-dir="1">Sağa taşı →</button><button type="button" class="btn ghost sm" data-act="col-new" data-after="${esc(cid)}">Sağına sütun ekle</button><button type="button" class="btn ghost sm" data-act="sort" data-c="${esc(cid)}">Bu sütuna göre sırala</button></div>` : ""}
    </div>
    <div class="mact">${cid ? `<button type="button" class="btn danger" data-act="col-del" data-c="${esc(cid)}">Sütunu sil</button>` : ""}<span class="sp"></span><button type="button" class="btn ghost" data-act="modal-close">Vazgeç</button><button class="btn">${cid ? "Kaydet" : "Sütunu ekle"}</button></div>
  </form>`);
}
function colIdFrom(ad, cols) { let b = slug(ad).replace(/-/g, "_") || "sutun"; if (!/^[a-z]/.test(b)) b = "c_" + b; let id = b, i = 2; while (cols.some(c => c.id === id) || id === "_id") id = b + "_" + i++; return id; }
function saveCol(form) {
  const d = curDosya(); if (!d) return; const cols = clone(d.kolonlar || []); const fd = new FormData(form);
  const cid = form.dataset.c; const ad = String(fd.get("ad") || "").trim(); if (!ad) return;
  const tur = fd.get("tur"); const gen = Number(fd.get("gen")) || undefined;
  const sec = tur === "secim" ? String(fd.get("secenekler") || "").split("\n").map(s => s.trim()).filter(Boolean) : undefined;
  const p = {};
  if (cid) {
    const i = cols.findIndex(c => c.id === cid); if (i < 0) return; const old = cols[i];
    const nc = { ...old, ad, tur, gen }; if (sec) nc.secenekler = sec; else delete nc.secenekler; if (!gen) delete nc.gen;
    cols[i] = nc;
    if (old.tur !== tur) {
      const sp = {}; for (const r of satirlar(d)) { if (r[cid] === undefined) continue; const v = deger(nc, displayText(old, r[cid])); if (!esit(v, r[cid])) sp[r._id] = { [cid]: v }; }
      if (Object.keys(sp).length) p.satirlar = sp;
    }
  } else {
    const nc = { id: colIdFrom(ad, cols), ad, tur }; if (sec) nc.secenekler = sec; if (gen && gen !== GENISLIK[tur]) nc.gen = gen;
    const after = S.colAfter ? cols.findIndex(c => c.id === S.colAfter) : -1;
    if (after >= 0) cols.splice(after + 1, 0, nc); else cols.push(nc);
  }
  p.kolonlar = cols; patchDosya(S.dosyaId, p);
  logla("col:" + S.dosyaId, `${d.baslik} tablosunun sütunlarını düzenledi`, d.departman);
  S.colAfter = null; closeModal(); render();
}
function sheetModal() {
  const d = curDosya(); if (!d) return;
  modal(`<form data-form="sheet-save">
    <h2>Tablo ayarları</h2>
    <div class="form">
      <label class="field"><span>Başlık</span><input class="inp" name="baslik" required value="${esc(d.baslik)}"></label>
      <label class="field"><span>Açıklama</span><textarea class="inp" name="aciklama" rows="3">${esc(d.aciklama || "")}</textarea></label>
      <label class="field"><span>Birim</span><select class="inp" name="departman">${DEPTS.map(x => `<option value="${x.id}"${x.id === d.departman ? " selected" : ""}>${esc(x.ad)}</option>`).join("")}</select></label>
      <div class="mrow"><label class="field check"><input type="checkbox" id="copy-rows" checked><span>Satırlarla birlikte</span></label><button type="button" class="btn ghost sm" data-act="sheet-copy">Kopyasını oluştur</button></div>
    </div>
    <div id="del-area" class="confirm" hidden><p><b>${esc(d.baslik)}</b> tablosu ve içindeki ${satirlar(d).length} satır silinecek. Hemen ardından çıkan bildirimden geri alabilirsiniz.</p><button type="button" class="btn danger" data-act="sheet-del-ok">Evet, tabloyu sil</button></div>
    <div class="mact"><button type="button" class="btn ghost" data-act="sheet-del">Tabloyu sil</button><span class="sp"></span><button type="button" class="btn ghost" data-act="modal-close">Vazgeç</button><button class="btn">Kaydet</button></div>
  </form>`);
}
const SABLON = {
  bos: { ad: "Boş tablo", kolonlar: [["ad", "Ad", "metin"], ["tamam", "Tamam", "tik"], ["not", "Not", "uzun"]] },
};
function newSheetModal(dep) {
  const ex = dosyalarOf(dep);
  modal(`<form data-form="sheet-create" data-dep="${dep}">
    <h2>Yeni tablo</h2><p class="mtext">${esc(DEP[dep].ad)} departmanına eklenir. Boş tablo Ad, Tamam ve Not sütunlarıyla açılır; sütun ekleyip adlarını ve türlerini değiştirebilirsiniz.</p>
    <div class="form">
      <label class="field"><span>Başlık</span><input class="inp" name="baslik" required placeholder="Tablo adı" autofocus></label>
      <label class="field"><span>Açıklama</span><input class="inp" name="aciklama" placeholder="Bu tablo ne için?"></label>
      <label class="field"><span>Başlangıç</span><select class="inp" name="sablon">
        ${Object.entries(SABLON).map(([k, s]) => `<option value="${k}">${s.ad}</option>`).join("")}
        ${ex.length ? `<optgroup label="Var olan tablonun sütunları">${ex.map(f => `<option value="kopya:${esc(f.id)}">${esc(f.baslik)}</option>`).join("")}</optgroup>` : ""}
      </select></label>
    </div>
    <div class="mact"><span class="sp"></span><button type="button" class="btn ghost" data-act="modal-close">Vazgeç</button><button class="btn">Tabloyu oluştur</button></div>
  </form>`);
}

/* ---------- Excel içe / dışa aktarma ---------- */
let xlsxP = null;
function xlsxYukle() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  return xlsxP ||= new Promise((res, rej) => {
    const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload = () => res(window.XLSX); s.onerror = () => { xlsxP = null; rej(new Error("Excel okuyucu yüklenemedi, bağlantını kontrol et.")); };
    document.head.appendChild(s);
  });
}
function importModal(dep, into) {
  S.imp = { dep, into: into || null, sheets: null, sheet: null, ad: "" };
  modal(`<h2>${into ? "Excel'den satır ekle" : "Excel / CSV içe aktar"}</h2>
    <p class="mtext">${into ? "Dosyanın ilk satırı başlık kabul edilir. Başlıklar bu tablonun sütun adlarıyla eşleşir, eşleşmeyenler yeni sütun olur." : "Dosyanın ilk satırı başlık kabul edilir. Sütun türleri (onay kutusu, tarih, tutar, seçim listesi) tahmin edilir; aşağıda değiştirebilirsiniz. İçe aktarılan tablo burada düzenlenir ve istediğiniz an Excel olarak geri indirilir."}</p>
    <label class="drop" style="margin-top:16px"><input type="file" id="imp-file" accept=".xlsx,.xls,.xlsm,.ods,.csv,.tsv,.txt"><b>Dosya seç</b><span>.xlsx, .xls, .ods veya .csv</span></label>
    <div id="imp-body"></div>
    <div class="mact"><span class="sp"></span><button type="button" class="btn ghost" data-act="modal-close">Vazgeç</button><button class="btn" id="imp-go" data-act="imp-go" disabled>İçe aktar</button></div>`, { wide: true });
}
async function impOku(file) {
  const body = $("#imp-body"); if (!body) return; body.innerHTML = `<p class="mtext">Okunuyor…</p>`;
  try {
    const sheets = {};
    if (/\.(csv|tsv|txt)$/i.test(file.name)) {
      const buf = await file.arrayBuffer(); let text;
      try { text = new TextDecoder("utf-8", { fatal: true }).decode(buf); } catch { text = new TextDecoder("windows-1254").decode(buf); }
      text = text.replace(/^﻿/, ""); const first = text.split(/\r?\n/)[0] || "";
      const sep = /\.tsv$/i.test(file.name) || first.split("\t").length > 1 ? "\t" : first.split(";").length > first.split(",").length ? ";" : ",";
      sheets["Sayfa 1"] = tsv(text, sep);
    } else {
      const X = await xlsxYukle(); const wb = X.read(await file.arrayBuffer(), { type: "array", cellDates: true });
      for (const n of wb.SheetNames) sheets[n] = X.utils.sheet_to_json(wb.Sheets[n], { header: 1, raw: true, defval: "", blankrows: false });
    }
    S.imp.sheets = sheets; S.imp.sheet = Object.keys(sheets).find(n => impVeri(n).rows.length) || Object.keys(sheets)[0];
    S.imp.ad = file.name.replace(/\.[^.]+$/, ""); impGoster();
  } catch (e) { body.innerHTML = `<p class="err">Dosya okunamadı: ${esc(e.message || e)}</p>`; }
}
function impVeri(name) {
  let aoa = (S.imp.sheets[name || S.imp.sheet] || []).map(r => (r || []).map(v => v instanceof Date ? v : String(v ?? "").trim() === "" ? "" : v));
  aoa = aoa.filter(r => r.some(v => v !== ""));
  if (!aoa.length) return { headers: [], rows: [] };
  let w = Math.max(...aoa.map(r => r.length));
  while (w > 0 && aoa.every(r => r[w - 1] === "" || r[w - 1] === undefined)) w--;
  const seen = {};
  const headers = Array.from({ length: w }, (_, i) => { let h = String(aoa[0][i] ?? "").trim() || `Sütun ${i + 1}`; if (seen[h]) h += " " + (++seen[h]); else seen[h] = 1; return h; });
  return { headers, rows: aoa.slice(1).map(r => Array.from({ length: w }, (_, i) => r[i] ?? "")) };
}
function tahminTur(h, vals) {
  const H = trl(h); const v = vals.filter(x => x !== "" && x != null);
  if (/not|açıklama|aciklama|yorum|özet/.test(H)) return "uzun";
  if (!v.length) return "metin";
  if (v.every(x => typeof x === "boolean" || ["✓", "✔", "☑", "x", "evet", "hayır", "true", "false", "doğru", "yanlış", "var", "yok"].includes(trl(x).trim()))) return "tik";
  if (v.every(x => x instanceof Date || /^\d{4}-\d{2}-\d{2}/.test(x) || /^\d{1,2}[./]\d{1,2}[./]\d{2,4}$/.test(String(x).trim()))) return "tarih";
  if (v.every(x => typeof x === "number" || /^[₺\s]*-?[\d.,]+\s*(tl)?$/i.test(String(x).trim()))) return "sayi";
  if (v.every(x => /^(https?:\/\/|www\.)/i.test(String(x).trim()))) return "link";
  const u = new Set(v.map(x => String(x).trim()));
  if (v.length >= 4 && u.size <= 10 && u.size <= v.length / 2 && [...u].every(x => x.length <= 40)) return "secim";
  return "metin";
}
function impGoster() {
  const body = $("#imp-body"); if (!body || !S.imp?.sheets) return;
  const names = Object.keys(S.imp.sheets); const { headers, rows } = impVeri();
  const turs = headers.map((h, i) => tahminTur(h, rows.map(r => r[i])));
  const into = S.imp.into ? S.dosyalar.get(S.imp.into) : null;
  const match = h => into && (into.kolonlar || []).find(c => trl(c.ad) === trl(h));
  body.innerHTML = `<div class="form">
    ${names.length > 1 ? `<label class="field"><span>Sayfa</span><select class="inp" id="imp-sheet">${names.map(n => `<option${n === S.imp.sheet ? " selected" : ""}>${esc(n)}</option>`).join("")}</select></label>` : ""}
    ${into ? "" : `<label class="field"><span>Tablo adı</span><input class="inp" id="imp-ad" value="${esc(S.imp.ad)}"></label>`}
    <p class="mtext" style="margin:0">${rows.length} satır, ${headers.length} sütun bulundu.${rows.length > 1500 ? ` <span class="err">Çok büyük: en fazla 1500 satır içe aktarılabilir, dosyayı bölün.</span>` : ""}</p>
  </div>
  ${headers.length ? `<div class="tbl-wrap prev"><table class="list"><thead><tr>${headers.map((h, i) => `<th>${esc(h)}<br>${match(h) ? `<span class="faint" style="text-transform:none;letter-spacing:0">→ ${esc(match(h).ad)}</span>` : `<select class="inp" id="imp-t-${i}" aria-label="${esc(h)} türü">${TURLER.filter(t => t[0] !== "belge").map(([k, a]) => `<option value="${k}"${k === turs[i] ? " selected" : ""}>${a}</option>`).join("")}</select>`}</th>`).join("")}</tr></thead>
    <tbody>${rows.slice(0, 6).map(r => `<tr>${r.map(v => `<td>${esc(v instanceof Date ? tarihOku(v) : String(v)).slice(0, 60)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>` : `<p class="err">Bu sayfada veri yok.</p>`}`;
  $("#imp-go").disabled = !rows.length || rows.length > 1500;
}
function impGo() {
  if (!S.imp?.sheets) return; const { headers, rows } = impVeri(); if (!rows.length || rows.length > 1500) return;
  const now = nowISO(), by = S.uid || "";
  if (S.imp.into) {
    const d = S.dosyalar.get(S.imp.into); if (!d) return; const cols = clone(d.kolonlar || []);
    const map = headers.map((h, i) => {
      let c = cols.find(c => trl(c.ad) === trl(h));
      if (!c) { c = { id: colIdFrom(h, cols), ad: h, tur: $("#imp-t-" + i)?.value || "metin" }; cols.push(c); }
      return c;
    });
    let mx = Math.max(0, ...satirlar(d).map(r => r._s || 0)); const sp = {};
    rows.forEach(r => { const o = { _s: ++mx, _t: now, _by: by }; map.forEach((c, i) => { const v = deger(c, r[i]); if (v !== "" && v !== false) o[c.id] = v; if (c.tur === "secim" && v && !(c.secenekler ||= []).includes(v)) c.secenekler.push(v); }); sp[newId("r")] = o; });
    if (JSON.stringify(d).length + JSON.stringify(sp).length > 900000) { toast("Bu kadar satır tabloyu 1 MB sınırının üstüne çıkarır. Yeni tablo olarak içe aktarın."); return; }
    patchDosya(S.imp.into, { kolonlar: cols, satirlar: sp });
    logla("imp:" + S.imp.into, `${d.baslik} tablosuna Excel'den ${rows.length} satır ekledi`, d.departman);
    closeModal(); render(); toast(`${rows.length} satır eklendi`); return;
  }
  const cols = [];
  headers.forEach((h, i) => cols.push({ id: colIdFrom(h, cols), ad: h, tur: $("#imp-t-" + i)?.value || "metin" }));
  cols.forEach((c, i) => { if (c.tur === "secim") c.secenekler = [...new Set(rows.map(r => String(r[i] ?? "").trim()).filter(Boolean))].slice(0, 40); });
  const sat = {}; rows.forEach((r, k) => { const o = { _s: k + 1, _t: now, _by: by }; cols.forEach((c, i) => { const v = deger(c, r[i]); if (v !== "" && v !== false) o[c.id] = v; }); sat[newId("r")] = o; });
  const baslik = ($("#imp-ad")?.value || S.imp.ad || "İçe aktarılan tablo").trim();
  const body = { baslik, aciklama: `${S.imp.sheet} sayfasından içe aktarıldı.`, departman: S.imp.dep, sira: 50, kolonlar: cols, satirlar: sat, olusturma: now, guncelleme: now, guncelleyen: by };
  if (JSON.stringify(body).length > 900000) { toast("Dosya 1 MB sınırını aşıyor. Excel'i iki parçaya bölüp ayrı ayrı içe aktarın."); return; }
  const id = slug(baslik) + "-" + rnd().slice(0, 4);
  write("dosyalar", id, "set", body); logla("imp:" + id, `${baslik} tablosunu Excel'den içe aktardı`, S.imp.dep);
  closeModal(); go("d-" + id); toast(`${rows.length} satır içe aktarıldı`);
}
function exportVal(c, v) {
  if (v === undefined || v === null || v === "") return "";
  if (c.tur === "tik") return v ? "✓" : "";
  if (c.tur === "tarih") return tarihParca(v) || v;
  if (c.tur === "sayi" || c.tur === "para") return typeof v === "number" ? v : sayiOku(v);
  if (c.tur === "kisi" || c.tur === "belge") return displayText(c, v);
  return String(v);
}
function wsOf(X, d) {
  const cols = d.kolonlar || [];
  const aoa = [cols.map(c => c.ad), ...satirlar(d).map(r => cols.map(c => exportVal(c, r[c.id])))];
  const ws = X.utils.aoa_to_sheet(aoa, { cellDates: true, dateNF: "dd.mm.yyyy" });
  ws["!cols"] = cols.map(c => ({ wch: Math.round((c.gen || GENISLIK[c.tur] || 170) / 7) }));
  return ws;
}
const sheetAdi = (s, used) => { let b = String(s).replace(/[\[\]:*?/\\]/g, " ").slice(0, 28).trim() || "Sayfa"; let n = b, i = 2; while (used.has(n)) n = b.slice(0, 26) + " " + i++; used.add(n); return n; };
async function indir(filename, build) {
  try {
    const X = await xlsxYukle(); const wb = X.utils.book_new(); build(X, wb);
    const buf = X.write(wb, { bookType: "xlsx", type: "array" });
    dosyaIndir(filename, new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
    toast("Excel dosyası indirildi");
  } catch (e) { toast("İndirilemedi: " + (e && e.message || e)); }
}
function exportDosya() { const d = curDosya(); if (d) indir(slug(d.baslik) + ".xlsx", (X, wb) => X.utils.book_append_sheet(wb, wsOf(X, d), sheetAdi(d.baslik, new Set()))); }
function backupAll() {
  indir(`otomotiv-kulubu-yedek-${bugun()}.xlsx`, (X, wb) => {
    const used = new Set();
    for (const dep of DEPTS) for (const d of dosyalarOf(dep.id)) X.utils.book_append_sheet(wb, wsOf(X, d), sheetAdi(d.baslik, used));
    const gs = gorevlerOf(); const aoa = [["Görev", "Departman", "Sorumlu", "Son tarih", "Öncelik", "Durum", "Açıklama"], ...gs.map(g => [g.baslik, DEP[g.departman]?.ad || "", kisi(g.sorumlu)?.ad || "", tarihParca(g.son_tarih) || "", ONCELIK[g.oncelik] || "", (GDURUM.find(x => x[0] === g.durum) || [])[1] || "", g.aciklama || ""])];
    X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet(aoa, { cellDates: true, dateNF: "dd.mm.yyyy" }), sheetAdi("Görevler", used));
  });
}

/* ---------- görevler ---------- */
function taskModal(id, dep, kid) {
  const g = id ? S.gorevler.get(id) : { durum: "yapilacak", oncelik: "orta", departman: dep, sorumlu: kid || "", atayan: benKisi()?.id || "" }; if (!g) return; const ed = editable(); const dis = ed ? "" : " disabled";
  const d = DEP[g.departman] || DEPTS[0];
  modal(`<form data-form="task-save" data-id="${esc(id || "")}" style="--dc:var(--${d.k});--dct:var(--${d.k}t)">
    <div class="eyebrow">${esc(d.ad)} · ${id ? "görev" : "yeni görev"}</div>
    <div class="form">
      <label class="field"><span>Görev</span><input class="inp" name="baslik" required value="${esc(g.baslik || "")}"${dis}${id ? "" : " autofocus"}></label>
      <label class="field"><span>Açıklama</span><textarea class="inp" name="aciklama" rows="4"${dis}>${esc(g.aciklama || "")}</textarea></label>
      <div class="fgrid">
        <label class="field"><span>Kime atandı</span><select class="inp" name="sorumlu"${dis}>${kisiOptions(g.sorumlu, g.departman)}</select></label>
        <label class="field"><span>Atayan</span><select class="inp" name="atayan"${dis}>${kisiOptions(g.atayan || "", g.departman)}</select></label>
        <label class="field"><span>Son tarih</span><input class="inp" type="date" name="son_tarih" value="${esc(g.son_tarih || "")}"${dis}></label>
        <label class="field"><span>Durum</span><select class="inp" name="durum"${dis}>${GDURUM.map(([k, a]) => `<option value="${k}"${k === g.durum ? " selected" : ""}>${a}</option>`).join("")}</select></label>
        <label class="field"><span>Öncelik</span><select class="inp" name="oncelik"${dis}>${Object.entries(ONCELIK).map(([k, a]) => `<option value="${k}"${k === g.oncelik ? " selected" : ""}>${a}</option>`).join("")}</select></label>
        <label class="field"><span>Birim</span><select class="inp" name="departman"${dis}>${DEPTS.map(x => `<option value="${x.id}"${x.id === g.departman ? " selected" : ""}>${esc(x.ad)}</option>`).join("")}</select></label>
      </div>
      ${id && g.olusturma ? `<p class="mtext faint" style="margin:0">Oluşturan <span data-uid="${esc(g.olusturan || "")}">Bir üye</span> · ${esc(goreli(g.olusturma))}${g.tamamlanma ? ` · tamamlandı ${esc(goreli(g.tamamlanma))}` : ""}</p>` : ""}
    </div>
    <div class="mact">${ed && id ? `<button type="button" class="btn ghost" data-act="task-del" data-id="${esc(id)}">Görevi sil</button>` : ""}<span class="sp"></span><button type="button" class="btn ghost" data-act="modal-close">${ed ? "Vazgeç" : "Kapat"}</button>${ed ? `<button class="btn">${id ? "Kaydet" : "Görevi ata"}</button>` : ""}</div>
  </form>`);
  fillNames($("#modal-root"));
}
function taskSave(form) {
  const fd = new FormData(form); const id = form.dataset.id || newId("g"); const old = S.gorevler.get(id);
  const body = { baslik: String(fd.get("baslik") || "").trim(), aciklama: String(fd.get("aciklama") || ""), sorumlu: fd.get("sorumlu") || "", atayan: fd.get("atayan") || "", son_tarih: fd.get("son_tarih") || "", durum: fd.get("durum") || "yapilacak", oncelik: fd.get("oncelik") || "orta", departman: fd.get("departman") || "kurumsal", guncelleme: nowISO() };
  if (!body.baslik) return;
  if (body.durum === "bitti" && (!old || old.durum !== "bitti")) body.tamamlanma = nowISO();
  if (old) write("gorevler", id, "update", body);
  else write("gorevler", id, "set", { ...body, olusturan: S.uid || "", olusturanAd: S.kullanici?.ad || "", olusturma: nowISO() });
  logla("task:" + id, `“${body.baslik}” görevini ${old ? "güncelledi" : "ekledi"}`, body.departman);
  closeModal();
}

/* ---------- belgeler ---------- */
function belgeModal(id) {
  const b = S.belgeler.get(id); if (!b) return; const h = belgeHref(b);
  modal(`<form data-form="belge-save" data-id="${esc(id)}">
    <h2>Belge</h2>
    <div class="form">
      <label class="field"><span>Ad</span><input class="inp" name="ad" required value="${esc(b.ad)}"></label>
      ${b.tur === "link" ? `<label class="field"><span>Link</span><input class="inp" name="url" value="${esc(b.url || "")}"></label>` : ""}
      <label class="field"><span>Not</span><input class="inp" name="not" value="${esc(b.not || "")}" placeholder="örn. Güncel sürüm, imzalı kopya"></label>
      <label class="field"><span>Birim</span><select class="inp" name="departman">${DEPTS.map(x => `<option value="${x.id}"${x.id === b.departman ? " selected" : ""}>${esc(x.ad)}</option>`).join("")}</select></label>
      ${b.tur === "dosya" ? `<label class="field"><span>Nerede görünsün</span><select class="inp" name="alan"><option value="belgeler"${b.alan !== "tablolar" ? " selected" : ""}>Belgeler</option><option value="tablolar"${b.alan === "tablolar" ? " selected" : ""}>Tablolar</option></select></label>` : ""}
      ${h ? `<a class="cell-link" href="${esc(h)}" target="_blank" rel="noopener noreferrer">${b.tur === "dosya" ? "Dosyayı aç" : "Belgeyi aç"} ↗</a>${b.boyut ? ` <span class="faint">${esc(boyutYaz(b.boyut))}</span>` : ""}` : ""}
    </div>
    <div id="del-area" class="confirm" hidden><p>${b.tur === "dosya" ? "Dosya depodan kalıcı olarak silinir, geri alınamaz." : "Link listeden kaldırılır; Drive’daki dosyaya dokunulmaz."} Tablolarda bu belgeye verilen bağlantılar “silinmiş belge” olarak görünür.</p><button type="button" class="btn danger" data-act="belge-del-ok" data-id="${esc(id)}">Evet, sil</button></div>
    <div class="mact"><button type="button" class="btn ghost" data-act="belge-del">Sil</button><span class="sp"></span><button type="button" class="btn ghost" data-act="modal-close">Vazgeç</button><button class="btn">Kaydet</button></div>
  </form>`);
}
async function belgeSil(id) {
  const b = S.belgeler.get(id); if (!b) return;
  if (b.tur === "dosya" && b.yol && S.depo) {
    try { await S.depo.sil(b.yol); }
    catch (e) { if (e && e.code !== "depo_yok") { toast(e.code === "izin" ? "Dosyayı silme izni yok." : "Dosya silinemedi: " + (e.message || e.code)); return; } }
  }
  write("belgeler", id, "delete"); logla("belge:" + id, `${b.ad} belgesini sildi`, b.departman); closeModal(); toast("Belge silindi");
}

/* ---------- MÜSAİTLİK ---------- */
function mgrid(kid) { const g = S.musaitlik.get(kid)?.gunler || {}; return GUNLER.map(([k]) => (String(g[k] || "") + ".".repeat(SAATN)).slice(0, SAATN)); }
function mVar(kid) { return mgrid(kid).some(s => /[mdx]/.test(s)); }
function mOzet(kid) { const s = mgrid(kid).join(""); return { m: (s.match(/m/g) || []).length, d: (s.match(/d/g) || []).length, x: (s.match(/x/g) || []).length }; }
function grupUyeleri(g) { const all = kisilerSirali(); return g === "hepsi" ? all : g === "yonetim" ? all.filter(k => k.seviye !== "ekip") : all.filter(k => k.departman === g); }
function miniGrid(kid) {
  const g = mgrid(kid);
  return `<table class="mini" aria-label="Haftalık müsaitlik">${GUNLER.map(([, k], i) => `<tr><th>${k}</th>${g[i].split("").map((c, s) => `<td class="st-${c === "." ? "u" : c}" title="${GUNLER[i][2]} ${hh(s)} · ${({ m: "Müsait", d: "Ders", x: "Meşgul" })[c] || "Bilinmiyor"}"></td>`).join("")}</tr>`).join("")}</table>`;
}
function vMusait() {
  const tab = S.m.tab;
  const t = (k, ad) => `<button class="tab${tab === k ? " on" : ""}" data-act="m-tab" data-tab="${k}">${ad}</button>`;
  return `${banner()}
  <header><div class="eyebrow">Ekip <i>•</i> haftalık program</div><h1 class="h-xl">Müsaitlik</h1>
  <p class="lead">Kim hangi saatte derste, kim boş. Ortak toplantı saatini ve etkinlik günü görev alabilecekleri buradan bulun. Çizelge 08:00–22:00 arasını saatlik dilimlerle tutar.</p></header>
  <nav class="tabs">${t("ozet", "Özet")}${t("duzenle", "Programı düzenle")}</nav>
  ${tab === "duzenle" ? mDuzenle() : mOzetView()}`;
}
function mOzetView() {
  const g = S.m.grup; const uy = grupUyeleri(g); const known = uy.filter(p => mVar(p.id));
  const gc = (k, ad) => `<button class="gchip${g === k ? " on" : ""}" data-act="m-grup" data-g="${k}">${esc(ad)}</button>`;
  const chips = `<div class="gchips">${gc("hepsi", "Tüm ekip")}${gc("yonetim", "Başkanlar ve yardımcılar")}${DEPTS.map(d => gc(d.id, d.ad)).join("")}</div>`;
  if (!known.length) return chips + `<div class="empty"><h3>Müsaitlik bilgisi henüz girilmedi</h3><p>Ekibin ders programları geldiğinde burada saat saat kimin boş olduğu, en uygun toplantı saatleri ve kişi bazında özet görünecek. ${editable() ? "Bilgileri “Programı düzenle” sekmesinden kişi kişi girebilirsiniz." : ""}</p></div>`;
  const C = GUNLER.map((_, di) => Array.from({ length: SAATN }, (_, s) => { const o = { m: [], d: [], x: [], u: [] }; known.forEach(p => { const c = mgrid(p.id)[di][s]; (o[c === "." ? "u" : c] || o.u).push(p.id); }); return o; }));
  const N = known.length;
  const lvl = n => n === 0 ? "" : n / N >= .85 ? "h4" : n / N >= .6 ? "h3" : n / N >= .35 ? "h2" : "h1";
  const heat = `<div class="hscroll"><table class="heat"><thead><tr><th></th>${GUNLER.map(([, k]) => `<th>${k}</th>`).join("")}</tr></thead><tbody>${Array.from({ length: SAATN }, (_, s) => `<tr><th class="hr">${hh(s)}</th>${GUNLER.map((_, di) => { const n = C[di][s].m.length; return `<td><button class="hc ${lvl(n)}${S.m.slot === di + "-" + s ? " on" : ""}" data-act="m-slot" data-slot="${di}-${s}" aria-label="${GUNLER[di][2]} ${hh(s)}: ${n} kişi müsait">${n}<small>/${N}</small></button></td>`; }).join("")}</tr>`).join("")}</tbody></table></div>`;
  // en uygun iki saatlik pencereler
  const ad = [];
  for (let di = 0; di < 7; di++) for (let s = 0; s < SAATN - 1; s++) { const b = new Set(C[di][s + 1].m); const both = C[di][s].m.filter(id => b.has(id)); ad.push({ di, s, ids: both }); }
  ad.sort((a, b) => b.ids.length - a.ids.length || (a.di > 4) - (b.di > 4) || a.di - b.di || a.s - b.s);
  const best = []; for (const a of ad) { if (best.length >= 6 || !a.ids.length) break; if (best.some(b => b.di === a.di && Math.abs(b.s - a.s) < 2)) continue; best.push(a); }
  const names = ids => ids.map(id => kisi(id)?.ad || "?").join(", ");
  let detail = "";
  if (S.m.slot) {
    const [di, s] = S.m.slot.split("-").map(Number); const o = C[di]?.[s];
    if (o) detail = `<div class="panel" style="margin-top:16px"><h3 class="h-md" style="margin-bottom:10px">${GUNLER[di][2]} ${hh(s)}–${hh(s + 1)}</h3>
      ${[["m", "Müsait"], ["d", "Derste"], ["x", "Meşgul"], ["u", "Bilgi yok"]].map(([k, a]) => o[k].length ? `<p class="mini-lbl" style="margin:12px 0 6px">${a} (${o[k].length})</p><div class="chips">${o[k].map(id => `<button class="pchip" data-act="kisi" data-id="${esc(id)}">${chip(id)}</button>`).join("")}</div>` : "").join("")}</div>`;
  }
  const missing = uy.filter(p => !mVar(p.id));
  return chips + `<div class="mlayout">
    <div style="min-width:0"><p class="mini-lbl" style="margin:0 0 10px">Her hücre o saatte müsait kişi sayısı · bilgisi olan ${N} kişi</p>${heat}
      <div class="brush" style="margin-top:12px"><span class="mini-lbl" style="align-self:center">Koyu yeşil = neredeyse herkes boş. Hücreye tıklayınca isimler açılır.</span></div>${detail}</div>
    <div class="panel"><h2 class="h-md">En uygun toplantı saatleri</h2>
      ${best.length ? `<ol class="best">${best.map(b => { const miss = known.filter(p => !b.ids.includes(p.id)).map(p => p.id); return `<li><b>${GUNLER[b.di][2]} ${hh(b.s)}–${hh(b.s + 2)}</b><small>${b.ids.length}/${N} kişi müsait${miss.length ? ` · gelemeyebilir: ${esc(names(miss))}` : " · herkes müsait"}</small></li>`; }).join("")}</ol>` : `<p class="faint">İki saat üst üste müsait olan ortak bir dilim bulunamadı.</p>`}
      ${missing.length ? `<p class="mtext faint">Bilgisi eksik: ${esc(names(missing.map(p => p.id)))}</p>` : ""}
    </div>
  </div>
  <h2 class="h-md" style="margin-top:36px">Kişi bazında</h2>
  <div class="tbl-wrap"><table class="list ptable"><thead><tr><th>Kişi</th><th>Ders</th><th>Müsait</th><th>Meşgul</th><th>En boş gün</th><th>Not</th></tr></thead><tbody>
  ${uy.map(p => { const has = mVar(p.id); const o = mOzet(p.id); const g = mgrid(p.id); const bi = has ? g.map((s, i) => [i, (s.match(/m/g) || []).length]).filter(x => x[0] < 5).sort((a, b) => b[1] - a[1])[0] : null; const rec = S.musaitlik.get(p.id);
    return `<tr><td><button class="linkbtn" style="text-decoration:none;color:var(--fg)" data-act="kisi" data-id="${esc(p.id)}">${chip(p.id)}</button></td>${has ? `<td>${o.d} sa</td><td>${o.m} sa</td><td>${o.x} sa</td><td>${bi && bi[1] ? `${GUNLER[bi[0]][2]} <small>(${bi[1]} sa)</small>` : "—"}</td>` : `<td colspan="4" class="faint">Bilgi girilmedi</td>`}<td class="faint">${esc(rec?.not || "")}</td></tr>`; }).join("")}
  </tbody></table></div>`;
}
function mDuzenle() {
  const ed = editable(); const ps = kisilerSirali();
  if (!ps.length) return `<div class="empty"><h3>Ekip listesi boş</h3><p>Önce Yönetim şemasına kişi ekleyin.</p></div>`;
  if (!S.m.kisi || !kisi(S.m.kisi)) S.m.kisi = (benKisi() || ps[0]).id;
  const kid = S.m.kisi; const g = mgrid(kid); const o = mOzet(kid); const rec = S.musaitlik.get(kid);
  const fr = (k, ad) => `<button class="${S.m.firca === k ? "on" : ""}" data-act="m-firca" data-f="${k}"><i class="sw st-${k}"></i>${ad}</button>`;
  return `<div class="toolbar"><label class="field" style="min-width:260px"><span>Kişi</span><select class="inp" id="m-kisi">${kisiOptions(kid).replace('<option value="">—</option>', "")}</select></label></div>
  ${ed ? `<div class="brush" role="radiogroup" aria-label="Fırça">${fr("m", "Müsait")}${fr("d", "Ders")}${fr("x", "Meşgul")}${fr("u", "Sil")}</div>` : ""}
  <div class="hscroll"><table class="mg"><thead><tr><th></th>${GUNLER.map(([, k, ad], i) => `<th>${ed ? `<button data-act="m-gun" data-day="${i}" title="${ad} gününün tamamını boya">${k}</button>` : k}</th>`).join("")}</tr></thead>
  <tbody>${Array.from({ length: SAATN }, (_, s) => `<tr><th>${ed ? `<button data-act="m-saat" data-s="${s}" title="${hh(s)} satırını hafta içi boya">${hh(s)}</button>` : hh(s)}</th>${GUNLER.map((_, di) => { const c = g[di][s]; return `<td><button class="mcell st-${c === "." ? "u" : c}" data-mc="${di}-${s}"${ed ? "" : " disabled"} aria-label="${GUNLER[di][2]} ${hh(s)}"></button></td>`; }).join("")}</tr>`).join("")}</tbody></table></div>
  <p class="hint">${ed ? "Fırçayı seçip hücrelere tıklayın; bilgisayarda basılı tutup sürükleyerek de boyayabilirsiniz. Gün adına tıklamak o günün tamamını, saate tıklamak o saati hafta içi her gün için boyar. Değişiklikler kendiliğinden kaydedilir." : "Salt okunur görünüm."}</p>
  <p class="mtext"><b>${o.d}</b> saat ders · <b>${o.m}</b> saat müsait · <b>${o.x}</b> saat meşgul${rec?.guncelleme ? ` <span class="faint">· güncellendi ${esc(goreli(rec.guncelleme))}</span>` : ""}</p>
  <div class="fgrid" style="margin-top:14px;max-width:760px">
    <label class="field" style="grid-column:1/-1"><span>Not</span><input class="inp" id="m-not" value="${esc(rec?.not || "")}" placeholder="örn. Salı akşamları part-time çalışıyor, cuma öğleden sonra atölyede"${ed ? "" : " disabled"}></label>
  </div>
  ${ed ? `<div class="mrow" style="margin-top:14px"><button class="btn ghost sm" data-act="m-bos">Boş kalanları müsait yap</button><button class="btn ghost sm" data-act="m-temizle">Programı temizle</button></div>` : ""}`;
}
function mYaz(kid, grid) {
  const gunler = {}; GUNLER.forEach(([k], i) => gunler[k] = grid[i]);
  const body = { gunler, guncelleme: nowISO(), guncelleyen: S.uid || "" };
  if (S.musaitlik.has(kid)) write("musaitlik", kid, "update", body); else write("musaitlik", kid, "set", { not: "", ...body });
  logla("m:" + kid, `${kisi(kid)?.ad || "bir üye"} için müsaitliği güncelledi`, kisi(kid)?.departman);
}
function paintCell(b) {
  const [di, s] = b.dataset.mc.split("-").map(Number); const f = S.m.firca === "u" ? "." : S.m.firca;
  const row = S.m.painting.grid[di]; S.m.painting.grid[di] = row.slice(0, s) + f + row.slice(s + 1);
  b.className = "mcell st-" + (f === "." ? "u" : f);
}
function paintEnd() { const p = S.m.painting; if (!p) return; S.m.painting = null; mYaz(p.kid, p.grid); render(); }

/* ---------- YÖNETİM ŞEMASI ---------- */
function vEkip() {
  const ps = kisilerSirali(); const ed = editable();
  const card = p => {
    const n = gorevlerOf().filter(g => g.sorumlu === p.id && g.durum !== "bitti").length;
    return `<button class="ocard ${p.seviye === "baskan" ? "baskan" : ""}" data-act="kisi" data-id="${esc(p.id)}"><span class="ol">${esc(p.rol || SEVIYE[p.seviye] || "")}</span><span class="on">${esc(p.ad)}</span>${p.aciklama ? `<p>${esc(p.aciklama)}</p>` : ""}<span class="ot">${n ? `${n} açık görev` : "Açık görevi yok"}${mVar(p.id) ? "" : " · müsaitlik girilmedi"}</span></button>`;
  };
  return `${banner()}
  <header class="hero-row"><div>
    <div class="eyebrow">ESOGÜ Otomotiv Kulübü <i>•</i> 2026–2027 dönemi</div>
    <h1 class="h-xl">Yönetim şeması</h1>
    <p class="lead">${DEPTS.length} birim, ${ps.length} görev. Renkli kartlar departman başkanlarını, koyu kartlar başkan yardımcılarını ve ekip üyelerini gösterir. Bir karta tıklayınca kişinin görevleri ve haftalık programı açılır.</p>
  </div><div class="ostats"><div class="obox"><b>${ps.length}</b><span>Atanmış görev</span></div><div class="obox outline"><b>${DEPTS.length}</b><span>Birim</span></div></div></header>
  ${ed ? `<div class="toolbar" style="margin-top:22px"><button class="btn ghost" data-act="birim-new">+ Birim ekle</button></div>` : ""}
  <div class="lane"></div>
  ${S.db && !S.loaded.kisiler ? `<p class="loading">Yükleniyor…</p>` : `<div class="org">${DEPTS.map(d => { const m = ps.filter(p => p.departman === d.id); const ust = m.filter(p => p.seviye !== "ekip"), alt = m.filter(p => p.seviye === "ekip");
    return `<div class="ocol" style="--dc:var(--${d.k});--dct:var(--${d.k}t)"><div class="dcol-top"><span class="dno">${d.no}</span><span class="mini-lbl">${m.length} dolu</span></div><h3>${esc(d.ad)}</h3>${ust.map(card).join("")}${alt.length ? `<div class="odiv">EKİP</div>${alt.map(card).join("")}` : ""}${ed ? `<button class="oadd" data-act="kisi-edit" data-dep="${d.id}">+ Kişi ekle</button>` : ""}</div>`; }).join("")}</div>`}`;
}
function kisiModal(id) {
  const k = kisi(id); if (!k) return; const d = DEP[k.departman] || DEPTS[0]; const ed = editable();
  const ts = gorevSirala(gorevlerOf().filter(g => g.sorumlu === id && acik(g)));
  const atadi = gorevSirala(gorevlerOf().filter(g => g.atayan === id && acik(g)));
  const has = mVar(id); const o = mOzet(id); const ben = benKisi();
  modal(`<div style="--dc:var(--${d.k});--dct:var(--${d.k}t)">
    <div class="eyebrow" style="color:var(--dct)">${d.no} · ${esc(d.ad)}</div>
    <h2>${esc(k.ad)}</h2><p class="mrole">${esc(k.rol || SEVIYE[k.seviye] || "")}</p>
    ${k.aciklama ? `<p class="mtext">${esc(k.aciklama)}</p>` : ""}
    <h3 class="mh">Ona atanan (${ts.length})</h3>
    ${ts.length ? `<ul class="gl flush">${ts.map(g => gorevSatir(g, { dep: true })).join("")}</ul>` : `<p class="mtext faint" style="margin:0">Açık görevi yok.</p>`}
    ${atadi.length ? `<h3 class="mh">Onun atadıkları (${atadi.length})</h3><ul class="gl flush">${atadi.map(g => gorevSatir(g, { dep: true, kisi: true, atayan: false })).join("")}</ul>` : ""}
    <h3 class="mh">Haftalık program</h3>
    ${has ? miniGrid(id) + `<p class="mtext faint">${o.d} saat ders · ${o.m} saat müsait · ${o.x} saat meşgul${S.musaitlik.get(id)?.not ? " · " + esc(S.musaitlik.get(id).not) : ""}</p>` : `<p class="mtext faint" style="margin:0">Henüz girilmedi.</p>`}
    <div class="mact">
      ${ed ? `<button class="btn ghost sm" data-act="task-new" data-dep="${esc(k.departman)}" data-kisi="${esc(id)}">+ Görev ata</button><button class="btn ghost sm" data-act="m-kisi" data-id="${esc(id)}">Programı düzenle</button><button class="btn ghost sm" data-act="kisi-edit" data-id="${esc(id)}">Bilgileri düzenle</button>` : ""}
      ${!ben && !(k.hesap && k.hesap !== S.uid) ? `<button class="btn ghost sm" data-act="kisi-ben" data-id="${esc(id)}">Bu benim</button>` : ""}
      ${k.hesap && k.hesap === S.uid ? `<span class="faint">Bu kart senin hesabına bağlı.</span>` : ""}
      <span class="sp"></span><button class="btn" data-act="modal-close">Kapat</button>
    </div></div>`);
}
function kisiForm(id, dep) {
  const k = id ? kisi(id) : { departman: dep, seviye: "ekip" }; if (!k) return;
  modal(`<form data-form="kisi-save" data-id="${esc(id || "")}">
    <h2>${id ? "Kişiyi düzenle" : "Yeni kişi"}</h2>
    <div class="form">
      <div class="fgrid">
        <label class="field"><span>Ad soyad</span><input class="inp" name="ad" required value="${esc(k.ad || "")}" autofocus></label>
        <label class="field"><span>Görev unvanı</span><input class="inp" name="rol" value="${esc(k.rol || "")}" placeholder="örn. Sorumlu"></label>
        <label class="field"><span>Birim</span><select class="inp" name="departman">${DEPTS.map(x => `<option value="${x.id}"${x.id === k.departman ? " selected" : ""}>${esc(x.ad)}</option>`).join("")}</select></label>
        <label class="field"><span>Kademe</span><select class="inp" name="seviye">${Object.entries(SEVIYE).map(([v, a]) => `<option value="${v}"${v === k.seviye ? " selected" : ""}>${a}</option>`).join("")}</select></label>
      </div>
      <label class="field"><span>Sorumlulukları</span><textarea class="inp" name="aciklama" rows="3">${esc(k.aciklama || "")}</textarea></label>
    </div>
    <div id="del-area" class="confirm" hidden><p>${esc(k.ad || "")} ekipten çıkarılır. Görevleri ve tablolardaki atamaları “silinmiş kişi” olarak kalır.</p><button type="button" class="btn danger" data-act="kisi-del-ok" data-id="${esc(id || "")}">Evet, çıkar</button></div>
    <div class="mact">${id ? `<button type="button" class="btn ghost" data-act="kisi-del">Ekipten çıkar</button>` : ""}<span class="sp"></span><button type="button" class="btn ghost" data-act="modal-close">Vazgeç</button><button class="btn">Kaydet</button></div>
  </form>`);
}
function benSecModal() {
  modal(`<h2>Ekipte ben kimim?</h2><p class="mtext">Kendi kartını seç. Böylece sana atanan ve senin atadığın görevler ayrı ayrı listelenir${editable() ? ", atadığın görevlerde adın görünür" : ". Düzenleme yetkin olmadığı için seçimin yalnızca bu tarayıcıda saklanır"}.</p>
    <div class="pickl">${kisilerSirali().map(p => `<button data-act="kisi-ben" data-id="${esc(p.id)}"${p.hesap && p.hesap !== S.uid ? " disabled" : ""}><b>${esc(p.ad)}</b><small>${esc(p.rol || SEVIYE[p.seviye])} · ${esc(DEP[p.departman]?.ad || "")}${p.hesap && p.hesap !== S.uid ? " · başka hesaba bağlı" : ""}</small></button>`).join("")}</div>
    <div class="mact"><span class="sp"></span><button class="btn ghost" data-act="modal-close">Vazgeç</button></div>`, { wide: true });
}
function helpModal() {
  modal(`<h2>Site nasıl kullanılır?</h2>
  <h3 class="mh">Kim düzenleyebilir?</h3>
  <p class="mtext">Siteyi linke tıklayan herkes görüntüler. Değişiklik yapmak için Google ile giriş yapmak ve site sahibinin <b>Yetkililer</b> listesinde olmak gerekir. Bu kural veritabanında uygulanır: listede olmayan biri görev atayamaz, tabloya yazamaz, etkinlik ya da belge ekleyemez.</p>
  <h3 class="mh">Ekip ve görevler</h3>
  <p class="mtext">Her departmanın açılış sayfasında departmandaki herkesin kendi kartı var. Kartta o kişiye atanan görevler, kimin atadığı ve son tarihler görünür; herkes herkesi görür. Üstteki düğmelerle tek bir kişiye, sana atananlara ya da senin atadıklarına bakabilirsin. Görevin solundaki yuvarlak durumu değiştirir: boş yapılacak, yarım dolu devam ediyor, tikli bitti.</p>
  <h3 class="mh">Tablolar (Excel gibi)</h3>
  <p class="mtext">Tabloları siz açarsınız: boş tablo ya da elinizdeki .xlsx / .csv dosyası. Hücreye tıklayıp yazın; onay kutularına tek tıkla işaret koyun; satır numarasına tıklayınca o satırın tüm alanları ve notu açılır. Excel'de kopyaladığınız alanı seçili hücreye yapıştırabilirsiniz. “Excel indir” ile geri alırsınız.</p>
  <h3 class="mh">Belgeler ve dosyalar</h3>
  <p class="mtext">Belgeler sekmesine bilgisayardan her türden dosya yüklenir (tür ve boyut sınırı yok) ya da Drive linki eklenir. Tablolar sekmesine tabloların yanında PDF ve JPG gibi dosyalar da eklenebilir. Bir tablodaki “Belge” sütunu, eklenen bir belgeyi ilgili satıra bağlar.</p>
  <h3 class="mh">Birimler</h3>
  <p class="mtext">Yetkililer menüdeki “+ Birim ekle” ile departmanların yanına yeni birim açar (örneğin Yönetim Kurulu). Her birimin kendi ekip kartları, görevleri, tabloları ve belgeleri olur. Kişiler Yönetim şeması sayfasından birime eklenir.</p>
  <h3 class="mh">Etkinlikler</h3>
  <p class="mtext">Kulübün takvimi. Yaklaşan etkinlikler genel bakışta da görünür; tarih, saat, yer, sorumlu ve kayıt linki eklenebilir.</p>
  <h3 class="mh">Müsaitlik</h3>
  <p class="mtext">Her üyenin haftalık programı 08:00–22:00 arasında saatlik tutulur: müsait, ders, meşgul. Özet sekmesi en uygun ortak toplantı saatlerini ve o saatte kimin boş olduğunu gösterir.</p>
  <div class="mact"><span class="sp"></span><button class="btn" data-act="modal-close">Tamam</button></div>`, { wide: true });
}


/* ---------- ETKİNLİKLER ---------- */
const etkSira = (a, b) => String(a.tarih || "").localeCompare(b.tarih || "") || String(a.saat || "").localeCompare(b.saat || "");
function etkinlikListe() { return [...S.etkinlikler.entries()].map(([id, e]) => ({ ...e, id })); }
function yaklasanEtk() { return etkinlikListe().filter(e => !e.iptal && (gunFark(e.tarih) ?? -1) >= 0).sort(etkSira); }
function etkRenk(e) { const d = DEP[e.departman]; return d ? `--dc:var(--${d.k});--dct:var(--${d.k}t);--dcon:var(--onk)` : "--dc:var(--fg);--dct:var(--muted);--dcon:var(--bg)"; }
function etkKart(e) {
  const t = tarihParca(e.tarih); const d = DEP[e.departman]; const f = gunFark(e.tarih);
  const yakin = f === 0 ? "Bugün" : f === 1 ? "Yarın" : f > 1 && f <= 7 ? `${f} gün sonra` : "";
  return `<button class="etk${e.iptal ? " iptal" : ""}" data-act="etk" data-id="${esc(e.id)}" style="${etkRenk(e)}">
    <span class="etk-d"><b>${t ? t.getDate() : "?"}</b><small>${t ? esc(t.toLocaleDateString("tr-TR", { month: "short" })) : ""}</small><small>${t ? esc(t.toLocaleDateString("tr-TR", { weekday: "short" })) : ""}</small></span>
    <span class="etk-b"><span class="etk-t">${esc(e.ad)}</span>
      <span class="tmeta">${yakin && !e.iptal ? `<span class="pill info">${yakin}</span>` : ""}${e.iptal ? `<span class="pill bad">İptal</span>` : ""}${e.saat ? `<span>${esc(e.saat)}</span>` : ""}${e.yer ? `<span>${esc(e.yer)}</span>` : ""}${d ? `<span class="chip"><i class="dot" style="background:var(--${d.k})"></i>${esc(d.ad)}</span>` : `<span>Tüm kulüp</span>`}${e.sorumlu ? chip(e.sorumlu) : ""}</span>
      ${e.aciklama ? `<span class="etk-a">${esc(e.aciklama)}</span>` : ""}</span>
  </button>`;
}
function vEtkinlik() {
  const ed = editable(); const all = etkinlikListe(); const yuk = S.db && !S.loaded.etkinlikler;
  const gelecek = all.filter(e => (gunFark(e.tarih) ?? -1) >= 0).sort(etkSira);
  const gecmis = all.filter(e => (gunFark(e.tarih) ?? -1) < 0).sort((a, b) => etkSira(b, a));
  const gs = S.gecmisHepsi ? gecmis : gecmis.slice(0, 6);
  return `${banner()}
  <header><div class="eyebrow">Kulüp takvimi <i>•</i> 2026–2027 dönemi</div><h1 class="h-xl">Etkinlikler</h1>
  <p class="lead">Seminerler, geziler, toplantılar ve kulübün diğer etkinlikleri. Bir etkinliğe tıklayınca ayrıntıları açılır.</p></header>
  ${ed ? `<div class="toolbar" style="margin-top:24px"><button class="btn" data-act="etk-new">+ Etkinlik ekle</button></div>` : `<div style="height:24px"></div>`}
  <h2 class="h-md">Yaklaşan</h2>
  ${yuk ? `<p class="loading">Yükleniyor…</p>` : gelecek.length ? `<div class="etk-list">${gelecek.map(etkKart).join("")}</div>` : `<div class="empty"><h3>Yaklaşan etkinlik yok</h3><p>${ed ? "“+ Etkinlik ekle” ile ilk etkinliği girin." : "Etkinlikler eklendiğinde burada görünür."}</p></div>`}
  ${gecmis.length ? `<h2 class="h-md" style="margin-top:36px">Geçmiş</h2><div class="etk-list">${gs.map(etkKart).join("")}</div>${gecmis.length > gs.length ? `<button class="addrow" data-act="gecmis-hepsi">Tüm geçmiş etkinlikleri göster (${gecmis.length})</button>` : ""}` : ""}`;
}
function etkModal(id) {
  const e = id ? S.etkinlikler.get(id) : { departman: benKisi()?.departman || "", tarih: "" }; if (!e) return;
  const ed = editable(); const link = safeUrl(e.link);
  if (!ed) {
    modal(`<div style="${etkRenk(e)}">
      <div class="eyebrow">${esc(DEP[e.departman]?.ad || "Tüm kulüp")}</div>
      <h2>${esc(e.ad)}</h2>
      <p class="mtext">${esc(fmtTarih(e.tarih, true))}${e.saat ? " · " + esc(e.saat) : ""}${e.yer ? " · " + esc(e.yer) : ""}${e.iptal ? ` · <span class="pill bad">İptal</span>` : ""}</p>
      ${e.aciklama ? `<p class="mtext" style="white-space:pre-wrap">${esc(e.aciklama)}</p>` : ""}
      ${e.sorumlu ? `<p class="mtext">Sorumlu: ${chip(e.sorumlu)}</p>` : ""}
      ${link ? `<p class="mtext"><a class="cell-link" href="${esc(link)}" target="_blank" rel="noopener noreferrer">Kayıt / ayrıntı linki ↗</a></p>` : ""}
      <div class="mact"><span class="sp"></span><button class="btn" data-act="modal-close">Kapat</button></div></div>`);
    return;
  }
  modal(`<form data-form="etk-save" data-id="${esc(id || "")}" style="${etkRenk(e)}">
    <h2>${id ? "Etkinliği düzenle" : "Yeni etkinlik"}</h2>
    <div class="form">
      <label class="field"><span>Etkinlik adı</span><input class="inp" name="ad" required value="${esc(e.ad || "")}"${id ? "" : " autofocus"}></label>
      <div class="fgrid">
        <label class="field"><span>Tarih</span><input class="inp" type="date" name="tarih" required value="${esc(e.tarih || "")}"></label>
        <label class="field"><span>Saat</span><input class="inp" name="saat" placeholder="örn. 14:00–16:00" value="${esc(e.saat || "")}"></label>
        <label class="field"><span>Yer</span><input class="inp" name="yer" value="${esc(e.yer || "")}"></label>
        <label class="field"><span>Birim</span><select class="inp" name="departman"><option value="">Tüm kulüp</option>${DEPTS.map(x => `<option value="${x.id}"${x.id === e.departman ? " selected" : ""}>${esc(x.ad)}</option>`).join("")}</select></label>
        <label class="field"><span>Sorumlu</span><select class="inp" name="sorumlu">${kisiOptions(e.sorumlu || "", e.departman)}</select></label>
        <label class="field"><span>Kayıt / ayrıntı linki</span><input class="inp" name="link" placeholder="https://…" value="${esc(e.link || "")}"></label>
      </div>
      <label class="field"><span>Açıklama</span><textarea class="inp" name="aciklama" rows="4">${esc(e.aciklama || "")}</textarea></label>
      <label class="field check"><input type="checkbox" name="iptal"${e.iptal ? " checked" : ""}><span>İptal edildi</span></label>
    </div>
    <div id="del-area" class="confirm" hidden><p>Etkinlik silinecek. Hemen ardından çıkan bildirimden geri alabilirsin.</p><button type="button" class="btn danger" data-act="etk-del" data-id="${esc(id || "")}">Evet, sil</button></div>
    <div class="mact">${id ? `<button type="button" class="btn ghost" data-act="del-ac">Sil</button>` : ""}<span class="sp"></span><button type="button" class="btn ghost" data-act="modal-close">Vazgeç</button><button class="btn">${id ? "Kaydet" : "Etkinliği ekle"}</button></div>
  </form>`);
}
function etkSave(f) {
  const fd = new FormData(f); const id = f.dataset.id || newId("e"); const old = S.etkinlikler.get(id);
  const ham = String(fd.get("link") || "").trim(); const link = ham ? safeUrl(ham) : "";
  if (ham && !link) { toast("Link http:// ya da https:// ile başlamalı."); return; }
  const body = { ad: String(fd.get("ad") || "").trim(), tarih: String(fd.get("tarih") || ""), saat: String(fd.get("saat") || "").trim(), yer: String(fd.get("yer") || "").trim(), departman: String(fd.get("departman") || ""), sorumlu: String(fd.get("sorumlu") || ""), link, aciklama: String(fd.get("aciklama") || ""), iptal: fd.get("iptal") === "on", guncelleme: nowISO() };
  if (!body.ad || !body.tarih) return;
  if (old) write("etkinlikler", id, "update", body);
  else write("etkinlikler", id, "set", { ...body, olusturan: S.uid || "", olusturanAd: S.kullanici?.ad || "", olusturma: nowISO() });
  logla("etk:" + id, `“${body.ad}” etkinliğini ${old ? "güncelledi" : "ekledi"}`, body.departman);
  closeModal();
}

/* ---------- YETKİLİLER (site sahibi) ---------- */
const KOLEKSIYONLAR = ["birimler", "kisiler", "gorevler", "etkinlikler", "dosyalar", "belgeler", "musaitlik"];
const epostaMi = e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
function vYetki() {
  const head = `<header><div class="eyebrow">Site ayarları</div><h1 class="h-xl">Yetkililer</h1>
    <p class="lead">Bu listedeki Gmail hesapları görev atayabilir; etkinlik, tablo, belge ve kişi ekleyip düzenleyebilir. Listede olmayanlar siteyi yalnızca görüntüler. Listeyi yalnızca site sahibi değiştirebilir.</p></header>`;
  if (!S.kullanici) return head + `<div class="empty" style="margin-top:24px"><h3>Önce giriş yap</h3><p style="margin-top:12px"><button class="btn" data-act="giris">Google ile giriş yap</button></p></div>`;
  if (!editable()) return head + `<div class="empty" style="margin-top:24px"><h3>Bu sayfayı yalnızca yetkililer görebilir</h3><p>${esc(S.kullanici.eposta)} hesabı yetkili listesinde değil.</p></div>`;
  const list = (S.yetkililer || []).slice().sort();
  return head + `
  ${S.sahip ? `<form class="qadd" data-form="yetkili-ekle" style="margin-top:24px"><input class="inp grow" id="yetkili-eposta" name="eposta" type="email" placeholder="ornek@gmail.com" required aria-label="Eklenecek e-posta"><button class="btn">Yetkili ekle</button></form>` : `<div style="height:24px"></div>`}
  <div class="panel"><ul class="rows">
    <li><span class="what"><b>${esc(S.sahipEposta || "")}</b><small>Site sahibi · listeyi değiştirebilir</small></span></li>
    ${list.map(e => `<li><span class="what"><b>${esc(e)}</b><small>Düzenleyebilir</small></span>${S.sahip ? `<button class="btn ghost sm" data-act="yetkili-sil" data-e="${esc(e)}">Listeden çıkar</button>` : ""}</li>`).join("")}
  </ul>${list.length ? "" : `<p class="faint">Henüz başka yetkili yok. Eklediğin kişi siteye kendi Gmail hesabıyla giriş yaptığında düzenleyebilir.</p>`}</div>
  ${S.sahip ? `<h2 class="h-md" style="margin-top:36px">Veri</h2>
  <div class="mrow">${S.kisiler.size ? "" : `<button class="btn" data-act="ekip-yukle">Yönetim şemasındaki ekibi yükle</button>`}<button class="btn ghost" data-act="json-indir">Tüm veriyi yedekle (JSON)</button><button class="btn ghost" data-act="json-sec">Yedekten geri yükle</button><input type="file" id="json-file" accept=".json,application/json" hidden></div>
  <p class="hint">Yedek dosyası kişileri, görevleri, etkinlikleri, tabloları, belgeleri ve müsaitliği içerir. Geri yükleme, yedekteki kayıtları aynı kimlikle yeniden yazar; yedekte olmayan kayıtlara dokunmaz.</p>` : ""}`;
}
async function yetkiliYaz(list, mesaj) {
  if (await yaz(() => S.db.doc("ayarlar/yetkililer").set({ sahip: S.sahipEposta, emails: list }))) { S.yetkililer = list; render(); toast(mesaj); }
}
function dosyaIndir(ad, blob) {
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = ad; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
function jsonYedekModal(j) {
  S.jsonYedek = j;
  const say = KOLEKSIYONLAR.map(c => [c, Object.keys(j[c] || {}).length]).filter(x => x[1]);
  modal(`<h2>Yedekten geri yükle</h2>
    <p class="mtext">${say.length ? say.map(([c, n]) => `${n} ${({ birimler: "birim", kisiler: "kişi", gorevler: "görev", etkinlikler: "etkinlik", dosyalar: "tablo", belgeler: "belge", musaitlik: "müsaitlik kaydı" })[c]}`).join(", ") + " yeniden yazılacak." : "Dosyada geri yüklenecek kayıt bulunamadı."}</p>
    <div class="mact"><span class="sp"></span><button class="btn ghost" data-act="modal-close">Vazgeç</button>${say.length ? `<button class="btn" data-act="json-onay">Geri yükle</button>` : ""}</div>`);
}


/* ---------- BİRİMLER ---------- */
const RENKLER = ["k5", "k6", "k7", "k8", "k1", "k2", "k3", "k4"];
function birimleriKur() {
  const ozel = [...S.birimler.entries()].map(([id, b]) => ({ id, ad: b.ad || "Yeni birim", k: RENKLER.includes(b.renk) ? b.renk : "k5", ozel: true, sira: b.sira ?? 50, olusturma: b.olusturma || "" }))
    .sort((a, b) => a.sira - b.sira || String(a.olusturma).localeCompare(b.olusturma));
  DEPTS = [...SABIT_BIRIMLER, ...ozel.map((b, i) => ({ ...b, no: pad(SABIT_BIRIMLER.length + i + 1) }))];
  DEP = Object.fromEntries(DEPTS.map(d => [d.id, d]));
}
function birimIcerik(id) {
  return { kisi: kisilerSirali(id).length, gorev: gorevlerOf(id).length, tablo: dosyalarOf(id).length, belge: [...S.belgeler.values()].filter(b => b.departman === id).length };
}
function birimModal(id) {
  const b = id ? S.birimler.get(id) : { ad: "", renk: RENKLER[S.birimler.size % 4] }; if (!b) return;
  const ic = id ? birimIcerik(id) : null; const dolu = ic && (ic.kisi + ic.gorev + ic.tablo + ic.belge);
  modal(`<form data-form="birim-save" data-id="${esc(id || "")}">
    <h2>${id ? "Birim ayarları" : "Yeni birim"}</h2>
    ${id ? "" : `<p class="mtext">Yeni birim, departmanların yanında kendi sayfasıyla açılır: ekip kartları, görev atama, tablolar ve belgeler. Kişileri Yönetim şeması sayfasından bu birime ekleyebilirsin.</p>`}
    <div class="form">
      <label class="field"><span>Birim adı</span><input class="inp" name="ad" required value="${esc(b.ad || "")}" placeholder="örn. Yönetim Kurulu" autofocus></label>
      <div class="field"><span>Renk</span><div class="renkler" role="radiogroup" aria-label="Birim rengi">${RENKLER.map(k => `<label class="renk"><input type="radio" name="renk" value="${k}"${k === b.renk ? " checked" : ""} aria-label="Renk ${k.slice(1)}"><i style="background:var(--${k})"></i></label>`).join("")}</div></div>
    </div>
    ${id ? `<div id="del-area" class="confirm" hidden>${dolu
      ? `<p>Bu birimde ${[ic.kisi && ic.kisi + " kişi", ic.gorev && ic.gorev + " görev", ic.tablo && ic.tablo + " tablo", ic.belge && ic.belge + " belge"].filter(Boolean).join(", ")} var. Silmeden önce bunları başka bir birime taşı.</p>`
      : `<p>${esc(b.ad)} birimi silinecek. Hemen ardından çıkan bildirimden geri alabilirsin.</p><button type="button" class="btn danger" data-act="birim-sil" data-id="${esc(id)}">Evet, birimi sil</button>`}</div>` : ""}
    <div class="mact">${id ? `<button type="button" class="btn ghost" data-act="del-ac">Birimi sil</button>` : ""}<span class="sp"></span><button type="button" class="btn ghost" data-act="modal-close">Vazgeç</button><button class="btn">${id ? "Kaydet" : "Birimi aç"}</button></div>
  </form>`);
}
function birimKaydet(f) {
  const fd = new FormData(f); const ad = String(fd.get("ad") || "").trim(); if (!ad) return;
  const renk = RENKLER.includes(String(fd.get("renk"))) ? String(fd.get("renk")) : "k5"; const id = f.dataset.id;
  if (id) { write("birimler", id, "update", { ad, renk, guncelleme: nowISO() }); logla("birim:" + id, `${ad} biriminin ayarlarını değiştirdi`, id); closeModal(); return; }
  const yeni = "b-" + slug(ad) + "-" + rnd().slice(0, 3);
  write("birimler", yeni, "set", { ad, renk, sira: 50, olusturma: nowISO(), olusturan: S.uid || "", olusturanAd: S.kullanici?.ad || "" });
  logla("birim:" + yeni, `${ad} birimini açtı`, yeni);
  closeModal(); go(yeni); toast(`${ad} birimi açıldı`);
}

/* ---------- DOSYA YÜKLEME ---------- */
const boyutYaz = n => !n ? "" : n < 1048576 ? Math.max(1, Math.round(n / 1024)) + " KB" : n < 1073741824 ? (n / 1048576).toFixed(1).replace(".", ",") + " MB" : (n / 1073741824).toFixed(2).replace(".", ",") + " GB";
const dosyaAdiTemiz = ad => String(ad || "dosya").replace(/[\\/#?\[\]*\u0000-\u001f]/g, "_").slice(-120);
const resimMi = b => /^image\//.test(b.contentType || "") || /\.(jpe?g|png|gif|webp|bmp|svg|heic|avif)$/i.test(b.ad || "");
const uzanti = b => (String(b.ad || "").includes(".") ? String(b.ad).split(".").pop() : "").slice(0, 5).toUpperCase();
function belgelerOf(dep, alan) {
  return [...S.belgeler.entries()].filter(([, b]) => b.departman === dep && (alan === "tablolar" ? b.alan === "tablolar" : b.alan !== "tablolar"))
    .sort((a, b) => String(b[1].tarih || "").localeCompare(a[1].tarih || ""));
}
function yuklemeHTML() {
  const y = S.yuklenen; if (!y) return "";
  return `<div class="yukleme" id="yukleme" role="status"><span>Yükleniyor${y.kalan > 1 ? ` (${y.kalan} dosya)` : ""}:</span><b>${esc(y.ad)}</b><div class="bar"><i style="width:${Math.round(y.oran * 100)}%"></i></div><span id="yukleme-oran">%${Math.round(y.oran * 100)}</span><button class="btn ghost sm" data-act="yukleme-iptal">İptal</button></div>`;
}
function depoMesaj(e, ad) {
  const c = e && e.code;
  if (c === "depo_yok") return "Dosya yükleme henüz açılmadı: Firebase'de Storage kurulmalı (KURULUM.md, 5. adım).";
  if (c === "izin") return "Dosya yükleme izni yok. Yetkili hesapla giriş yaptığından emin ol; Storage kuralları da yayımlanmış olmalı.";
  if (c === "kota") return "Dosya deposunun kotası doldu. Kullanılmayan dosyaları sil ya da Firebase planını kontrol et.";
  if (c === "iptal") return `${ad} yüklemesi iptal edildi.`;
  if (c === "unavailable") return "Dosya deposuna ulaşılamadı. Storage açılmamış olabilir ya da internet bağlantısı koptu.";
  return `${ad} yüklenemedi: ${(e && e.message) || e}`;
}
async function yukle(files, dep, alan) {
  files = [...files]; if (!files.length) return;
  if (!editable()) { toast(S.kullanici ? "Dosya yüklemek için yetkili listesinde olmalısın." : "Dosya yüklemek için Google ile giriş yap."); return; }
  if (!S.depo) { toast(depoMesaj({ code: "depo_yok" })); return; }
  if (S.yuklenen) { toast("Bir yükleme sürüyor, bitince tekrar dene."); return; }
  let n = 0;
  for (let i = 0; i < files.length; i++) {
    const f = files[i]; const id = newId("b"); const yol = `belgeler/${dep}/${id}-${dosyaAdiTemiz(f.name)}`;
    S.yuklenen = { ad: f.name, oran: 0, kalan: files.length - i }; render();
    try {
      S.yuklemeKontrol = {};
      const r = await S.depo.yukle(yol, f, o => {
        S.yuklenen.oran = o;
        const bar = $("#yukleme .bar i"), yz = $("#yukleme-oran");
        if (bar) bar.style.width = Math.round(o * 100) + "%"; if (yz) yz.textContent = "%" + Math.round(o * 100);
      }, S.yuklemeKontrol);
      write("belgeler", id, "set", { ad: f.name, departman: dep, alan: alan === "tablolar" ? "tablolar" : "belgeler", tur: "dosya", url: r.url, yol, boyut: r.boyut, contentType: r.tur, yukleyen: S.uid || "", yukleyenAd: S.kullanici?.ad || "", tarih: nowISO(), not: "" });
      logla("yukle:" + dep, `${DEP[dep]?.ad || ""} birimine dosya yükledi: ${f.name}`, dep); n++;
    } catch (e) { toast(depoMesaj(e, f.name)); if (e && ["depo_yok", "izin", "iptal", "unavailable"].includes(e.code)) break; }
  }
  S.yuklenen = null; S.yuklemeKontrol = null; render();
  if (n) toast(n === 1 ? `${files[0].name} yüklendi` : `${n} dosya yüklendi`);
}
function ekKart(id, b) {
  const ed = editable();
  return `<div class="fcard ek">
    <a class="ek-a" href="${esc(b.url || "#")}" target="_blank" rel="noopener noreferrer">
      ${resimMi(b) ? `<span class="ek-on"><img src="${esc(b.url)}" alt="${esc(b.ad)}" loading="lazy"></span>` : `<span class="ek-on ek-ikon">${esc(uzanti(b) || "DOSYA")}</span>`}
      <h3>${esc(b.ad)}</h3>
    </a>
    <div class="fmeta"><span>${esc(boyutYaz(b.boyut))}</span><span>${esc(goreli(b.tarih))}</span>${ed ? `<button class="btn ghost sm" data-act="belge" data-id="${esc(id)}">Düzenle</button>` : ""}</div>
  </div>`;
}

/* ---------- pencere ve bildirim ---------- */
function modal(html, o = {}) {
  const r = $("#modal-root");
  r.innerHTML = `<div class="mback" data-act="modal-close"></div><div class="modal${o.wide ? " wide" : ""}" role="dialog" aria-modal="true">${html}</div>`;
  r.hidden = false;
  const f = r.querySelector("[autofocus]"); if (f) f.focus(); else r.querySelector(".modal").setAttribute("tabindex", "-1"), r.querySelector(".modal").focus();
}
function closeModal() { const r = $("#modal-root"); if (r.hidden) return; r.hidden = true; r.innerHTML = ""; S.imp = null; if (S.view === "dosya") $("#grid")?.focus({ preventScroll: true }); }
function toast(msg, act) {
  const t = $("#toast"); t.innerHTML = "<span></span>"; t.firstChild.textContent = msg;
  if (act) { const b = document.createElement("button"); b.textContent = act.label; b.onclick = () => { t.hidden = true; act.fn(); }; t.appendChild(b); }
  t.hidden = false; clearTimeout(toast.tm); toast.tm = setTimeout(() => t.hidden = true, act ? 8000 : 3800);
}

/* ---------- olaylar ---------- */
const ACT = {
  "nav": el => go(el.dataset.v),
  "open": el => go("d-" + el.dataset.id),
  "dtab": el => { S.deptTab[el.dataset.dep] = el.dataset.tab; render(); },
  "kisi": el => kisiModal(el.dataset.id),
  "kisi-edit": el => kisiForm(el.dataset.id, el.dataset.dep),
  "kisi-del": () => { const a = $("#del-area"); if (a) a.hidden = false; },
  "kisi-del-ok": el => { const id = el.dataset.id; const k = kisi(id); if (!k) return; const bk = clone(k); write("kisiler", id, "delete"); logla("kisi:" + id, `${k.ad} kişisini ekipten çıkardı`, k.departman); closeModal(); toast(`${k.ad} ekipten çıkarıldı`, { label: "Geri al", fn: () => write("kisiler", id, "set", bk) }); },
  "kisi-ben": el => {
    const id = el.dataset.id; if (!kisi(id)) return;
    LS.set("ben", id);
    if (S.uid && editable()) {
      for (const [kid, k] of S.kisiler) if (k.hesap === S.uid && kid !== id) write("kisiler", kid, "update", { hesap: "" });
      write("kisiler", id, "update", { hesap: S.uid });
    }
    closeModal(); render(); toast(`Kartın seçildi: ${kisi(id)?.ad || ""}`);
  },
  "ben-sec": () => benSecModal(),
  "help": () => helpModal(),
  "backup": () => backupAll(),
  "sheet-new": el => newSheetModal(el.dataset.dep),
  "import": el => importModal(el.dataset.dep, el.dataset.into),
  "imp-go": () => impGo(),
  "export": () => exportDosya(),
  "sheet-settings": () => sheetModal(),
  "sheet-del": () => { const a = $("#del-area"); if (a) a.hidden = false; },
  "sheet-del-ok": () => {
    const id = S.dosyaId; const d = curDosya(); if (!d) return; const bk = clone(d);
    write("dosyalar", id, "delete"); logla("sheet:" + id, `${d.baslik} tablosunu sildi`, d.departman);
    closeModal(); go(d.departman);
    toast(`${d.baslik} silindi`, { label: "Geri al", fn: () => { write("dosyalar", id, "set", bk); render(); } });
  },
  "sheet-copy": () => {
    const d = curDosya(); if (!d) return; const rows = $("#copy-rows")?.checked;
    const body = clone(d); body.baslik = d.baslik + " (kopya)"; body.olusturma = body.guncelleme = nowISO(); body.guncelleyen = S.uid || ""; if (!rows) body.satirlar = {};
    const id = slug(body.baslik) + "-" + rnd().slice(0, 4); write("dosyalar", id, "set", body); logla("sheet:" + id, `${body.baslik} tablosunu oluşturdu`, d.departman); closeModal(); go("d-" + id);
  },
  "add-row": () => addRow(),
  "row": el => rowModal(el.dataset.r),
  "row-del": el => delRow(el.dataset.r),
  "col": el => editable() ? colModal(el.dataset.c) : ACT.sort(el),
  "col-new": el => { S.colAfter = el.dataset.after || null; colModal(null); },
  "col-move": el => {
    const d = curDosya(); const cols = clone(d.kolonlar || []); const i = cols.findIndex(c => c.id === el.dataset.c); const j = i + Number(el.dataset.dir);
    if (i < 0 || j < 0 || j >= cols.length) return; [cols[i], cols[j]] = [cols[j], cols[i]]; patchDosya(S.dosyaId, { kolonlar: cols }); render(); toast("Sütun taşındı");
  },
  "col-del": el => {
    const d = curDosya(); const cols = d.kolonlar || []; const c = cols.find(x => x.id === el.dataset.c); if (!c) return; const bk = clone(cols); const did = S.dosyaId;
    patchDosya(did, { kolonlar: cols.filter(x => x.id !== c.id) }); closeModal(); render();
    toast(`“${c.ad}” sütunu silindi`, { label: "Geri al", fn: () => { patchDosya(did, { kolonlar: bk }); render(); } });
  },
  "sort": el => { const c = el.dataset.c; const s = S.sh.sort; S.sh.sort = !s || s.c !== c ? { c, dir: 1 } : s.dir === 1 ? { c, dir: -1 } : null; closeModal(); render(); },
  "task": el => taskModal(el.dataset.id),
  "task-new": el => taskModal(null, el.dataset.dep || benKisi()?.departman || "kurumsal", el.dataset.kisi || ""),
  "dfiltre": el => { S.dFiltre[el.dataset.dep] = el.dataset.f; render(); },
  "biten": el => { const k = el.dataset.key; S.bitenAcik[k] = !S.bitenAcik[k]; render(); },
  "task-step": el => {
    const id = el.dataset.id; const g = S.gorevler.get(id); if (!g) return; const nx = { yapilacak: "devam", devam: "bitti", bitti: "yapilacak" }[g.durum || "yapilacak"];
    const p = { durum: nx, guncelleme: nowISO() }; if (nx === "bitti") p.tamamlanma = nowISO();
    write("gorevler", id, "update", p); logla("task:" + id, `“${g.baslik}” görevini ${nx === "bitti" ? "bitirdi" : nx === "devam" ? "başlattı" : "yeniden açtı"}`, g.departman);
  },
  "task-del": el => { const id = el.dataset.id; const g = S.gorevler.get(id); if (!g) return; const bk = clone(g); write("gorevler", id, "delete"); closeModal(); toast("Görev silindi", { label: "Geri al", fn: () => write("gorevler", id, "set", bk) }); },
  "belge": el => belgeModal(el.dataset.id),
  "belge-del": () => { const a = $("#del-area"); if (a) a.hidden = false; },
  "belge-del-ok": el => belgeSil(el.dataset.id),
  "m-tab": el => { S.m.tab = el.dataset.tab; render(); },
  "m-grup": el => { S.m.grup = el.dataset.g; S.m.slot = null; render(); },
  "m-slot": el => { S.m.slot = S.m.slot === el.dataset.slot ? null : el.dataset.slot; render(); },
  "m-firca": el => { S.m.firca = el.dataset.f; render(); },
  "m-kisi": el => { S.m.kisi = el.dataset.id; S.m.tab = "duzenle"; go("musaitlik"); },
  "m-gun": el => { const kid = S.m.kisi; const g = mgrid(kid); const f = S.m.firca === "u" ? "." : S.m.firca; g[+el.dataset.day] = f.repeat(SAATN); mYaz(kid, g); render(); },
  "m-saat": el => { const kid = S.m.kisi; const s = +el.dataset.s; const f = S.m.firca === "u" ? "." : S.m.firca; const g = mgrid(kid).map((r, i) => i < 5 ? r.slice(0, s) + f + r.slice(s + 1) : r); mYaz(kid, g); render(); },
  "m-bos": () => { const kid = S.m.kisi; mYaz(kid, mgrid(kid).map(r => r.replace(/\./g, "m"))); render(); },
  "m-temizle": () => { const kid = S.m.kisi; mYaz(kid, GUNLER.map(() => ".".repeat(SAATN))); render(); toast("Program temizlendi"); },
  "modal-close": () => closeModal(),
  "birim-new": () => birimModal(null),
  "yukleme-iptal": () => { if (S.yuklemeKontrol && S.yuklemeKontrol.iptal) S.yuklemeKontrol.iptal(); },
  "birim-ayar": el => birimModal(el.dataset.id),
  "birim-sil": el => { const id = el.dataset.id; const b = S.birimler.get(id); if (!b) return; const bk = clone(b); write("birimler", id, "delete"); logla("birim:" + id, `${b.ad} birimini kapattı`, ""); closeModal(); go("genel"); toast(`${b.ad} birimi silindi`, { label: "Geri al", fn: () => write("birimler", id, "set", bk) }); },
  "del-ac": () => { const a = $("#del-area"); if (a) a.hidden = false; },
  "giris": () => { if (S.auth) S.auth.giris().catch(e => toast("Giriş yapılamadı: " + (e && e.message || e))); },
  "cikis": () => { if (S.auth) S.auth.cikis(); },
  "etk": el => etkModal(el.dataset.id),
  "etk-new": () => etkModal(null),
  "etk-del": el => { const id = el.dataset.id; const e = S.etkinlikler.get(id); if (!e) return; const bk = clone(e); write("etkinlikler", id, "delete"); logla("etk:" + id, `“${e.ad}” etkinliğini sildi`, e.departman); closeModal(); toast("Etkinlik silindi", { label: "Geri al", fn: () => write("etkinlikler", id, "set", bk) }); },
  "gecmis-hepsi": () => { S.gecmisHepsi = true; render(); },
  "yetkili-sil": el => { const e = el.dataset.e; yetkiliYaz((S.yetkililer || []).filter(x => x !== e), `${e} listeden çıkarıldı`); },
  "ekip-yukle": async () => {
    try { const r = await fetch("./ilk-ekip.json", { cache: "no-store" }); const j = await r.json(); let n = 0;
      for (const [id, k] of Object.entries(j.kisiler || {})) if (!S.kisiler.has(id)) { write("kisiler", id, "set", k); n++; }
      toast(`${n} kişi yüklendi`);
    } catch (e) { toast("Ekip dosyası okunamadı: " + (e && e.message || e)); }
  },
  "json-indir": () => { const out = { surum: 1, tarih: nowISO() }; for (const c of KOLEKSIYONLAR) out[c] = Object.fromEntries(S[c]); dosyaIndir(`otomotiv-kulubu-yedek-${bugun()}.json`, new Blob([JSON.stringify(out, null, 1)], { type: "application/json" })); },
  "json-sec": () => $("#json-file")?.click(),
  "json-onay": () => { const j = S.jsonYedek; if (!j) return; let n = 0; for (const c of KOLEKSIYONLAR) for (const [id, d] of Object.entries(j[c] || {})) if (isObj(d)) { write(c, id, "set", d); n++; } S.jsonYedek = null; closeModal(); toast(`${n} kayıt geri yüklendi`); },
};
const FORM = {
  "task-save": f => taskSave(f),
  "birim-save": f => birimKaydet(f),
  "etk-save": f => etkSave(f),
  "yetkili-ekle": f => { const e = String(new FormData(f).get("eposta") || "").trim().toLowerCase(); if (!epostaMi(e)) { toast("Geçerli bir e-posta yaz."); return; } if (e === S.sahipEposta || (S.yetkililer || []).includes(e)) { toast("Bu adres zaten listede."); return; } yetkiliYaz([...(S.yetkililer || []), e], `${e} yetkili olarak eklendi`); },
  "link-add": f => {
    const fd = new FormData(f); const ad = String(fd.get("ad") || "").trim(); const url = safeUrl(fd.get("url"));
    if (!url) { toast("Link http:// ya da https:// ile başlamalı."); return; }
    const id = newId("b"); write("belgeler", id, "set", { ad, url, departman: f.dataset.dep, tur: "link", yukleyen: S.uid || "", yukleyenAd: S.kullanici?.ad || "", tarih: nowISO(), not: "" });
    logla("belge:" + id, `${ad} linkini ekledi`, f.dataset.dep); f.reset();
  },
  "belge-save": f => { const fd = new FormData(f); const p = { ad: String(fd.get("ad") || "").trim(), not: String(fd.get("not") || ""), departman: fd.get("departman") }; if (fd.has("alan")) p.alan = fd.get("alan") === "tablolar" ? "tablolar" : "belgeler"; if (fd.has("url")) { const u = safeUrl(fd.get("url")); if (!u) { toast("Geçerli bir link girin."); return; } p.url = u; } write("belgeler", f.dataset.id, "update", p); closeModal(); },
  "col-save": f => saveCol(f),
  "sheet-save": f => { const fd = new FormData(f); const d = curDosya(); if (!d) return; const p = { baslik: String(fd.get("baslik") || "").trim() || d.baslik, aciklama: String(fd.get("aciklama") || ""), departman: fd.get("departman") }; patchDosya(S.dosyaId, p); closeModal(); render(); },
  "sheet-create": f => {
    const fd = new FormData(f); const baslik = String(fd.get("baslik") || "").trim(); if (!baslik) return; const s = String(fd.get("sablon") || "bos"); let kolonlar;
    if (s.startsWith("kopya:")) kolonlar = clone(S.dosyalar.get(s.slice(6))?.kolonlar || []);
    else kolonlar = (SABLON[s] || SABLON.bos).kolonlar.map(([id, ad, tur, sec]) => sec ? { id, ad, tur, secenekler: sec } : { id, ad, tur });
    const id = slug(baslik) + "-" + rnd().slice(0, 4); const now = nowISO();
    write("dosyalar", id, "set", { baslik, aciklama: String(fd.get("aciklama") || ""), departman: f.dataset.dep, sira: 50, kolonlar, satirlar: {}, olusturma: now, guncelleme: now, guncelleyen: S.uid || "" });
    logla("sheet:" + id, `${baslik} tablosunu oluşturdu`, f.dataset.dep); closeModal(); go("d-" + id);
  },
  "kisi-save": f => {
    const fd = new FormData(f); const id = f.dataset.id || slug(String(fd.get("ad") || "kisi")) + "-" + rnd().slice(0, 3);
    const body = { ad: String(fd.get("ad") || "").trim(), rol: String(fd.get("rol") || "").trim(), departman: fd.get("departman"), seviye: fd.get("seviye"), aciklama: String(fd.get("aciklama") || "").trim() };
    if (!body.ad) return;
    if (f.dataset.id) write("kisiler", id, "update", body); else write("kisiler", id, "set", { ...body, sira: 50, hesap: "" });
    logla("kisi:" + id, `${body.ad} kişisinin bilgilerini ${f.dataset.id ? "güncelledi" : "ekledi"}`, body.departman); closeModal();
  },
};
let lastPointer = "mouse";
document.addEventListener("click", e => {
  const a = e.target.closest("[data-act]");
  if (a && !a.disabled) { e.preventDefault(); ACT[a.dataset.act]?.(a, e); return; }
  const mc = e.target.closest("[data-mc]");
  if (mc && !mc.disabled && lastPointer !== "mouse" && editable()) { S.m.painting = { kid: S.m.kisi, grid: mgrid(S.m.kisi) }; paintCell(mc); paintEnd(); return; }
  const td = e.target.closest("#grid td[data-c]");
  if (td && !td.classList.contains("editing") && !e.target.closest("a")) {
    const r = td.parentElement.dataset.r, c = td.dataset.c; const was = S.sh.sel && S.sh.sel.r === r && S.sh.sel.c === c;
    if (S.sh.editing) commitEdit();
    S.sh.sel = { r, c }; paintSel(); $("#grid")?.focus({ preventScroll: true });
    if (!editable()) return;
    const col = colById(c);
    if (col?.tur === "tik") { setCell(r, c, !curDosya()?.satirlar?.[r]?.[c]); render(); return; }
    if (was || lastPointer === "touch") startEdit();
  }
});
document.addEventListener("mousedown", e => { if (S.sh.editing && e.target.closest && e.target.closest("#grid td[data-c]:not(.editing)")) e.preventDefault(); });
document.addEventListener("dblclick", e => { const td = e.target.closest("#grid td[data-c]"); if (td && !td.classList.contains("editing") && editable() && colById(td.dataset.c)?.tur !== "tik") { S.sh.sel = { r: td.parentElement.dataset.r, c: td.dataset.c }; startEdit(); } });
document.addEventListener("pointerdown", e => {
  lastPointer = e.pointerType || "mouse";
  const mc = e.target.closest("[data-mc]");
  if (mc && !mc.disabled && e.pointerType === "mouse" && e.button === 0 && editable()) { e.preventDefault(); S.m.painting = { kid: S.m.kisi, grid: mgrid(S.m.kisi) }; paintCell(mc); }
});
document.addEventListener("pointerover", e => { if (!S.m.painting) return; const mc = e.target.closest("[data-mc]"); if (mc) paintCell(mc); });
document.addEventListener("pointerup", () => paintEnd());
document.addEventListener("pointercancel", () => paintEnd());
document.addEventListener("submit", e => { const f = e.target.closest("form[data-form]"); if (!f) return; e.preventDefault(); FORM[f.dataset.form]?.(f); });
let qTimer = 0;
document.addEventListener("input", e => {
  const t = e.target;
  if (t.id === "sh-q") { S.sh.q = t.value; clearTimeout(qTimer); qTimer = setTimeout(render, 120); }
  else if (t.hasAttribute("data-draft")) S.drafts[t.id] = t.value;
});
document.addEventListener("change", e => {
  const t = e.target;
  if (t.id === "sh-f") { S.sh.f = t.value; render(); }
  else if (t.hasAttribute("data-rf")) {
    const d = curDosya(); const c = (d?.kolonlar || []).find(x => x.id === t.dataset.c); if (!c) return;
    const v = c.tur === "tik" ? t.checked : deger(c, t.value); if (!esit(v, d.satirlar?.[t.dataset.r]?.[c.id])) { setCell(t.dataset.r, c.id, v); render(); }
  }
  else if (t.id === "imp-file" && t.files[0]) impOku(t.files[0]);
  else if (t.hasAttribute("data-up") && t.files.length) { const fs = [...t.files]; t.value = ""; yukle(fs, t.dataset.up, t.dataset.alan); }
  else if (t.id === "json-file" && t.files[0]) { const f = t.files[0]; t.value = ""; f.text().then(x => { try { jsonYedekModal(JSON.parse(x)); } catch { toast("Bu dosya geçerli bir yedek değil."); } }); }
  else if (t.id === "imp-sheet") { S.imp.sheet = t.value; impGoster(); }
  else if (t.id === "col-tur") { const f = $("#col-sec"); if (f) f.hidden = t.value !== "secim"; }
  else if (t.id === "m-kisi") { S.m.kisi = t.value; render(); }
  else if (t.id === "m-not") { const kid = S.m.kisi; const p = { not: t.value, guncelleme: nowISO(), guncelleyen: S.uid || "" }; if (S.musaitlik.has(kid)) write("musaitlik", kid, "update", p); else write("musaitlik", kid, "set", { gunler: {}, ...p }); }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !$("#modal-root").hidden && !S.sh.editing) { closeModal(); return; }
  if (e.target.id !== "grid" || S.sh.editing || S.view !== "dosya") return;
  const k = e.key, mod = e.ctrlKey || e.metaKey;
  if (!S.sh.sel) { if (/^(Arrow|Enter|Tab)/.test(k) && S.sh.rows.length && S.sh.cols.length) { e.preventDefault(); S.sh.sel = { r: S.sh.rows[0], c: S.sh.cols[0] }; paintSel(); } return; }
  const mv = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[k];
  if (mv) { e.preventDefault(); moveSel(...mv); return; }
  if (k === "Tab") { e.preventDefault(); moveSel(0, e.shiftKey ? -1 : 1); return; }
  if (mod && (k === "c" || k === "C")) {
    e.preventDefault(); const c = colById(S.sh.sel.c); const v = curDosya()?.satirlar?.[S.sh.sel.r]?.[S.sh.sel.c];
    try { navigator.clipboard.writeText(displayText(c, v)).then(() => toast("Kopyalandı"), () => toast("Kopyalanamadı")); } catch { toast("Kopyalanamadı"); }
    return;
  }
  if (mod || !editable()) return;
  const col = colById(S.sh.sel.c); if (!col) return;
  if (k === "Enter" || k === "F2") { e.preventDefault(); startEdit(); return; }
  if (k === " " && col.tur === "tik") { e.preventDefault(); startEdit(); return; }
  if (k === "Delete" || k === "Backspace") { e.preventDefault(); setCell(S.sh.sel.r, S.sh.sel.c, col.tur === "tik" ? false : ""); render(); return; }
  if (k.length === 1 && !e.altKey) {
    if (["metin", "uzun", "sayi", "para", "link"].includes(col.tur)) { e.preventDefault(); startEdit(k); }
    else if (col.tur !== "tik") { e.preventDefault(); startEdit(); }
  }
});
document.addEventListener("paste", e => {
  if (S.view !== "dosya" || S.sh.editing || !editable() || !e.target.closest || !e.target.closest("#grid")) return;
  const t = e.clipboardData?.getData("text/plain"); if (!t || !S.sh.sel) return; e.preventDefault(); pasteGrid(t);
});
document.addEventListener("dragover", e => { const z = e.target.closest?.("[data-drop]"); if (z && editable()) { e.preventDefault(); z.classList.add("over"); } });
document.addEventListener("dragleave", e => { const z = e.target.closest?.("[data-drop]"); if (z) z.classList.remove("over"); });
document.addEventListener("drop", e => { const z = e.target.closest?.("[data-drop]"); if (!z) return; e.preventDefault(); z.classList.remove("over"); if (e.dataTransfer?.files?.length) yukle([...e.dataTransfer.files], z.dataset.drop, z.dataset.alan); });

hashOku();
render();
init();
