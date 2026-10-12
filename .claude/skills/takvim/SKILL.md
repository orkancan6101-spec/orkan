---
name: takvim
description: Google Takvim'e etkinlik ya da odak bloğu ekler, taşır veya listeler. Çakışma kontrolü yapar, hatırlatma ve renk kurallarını uygular, planlayıcının oluşturduğu etkinlikleri işaretler. Takvim bağlı değilse .ics dosyası üretir. "Takvime ekle", "şu saate koy", "bloğu kaydır", "yarın neler var" denildiğinde ve diğer skill'ler takvime yazacağı zaman kullan.
argument-hint: "[ne, ne zaman]"
---

# /takvim: Takvim işlemleri

## Araçları bul
- Google Takvim araçlarının adları kuruluma göre değişir. Örnekler:
  `mcp__Google_Calendar__create_event`,
  `mcp__plugin_small-business_google-calendar__create_event`.
  ToolSearch ile "calendar create_event" ara.
- Araç yoksa ya da yetkilendirme hatası verirse **yedek yolu** kullan:
  1. Planı `planla.py gun --kaydet` ile üret.
  2. `planla.py ics --plan planlayici/.veri/plan.json --cikti planlayici/takvim.ics`
     ile .ics dosyası üret ve kullanıcıya gönder.
  3. Kullanıcıya bir kez şunu söyle: "claude.ai → Ayarlar → Bağlayıcılar'dan
     Google Calendar'ı bağlarsan bunu kendim eklerim."

## Yazmadan önce
1. **Çakışma kontrolü.** İlgili zaman aralığını `list_events` ile çek.
   Çakışma varsa yazma; en yakın 2 boş aralığı öner (`suggest_time` varsa
   onu kullan).
2. **Onay.** Eklenecek her şeyi tek listede göster ve onay al:
   `Çar 15 Eki 09:00–10:30 · Odak: Mukavemet ödevi 3 (derin)`.
   İstisna: profilde `takvim_yazma: "otomatik"` varsa planlayıcının kendi
   odak bloklarını onaysız ekle. Sabit etkinliklerde (sınav, toplantı) her
   zaman onay al.
3. **Saat dilimi.** Saatleri İstanbul yerel saati olarak, ofset vermeden yaz
   (`2026-10-15T09:00:00`). Kullanıcı başka bir saat dilimi söylerse
   `timeZone` alanını kullan.

## Etkinlik kuralları
- **Odak blokları:**
  - Başlık: `Odak: <görev başlığı>`.
  - Açıklama, `niyet` ile başlar, `Sonraki adım: ...` ile devam eder ve
    `planlayici:gorev=<id>` satırıyla biter.
  - `availability: BUSY`. Hatırlatma: 5 dakika önce açılır bildirim.
- **Sabit etkinlikler (sınav, toplantı, randevu):**
  - Görevin başlığıyla eklenir; açıklamaya `planlayici:gorev=<id>` yazılır.
  - Hatırlatmalar: sınav için 1 gün ve 2 saat önce. Diğerleri için
    30 dakika önce.
  - Mekân dışarıdaysa önüne yol süresi kadar ayrı bir "Yol" bloğu öner.
- **Son tarih hatırlatması** (istenirse): son tarih gününe tüm gün etkinliği,
  `Teslim: <başlık>`, `availability: FREE`.
- **Renkler** (`colorId`): okul 9, solar 10, kişisel 5, sağlık 2, kariyer 3.
- **Tekrarlayan bloklar** (spor, kelime): `recurrenceData` ile
  `RRULE:FREQ=WEEKLY;BYDAY=...` kullan.

## Yazdıktan sonra
- Dönen etkinlik id'lerini görevin `takvim` alanına
  `[{id, bas, bit}]` olarak ekle (`ArtifactData update` + `if_version`).
- **Taşıma.** Önce `takvim` alanındaki ya da açıklamasında
  `planlayici:gorev=<id>` geçen etkinliği bul, sonra `update_event` ile taşı.
- **Silme.** `delete_event` öncesinde koruma hook'u onay ister. Yalnızca
  planlayıcının oluşturduğu ve kullanıcının silinmesini onayladığı
  etkinlikleri sil.

## Listeleme
"Yarın neler var?" gibi sorularda takvimi ve o günün `planlar/<tarih>`
belgesini birlikte göster. Boş aralıkları ve bunlara sığabilecek en önemli
işi öner.
