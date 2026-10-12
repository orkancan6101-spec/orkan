---
name: gorev
description: Yeni bir görevi, ödevi, işi, randevuyu ya da hatırlatmayı alır. Analiz eder, eksik bilgiyi profesyonel sorularla tamamlar, alt adımlara böler, önceliklendirir, takvime yerleştirmeyi önerir ve onayla ekler. Kullanıcı "şunu yapmam lazım", "ödevim var", "takvime ekle", "X'e yetişmem gerekiyor" dediğinde ya da bir iş tarif ettiğinde kullan. Gelen kutusundaki (durum=gelen) görevleri netleştirmek için de kullan.
argument-hint: "[görevin kısa tarifi]"
---

# /gorev: Görev al, analiz et, planla

Amaç: Tek cümlelik bir istekten, takvimde yeri olan ve yetişip yetişmeyeceği
bilinen bir plana gitmek. Adımları sırayla izle. Kullanıcı acele ediyorsa
(örneğin "sadece ekle") 3. adımı kısalt, ama 5. adımdaki fizibilite kontrolünü
asla atlama.

## 1. Veriyi indir
CLAUDE.md'deki **P1**'i uygula. Aynı işin zaten var olup olmadığına bak (benzer
başlık, aynı son tarih). Varsa yeni kayıt açma, onu güncelle. Kullanıcı
gelen kutusunu işlemeni istediyse `durum=gelen` olan görevleri sırayla ele al.
Panodaki `on_analiz` ve `cevaplar` alanlarını da oku: kullanıcı bazı soruları
orada cevaplamış olabilir.

## 2. Türünü belirle
- **Tek seferlik iş**: ödev, form, e-posta, alışveriş.
- **Etkinlik**: saati sabit iş (sınav, toplantı, randevu). `tur: "etkinlik"`,
  `bas` ve `bit` alanları zorunlu.
- **Proje**: birden çok oturum gerektiren, 4 saati aşan iş (rapor, tasarım,
  sınav hazırlığı). 2 saati aşan her iş için en azından alt görevlere böl.
  Haftalara yayılıyorsa `/proje-plani`'na geç.
- **Alışkanlık**: tekrarlayan iş (spor, kelime çalışması). Takvimde
  tekrarlayan blok olarak önerilir.
- **Bekleyen**: başkasından cevap ya da malzeme gerekiyor. `durum: "bekliyor"`
  ve `bekledigi` alanıyla kaydet.

## 3. Profesyonel sorular
`soru-bankasi.md` dosyasından bu türe uyan soruları seç. Kurallar:
- En fazla 4 soru sor. Hepsini tek mesajda, numaralı olarak sor.
- Cevabını tahmin edebildiğin şeyi sorma. Tahminini söyle ve onaylat.
  Örnek: "Bunu yaklaşık 3 saat diye tahmin ediyorum (ilk FEA'n olduğu için
  pay ekledim), doğru mu?"
- Her zaman öğrenmen gerekenler: son tarihin kesin olup olmadığı, "bitti"nin
  tanımı (teslim biçimi), önem (1–5) ve süre tahmini.
- Kullanıcı "bilmiyorum" derse makul bir varsayım yap ve bunu `analiz`
  alanına yaz.

## 4. Analiz et
Cevaplarla şunları çıkar:
- **Alt görevler.** Her biri 25–90 dakikalık, fiille başlayan somut adım
  olsun. Örnek: "Kaliper bağlantı CAD'ini STEP olarak dışa aktar".
- **Süre tahmini (`tahmin_dk`).** Alt görevlerin toplamı. Katsayıyı ekleme,
  motor ekler.
- **Önem (1–5).** 5: not, takım veya kariyer için kritik ya da başkaları buna
  bağlı. 3: yapılmalı ama esnek. 1: olsa iyi olur.
- **Enerji.** `derin`: hesap, tasarım, yazma, öğrenme. `orta`: düzenleme,
  toplantı hazırlığı. `hafif`: e-posta, form, sipariş.
- **Bağımlılıklar** (`bagimli`): önce bitmesi gereken görevlerin id'leri.
- **`sonraki_adim`**: 10–25 dakikada yapılabilecek ilk fiziksel eylem.
- **`niyet`**: "Salı 09:00, kütüphane, telefon çantada: ..." biçiminde.
- **`analiz`**: 1–3 cümle. Neden önemli, risk ne, nasıl ele alınmalı.

## 5. Kaydet ve fizibiliteyi kontrol et
1. Görevi (ve alt görevlerini `ust_id` ile) panoya yaz (**P3**).
   `olusturma`/`guncelleme` alanlarını doldur. Gelen kutusundan geldiyse
   `durum: "aktif"` yap.
2. Veriyi yeniden indir (P1), `siralama` komutunu çalıştır ve panoya yaz
   (P2, P3).
3. `kapasite` çıktısına bak:
   - **Yetişmez**: bunu açıkça söyle. Açığı saat olarak ver ve en az 2 somut
     seçenek sun: kapsamı daralt (neyi?), süre iste (kimden?), şu görevi
     ertele ya da bırak (hangisi?), ya da hafta sonu ek blok koy.
   - **Sıkışık**: tampon kalmadığını söyle.
   - **Rahat**: tek cümleyle geç.

## 6. Takvime yerleştirmeyi öner
- Etkinlikse doğrudan o saate yerleştir.
- Görevse ilk 1–3 odak bloğunu öner. Son tarihe yakın günlerden değil, en
  erken uygun günlerden başla. `planla.py gun --tarih ...` ile o günün boş
  yerlerini kontrol et.
- Öneriyi şu biçimde göster: "Çar 09:00–10:30 · Odak: ... (derin)".
- Onay gelince `/takvim` skill'indeki kurallarla ekle ve etkinlik id'lerini
  görevin `takvim` alanına yaz.

## 7. Kapanış mesajı
Kısa tut:
- **Kayıt:** başlık · önem · son tarih · katsayılı süre
- **Durum:** rahat / sıkışık / yetişmez (+ ne yapılmalı)
- **İlk adım:** ...
- **Takvim:** eklenen ya da önerilen bloklar
- Sıralamada kaçıncı olduğu ve bir önceki 1. ile karşılaştırma (sıra
  değiştiyse)
