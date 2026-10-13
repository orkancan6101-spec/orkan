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

Düzenleme yetkisi claude.ai paylaşımından gelir. Panel sahibi Paylaş
menüsünden kişileri e-postayla **düzenleyebilir** olarak ekler; yalnızca
görmesi gerekenler **görüntüleyebilir** olur. Görüntüleyenler hiçbir şeyi
değiştiremez (sunucu tarafında engellenir). Belge yükleme ve silme yalnızca
düzenleyenlere açıktır.

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
