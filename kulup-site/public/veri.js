// Firebase bağlantısı: Google ile giriş ve Firestore veritabanı.
// app.js bu dosyadan yalnızca küçük bir arayüz alır: db.doc / db.collection
// ve auth.izle / giris / cikis. Böylece uygulama kodu Firebase'e doğrudan
// bağımlı kalmaz.
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult,
  signOut, onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  initializeFirestore, collection, doc, onSnapshot, query, orderBy, limit,
  getDoc, setDoc, deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, siteAdresi } from "./firebase-config.js";

const KODLAR = {
  "permission-denied": "izin",
  "unauthenticated": "izin",
  "unavailable": "unavailable",
  "resource-exhausted": "resource_exhausted",
  "invalid-argument": "invalid_argument",
  "failed-precondition": "invalid_argument",
};
const hata = e => ({ code: KODLAR[e && e.code] || (e && e.code) || "bilinmiyor", message: (e && e.message) || String(e) });
const sar = p => p.catch(e => { throw hata(e); });
// Dosyalar Vercel Blob'da tutulur (ücretsiz planda ~1 GB). Yükleme izni /api/yukle
// fonksiyonundan alınır; fonksiyon kişinin yetkili olduğunu Firestore kurallarına sorar.
function blobHata(e) {
  const m = String((e && e.message) || e || "");
  if ((e && e.name === "AbortError") || /abort/i.test(m)) return { code: "iptal", message: m };
  if (/client token|yetkisi yok|404|Failed to fetch.*api/i.test(m)) return { code: "token", message: m };
  if (/Failed to fetch|network|NetworkError/i.test(m)) return { code: "unavailable", message: m };
  if (/limit|quota|storage.*full|exceeded/i.test(m)) return { code: "kota", message: m };
  return { code: "bilinmiyor", message: m };
}

// Google ile girişte çıkabilecek hatalar, kullanıcının ne yapacağını söyleyen
// cümlelerle.
const GIRIS_HATALARI = {
  "auth/unauthorized-domain": () => `Bu adresten giriş yapılamıyor. Siteyi ${siteAdresi || "asıl adresinden"} adresinden aç.`,
  "auth/network-request-failed": "İnternet bağlantısı kurulamadı. Bağlantını kontrol edip tekrar dene.",
  "auth/web-storage-unsupported": "Tarayıcı çerezleri engelliyor. Gizli sekme yerine normal Chrome ya da Safari sekmesinde aç.",
  "auth/internal-error": "Tarayıcı girişi tamamlayamadı. Sayfayı yenileyip tekrar dene; olmazsa normal Chrome ya da Safari sekmesinde aç.",
  "auth/too-many-requests": "Çok fazla deneme yapıldı. Birkaç dakika sonra tekrar dene.",
  "auth/user-disabled": "Bu Google hesabı devre dışı bırakılmış.",
  "auth/operation-not-allowed": "Google ile giriş Firebase'de kapalı: Firebase → Authentication → Sign-in method → Google → Enable.",
};
const girisHatasi = e => {
  const h = GIRIS_HATALARI[e && e.code];
  return { code: (e && e.code) || "bilinmiyor", message: h ? (typeof h === "function" ? h() : h) : ((e && e.message) || String(e)) };
};
// Instagram, Facebook, TikTok gibi uygulamaların kendi içindeki tarayıcıda Google
// girişe izin vermez ("disallowed_useragent").
const uygulamaIci = () => /FBAN|FBAV|Instagram|Line\/|Snapchat|TikTok|musical_ly|; wv\)/i.test(navigator.userAgent || "");

