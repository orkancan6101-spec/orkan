---
name: gun-sonu
description: Günün sonunda neyin bittiğini, neyin kaldığını kaydeder. Gerçek süreleri alarak tahmin katsayısını eğitir, kalan işleri yeniden planlar, kısa bir değerlendirme yapar ve yarını hazırlar. "Bugün şunları bitirdim", "günü kapat", "akşam değerlendirmesi" denildiğinde ve akşam rutininde kullan.
argument-hint: "[rutin]"
---

# /gun-sonu: Günü kapat

Argümanda "rutin" varsa rutin modundasın. Kullanıcıya soru sorup bekleme.
Bunun yerine bugünün planını özetle ve kullanıcının bu oturuma ya da panoya
cevap vermesi için kısa bir kontrol listesi bırak.

## Etkileşimli akış

1. **Veri.** P1 ile veriyi indir. Bugünün planını da al
   (`ArtifactData get planlar/<bugün>`).

2. **Tek soruda durum.** Planlanan odak bloklarını numaralı listele ve tek
   mesajda sor:
   "Hangileri bitti, hangileri yarım kaldı? Bitenler için yaklaşık kaç dakika
   sürdü? Plana girmeyen bir iş yaptın mı?"
   Panoda "Bitti" ile işaretlenmiş görevleri tekrar sorma.

3. **Kaydet** (tek bir `batch` ile, `if_version` vererek):
   - **Bitenler:** `durum: "tamamlandi"`, `tamamlanma`, `gercek_dk`,
     `kalan_dk: 0`.
   - **Yarım kalanlar:** `kalan_dk` değerini kullanıcının söylediğine göre
     düşür. Hiç başlanmadıysa `ertelenme` değerini 1 artır.
   - **Plan dışı yapılan iş:** önemliyse yeni görev olarak `tamamlandi`
     durumuyla kaydet. Böylece neye zaman gittiği görünür olur.
   - `planlar/<bugün>` belgesine şu alanı ekle:
     `degerlendirme: {planlanan_dk, tamamlanan_dk, notlar}`.

4. **Öğren.** `planla.py katsayi` çalıştır. Katsayı belirgin şekilde
   değiştiyse tek cümleyle söyle. Örnek: "Tahminlerin gerçek sürenin
   ~%60'ı çıkıyor, katsayı ×1,7'ye çıktı."

5. **Yeniden planla.** `siralama`'yı çalıştır ve panoya yaz. `kapasite`
   çıktısında yeni bir "yetişmez" çıktıysa hemen söyle. Ardından yarın için
   `/gunluk-plan` akışını kısaltılmış haliyle çalıştır: tarih yarın, yorum kısa.

6. **Değerlendirme (en fazla 2 soru, isteğe bağlı):**
   - "Bugün seni en çok ne yavaşlattı?"
   - "Yarın ilk 90 dakikada neyi bitirirsen gün başarılı sayılır?"
   Cevabı yarının plan yorumuna yansıt.

7. **Kapanış:** Bugün kaç saat odaklı çalışıldı, kaç iş bitti, yarının ilk
   işi ne. Övgüyü abartma, eleştiriyi yumuşatma. Somut ol.

## Rutin modu
- Bugünün planındaki görevlerden panoda hâlâ `aktif` olanları listele.
- Son mesajda bunları "Bitirdiklerini panodan işaretle ya da bu oturuma yaz"
  notuyla ver.
- Yarının taslak planını yine de çıkar ve panoya yaz.
