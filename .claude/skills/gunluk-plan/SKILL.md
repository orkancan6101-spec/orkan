---
name: gunluk-plan
description: Bir günün (varsayılan bugün) zaman bloklu planını çıkarır. Takvimdeki dersleri ve toplantıları, görevlerin önceliğini, son tarih fizibilitesini ve enerji ritmini hesaba katar, günün en önemli 3 işini belirler ve planı Plan Panosu'na yazar. "Bugün ne yapayım", "günü planla", "yarını planla", sabah brifingi ve sabah rutini için kullan.
argument-hint: "[YYYY-MM-DD | yarın] [rutin]"
---

# /gunluk-plan: Günün planı

Argümanda "rutin" geçiyorsa **rutin modundasın** (CLAUDE.md → Rutin modu):
soru sorma, takvime yalnızca `takvim_yazma: "otomatik"` ise yaz, en sonda kısa
bir bildirim özeti üret.

## Adımlar

1. **Tarih.** Argüman yoksa bugün. "yarın" ise yarının tarihi. Saat 19:00'dan
   sonra argümansız çağrıldıysa yarını planla ve bunu söyle.

2. **Veri.** P1 ile veriyi indir. Sonra:
   - Google Takvim bağlıysa o günün etkinliklerini çek (list_events, o günün
     00:00–23:59 aralığı). Açıklamasında `planlayici:` geçmeyenleri
     `planlayici/.veri/mesgul.json`'a yaz. Planlayıcının eski odak
     bloklarını ayrıca not et.
   - Takvim bağlı değilse profildeki `haftalik_sabitler` yeterli. Bunu
     kullanıcıya bir kez hatırlat.

3. **Gelen kutusu.** `durum=gelen` görev varsa:
   - Etkileşimli modda: kullanıcıya say ve "önce bunları netleştirelim mi?"
     diye sor. Evet derse `/gorev` akışıyla kısaca işle.
   - Rutin modunda: dokunma, sadece özette say.

4. **Motor.**
   - `planla.py siralama --kaydet planlayici/.veri/siralama.json` çalıştır ve
     panoya yaz (`analiz/siralama`).
   - `planla.py gun --tarih <T> --mesgul planlayici/.veri/mesgul.json --kaydet planlayici/.veri/plan.json`
     çalıştır.

5. **Eleştirel gözden geçirme.** Motorun önerisini körü körüne kabul etme.
   Şunları kontrol et:
   - Günün en önemli 3 işi gerçekten en önemlileri mi? Kadran 2'deki
     (önemli, acil değil) işlerin en az biri günde yer alıyor mu? Yoksa ve
     yer varsa ekle.
   - Bir görev üst üste 3. kez mi planlanıyor (`ertelenme >= 3`)? Öyleyse onu
     10 dakikalık bir ilk adıma küçültmeyi öner.
   - Gün aşırı dolu mu? `planlanan_dk` kapasiteye çok yakınsa ve dışarıda bir
     etkinlik varsa, yol ve hazırlık payı bırak.
   - Yetişmeyen iş varsa, plan yorumuna somut bir öneri yaz: "Raporun 3.
     bölümünü kısalt" ya da "Hocadan 1 gün iste".
   - Değişiklik yaptıysan bunu `plan.json` üzerinde yap. Örnek: blokları
     elle düzenle, `mit` listesini güncelle.

6. **Rutin blokların içeriği.** Plandaki her `tur: "rutin"` bloğu için
   `izler/<iz>` belgesinin `sonraki` alanından tek satırlık somut içerik
   yaz. Örnek: "21:30 Almanca: Nicos Weg A1 Bölüm 5 + 10 kelime".
   - "Ders tekrarı" bloğuna `izler/dersler.tekrar_kuyrugu` içinde tarihi
     bugün ya da geçmiş olan tekrarları ekle. Örnek: "17:00 Tekrar:
     MEC.MAT gerilme dönüşümü (2/3) + bugünkü MÜHTER II notu".
   - Bu haftanın hedefinin gerisinde kalan izi yorumda belirt.
   - Sınav dönemindeysen (`plan.sinav_modu`) bunu en üstte söyle.

7. **Yorum.** Günün planına 2–3 cümlelik bir not yaz (`--yorum` ya da
   `plan.json`'daki `yorum` alanı). Kullanıcıya ikinci tekil şahısla, doğrudan
   hitap et. Bugünün ana riski ne, neye odaklanmalı, neyi bırakabilir.
   Örnek: "Rapor yarın 12:00'de teslim ve 5 saat açığın var. Sabahki iki derin
   bloğu yalnızca rapora ver, mukavemet ödevini perşembeye kaydırdım."

8. **Panoya yaz.** `planlar/<T>` belgesini kaydet (P3).

9. **Takvim.** Etkileşimli modda odak bloklarını takvime eklemeyi öner
   (`/takvim`). Rutin modunda yalnızca `takvim_yazma: "otomatik"` ise ekle.
   Aynı gün için önceden eklenmiş `planlayici:` blokları varsa yenilerini
   ekleme. Önce eskileri güncelle ya da taşı; silmen gerekiyorsa onay iste.

10. **E-posta (isteğe bağlı).** Gmail bağlıysa ve kullanıcı istemişse
   (profilde `sabah_eposta_tarama: true`) son 24 saatin e-postalarını
   `/eposta-tara` mantığıyla tara. Görev adaylarını yalnızca özette listele;
   onaysız görev oluşturma.

## Çıktı

```
<Gün, tarih> · <planlanan> / <kapasite>
1) <MIT 1>  2) <MIT 2>  3) <MIT 3>
<saat> <blok> ... (yalnızca odak ve sabit bloklar)
! <varsa yetişmeyen iş ve önerin>
? <varsa cevap bekleyen sorular>
Pano: <PANO>
```