export async function baglan() {
  // Yanlış .vercel.app adresinden açıldıysa asıl adrese geç.
  if (siteAdresi && typeof location !== "undefined") {
    const ana = new URL(siteAdresi);
    if (location.hostname !== ana.hostname && /\.vercel\.app$/i.test(location.hostname)) {
      location.replace(ana.origin + location.pathname + location.search + location.hash);
      return new Promise(() => { });
    }
  }
  if (!firebaseConfig || !firebaseConfig.apiKey || String(firebaseConfig.apiKey).startsWith("BURAYA")) {
    throw new Error("firebase-config.js henüz doldurulmadı.");
  }
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const fs = initializeFirestore(app, { ignoreUndefinedProperties: true });
  // Yönlendirmeli girişten dönüşte hata olduysa uygulama bunu gösterebilsin.
  const donusHatasi = getRedirectResult(auth).then(() => null, e => girisHatasi(e));

  const belge = s => ({ id: s.id, exists: s.exists(), data: () => s.data() });
  const D = path => ({
    get: () => sar(getDoc(doc(fs, path)).then(belge)),
    set: data => sar(setDoc(doc(fs, path), data)),
    // Uygulama "update" ile iç içe alanları birleştirir (tablo hücreleri gibi);
    // Firestore'da bunun karşılığı merge ile set'tir.
    update: data => sar(setDoc(doc(fs, path), data, { merge: true })),
    delete: () => sar(deleteDoc(doc(fs, path))),
  });
  const C = (path, kosul = []) => ({
    orderBy: (alan, yon) => C(path, [...kosul, orderBy(alan, yon)]),
    limit: n => C(path, [...kosul, limit(n)]),
    doc: id => D(path + "/" + id),
    onSnapshot(next, err) {
      const ref = kosul.length ? query(collection(fs, path), ...kosul) : collection(fs, path);
      return onSnapshot(ref, s => next({ docs: s.docs.map(belge) }), e => err && err(hata(e)));
    },
  });

  const jeton = async () => {
    if (!auth.currentUser) throw { code: "izin", message: "Giriş yapılmamış." };
    return auth.currentUser.getIdToken();
  };
  const depo = {
    // Dosya tarayıcıdan doğrudan Vercel Blob'a gider; ilerleme 0–1 arası bildirilir.
    // Tür ve boyut sınırı yok. kontrol nesnesine iptal() eklenir.
    async yukle(yol, dosya, ilerleme, kontrol) {
      const token = await jeton();
      const { upload } = await import("./blob-client.js");
      const ac = new AbortController();
      if (kontrol) kontrol.iptal = () => ac.abort();
      try {
        const b = await upload(yol, dosya, {
          access: "public",
          handleUploadUrl: "/api/yukle",
          clientPayload: token,
          multipart: dosya.size > 8 * 1048576,
          contentType: dosya.type || undefined,
          abortSignal: ac.signal,
          onUploadProgress: e => ilerleme && ilerleme(((e && e.percentage) || 0) / 100),
        });
        return { url: b.url, yol: b.pathname, boyut: dosya.size, tur: b.contentType || dosya.type || "" };
      } catch (e) { throw blobHata(e); }
    },
    async sil(url) {
      const r = await fetch("/api/sil", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url, token: await jeton() }) });
      if (!r.ok) {
        const j = await r.json().catch(() => ({}));
        throw { code: r.status === 403 ? "izin" : "bilinmiyor", message: j.error || "HTTP " + r.status };
      }
    },
  };

  const saglayici = new GoogleAuthProvider();
  saglayici.setCustomParameters({ prompt: "select_account" });
  return {
    db: { doc: D, collection: p => C(p) },
    depo,
    auth: {
      izle(cb) {
        return onAuthStateChanged(auth, u => cb(u ? {
          uid: u.uid,
          ad: u.displayName || u.email || "Kullanıcı",
          eposta: String(u.email || "").toLowerCase(),
          foto: u.photoURL || "",
        } : null));
      },
      async giris() {
        if (uygulamaIci()) throw { code: "uygulama_ici", message: "Google, uygulama içindeki tarayıcıda girişe izin vermiyor. Menüden (⋮ ya da ···) \"Tarayıcıda aç\" deyip Chrome ya da Safari'de dene." };
        try { await signInWithPopup(auth, saglayici); }
        catch (e) {
          if (e && (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment")) {
            try { await signInWithRedirect(auth, saglayici); } catch (e2) { throw girisHatasi(e2); }
          }
          else if (e && (e.code === "auth/popup-closed-by-user" || e.code === "auth/cancelled-popup-request")) return;
          else throw girisHatasi(e);
        }
      },
      cikis: () => signOut(auth),
      donusHatasi: () => donusHatasi,
    },
  };
}
