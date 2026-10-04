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

## Buluta kurulum (tamamen ücretsiz, süresiz, ~10 dakika)

- **Site** [Render](https://render.com) üzerinde çalışır.
- **Randevular** [Neon](https://neon.tech) üzerindeki PostgreSQL veritabanında saklanır. Neon'un ücretsiz planının süresi dolmaz.
- İkisi de kredi kartı istemez.

### 1) Veritabanı: Neon

1. **neon.tech** adresine gidin, **Sign up** ile GitHub ya da Google hesabınızla kayıt olun.
2. Yeni proje oluşturun:
   - **Project name**: `otomotiv-mulakat`
   - **Region**: **AWS Europe Central 1 (Frankfurt)** (siteyle aynı bölge, en hızlısı)
   - Diğer ayarları olduğu gibi bırakıp **Create project**'e basın.
3. Açılan sayfada **Connect** düğmesine basın. `postgresql://` ile başlayan bağlantı adresini **kopyala** simgesiyle kopyalayın.
   Adreste şifre `****` olarak gizliyse önce **Show password**'a basın.
   Bu adres şifre içerir, kimseyle paylaşmayın.

### 2) Site: Render

1. **render.com**'a GitHub hesabınızla (**orkancan6101-spec**) giriş yapın.
2. **+ New → Blueprint**'i seçin ve `orkancan6101-spec / orkan` deposunda **Connect**'e basın.
3. Formu doldurun:
   - **Blueprint Name**: `otomotiv-mulakat`
   - **Branch**: `claude/upbeat-newton-syzkmf` (varsayılan olarak başka bir dal gelir, mutlaka değiştirin)
   - **Blueprint Path**: boş bırakın
4. Aşağıda istenen iki değeri girin:
   - **DATABASE_URL** → Neon'dan kopyaladığınız adres
   - **ADMIN_PASSWORD** → yönetim paneli şifresi (güçlü bir şifre seçin ve not alın)

   Mülakat günü (**6 Ekim 2026 Salı**) zaten ayarlı.
5. **Deploy Blueprint**'e basın. Site 2–3 dakika içinde yayına girer.
6. **otomotiv-mulakat** servisine tıklayın. Üstte `https://otomotiv-mulakat-xxxx.onrender.com` gibi bir adres görürsünüz.
   **Adaylarla bu linki paylaşın.** Yönetim paneli için aynı adresin sonuna `/admin` ekleyin.

> Site `DATABASE_URL` olmadan Render'da çalışmayı bilerek reddeder; böylece randevuların geçici bir yerde tutulup kaybolması önlenir.
> Deploy "failed" görünürse **Logs** sekmesine bakın: `DATABASE_URL ayarlanmamış` yazıyorsa **Environment** sekmesinden adresi ekleyin.

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

- **Veritabanı:** Neon'un ücretsiz veritabanı süresizdir. Kimse kullanmazken uykuya geçer ve ilk istekte yaklaşık 1 saniyede uyanır; adaylar bunu fark etmez.
- **Yedek:** Mülakatlar bittiğinde yönetim panelinden **Excel / CSV indir** ile listeyi kaydedin.
- **Kapatma:** Siteyi kapatmak istediğinizde Render'da **otomotiv-mulakat** → **Settings** → en alttaki **Delete Web Service**'e basın.
  Randevu verilerini de silmek için Neon'da projeyi silin.

---

## Ayarlar

Render'da `otomotiv-mulakat` → **Environment** sekmesinden değiştirilebilir. Kaydettikten sonra site kendini yeniden başlatır.

| Değişken | Açıklama | Varsayılan |
|---|---|---|
| `DATABASE_URL` | Neon (veya başka bir PostgreSQL) bağlantı adresi. Render'da zorunludur | – |
| `ADMIN_PASSWORD` | `/admin` paneli şifresi (boşsa panel kapalıdır) | – |
| `INTERVIEW_DATE` | Mülakat günü (`YYYY-AA-GG`). Sayfada tarih olarak görünür, takvime eklemede kullanılır; saati geçen dilimler otomatik kapanır | `2026-10-06` (6 Ekim 2026 Salı) |
| `LOCATION` | Mülakat yeri (örn. `Mühendislik Fakültesi, B Blok 204` veya `Google Meet`) | – |
| `CONTACT` | Alt bilgide görünen iletişim (e-posta / telefon) | – |
| `CLUB_NAME` | Kulüp adı | `Otomotiv Kulübü` |
| `PAGE_TITLE` | Büyük başlık | `Otomotiv Kulübü Üye Mülakatı` |
| `SUBTITLE` | Başlığın altındaki soru | `Sizinle ne zaman görüşmemizi istersiniz?` |
| `START_TIME` / `END_TIME` | Görüşme saat aralığı | `17:00` / `20:00` |
| `SLOT_MINUTES` | Bir görüşmenin süresi (dakika) | `10` |
| `KEEP_ALIVE` | `off` yazılırsa sitenin kendini uyanık tutması kapanır | açık |

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
