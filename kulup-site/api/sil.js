// Yüklenmiş bir dosyayı Vercel Blob'dan siler. Yalnızca yetkili hesaplar.
import { del } from "@vercel/blob";
import { yetkiliMi, govde } from "./_yetki.js";

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "Yalnızca POST kabul edilir." }); return; }
  try {
    const { url, token } = govde(req);
    if (!(await yetkiliMi(token))) { res.status(403).json({ error: "Bu hesabın dosya silme yetkisi yok." }); return; }
    if (typeof url !== "string" || !/^https:\/\/[a-z0-9]+\.public\.blob\.vercel-storage\.com\/belgeler\//i.test(url)) {
      res.status(400).json({ error: "Geçersiz dosya adresi." }); return;
    }
    await del(url);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
