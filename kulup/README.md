# ESOGÜ Otomotiv Kulübü · Yönetim Paneli

Bulutta, her zaman açık çalışan kulüp paneli:
**https://claude.ai/artifact/SGCiszSocGQtNKthvC8F3Z**

## Ne var

| Bölüm | İçerik |
|---|---|
| Genel bakış | Açık / süresi geçen / son 7 günde biten görev sayısı; **Bana atanan** ve **Benim atadıklarım**; dört departmanda kim ne yapıyor; yaklaşan son tarihler; son hareketler; şu an kim müsait |
| Departman (×4) | **Ekip ve görevler**: departmandaki herkesin kendi kartı ve o kişiye atanan görevler (atayan, son tarih, durum). Üstte filtre: herkes, bana atanan, benim atadıklarım, tek kişi. **Tablolar**: kulübün açtığı Excel benzeri tablolar. **Belgeler**: yükleme ve Drive linkleri |
| Müsaitlik | Kişi başına haftalık program (08:00–22:00, saatlik: müsait / ders / meşgul), ısı haritası, en uygun toplantı saatleri |
| Yönetim şeması | Ekip kartları, kişinin görevleri ve programı |

Panel hazır tablo ya da görev getirmez; hepsini kulüp ekler. Para, bütçe ve
ödeme takibi bilerek yoktur.

## Yetki

- Panel claude.ai'de barınır; 7/24 açıktır, bu oturuma ya da bir sunucuya bağlı değildir.
- Veritabanı kuralı: `{path: "", read: "view", write: "admin"}`. Okuma: paneli
  açabilen herkes. Yazma (görev, tablo, kişi, müsaitlik, hareket kaydı): yalnızca
  panel sahibi ve Paylaş menüsünden **düzenleyebilir** (Editor) eklenen hesaplar.
  Kural sunucuda uygulanır. Belge yükleme/silme de yalnızca bu hesaplara açıktır.
- Kişisel hesapta (Pro/Max) dışarıdan davet edilen düzenleyenlerin yazma yetkisi,
  panel aynı anda herkese açık linkle paylaşılırsa düşer. Düzenleyenler varken
  herkese açık linki kapalı tutun; görecek herkesi e-postayla ekleyin.
- Görüntüleyenler panele girmek için claude.ai'de oturum açmalıdır. "Ekipte ben
  kimim?" seçimleri yalnızca kendi tarayıcılarında saklanır.

## Veri (panelin veritabanı)

- `kisiler/<id>`: `ad, departman, seviye (baskan|yardimci|ekip), rol, aciklama, sira, hesap`
- `dosyalar/<id>`: `baslik, aciklama, departman, sira, kolonlar[{id, ad, tur, secenekler?, gen?}], satirlar{<satirId>: {_s, <kolonId>: deger}}`
  - `tur`: `metin | uzun | tik | tarih | sayi | secim | kisi | link | belge`
- `gorevler/<id>`: `baslik, aciklama, departman, sorumlu (kime atandı), atayan (kişi id), son_tarih, oncelik, durum (yapilacak|devam|bitti), olusturan, olusturma, tamamlanma`
- `belgeler/<id>`: `ad, departman, tur (dosya|link), asset | url, yukleyen, tarih, not`
- `musaitlik/<kisiId>`: `gunler {pzt..paz: 14 karakter}, not` — her karakter bir saat
  (08:00'dan başlar): `m` müsait, `d` ders, `x` meşgul, `.` bilinmiyor
- `hareketler/<id>`: son değişiklikler

## Güncelleme

- Sayfa: `kulup/index.html` değişince aynı URL'ye yeniden yayımla
  (Artifact, `url` = panel_url).
- Ekip listesi: `python3 kulup/tohum.py <klasör>` ile üretilir,
  `ArtifactData batch` ile yüklenir. Var olan belgelerin üzerine yazmadan
  önce sürümlerini oku (`if_version`).
- Müsaitlik bilgisi geldiğinde `musaitlik/<kisiId>` belgeleri yukarıdaki
  biçimde yazılır.
