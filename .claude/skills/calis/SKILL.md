---
name: calis
description: Bir öğrenme izinde (SolidWorks, yapay zekâ, Almanca, borsa, ders tekrarı) bugünkü çalışma oturumunu hazırlar. Müfredattaki sıradaki adımı, somut kaynak linkini, dakika dakika oturum planını ve alıştırmaları verir. Oturumdan sonra AI özeti ve bir sonraki adım tavsiyesini üretir, ilerlemeyi panoya kaydeder. "SolidWorks çalışacağım", "bugünkü Almanca", "AI oturumu", "ne çalışayım", "çalıştım, kaydet" denildiğinde kullan.
argument-hint: "<solidworks | yz | almanca | borsa | dersler> [bitti: ne yaptım]"
---

# /calis: Öğrenme izi oturumu

İzler ve öncelikleri (kullanıcının sırası):
1. dersler, takım, solidworks
2. yz
3. almanca
4. borsa

Bu sıra tartışılmaz. Zaman çakışırsa üstteki kazanır.

| İz | Müfredat dosyası | Pano belgesi |
|---|---|---|
| SolidWorks | `planlayici/izler/solidworks.md` | `izler/solidworks` |
| Yapay zekâ | `planlayici/izler/yapay-zeka.md` | `izler/yz` |
| Almanca | `planlayici/izler/almanca.md` | `izler/almanca` |
| Borsa | `planlayici/izler/borsa.md` | `izler/borsa` (akşam rutini için `/borsa` kullan) |
| Dersler | `planlayici/izler/dersler.md` | `izler/dersler` (ders notu için `/ders` kullan) |

Pano belgesi alanları:
- `ad`, `oncelik`, `alan`
- `haftalik_hedef_dk`, `ozel_hedefler: [{bas, bit, hedef_dk}]`
- `varsayilan_oturum_dk`, `faz`, `sonraki`
- `oturumlar: [{tarih, dk, not}]` (en fazla 60 kayıt)
- `ilerleme` (ize özel ölçüler: kelime sayısı, tamamlanan video gibi)
- `ozet` (son AI tavsiyesi)

## A) Oturum başlatma ("çalışacağım")
1. Müfredat dosyasını ve `izler/<iz>` belgesini oku (`ArtifactData get`).
   Bu haftanın toplamını hesapla: `oturumlar` içinde haftanın pazartesisinden
   bugüne kadar olan kayıtlar.
2. Sıradaki adımı belirle: belgedeki `sonraki` alanı, yoksa müfredatın
   mevcut fazındaki ilk tamamlanmamış adım.
3. Oturum planını ver (telefonda okunacak kadar kısa):
   - **Bugünün hedefi:** tek cümle, somut bir çıktı. Örnekler: "flanşlı
     yatak parçasını tam tanımlı sketch'lerle çiz", "Nicos Weg A1 Bölüm 4 +
     10 kelime".
   - **Kaynak:** müfredattaki gerçek link. Link uydurma; müfredatta yoksa
     WebSearch ile bul ve doğrula.
   - **Dakika dakika akış:** müfredattaki oturum şablonuna uy.
   - **Alıştırma:** Almanca için 5 cümle çevir/kur; SolidWorks için ölçülü
     parça tarifi; YZ için küçük bir uygulama görevi.
4. Kullanıcı konu anlatımı isterse kısa ve doğru anlat. Kaynağın yerini
   tutmaya çalışma.

## B) Oturum kapanışı ("bitti" / "çalıştım")
1. Kullanıcıya en fazla 2 soru sor: "Ne yaptın, nerede takıldın?" Almanca
   alıştırmasıysa cevaplarını iste.
2. **AI özeti ve tavsiye** üret, en fazla 6 satır:
   - Ne öğrenildi (2–3 madde).
   - Hata veya eksik varsa düzeltme. Almanca cümlelerini düzelt ve
     nedenini kısaca söyle.
   - Bir sonraki oturumun somut adımı.
3. Panoya yaz (`ArtifactData update` + `if_version`):
   - `oturumlar` dizisine `{tarih, dk, not}` ekle (son 60 kayıt kalsın).
   - `sonraki`, `ozet`, gerekiyorsa `faz` ve `ilerleme` alanlarını güncelle.
4. Haftalık hedefin gerisindeyse bunu söyle. Hangi boş bloğa ek oturum
   konabileceğini `planla.py gun` ile kontrol edip öner.

## Kurallar
- **Sınav dönemi** (profilde `sinav_donemleri`): Almanca yalnızca 10 dakika
  uygulama, borsa durur, YZ haftada 1 oturum. Kullanıcı isterse bile önce
  dersleri hatırlat.
- **Almanca:** her oturumda 10 yeni kelime (artikeliyle), 1 gramer notu ve
  5 cümlelik alıştırma olsun. Kelimeleri `ilerleme.kelimeler` sayısına ekle.
  Haftada bir mini sınav yap.
- **SolidWorks:** her oturum bir dosya veya parça çıktısıyla bitsin. Takım
  oynatma listesinde izle → durdur → aynısını çiz → bir parametreyi
  değiştir döngüsünü uygula.
- **YZ:** öğrenme / proje / trend dengesini müfredattaki haftalık ritme göre
  kur. Mobil uygulama işini "proje oturumu" say.
- **Ders tekrarı:** bu iz için `/ders` kullan.
