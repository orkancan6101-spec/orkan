# Otomotiv Kulübü – Üye Mülakatı Randevu Sistemi

Adayların mülakat saatini kendilerinin seçtiği web sitesi.

- **17:00 – 20:00** arası, **10 dakikalık** 18 görüşme saati
- Her saati **yalnızca bir kişi** alabilir; seçilen saat herkese anında "Dolu" görünür
- Her aday **yalnızca bir randevu** alabilir (aynı e-posta veya telefonla ikinci randevu alınamaz)
- Aynı anda birden fazla kişi aynı saate tıklarsa saati yalnızca biri alır (veritabanı seviyesinde garanti)
- Sayfa her 15 saniyede bir kendini günceller; boş/dolu sayısı ve doluluk oranı canlı görünür
- Randevu sonrası onay ekranı, **Google Takvim'e ekle** ve **.ics** takvim dosyası
- Şifreli **yönetim paneli** (`/admin`): tüm randevular, iptal etme, **Excel/CSV** indirme
- Bulutta çalışır: sizin bilgisayarınızın açık ya da kapalı olması siteyi etkilemez

---

## Buluta kurulum (Render, ücretsiz, ~5 dakika)

Site ve veritabanı [Render](https://render.com) üzerinde çalışır. Kredi kartı gerekmez.

1. **render.com** adresine gidin ve **GitHub hesabınızla giriş yapın**.
2. Üst menüden **New → Blueprint** seçin.
3. `orkancan6101-spec/orkan` deposunu seçin (gerekirse "Configure GitHub" ile Render'a bu depoya erişim izni verin).
   **Branch** olarak `claude/upbeat-newton-syzkmf` seçin (bu değişiklik ana dala birleştirildiyse ana dalı seçebilirsiniz).
4. Render, depodaki `render.yaml` dosyasını okuyup iki şey kuracağını gösterir:
   - `otomotiv-mulakat` (web sitesi)
   - `otomotiv-mulakat-db` (PostgreSQL veritabanı)
5. Sizden **ADMIN_PASSWORD** istenir → yönetim paneli şifresi (güçlü bir şifre seçin, kimseyle paylaşmayın).
   Mülakat günü (**6 Ekim 2026 Salı**) hazır olarak ayarlıdır.
6. **Apply** (Deploy) düğmesine basın. 2–3 dakika içinde site yayına girer.
7. `otomotiv-mulakat` servisine tıklayın; üstte `https://otomotiv-mulakat.onrender.com` benzeri bir adres görürsünüz.
   **Bu linki adaylarla paylaşın.** Yönetim paneli: aynı adresin sonuna `/admin` ekleyin.

### Bilmeniz gerekenler (ücretsiz plan)

- **Uyku modu:** Ücretsiz sunucu 15 dakika kimse girmezse uyur; ilk giren kişi için sayfanın açılması
  30–60 saniye sürebilir, sonrası hızlıdır. **Randevular kaybolmaz** (veritabanında saklanır).
  Linki paylaşmadan birkaç dakika önce siteyi bir kez kendiniz açın.
  Sürekli uyanık kalmasını isterseniz ücretsiz [UptimeRobot](https://uptimerobot.com) ile
  `https://SİTE-ADRESİNİZ/health` adresine 5 dakikada bir istek gönderecek bir "monitor" kurun.
- **Veritabanı süresi:** Render'ın ücretsiz veritabanı oluşturulduktan **30 gün sonra** sona erer.
  Mülakat süreci bu süre içinde biteceği için sorun olmaz; bittiğinde yönetim panelinden CSV'yi indirmeyi unutmayın.
  Daha uzun süre lazımsa veritabanını Render'da ücretli plana geçirebilir ya da
  [Neon](https://neon.tech) gibi ücretsiz bir PostgreSQL'in bağlantı adresini `DATABASE_URL` olarak girebilirsiniz.

---

## Ayarlar

Render'da `otomotiv-mulakat` → **Environment** sekmesinden değiştirilebilir. Kaydettikten sonra site kendini yeniden başlatır.

| Değişken | Açıklama | Varsayılan |
|---|---|---|
| `ADMIN_PASSWORD` | `/admin` paneli şifresi (boşsa panel kapalıdır) | – |
| `INTERVIEW_DATE` | Mülakat günü (`YYYY-AA-GG`). Sayfada tarih olarak görünür, takvime eklemede kullanılır; saati geçen dilimler otomatik kapanır | `2026-10-06` (6 Ekim 2026 Salı) |
| `LOCATION` | Mülakat yeri (örn. `Mühendislik Fakültesi, B Blok 204` veya `Google Meet`) | – |
| `CONTACT` | Alt bilgide görünen iletişim (e-posta / telefon) | – |
| `CLUB_NAME` | Kulüp adı | `Otomotiv Kulübü` |
| `PAGE_TITLE` | Büyük başlık | `Otomotiv Kulübü Üye Mülakatı` |
| `SUBTITLE` | Başlığın altındaki soru | `Sizinle ne zaman görüşmemizi istersiniz?` |
| `START_TIME` / `END_TIME` | Görüşme saat aralığı | `17:00` / `20:00` |
| `SLOT_MINUTES` | Bir görüşmenin süresi (dakika) | `10` |

> Saat aralığını veya süreyi, randevular alınmaya başladıktan **sonra** değiştirmeyin; mevcut randevular eski saatlere göre kayıtlıdır.

---

## Yönetim paneli (`/admin`)

- Tüm saatleri, kimin hangi saati aldığını (ad, e-posta, telefon, bölüm) görürsünüz.
- **İptal et**: bir randevuyu siler; saat tekrar seçime açılır ve o aday yeniden randevu alabilir.
  (Adaylar kendi randevularını değiştiremez; değişiklik isteyen adayın randevusunu buradan iptal edip yeniden almasını isteyin.)
- **Excel / CSV indir**: listeyi Excel'de açılabilir dosya olarak indirir.

---

## Bilgisayarda deneme (isteğe bağlı)

Node.js 20 veya üstü gerekir.

```bash
cd mulakat
npm install
ADMIN_PASSWORD=deneme npm start
# http://localhost:3000  ve  http://localhost:3000/admin
```

`DATABASE_URL` verilmezse randevular `mulakat/data/bookings.json` dosyasında tutulur (yalnızca deneme için).

Testler (çift rezervasyon, eşzamanlı seçim, yönetim paneli vb.):

```bash
npm test
# PostgreSQL ile de denemek için:
TEST_DATABASE_URL=postgres://kullanici:sifre@localhost:5432/veritabani npm test
```
