// Tarayıcıdan Vercel Blob'a doğrudan yükleme için izin (istemci jetonu) verir.
// Dosya bu fonksiyondan geçmez; tarayıcı jetonla doğrudan depoya yükler.
// Tür ve boyut sınırı konmaz. Yalnızca yetkili hesaplar jeton alabilir.
import { handleUpload } from "@vercel/blob/client";
import { yetkiliMi, govde } from "./_yetki.js";

export default async function handler(req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "Yalnızca POST kabul edilir." }); return; }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    res.status(500).json({ error: "Vercel Blob deposu bu projeye bağlı değil (BLOB_READ_WRITE_TOKEN yok)." });
    return;
  }
  try {
    const sonuc = await handleUpload({
      body: govde(req),
      request: req,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!/^belgeler\/[A-Za-z0-9_-]+\//.test(pathname)) throw new Error("Geçersiz dosya yolu.");
        if (!(await yetkiliMi(clientPayload))) throw new Error("Bu hesabın dosya yükleme yetkisi yok.");
        return { addRandomSuffix: true };
      },
    });
    res.status(200).json(sonuc);
  } catch (e) {
    res.status(400).json({ error: String((e && e.message) || e) });
  }
}
