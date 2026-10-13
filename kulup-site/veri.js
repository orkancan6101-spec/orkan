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
import {
  getStorage, ref as depoRef, uploadBytesResumable, getDownloadURL, deleteObject,
  setMaxUploadRetryTime, setMaxOperationRetryTime,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { firebaseConfig } from "./firebase-config.js";

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
const DEPO_KODLARI = {
  "storage/unauthorized": "izin",
  "storage/unauthenticated": "izin",
  "storage/bucket-not-found": "depo_yok",
  "storage/project-not-found": "depo_yok",
  "storage/no-default-bucket": "depo_yok",
  "storage/quota-exceeded": "kota",
  "storage/retry-limit-exceeded": "unavailable",
  "storage/canceled": "iptal",
};
function depoHata(e) {
  const c = e && e.code;
  // Depo hiç oluşturulmamışsa Firebase çoğu zaman 404 ile "storage/unknown" döner.
  const yok = c === "storage/unknown" && /404|not found/i.test(String((e && e.customData && e.customData.serverResponse) || e.message || ""));
  return { code: yok ? "depo_yok" : (DEPO_KODLARI[c] || c || "bilinmiyor"), message: (e && e.message) || String(e) };
}

export async function baglan() {
  if (!firebaseConfig || !firebaseConfig.apiKey || String(firebaseConfig.apiKey).startsWith("BURAYA")) {
    throw new Error("firebase-config.js henüz doldurulmadı.");
  }
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const fs = initializeFirestore(app, { ignoreUndefinedProperties: true });
  getRedirectResult(auth).catch(() => { });

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

  const st = firebaseConfig.storageBucket ? getStorage(app) : null;
  // Varsayılanda SDK ulaşamadığı depoya 10 dakika sessizce yeniden dener; kullanıcı %0'da bekler.
  if (st) { setMaxUploadRetryTime(st, 20000); setMaxOperationRetryTime(st, 20000); }
  let depoVar = false;
  async function depoKontrol() {
    // Depo hiç oluşturulmamışsa liste adresi 404 döner (tarayıcı yüklemesi ise CORS'a takılıp asılı kalır).
    if (depoVar) return true;
    try {
      const r = await fetch(`https://firebasestorage.googleapis.com/v0/b/${encodeURIComponent(firebaseConfig.storageBucket)}/o?maxResults=1`);
      depoVar = r.status !== 404;
    } catch { return true; } // ağ hatasında kararı yüklemenin kendisine bırak
    return depoVar;
  }
  const depo = st ? {
    // Dosyayı parça parça yükler; ilerleme 0–1 arası bildirilir. Tür ve boyut sınırı yok.
    // kontrol nesnesine iptal() eklenir.
    yukle(yol, dosya, ilerleme, kontrol) {
      return new Promise(async (tamam, hatali) => {
        if (!(await depoKontrol())) { hatali({ code: "depo_yok", message: "Firebase Storage oluşturulmamış." }); return; }
        const meta = { contentType: dosya.type || "application/octet-stream", contentDisposition: "inline; filename*=UTF-8''" + encodeURIComponent(dosya.name) };
        const is = uploadBytesResumable(depoRef(st, yol), dosya, meta);
        if (kontrol) kontrol.iptal = () => is.cancel();
        is.on("state_changed",
          s => ilerleme && ilerleme(s.totalBytes ? s.bytesTransferred / s.totalBytes : 0),
          e => hatali(depoHata(e)),
          async () => {
            try { tamam({ url: await getDownloadURL(is.snapshot.ref), yol, boyut: is.snapshot.totalBytes, tur: meta.contentType }); }
            catch (e) { hatali(depoHata(e)); }
          });
      });
    },
    sil: yol => deleteObject(depoRef(st, yol)).catch(e => { if (e && e.code === "storage/object-not-found") return; throw depoHata(e); }),
  } : null;

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
        try { await signInWithPopup(auth, saglayici); }
        catch (e) {
          if (e && (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment")) await signInWithRedirect(auth, saglayici);
          else if (e && (e.code === "auth/popup-closed-by-user" || e.code === "auth/cancelled-popup-request")) return;
          else throw hata(e);
        }
      },
      cikis: () => signOut(auth),
    },
  };
}
