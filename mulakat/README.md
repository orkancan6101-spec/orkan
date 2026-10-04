# Otomotiv Kulübü – Üye Mülakatı Randevu Sistemi

Adayların mülakat saatini kendilerinin seçtiği web sitesi.

- **17:00 – 20:00** arası, **10 dakikalık** 18 görüşme saati; **her saatte 2 kişi** → toplam **36 kişi**
- Bir saatin 2 yeri dolunca saat herkese anında "Dolu" görünür ve kapanır
- Her aday **yalnızca bir randevu** alabilir (aynı e-posta veya telefonla ikinci randevu alınamaz)
- Aynı anda çok kişi aynı saate tıklarsa yalnızca 2 kişi alır (veritabanı seviyesinde garanti)
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

### 7/24 açık kalma

Site kurulduğu andan itibaren gece gündüz açıktır; link her an çalışır ve adaylar istedikleri saatte girip seçim yapabilir.
Siz de yönetim panelini (`/admin`) telefondan ya da bilgisayardan istediğiniz zaman açabilirsiniz.

- Render'ın ücretsiz sunucusu normalde 15 dakika kimse girmezse uykuya geçer ve sonraki ilk açılış 30–60 saniye sürer.
  Bunu önlemek için site **kendi adresine 10 dakikada bir istek atar** ve uykuya geçmez. Bu özellik Render'da
  otomatik açılır, ayrıca bir şey yapmanız gerekmez (kapatmak için `KEEP_ALIVE=off`).
- Render sunucuyu bakım için nadiren yeniden başlatabilir; bu durumda site bir dakika içinde kendiliğinden geri gelir.
  **Randevular kaybolmaz**, hepsi veritabanında saklanır.
- Ek güvence isterseniz ücretsiz [UptimeRobot](https://uptimerobot.com) hesabı açıp
  `https://SİTE-ADRESİNİZ/health` adresi için 5 dakikalık bir "HTTP monitor" ekleyin. Hem siteyi uyanık tutar
  hem de site erişilemez olursa size e-posta gönderir.
- Ücretsiz plan ayda 750 saat çalışma hakkı verir; tek site için 7/24 çalışmaya (ayda en fazla 744 saat) yeter.
  Kesin garanti isterseniz `otomotiv-mulakat` → **Settings → Instance Type** bölümünden ücretli **Starter**
  planına geçebilirsiniz (aylık birkaç dolar); bu planda sunucu hiç uyumaz.

### Bilmeniz gerekenler (ücretsiz plan)

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
| `SLOT_CAPACITY` | Aynı saate alınabilecek kişi sayısı | `2` |
| `KEEP_ALIVE` | `off` yazılırsa sitenin kendini uyanık tutması kapanır | açık |

> Saat aralığını veya süreyi, randevular alınmaya başladıktan **sonra** değiştirmeyin; mevcut randevular eski saatlere göre kayıtlıdır.

---

## Yönetim paneli (`/admin`)

- Tüm saatleri, kimin hangi saati aldığını (ad, e-posta, telefon, bölüm) görürsünüz.
- Her saatin 2 yeri ayrı satırda (1. kişi / 2. kişi) görünür.
- **Randevuyu iptal et**: o kişinin randevusunu siler; yer tekrar seçime açılır ve aday yeniden randevu alabilir.
  Aynı saatteki diğer kişinin randevusu etkilenmez.
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
