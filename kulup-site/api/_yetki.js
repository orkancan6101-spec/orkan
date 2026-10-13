// Yükleyen kişinin yetkili olup olmadığını Firestore'un kendi kurallarına sorar.
// firestore.rules, ayarlar/yetkililer belgesini yalnızca site sahibine ve
// yetkili listesindeki hesaplara okutur. Kişinin Firebase kimlik jetonuyla bu
// belgeyi okumayı deneriz: okunabiliyorsa (200) yetkilidir. Belge henüz yoksa
// onu yalnızca site sahibi okuyabildiği için 404 de yetkili sayılır.
// Geçersiz ya da süresi dolmuş jeton 401, yetkisiz hesap 403 alır.

const PROJE = process.env.FIREBASE_PROJECT_ID || "esogu-otomotiv";

export async function yetkiliMi(idToken) {
  if (typeof idToken !== "string" || idToken.length < 20) return false;
  const r = await fetch(
    `https://firestore.googleapis.com/v1/projects/${PROJE}/databases/(default)/documents/ayarlar/yetkililer`,
    { headers: { Authorization: "Bearer " + idToken } },
  );
  return r.status === 200 || r.status === 404;
}

export function govde(req) {
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  return req.body || {};
}
