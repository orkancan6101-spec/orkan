---
name: haftalik-plan
description: Haftalık gözden geçirme ve planlama (GTD weekly review). Gelen kutusunu boşaltır, takılan ve ertelenen işleri ayıklar, önümüzdeki 14 günün son tarihlerini kapasiteyle karşılaştırır, alanlar arasında denge kurar, haftanın 3 hedefini seçer ve büyük işleri günlere dağıtır. "Haftayı planla", "haftalık değerlendirme" denildiğinde ve pazar rutininde kullan.
argument-hint: "[rutin]"
---

# /haftalik-plan: Haftalık gözden geçirme

Rutin modunda (argümanda "rutin") soru sorma. Analizi yap, haftanın taslağını
panoya yaz ve kararları kullanıcıya bırakan bir özet üret.

## 1. Topla ve temizle
- P1 ile veriyi indir. Takvim bağlıysa önümüzdeki 14 günün etkinliklerini çek.
- **Gelen kutusu** (`durum=gelen`): her birini `/gorev` mantığıyla kısaca
  netleştir. Rutin modunda yalnızca listele.
- **Bekleyenler** (`durum=bekliyor`): bir haftadan uzun bekleyenler için
  hatırlatma mesajı taslağı öner (kime, ne). Gönderme.
- **Takılanlar** (`ertelenme >= 3`, ya da 14 günden eski ve son tarihsiz):
  her biri için karar iste: küçült, sil, devret ya da bu hafta yap.

## 2. Geçen hafta
- `planlar/` belgelerinden son 7 günün `degerlendirme` alanlarını oku.
  Toplam planlanan ve tamamlanan süreyi hesapla.
- `katsayi` komutunu çalıştır.
- Bulguyu tek paragrafta söyle. Örnek: "Planladığının %55'ini bitirdin. Kayıp
  en çok salı ve çarşamba akşamlarında. Akşam bloklarını 60 dakikaya
  düşürelim mi?"

## 3. Önümüzdeki 14 gün
- `kapasite` çıktısını göster: hangi son tarih rahat, hangisi sıkışık,
  hangisi yetişmiyor.
- Sınav haftası, takım yarışı ya da teslim yığılması varsa erkenden işaretle.
  İşleri öne çekmeyi öner.

## 4. Denge ve hedefler
- Aktif işleri alana göre say (okul, solar, kişisel, sağlık, kariyer).
  Bir alan tamamen boşsa bunu söyle. Örnek: "Bu hafta hiç sağlık bloğu yok."
- Kullanıcıyla **haftanın 3 hedefini** seç. En az biri kadran 2'den
  (önemli, acil değil) olsun. Hedefler "çıktı" olarak yazılır.
  Örnek: "ANSYS modül 2 bitti, mesh yakınsama grafiği hazır".
- Hedefleri `ayarlar/profil` belgesine `hafta_hedefleri:
  {hafta: "YYYY-Www", hedefler: [...]}` olarak yaz.

## 5. Dağıt
- Büyük işleri günlere dağıt. Her gün için `planla.py gun` ile bir taslak al.
  Yalnızca pazartesinin planını panoya yaz; diğer günler o sabah taze veriyle
  yeniden planlanır.
- Tekrarlayan blokları (spor, kelime, takım toplantısı) takvime bir kez
  tekrarlayan etkinlik olarak eklemeyi öner (`/takvim`).

## Çıktı
```
Hafta <YYYY-Www> · kapasite ≈ <saat> · son tarihli iş yükü ≈ <saat>
Hedefler: 1) ... 2) ... 3) ...
Risk: <yetişmeyen ya da sıkışık son tarihler>
Karar bekleyenler: <takılan işler, bekleyenler>
```
