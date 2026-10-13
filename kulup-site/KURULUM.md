# ESOGÜ Otomotiv Kulübü sitesi · Kurulum

Kendi adresi olan, ücretsiz ve 7/24 açık site. İki ücretsiz hizmet kullanır:

- **Render (statik site):** sayfayı yayınlar. Statik siteler uyumaz.
  Adres `isim.onrender.com` biçimindedir.
- **Firebase:** Google ile giriş ve veritabanı (Firestore). Ücretsiz planda
  günde 50.000 okuma ve 20.000 yazma hakkı var; kulüp kullanımı için yeterli.

Kim ne yapabilir:

| Kim | Ne yapar |
|---|---|
| Linke tıklayan herkes | Ekibi, görevleri, etkinlikleri, tabloları, belgeleri ve müsaitliği görür |
| Yetkililer listesindeki Gmail hesapları | Görev atar; etkinlik, tablo, belge, kişi ve müsaitlik ekler, düzenler |
| Site sahibi | Yukarıdakilere ek olarak yetkili listesini yönetir, yedek alır |

Bu kurallar `firestore.rules` dosyasında, yani veritabanında uygulanır.

## 1. Firebase projesi

1. https://console.firebase.google.com adresine site sahibinin Gmail hesabıyla gir.
2. **Proje oluştur** → ad: `esogu-otomotiv` → Google Analytics kapalı → Oluştur.
3. Sol menü **Derleme → Authentication → Başlayın**. Oturum açma yöntemlerinden
   **Google**'ı seç, **Etkinleştir**, destek e-postası olarak kendi adresini seç, **Kaydet**.
4. Sol menü **Derleme → Firestore Database → Veritabanı oluştur**. Konum:
   `eur3 (europe-west)`. **Üretim modunda başlat** → Oluştur.
5. Firestore'da **Kurallar** sekmesini aç. İçindekini sil, `firestore.rules`
   dosyasını yapıştır, `SAHIBIN_GMAIL_ADRESI` yerine site sahibinin Gmail
   adresini küçük harfle yaz, **Yayınla**.
6. Sol üstte dişli → **Proje ayarları → Genel → Uygulamalarınız** → web simgesi
   `</>` → takma ad `site` → (Firebase Hosting kutusunu işaretleme) →
   **Uygulamayı kaydet**. Çıkan `firebaseConfig` değerlerini `firebase-config.js`
   dosyasına yaz. Bu değerler gizli değildir.

## 2. Render'da yayın

1. https://render.com → **New → Static Site**.
2. GitHub hesabını bağla ve bu repoyu seç.
3. Ayarlar:
   - **Branch:** sitenin kodunun olduğu dal (tercihen `main`)
   - **Build Command:** `echo hazir`
   - **Publish Directory:** `kulup-site`
4. **Create Static Site**. Birkaç dakika sonra adres hazır olur
   (örneğin `esogu-otomotiv.onrender.com`). Dala her gönderilen değişiklik
   siteyi kendiliğinden günceller.

## 3. Girişi Render adresine aç

Firebase konsolu → **Authentication → Ayarlar → Yetkili alan adları → Alan adı ekle**
→ Render adresini yaz (örneğin `esogu-otomotiv.onrender.com`).

## 4. İlk giriş

1. Siteyi aç, sol alttan **Google ile giriş yap**. Site sahibi ilk girişte
   otomatik olarak sahip olur.
2. **Yetkililer** sayfasında **Yönetim şemasındaki ekibi yükle** düğmesine bas
   (14 kişi `ilk-ekip.json` dosyasından gelir).
3. Düzenleyebilecek kişilerin Gmail adreslerini ekle. Bu kişiler siteye kendi
   hesaplarıyla girdiğinde düzenleme açılır.

## Yedek

Yetkililer sayfasındaki **Tüm veriyi yedekle (JSON)** her şeyi tek dosyaya indirir;
**Yedekten geri yükle** aynı dosyayı geri yazar. Tablolar ayrıca Excel olarak indirilebilir.

## Dosyalar

| Dosya | Ne işe yarar |
|---|---|
| `index.html` | Sayfa ve görünüm |
| `app.js` | Uygulama: departmanlar, görevler, etkinlikler, tablolar, müsaitlik |
| `veri.js` | Firebase bağlantısı (giriş ve veritabanı) |
| `firebase-config.js` | Firebase proje ayarları |
| `firestore.rules` | Kim okur, kim yazar |
| `ilk-ekip.json` | Başlangıç ekip listesi |
