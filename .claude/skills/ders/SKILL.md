---
name: ders
description: Bir dersin notunu, slaytını, tahta fotoğrafını ya da konu adını alır. Yapılandırılmış özet, kilit formüller ve birimleri, kendini test soruları, çözümlü örnek ve Solar Team bağlantısı üretir. Notu panoya kaydeder ve 1-3-7 gün sonrasına aralıklı tekrar görevleri kurar. Vize hazırlığı ve ders analizi için de kullanılır. "Bugünkü dersin notu", "şu konuyu özetle", "mukavemet çalışacağım", "vizeye hazırlan", "ders analizi" denildiğinde kullan.
argument-hint: "<ders kısaltması> [konu | not/fotoğraf]"
---

# /ders: Ders notu, özet ve tekrar

Derslerin listesi, konuları, kaynakları ve çalışma yöntemi
`planlayici/izler/dersler.md` dosyasında. Önce o dosyadaki ilgili ders
bölümünü oku.

Ders kodları:
- MEC.DES (Pzt)
- MÜHTER II (Sal)
- MEC.MAT (Çar)
- İMALAT (Çar)
- TÜRK DİLİ (Per)
- ERHVKİL (Cum)
- MAK.EL I (Cum)

## A) Ders sonrası not ("bugünkü ders", not veya fotoğraf verildi)
1. Girdiyi oku: metin, slayt, PDF ya da tahta veya defter fotoğrafı.
   Okunamayan kısmı uydurma; "şu kısım okunmuyor" de.
2. Şunları üret:
   - **Özet:** 5–8 madde. Ne anlatıldı, neden önemli.
   - **Kilit formüller:** her biri birimleri ve hangi koşulda geçerli
     olduğuyla birlikte.
   - **Kavram haritası:** 2–3 satır. Önceki konulara nasıl bağlanıyor?
   - **Kendini test et:** 5 soru. 3'ü hesap, 2'si kavram olsun. Cevapları
     ayrı bir bölümde ver ki önce kendisi denesin.
   - **Çözümlü örnek:** 1 tane, adım adım ve birim kontrolüyle.
   - **Solar Team bağlantısı:** bu konu araçta nerede karşına çıkar
     (`solar-team/mekanik-muhendis-rehberi.md` 6. bölüm).
   - **Kaynak:** bu konuyu en iyi anlatan 1 video ve kitap bölümü
     (`dersler.md`'deki kütüphaneden).
3. Panoya kaydet: `ArtifactData set` ile `notlar/<ders>-<YYYYMMDD>`.
   Alanlar: `ders`, `tarih`, `konu`, `ozet`, `formuller`, `sorular`,
   `cevaplar`, `kaynaklar`. Bir belge 256 KB'ı geçmesin; uzun notu
   konulara böl.
4. **Aralıklı tekrar görevleri:** dersten 1, 3 ve 7 gün sonrası için 15'er
   dakikalık görev oluştur. Alanlar:
   - `alan: "okul"`, `enerji: "orta"`, `onem: 4`
   - `son_tarih`: ilgili gün
   - `baslik: "Tekrar: <ders> – <konu> (1/3)"`
   - `sonraki_adim: "5 soruyu kağıt kapalı çöz"`
   Ardından `siralama`'yı güncelle (CLAUDE.md P2–P3).

## B) Konu çalışma ("mukavemet çalışacağım")
1. `dersler.md`'den konunun yerini ve sıradaki konuyu bul. Panodaki
   `notlar/` belgelerinden o derse ait son notları oku.
2. 50 dakikalık oturum ver:
   - 10 dk: önceki notlardan 3 soruyla ısınma
   - 30 dk: problem çözümü (zorluğu artan 3 problem)
   - 10 dk: hata defteri ve özet
3. Bitince takıldığı yeri sor ve hata defterine ekle
   (`notlar/<ders>-hatalar` belgesi, `maddeler` listesi).

## C) Vize hazırlığı ("vize ne zaman", "vizeye hazırlan")
1. Vize tarihini öğren ve görev olarak kaydet: `tur: "etkinlik"`, saatli.
   Profildeki `sinav_donemleri` listesine vize haftasını ekle (vizeden 7 gün
   önce başlasın). Bu, sınav haftası modunu açar.
2. `/proje-plani` sınav akışını uygula: konu listesi, hakimiyet puanı,
   aralıklı tekrar, çıkmış sorular. Son gece yeni konu planlama.

## D) Ders analizi (dönem başı ya da istek üzerine)
Her ders için şunları ver:
- zorluk
- haftalık önerilen süre
- vize ve final ağırlığı (kullanıcıdan öğren)
- en riskli konu
- takımla bağlantısı

Sonra haftalık ders çalışma şablonunu kapasiteye göre kur: `dersler.md`'deki
şablon, `planla.py kapasite` ile kontrol edilir.
