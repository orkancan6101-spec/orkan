---
name: kurulum
description: Planlama asistanının kişisel profilini oluşturur veya günceller. Çalışma saatleri, en verimli saatler, ders programı, takım toplantıları, günlük kapasite, takvim izinleri ve hayat alanları belirlenir. İlk kullanımda, profilde kurulum_tamamlandi false iken ve kullanıcı "ders programım değişti", "çalışma saatlerimi güncelle" dediğinde kullan.
---

# /kurulum: Profili kur

Profil `ayarlar/profil` belgesindedir. Önce `ArtifactData get` ile oku ve
versiyonunu al. Soruları **3 tur** halinde sor; her turda en fazla 4 soru
olsun. Mevcut değerleri öneri olarak göster ki kullanıcı "aynen" diyebilsin.

## Tur 1: Ritim
1. Genelde kaçta uyanıp kaçta yatıyorsun? (Hafta içi ve hafta sonu ayrı)
2. Günün hangi saatlerinde zihnin en açık? (Zor hesap ve yazma için.)
   → `zirve_saatleri`
3. Bir oturumda kaç dakika kesintisiz odaklanabiliyorsun? (25 / 50 / 90)
   → `blok_dk`, `mola_dk`
4. Gerçekçi olarak günde kaç saat odaklı çalışabiliyorsun, derslerin
   dışında? → `gunluk_max_is_dk`, `gunluk_derin_limit_dk`

## Tur 2: Sabit programlar
1. Bu dönemin ders programı: gün, saat, ders adı. Fotoğraf ya da metin olarak
   yapıştırabilirsin. → `haftalik_sabitler`
   Takvim bağlıysa ve dersler zaten takvimdeyse bunu sorma, takvimden oku.
2. Solar Team toplantıları ve atölye saatleri ne zaman?
3. Düzenli başka bir şey var mı? (Spor, iş, ulaşım, ailevi sorumluluk)
4. Çalışma pencereleri: derslerin ve uykun dışında hangi aralıklarda
   çalışabilirsin? → `calisma_pencereleri`

## Tur 3: Tercihler
1. Takvimine odak bloklarını ben ekleyeyim mi?
   (a) her seferinde sor → `takvim_yazma: "onayla"`
   (b) planlayıcının odak bloklarını otomatik ekle, sabit etkinlikler için
   sor → `"otomatik"`
2. Sabah planına e-posta taraması ekleyeyim mi?
   → `sabah_eposta_tarama: true/false`
3. Hangi hayat alanlarını takip edelim? (okul, solar, kişisel, sağlık,
   kariyer + istediğin) → `alanlar`
4. Bu dönemki en büyük 3 hedefin ne? → `donem_hedefleri`. Her biri için
   `/proje-plani` önerilir.

## Kaydet
- `ayarlar/profil` belgesini `update` + `if_version` ile güncelle.
  `kurulum_tamamlandi: true` yap. `baglam` alanını öğrendiklerinle 2–3 cümle
  olarak güncelle; panodaki AI yorumu bunu kullanır.
- Saatleri `"HH:MM"`, pencereleri `[["09:00","12:30"], ...]` biçiminde yaz.
  Gün anahtarları: `"hafta_ici"`, `"hafta_sonu"` ya da `"pazartesi"` …
  `"pazar"`.
- Sonra bugün ya da yarın için `/gunluk-plan` çalıştırıp profili hemen test
  et. Kullanıcıya "Bu plan gerçekçi görünüyor mu?" diye sor ve gerekirse
  ayarla.

## Doğrulama
Kaydettikten sonra profili `out_dir` ile indir ve şunu çalıştır:
`python3 planlayici/planla.py gun --veri planlayici/.veri --tarih <yarın>`.
Hata veriyorsa biçimi düzelt.
