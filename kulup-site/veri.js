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

  const saglayici = new GoogleAuthProvider();
  saglayici.setCustomParameters({ prompt: "select_account" });
  return {
    db: { doc: D, collection: p => C(p) },
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
