# ESOGÜ Otomotiv Kulübü · Yönetim Paneli

Bulutta, her zaman açık çalışan kulüp paneli:
**https://claude.ai/artifact/SGCiszSocGQtNKthvC8F3Z**

## Ne var

| Bölüm | İçerik |
|---|---|
| Genel bakış | Açık görevler, sponsor anlaşmaları, sonraki etkinlik, kasa; önümüzdeki 3 haftanın tarihleri; son hareketler; şu an kim müsait |
| 01 Kurumsal İlişkiler | Sponsor takip listesi, sponsorluk paketleri, sözleşme/ödeme, firma gezileri, konuşmacı havuzu, kurum ilişkileri, mezun ağı, görüşme kaydı |
| 02 İletişim ve Sosyal Medya | İçerik takvimi, tasarım talepleri, marka kiti, hesaplar, aylık rapor, duyuru kanalları |
| 03 Organizasyon | Yıllık etkinlik takvimi, etkinlik kontrol listesi, izin/resmi yazışmalar, bütçe, görevli üye planı, üye listesi, envanter, etkinlik raporları |
| 04 Erasmus+ | Proje/çağrı takibi, ortak kuruluşlar, başvuranlar, webinar takvimi, kaynaklar |
| Müsaitlik | Kişi başına haftalık program (08:00–22:00, saatlik: müsait / ders / meşgul), ısı haritası, en uygun toplantı saatleri |
| Yönetim şeması | Ekip kartları, kişinin açık görevleri ve programı |

Her departmanda üç sekme var: **Tablolar** (Excel gibi düzenlenir, onay kutusu,
not, kişi, tarih, tutar, belge sütunları; Excel/CSV içe aktarma ve Excel indirme),
**Görevler** (yapılacak / devam / bitti) ve **Belgeler** (PDF, görsel, CSV
yükleme ya da Drive linki).

## Yetki

Düzenleme yetkisi claude.ai paylaşımından gelir. Panel sahibi Paylaş
menüsünden kişileri e-postayla **düzenleyebilir** olarak ekler; yalnızca
görmesi gerekenler **görüntüleyebilir** olur. Görüntüleyenler hiçbir şeyi
değiştiremez (sunucu tarafında engellenir). Belge yükleme ve silme yalnızca
düzenleyenlere açıktır.

## Veri (panelin veritabanı)

- `kisiler/<id>`: `ad, departman, seviye (baskan|yardimci|ekip), rol, aciklama, sira, hesap`
- `dosyalar/<id>`: `baslik, aciklama, departman, sira, kolonlar[{id, ad, tur, secenekler?, gen?}], satirlar{<satirId>: {_s, <kolonId>: deger}}, ozel?, ajanda?`
  - `tur`: `metin | uzun | tik | tarih | sayi | para | secim | kisi | link | belge`
  - `ozel`: `sponsor | etkinlik | butce` (genel bakıştaki sayılar buradan)
  - `ajanda`: `{tarih, baslik, bitti?, durum?}` kolon id'leri; tarihli satırlar genel bakışa düşer
- `gorevler/<id>`: `baslik, aciklama, departman, sorumlu, son_tarih, oncelik, durum, olusturan, olusturma, tamamlanma`
- `belgeler/<id>`: `ad, departman, tur (dosya|link), asset | url, yukleyen, tarih, not`
- `musaitlik/<kisiId>`: `gunler {pzt..paz: 14 karakter}, not` — her karakter bir saat
  (08:00'dan başlar): `m` müsait, `d` ders, `x` meşgul, `.` bilinmiyor
- `hareketler/<id>`: son değişiklikler

## Güncelleme

- Sayfa: `kulup/index.html` değişince aynı URL'ye yeniden yayımla
  (Artifact, `url` = panel_url).
- Başlangıç verisi: `python3 kulup/tohum.py <klasör>` ile üretilir,
  `ArtifactData batch` ile yüklenir. Var olan belgelerin üzerine yazmadan
  önce sürümlerini oku (`if_version`).
- Müsaitlik bilgisi geldiğinde `musaitlik/<kisiId>` belgeleri yukarıdaki
  biçimde yazılır.
