# Dersler — 2026–2027 Güz

Bu dosya "Dersler" izinin müfredatıdır. `/ders` ve `/calis dersler` önce buraya
bakar. Pano belgesi: `izler/dersler`. Ders notları: `notlar/<anahtar>-<YYYYMMDD>`.

> **Önce oku: üniversite uyuşmazlığı.** Ders programındaki kodlar (`[15181]`,
> `[80111]`) ve ders süreleri **Eskişehir Osmangazi Üniversitesi (ESOGÜ) Makina
> Mühendisliği** kataloğuyla birebir örtüşüyor. Profilde ve takım rehberinde
> ise **ESTÜ** yazıyor. ESTÜ'de ders kodları harflidir (ör. MKM302) ve ders
> adları ile süreleri bu programla uyuşmuyor. Aşağıdaki ders bilgileri ESOGÜ
> kataloğuna göre yazıldı. Kullanıcı teyit edene kadar "muhtemel" kabul et
> (bkz. son bölüm).

---

## Dönemin özeti

**Yük:** 7 ders. Haftada 21 saat sınıf dersi var (Pzt 3, Sal 3, Çar 7, Per 2,
Cum 6). Mühendislik derslerinin toplamı ≈ 28 AKTS. Buna Türk Dili ve ERHVKİL
ekleniyor.

**Dönem takvimi (varsayım):** ESOGÜ'de kayıt yenileme 14–18 Eylül 2026'daydı.
Dersler 21 Eylül haftasında başladıysa 12 Ekim dönemin 4. haftasıdır. Vizeler
genelde 8.–9. haftaya, yani yaklaşık **9–20 Kasım 2026** aralığına düşer.
Kesin tarihleri bölüm duyurusundan al ve `sinav_donemleri`ne yaz.

| Kısaltma | Gün, saat, derslik | Muhtemel tam adı (ESOGÜ kodu) | Kredi / AKTS | Türü | Zorluk | Haftalık öneri | En riskli konu | Takımdaki karşılığı |
|---|---|---|---|---|---|---|---|---|
| **MAK.EL I** | Cum 14–17, C222 | Makine Elemanları (I) (151815357) | 3-0-3 / 5 | Problem + tablo | 5 | 105 dk | Yorulma (Goodman, Marin) | Cıvata, mil, göbek, aks. "En sık kullanacağın ders" |
| **MEC.MAT** | Çar 09–13, C221 | Mechanics of Materials = Mukavemet (151813234) | 4-0-4 / 6 | Problem | 4 | 115 dk | Kesme-moment diyagramı, Mohr çemberi | Şasi, salıncak, aks, burkulma |
| **MÜHTER II** | Sal 09–12, C222 | Mühendislik Termodinamiği II (151815359) | 3 saat / 6 | Problem + tablo | 4 | 95 dk | Rejeneratif Rankine, ekserji | Batarya ve motor soğutma, kabin havası |
| **MEC.DES** | Pzt 09–12, C419 | Mechanism Design = Mekanizma Tekniği (151815356) | 3-0-3 / 6 | Problem + grafik | 4 | 95 dk | İvme analizi (Coriolis) | Süspansiyon ve direksiyon geometrisi |
| **İMALAT** | Çar 13–16, C220 | İmalat Mühendisliği (151815331) | 3-0-3 / 5 | Kavram + hesap | 3 | 35 dk | Talaşlı imalat hesapları | DFM, kompozit üretimi, kaynak |
| **ERHVKİL** | Cum 09–12, D-14 | Rektörlük alan dışı seçmeli, adı bilinmiyor | ? | ? (kavram varsayımı) | 2? | 15 dk | ? | Zayıf ya da yok |
| **TÜRK DİLİ** | Per 19–21, çevrimiçi | Türk Dili (YÖK ortak zorunlu) | ? | Kavram + yazım | 1 | 10–15 dk | Sınav tarihini kaçırmak | TEKNOFEST raporlarının dili |

**En kritik üçlü: MAK.EL I, MEC.MAT, MÜHTER II.**
- **MAK.EL I** takımın en çok kullandığı ders. Ayrıca Mukavemet'in üzerine
  kurulur: Mukavemet'te bir açık varsa burada iki katına çıkar.
- **MEC.MAT** 4 saatlik bir temel ders. 3. sınıfta alınıyorsa büyük olasılıkla
  alttan alınıyor. Alttan alınıyorsa geçmek zorunlu, kaybetme riski yüksek.
  MAK.EL I ile aynı dönemde olması bir fırsat: iki ders birbirini besler.
- **MÜHTER II** tablo ağırlıklı ve uzun problemlerden oluşur. Haftalık problem
  çözülmezse vizede süre yetmez.
- **MEC.DES** de problem ağırlıklı. Konular birbirine zincirle bağlı (konum →
  hız → ivme), bu yüzden bir hafta kaçırmak sonraki haftaları da bozar.

**Pano anahtarları** (ASCII, `notlar/<anahtar>-<YYYYMMDD>` için):
`mecdes`, `muhter2`, `mecmat`, `imalat`, `makel1`, `erhvkil`, `turkdili`.

---

## Çalışma ve not sistemi

### Neye dayanıyor

- **Dunlosky ve ark. (2013)** on öğrenme tekniğini karşılaştırdı. Yalnızca
  ikisi "yüksek fayda" aldı: **kendini test etme** (practice testing) ve
  **aralıklı çalışma** (distributed practice). Kendine açıklama, ayrıntılı
  sorgulama ve konuları karıştırarak çalışma (interleaving) orta fayda aldı.
  Yeniden okuma, altını çizme ve özet çıkarma ise düşük faydalı bulundu.
  **Sonuç:** Notu güzelleştirmeye değil, kendini test etmeye zaman ayır.
- **Cepeda ve ark. (2008)**: En iyi tekrar aralığı, sınava kalan süreyle
  birlikte büyür. 1 hafta sonraki bir test için en iyi aralık kalan sürenin
  yaklaşık %20–40'ı, 1 yıl sonraki bir test için %5–10'u. Vizeye ~4 hafta
  varken bu, bir konuyu **yaklaşık haftada bir** yeniden test etmek demek.
  Final için (~3 ay) aralık 2 haftaya çıkabilir.
- Künyeler ve linkler: `planlayici/yontemler.md`, madde 9.

### Döngü: her ders için aynı 5 adım

| Ne zaman | Ne yapılır | Süre |
|---|---|---|
| Ders öncesi (sabah, yolda) | Geçen haftanın sol sütun sorularına göz at | 5 dk, kapasiteye sayılmaz |
| Ders sırasında | Cornell sayfasına not al. Hocanın çözdüğü örneği adım adım yaz | — |
| **Aynı gün** (profildeki tekrar blokları) | 30–45 dk tekrar protokolü (aşağıda) | 30–45 dk |
| +1, +3, +7 gün | 5 soruyu kağıt kapalı çöz, sonra kartlara bak | 10–15 dk |
| Haftalık (Pazar) | Hata defteri + karışık problem + zayıf konu | 50 dk |

### Aynı gün tekrar protokolü (30–45 dk)

1. **5 dk, kapalı kitap:** Defteri kapat, dersten hatırladığın her şeyi boş
   kağıda yaz. Formüller, şekiller, hocanın vurguladıkları.
2. **10 dk, notu tamamla:** Cornell sayfasını aç, boşlukları doldur. Sol
   sütuna her blok için bir soru yaz ("Bu formülü hangi durumda kullanırım?").
3. **5 dk, formül kartı:** Yeni formülleri karta geçir (format aşağıda).
4. **15–20 dk, problem:** Hocanın örneğini kitaba bakmadan yeniden çöz, sonra
   kitaptan benzer bir problem çöz.
5. **2 dk, kapanış:** Sayfanın altına 2 cümlelik özet yaz. Takıldığın yeri
   hata defterine ekle.

45 dk'lık blokta 2 ders varsa (Çar: MEC.MAT + İMALAT, Cum: MAK.EL I +
ERHVKİL) problem dersine 2/3, kavram dersine 1/3 süre ver.

### Cornell sayfası, mühendislik uyarlaması

```
+-------------------+---------------------------------------------+
| SOL (1/3)         | SAĞ (2/3): NOTLAR                           |
| Soru / ipucu      | - Tanım, şekil, serbest cisim diyagramı     |
| "σ = My/I ne      | - Türetme adımları (atlama)                 |
|  zaman geçersiz?" | - Hocanın çözdüğü örnek: verilen, istenen,  |
| Formül anahtarı   |   çözüm, sonuç ve birim                     |
| "Kf, Kt, q"       | - [!] Hocanın "sınavda çıkar" dediği yerler |
+-------------------+---------------------------------------------+
| ALT: 2 cümle özet + bu sayfanın en önemli 1 formülü             |
+-----------------------------------------------------------------+
```

Tekrar sırasında sağ sütunu kapat, sol sütundaki sorulara sesli cevap ver.
Cornell yöntemi Walter Pauk'un *How to Study in College* kitabından gelir. Bu
uyarlamadaki asıl iş sol sütundaki sorulardır: kendini test etmeyi notun
içine gömerler.

### Formül kartları

- **Ön yüz:** Durum ve soru. Örnek: "Dönen milde eğilme + sabit burulma,
  sonsuz ömür için çap?"
- **Arka yüz:** Formül, sembollerin anlamı ve **SI birimleri**, geçerlilik
  koşulu, tipik hata.
- Her ders için ayrı deste tut. Kart yalnızca formül sormasın, "hangi
  formülü seçerim?" diye de sorsun. Sınavda en sık hata seçimde olur.
- Kağıt kart ya da Anki kullanabilirsin. Aralıklı tekrarı ikisi de destekler.

### Çözümlü problem defteri (her ders için ayrı)

Her problem şu kalıpta çözülür. Sınavda kısmi puanı bu kalıp getirir.

1. **Verilen / İstenen.** Birimlerle birlikte.
2. **Şekil.** Serbest cisim diyagramı, T-s diyagramı ya da mekanizma şeması.
3. **Varsayımlar.** Örnekler: "Sürekli akış, ΔKE ≈ 0", "Lineer elastik".
4. **Denklemler**, sonra **çözüm**.
5. **Kontrol.** Birim, işaret, mertebe ("190 kg'lık araçta 50 kN fren kuvveti
   olamaz") ve sınır durumu ("L → 0 olunca ne olur?").
6. **Anahtar fikir.** Tek satır: "Bu problemi çözdüren şey ...".

### Hata defteri

| Tarih | Ders | Konu | Hata türü | Doğru fikir | Tekrar tarihi |
|---|---|---|---|---|---|
| 14.10 | MEC.MAT | Mohr çemberi | İşaret | Saat yönü kayma pozitif çizilir (hocanın konvansiyonu) | 17.10 |

- **Hata türleri:** kavram, formül seçimi, işlem, birim, işaret, soruyu yanlış
  okuma, süre.
- Pazar bloğunda aynı türden 3 hata görürsen o tür haftanın odak konusu olur.
- Panoda: `notlar/<anahtar>-hatalar` belgesi, `maddeler` listesi.

---

## Haftalık ders çalışma şablonu

Şablon profildeki gerçek bloklara göre kuruldu. **Kalın** satırlar profilde
zaten tanımlı olan aynı gün tekrar bloklarıdır. Diğer satırlar eklenecek
problem bloklarıdır. Gün toplamları, profildeki rutinler (SolidWorks, YZ,
Almanca, Borsa) dahil, günlük kapasiteyi (hafta içi 210 dk, Cmt 60, Paz 180)
ve derin çalışma sınırını (150 dk) aşmaz.

| Gün | Saat | Blok | Enerji | dk | Gün toplamı / kapasite |
|---|---|---|---|---|---|
| Pzt | 15:00–15:50 | MEC.MAT problem bloğu (Çarşamba dersinden 5 gün sonra) | derin | 50 | |
| Pzt | **17:00–17:45** | **MEC.DES aynı gün tekrar** | orta | 45 | 200 / 210 |
| Sal | **17:00–17:45** | **MÜHTER II aynı gün tekrar** | orta | 45 | 200 / 210 (dolu) |
| Çar | **16:30–17:30** | **MEC.MAT + İMALAT aynı gün tekrar** | orta | 60 | |
| Çar | 20:00–20:50 | MÜHTER II problem bloğu | orta | 50 | 165 / 210 |
| Per | 15:00–15:50 | MAK.EL I problem bloğu (Cuma dersine hazırlık) | derin | 50 | 205 / 210 |
| Cum | **17:20–18:05** | **MAK.EL I + ERHVKİL aynı gün tekrar** | orta | 45 | |
| Cum | 18:10–19:00 | MEC.DES problem bloğu (Pazartesi dersinden 4 gün sonra) | orta | 50 | 170 / 210 |
| Cmt | — | Atölye günü. İstersen akşam 20 dk kart (hafif) | hafif | 0–20 | 25–45 / 60 |
| Paz | 10:00–10:50 | Haftalık tekrar: hata defteri + karışık problem (MAK.EL I / MEC.MAT dönüşümlü) | orta | 50 | |
| Paz | 11:00–11:25 | İMALAT kartları + TÜRK DİLİ / ERHVKİL okuma | hafif | 25 | 180 / 180 (dolu) |

**Toplam: 470–490 dk ≈ 8 saat.** Ders başına dağılım: MAK.EL I ~105, MEC.MAT
~115, MEC.DES 95, MÜHTER II 95, İMALAT 35, ERHVKİL 15, TÜRK DİLİ 10–15 dk.

**Açık konuşalım: mevcut rutinlerle 9–10 saat sığmıyor.** Profildeki rutinler
haftalık kapasitenin çoğunu kullanıyor. Hedeflenen 9–10 saate çıkmanın üç
yolu var. Karar kullanıcının:
1. Perşembe 09:00 YZ bloğunu derse ver: +50 dk.
2. Pazar borsa (23:00) yerine ders kartı koy: +30 dk.
3. Cumartesi akşamı 20 dk kart ekle: +20 dk.

Üçü birlikte toplamı ≈ 9,5 saate çıkarır. Öncelik sırası "dersler önce"
olduğu için 1. seçenek en tutarlısı.

**Kurallar:**
- **Ödev haftası:** O dersin problem bloğu ödeve gider. Ödev 50 dk'yı aşıyorsa
  `/gorev` ile ayrı görev aç ve parçala.
- **1-3-7 tekrarları ayrı blok açmaz.** O gün hangi ders bloğu varsa onun ilk
  10–15 dakikasında yapılır. Aynı güne düşen tekrarlar tek göreve birleşir.
- Bir ders bloğu kaçarsa yalnızca aynı haftanın Pazar bloğuna taşınır. Hafta
  devretmez: geride kalan konu hata defterine "eksik" olarak yazılır.
- **Bu hafta (12–18 Ekim)** "SolidWorks yoğun hafta" görevi (300 dk) boş
  kapasiteyi kullanıyor. Şablon tam olarak 19 Ekim haftasından itibaren
  uygulanır.
- **Sınav dönemi:** Vizeden 7 gün önce `sinav_donemleri` açılır.
  `sinavda: false` olan rutinler (Salı ve Cuma SolidWorks, Salı ve Perşembe
  YZ, Almanca, Borsa) düşer. Bu, haftada ~6–8 saat ek ders kapasitesi açar.

---

## Vize hazırlık şablonu

Geri sayım vizeden 10 gün önce başlar. Aynı hafta 3 veya daha fazla vize
varsa geri sayım 14 gün önce başlar ve oturumlar sırayla dağıtılır. Önce
tarihi en yakın olan, eşitlikte ağırlığı ve zorluğu büyük olan gelir.

| Gün | Yapılacak | Not |
|---|---|---|
| **V-10** | Konu envanteri: izlence + slaytlar. Her konuya hakimiyet puanı ver (0 = bilmiyorum, 3 = sınav hızında çözerim). Çıkmış soruları topla (bölüm öğrencileri, hoca sayfası). Formül sayfası taslağı. | 50 dk. Profile `sinav_donemleri` eklenir (V-7'den başlar) |
| **V-9 … V-6** | Puanı 0–1 olan konular. Her oturum: 10 dk kendini test + 35 dk problem + 5 dk hata defteri | Oturum başına 1 konu, en zayıftan başla |
| **V-5** | **Deneme sınavı 1:** Çıkmış sorularla, süreli, kitap kapalı. Puanla ve hataları sınıfla | Gerçek sınav süresi kadar |
| **V-4 … V-3** | Deneme 1'in hataları + puanı 2 olan konular. Karışık problem setleri: konu adı yazmadan, farklı bölümlerden | Konuları karıştırmak, "hangi yöntem?" sorusunu çalıştırır |
| **V-2** | **Deneme sınavı 2:** Süreli. Formül sayfasını son haline getir | |
| **V-1** | Hafif gün: formül kartları, hata defteri, 3–4 "imza problemi" yeniden. **Yeni konu yok.** Sınav malzemeleri hazır olsun: hesap makinesi, tablolar, cetvel, iletki | Erken yat (23:30) |
| **V-0** | Sabah 20 dk ısınma: 2 kolay problem + kartlar. Sınavda önce tüm soruları oku, kolaydan başla, her adımda birim yaz | Kısmi puan için adımları göster |
| **V+1** | 15 dk: Kaybedilen puanların nedeni hata defterine. Final listesi buradan başlar | |

**Derse göre vize notları:**
- **MÜHTER II:** Tablo okuma ve interpolasyon hızı puan getirir. Her çevrim
  tipinden en az 3 süreli problem çöz. Sınavda tablo verilip verilmediğini
  önceden öğren.
- **MEC.DES:** Grafik çözüm için cetvel, iletki ve pergel gerekir. Hız ve ivme
  poligonu çizimini süre tutarak çalış. Analitik çözümü bir kez Python veya
  hesap makinesiyle doğrula.
- **MEC.MAT:** Kesme-moment diyagramını 3 dakikada çizebilmek hedef. Mohr
  çemberinde hocanın işaret konvansiyonunu kullan.
- **MAK.EL I:** Yorulmanın 5 problem tipini ayrı ayrı çalış: tam değişken,
  ortalama + değişken, çentikli (Kf), bileşik gerilme, sonlu ömür. Abak ve
  tablo okumayı unutma.
- **İMALAT:** Yöntem karşılaştırma tablosunu ezbere çizebilmek. 4–5 hesap
  tipinden birer problem çöz.

---

## Dersler

### MEC.DES — Mechanism Design (Mekanizma Tekniği) · Pzt 09–12, C419

**Kimlik:** ESOGÜ kataloğunda *151815356 Mechanism Design* olarak geçiyor:
3-0-3, 6 AKTS, TR/ENG (2015–2020 kataloğu). Türkçe ders bilgi formunun adı
"Mekanizma Tekniği". Kısaltmanın İngilizce olması, dersin İngilizce şubede
olabileceğini düşündürüyor. "Makine Tasarımı" değil, mekanizma dersi. Teyit
ettir. Pano anahtarı: `mecdes`.

**Ne anlatır (tipik sıra, hocanın izlencesiyle karşılaştır):**
1. Temel kavramlar: uzuv, mafsal (kinematik çift), kinematik zincir. Serbestlik
   derecesi (Grübler–Kutzbach: M = 3(n−1) − 2j₁ − j₂).
2. Grashof koşulu. Dört çubuk ve krank-biyel mekanizmaları, inversiyonlar.
   Geçiş açısı (transmission angle), ölü konumlar.
3. Konum analizi, grafik ve analitik: vektör döngü denklemi, karmaşık sayılar,
   açık ve çapraz montaj.
4. Hız analizi: göreli hız yöntemi, ani dönme merkezleri (Kennedy–Aronhold
   teoremi).
5. İvme analizi: normal ve teğetsel bileşenler, kayan mafsalda Coriolis
   ivmesi. *(Vize genelde buraya kadar.)*
6. Boyut sentezi: 2 ve 3 konum için grafik sentez, fonksiyon üretimi
   (Freudenstein denklemi).
7. Kamlar: izleyici hareket eğrileri (SVAJ), kam profili, basınç açısı.
8. Dişliler: evolvent profil, dişli katarları, planet dişliler (Willis).
9. Kinetostatik (kuvvet analizi). Konu izlencede varsa.

**Zor kısmı:** İvme analizi, özellikle Coriolis teriminin büyüklüğü ve yönü.
Ani merkezleri sistematik bulmak. Analitik konum çözümünde doğru kökü (açık
ya da çapraz montaj) seçmek. Grafik çözümde ölçek hataları.

**Kitaplar:**
- R. L. Norton, *Design of Machinery*. Ana kaynak için en okunaklısı.
- Erdman, Sandor & Kota, *Mechanism Design: Analysis and Synthesis*. Sentez
  için güçlü.
- Uicker, Pennock & Shigley, *Theory of Machines and Mechanisms*.
- Eres Söylemez, *Mechanisms* (ODTÜ). Türk müfredatına çok yakın, İngilizce.
- Türkçe ders kitabı: ESOGÜ ders bilgi formundaki kaynak listesine bak. Bu
  araştırmada formun içeriği açılamadı.

**Ücretsiz kaynaklar:** ESOGÜ Mekanizma Tekniği ders bilgi formu (kütüphanede).
Video için NPTEL "Kinematics of Machines" (IIT Kanpur) önerilir, ama linki
doğrulanamadı. Aktif çalışma önerisi: GeoGebra'da bir dört çubuk kur, bir uzvu
sürükleyerek Grashof koşulunu ve geçiş açısını gör.

**Solar Team'de karşılığı (rehber 6.1, 3.4, 3.5):**
- Çift salıncaklı süspansiyon, uzayda çalışan bir dört çubuk mekanizmasıdır.
  Ani dönme merkezi (instant center) ve yuvarlanma merkezi, derste gördüğün
  ani merkezlerin ta kendisi.
- Ackermann direksiyonu bir dört çubuk (trapez) mekanizmasıdır:
  `cot δ_dış − cot δ_iç = w / L`.
- Pedal oranı (rehber 4.1) ve zincir/kayış aktarma oranı (3.8) da bu dersin
  konuları.
- **Mini proje:** Takım aracının süspansiyon hardpoint'leriyle bump steer'i
  Python'da hesapla. Ders, YZ izi ve takım işi aynı saatte birleşir.

**Nasıl çalışılır:** %70 problem, %30 kavram. Her konuda bir problemi hem
grafik hem analitik yöntemle çöz, iki sonucu karşılaştır. Vize öncesi: tek
bir mekanizmada konum → hız → ivme zincirini baştan sona 3 kez kur.

---

### MÜHTER II — Mühendislik Termodinamiği II · Sal 09–12, C222

**Kimlik:** ESOGÜ ders bilgi formunda *151815359 Mühendislik Termodinamiği II*
olarak geçiyor: Türkçe, haftada 3 saat, 6 AKTS. Kapsamı gaz akışlı güç
çevrimleri, buharlı güç çevrimleri, soğutma çevrimleri, iklimlendirme ve
kullanılabilirlik (ekserji) analizi. Değerlendirme: ara sınav %40, final %60.
Ana kitap Çengel & Boles. Pano anahtarı: `muhter2`.

**Ne anlatır (Çengel & Boles sırasıyla; bölüm numaraları baskıya göre değişir):**
1. Termo I tekrarı: 1. ve 2. yasa, entropi, izantropik verim.
2. Ekserji: tersinir iş, tersinmezlik, ikinci yasa verimi, ekserji dengesi.
3. Gaz akışlı güç çevrimleri: Otto, Diesel, Brayton. Rejenerasyon, ara
   soğutma ve ara ısıtma. Jet itki.
4. Buharlı güç çevrimleri: ideal ve gerçek Rankine. Ara ısıtma, rejeneratif
   çevrim (açık ve kapalı besleme suyu ısıtıcısı), kojenerasyon, kombine
   çevrim. *(Vize genelde buraya kadar.)*
5. Soğutma çevrimleri: buhar sıkıştırmalı çevrim, ısı pompası, kaskad ve çok
   kademeli sistemler, gaz soğutma, absorpsiyonlu soğutma.
6. Gaz karışımları (izlencede varsa).
7. Gaz-buhar karışımları ve iklimlendirme: özgül ve bağıl nem, çiy noktası,
   psikrometrik diyagram, ısıtma-nemlendirme, soğutma-nem alma, karışım.

**Zor kısmı:** Tablo okuma ve interpolasyon (kızgın buhar, doymuş karışım).
Her durum noktasında hangi iki özelliğin bilindiğini görmek. Rejeneratif
Rankine'de kütle oranı (y). Ekserji kavramının soyutluğu. Psikrometride kütle
ve enerji dengesini aynı anda kurmak.

**Kitaplar:**
- Çengel & Boles, *Thermodynamics: An Engineering Approach*. Ders kitabı.
  Türkçe çevirisi var ("Mühendislik Yaklaşımıyla Termodinamik"). Baskıyı ve
  yayınevini kütüphane kataloğundan kontrol et.
- Moran & Shapiro, *Fundamentals of Engineering Thermodynamics*. Alternatif
  anlatım ve ek problem için.

**Ücretsiz kaynaklar:**
- ESOGÜ ders bilgi formu: konu ve ağırlıklar için.
- Sakarya Üniversitesi Termodinamik II ders sayfası: konu listesi
  karşılaştırması için.
- Prof. Dr. Hüseyin Günerhan'ın Termodinamik I sayfası: Termo I eksiklerini
  Türkçe kapatmak için.

Linkler kaynak kütüphanesinde. "The Efficient Engineer" kanalı (rehberde
önerilir) çevrimleri görsel anlatır, ama linki bu görevde doğrulanamadı.

**Solar Team'de karşılığı (rehber 6.1, 3.6, 3.9, 3.10, 3.11):**
- Batarya kutusu soğutması `Q = I²R`, hava debisi `ΔT ≈ Q/(ṁ·c_p)`: açık
  sistemde 1. yasa.
- Kapalı gövdede sürücü konforu ve havalandırma: psikrometri ve iklimlendirme.
- Frenleme: kinetik enerjinin ısıya dönüşmesi.
- Panel sıcaklığı arttıkça verim düşer.
- Ekserji düşüncesi rehberdeki "Watt gibi düşün" ilkesinin termodinamik
  karşılığıdır.

**Nasıl çalışılır:** %80 problem. Her çevrim için aynı **durum tablosunu**
kullan:

```
Durum | P | T | h | s | x | Kaynak (tablo/sayfa)
```

Her problemde T-s diyagramını çiz. Tablo değerlerini Python'daki CoolProp
kütüphanesiyle kontrol edebilirsin; sınavda ise tablo hızı lazım. Vize öncesi
her çevrim tipinden 3 süreli problem çöz.

---

### MEC.MAT — Mechanics of Materials (Mukavemet) · Çar 09–13, C221

**Kimlik (teyit gerekli):** ESOGÜ'de bu adla 5. yarıyıl dersi bulunamadı. En
güçlü eşleşme *151813234 Mukavemet*: 4-0-4, 6 AKTS, 2021–2023 kataloğunda 3.
yarıyıl dersi. Haftalık 4 saatlik ders bu dersle birebir uyuyor. İngilizce
kısaltma, İngilizce şubeyi düşündürüyor. 3. sınıfta alınıyorsa büyük
olasılıkla alttan alınıyor. Pano anahtarı: `mecmat`.

**Ne anlatır (Hibbeler veya Beer & Johnston sırası):**
1. Gerilme: normal, kayma, ezilme (bearing) gerilmesi. Emniyet katsayısı.
   İç kuvvetler (statik tekrarı).
2. Şekil değiştirme ve malzeme davranışı: σ–ε eğrisi, Hooke yasası, Poisson
   oranı, G.
3. Eksenel yük: δ = PL/(AE), statikçe belirsiz çubuklar, ısıl gerilme.
4. Burulma: τ = Tρ/J, φ = TL/(GJ), güç iletimi P = Tω.
5. Eğilme: kesme kuvveti ve eğilme momenti diyagramları, σ = −My/I, kompozit
   kesit.
6. Enine kayma: τ = VQ/(It), kayma akışı. *(Vize genelde buraya kadar.)*
7. Bileşik yükler. İnce cidarlı basınç kabı: σ_çevresel = pr/t.
8. Gerilme dönüşümü, asal gerilmeler, Mohr çemberi. Akma kriterleri (Tresca,
   von Mises).
9. Kiriş tasarımı. Sehim: elastik eğri ve süperpozisyon.
10. Statikçe belirsiz kirişler.
11. Burkulma: P_kr = π²EI/(KL)², etkin boy, narinlik.

**Zor kısmı:** Kesme-moment diyagramını hızlı ve işaret hatası yapmadan
çizmek. Q (statik moment) hesabı. Mohr çemberinde 2θ ve işaret konvansiyonu.
Bileşik yüklemede kritik noktayı bulmak. Statikçe belirsiz problemlerde
uygunluk denklemini kurmak. Statik (serbest cisim diyagramı) zayıfsa her şey
zorlaşır.

**Kitaplar:**
- R. C. Hibbeler, *Mechanics of Materials*. Türkçe "Mukavemet" çevirisi var.
  Her bölümdeki "Fundamental Problems" ısınma için ideal.
- Beer, Johnston, DeWolf & Mazurek, *Mechanics of Materials*. Türkçe çevirisi
  "Cisimlerin Mukavemeti".
- Gere & Goodno, *Mechanics of Materials*.
- Türkçe telif: Mehmet H. Omurtag, *Mukavemet*.
- Çeviri baskılarını kütüphane kataloğundan kontrol et.

**Ücretsiz kaynaklar:**
- Marmara Üniversitesi ME2072 Mechanics of Materials ders sayfası (Hibbeler
  tabanlı izlence).
- Işık Üniversitesi ENGR2102 Mechanics of Materials (Mukavemet) ders katalog
  formu.
- İkisi de konu sırası ve izlence karşılaştırması için yararlı.

MIT OCW 2.001 (Mechanics & Materials I) ve The Efficient Engineer'ın Mohr
çemberi, eğilme ve burkulma videoları önerilir, ama linkleri bu görevde
doğrulanamadı.

**Solar Team'de karşılığı (rehber 6.1, 3.1, 3.4, 4.2, 4.4):**
- Şasi, salıncak ve aks hesapları: eğilme, burulma, bileşik gerilme.
- Rot başlı süspansiyon çubuğu iki kuvvet elemanıdır. Basınçta **burkulma**
  kontrolü gerekir (rehber 14, soru 7).
- Cıvata ön yükü bir eksenel gerilme problemidir (4.2).
- Sandviç panelde rijitliğin çekirdek kalınlığının karesiyle artması
  doğrudan I = ∫y² dA'dan gelir (4.4).
- Rehberin 6. ilkesi bu derse dayanır: "Önce el hesabı, sonra FEA". FEA
  sonucunu kontrol edecek el hesabını bu ders verir.

**Nasıl çalışılır:** %75 problem. Her bölümde önce Fundamental Problems'ı,
sonra 4–6 normal problemi çöz. Statik zayıfsa ilk iki hafta 20'şer dk statik
tekrarı yap. **MAK.EL I ile bağla:** MAK.EL I'de kullanılan her Mukavemet
formülünü bu dersin defterinde işaretle.

---

### İMALAT — İmalat Mühendisliği · Çar 13–16, C220

**Kimlik:** ESOGÜ kataloğunda *151815331 İmalat Mühendisliği* olarak geçiyor:
3-0-3, 5 AKTS, TR/ENG (2015–2020 ve 2021–2023 kataloglarında). Pano anahtarı:
`imalat`.

**Ne anlatır (Kalpakjian ve Groover sırası; ESOGÜ formu açılamadı):**
1. Giriş: malzeme ve yöntem seçimi, tolerans, yüzey pürüzlülüğü.
2. Döküm: kum döküm, kokil, basınçlı döküm, hassas döküm. Katılaşma, Chvorinov
   kuralı t = B(V/A)ⁿ, yolluk ve besleyici.
3. Hacim şekillendirme: dövme, haddeleme, ekstrüzyon, tel çekme. Kuvvet
   hesapları.
4. Sac şekillendirme: kesme kuvveti, bükme ve geri esneme, derin çekme.
5. Talaşlı imalat: ortogonal kesme (Merchant), takım ömrü (Taylor: VTⁿ = C),
   tornalama, frezeleme, delme. Malzeme kaldırma oranı (MRR) ve işleme süresi.
   CNC. *(Vize genelde buraya kadar.)*
6. Taşlama ve alışılmamış yöntemler: EDM, lazer, su jeti.
7. Birleştirme: ark kaynağı (TIG, MIG), direnç kaynağı, lehim, yapıştırma.
8. Polimer ve kompozit imalatı: enjeksiyon, el yatırma, vakum infüzyonu,
   prepreg ve otoklav.
9. Toz metalurjisi. Eklemeli imalat (FDM, SLA, SLS).
10. Ölçme, kalite kontrol, DFM ve DFA.

**Zor kısmı:** Konu çok geniş ve ezber yükü büyük. Asıl zorluk "bu parça hangi
yöntemle, neden?" sorusu. Talaşlı imalat hesaplarında birimler karışır: m/dk,
mm/dev, dev/dk. Merchant kuvvet çemberi.

**Kitaplar:**
- Kalpakjian & Schmid, *Manufacturing Engineering and Technology*.
- M. P. Groover, *Fundamentals of Modern Manufacturing*. Hesap örnekleri
  bakımından zengin.
- Türkçe: kütüphane kataloğunda "imal usulleri" diye ara. Bu araştırmada
  belirli bir Türkçe kitap doğrulanamadı.

**Ücretsiz kaynaklar:** MIT OCW 2.008 (Design and Manufacturing II) ve NPTEL
"Manufacturing Processes" önerilir, ama linkleri doğrulanamadı. En iyi
"laboratuvar" zaten elinde: **Cumartesi atölyesi**.

**Solar Team'de karşılığı (rehber 6.1, 3.1, 3.2, 8.6):**
- Üretilebilir tasarım (DFM): CAD'de çizdiğin parçanın gerçekten üretilip
  takılabilmesi.
- Kompozit üretimi (3.2): kalıp zinciri, vakum torbalama, infüzyon, kür, Tg.
- Boru kafes şasi (3.1): TIG kaynağı ve fikstür.
- Üretim terimleri (8.6): tolerans ve geçme, GD&T, Ra, su jeti ve lazer
  kesim, 3B baskı, BOM.
- **Kural:** Her Cumartesi atölyede gördüğün bir imalat işlemini Pazar kart
  bloğunda bu derse bağla.

**Nasıl çalışılır:** %60 kavram, %40 hesap. Dönem boyunca tek bir **yöntem
karşılaştırma tablosu** büyüt:

```
yöntem | malzeme | tolerans | Ra | parti büyüklüğü | maliyet | tipik parça | Solar Team örneği
```

Hesap tipleri sınırlı: Chvorinov, sac kesme kuvveti, bükme, Taylor, MRR ve
işleme süresi, kesme kuvveti. Her biri için çözümlü 1 "imza problemi" tut.
Kavramları kartlarla tekrar et.

---

### MAK.EL I — Makine Elemanları I · Cum 14–17, C222

**Kimlik:** ESOGÜ 2021–2023 kataloğunda *151815357 Makine Elemanları (I)*
olarak geçiyor: 3-0-3, 5 AKTS, TR/ENG. Ön bilgi Mukavemet. ESTÜ'deki eşdeğer
derste de önerilen önkoşul Mukavemet ve Teknik Resim. Pano anahtarı: `makel1`.

**Ne anlatır (Shigley sırası; I. dönem genelde "dayanım + bağlantılar"):**
1. Tasarıma giriş: emniyet katsayısı, standartlar, ISO tolerans ve geçmeler.
2. Mukavemet köprüsü: bileşik gerilme, Mohr çemberi, gerilme yığılması (Kt).
3. Statik hasar teorileri: sünek malzemede Tresca ve von Mises, gevrek
   malzemede Coulomb-Mohr ve Modified Mohr.
4. Yorulma:
   - S-N eğrisi. Çelikte dayanım sınırı yaklaşık Se′ ≈ 0,5·Sut.
   - Marin faktörleri (ka … ke). Çentik hassasiyeti (q) ve Kf.
   - Ortalama ve değişken gerilme: Goodman, Gerber, ASME-eliptik ve
     Soderberg ölçütleri. Langer akma kontrolü.
   - Sonlu ömür.
   - *(Vize genelde buraya kadar.)*
5. Mil tasarımı: eğilme + burulma, DE-Goodman ile çap hesabı, kritik hız.
6. Mil-göbek bağlantıları: kama, kamalı mil, sıkı geçme.
7. Cıvatalı bağlantılar:
   - Vida geometrisi, güç vidaları.
   - Ön yük ve sıkma torku: T = K·F·d.
   - Bağlantı rijitliği ve yük paylaşımı (C).
   - Statik, ayrılma ve yorulma kontrolü.
8. Kaynaklı bağlantılar: köşe kaynağı gerilmesi, birim kaynak boyu yöntemi,
   kaynak yorulması.
9. Yaylar. Bazı programlarda MAK.EL II'dedir. Rulman, dişli, kayış ve zincir
   genelde MAK.EL II'de işlenir.

**Zor kısmı:** **Yorulma.** Doğru Marin faktörünü seçmek, Kf'yi hesaplamak,
ortalama gerilme düzeltmesini yapmak. Vizede puan en çok burada kaybedilir.
Cıvatada C oranı ve ayrılma kontrolü. Abak ve tablo okuma (Kt grafikleri).

**Kitaplar:**
- Budynas & Nisbett, *Shigley's Mechanical Engineering Design*. Standart kitap,
  rehberde de önerilir.
- R. L. Norton, *Machine Design: An Integrated Approach*. Yorulma anlatımı çok
  net.
- Juvinall & Marshek, *Fundamentals of Machine Component Design*.
- Türkçe: Mustafa Akkurt, *Makina Elemanları*; Fethi Babalık & Kadir Çavdar,
  *Makine Elemanları ve Konstrüksiyon Örnekleri*. Baskıyı kütüphaneden
  kontrol et.

**Ücretsiz kaynaklar:**
- ESTÜ "Machine Design I (Makine Elemanları I)" ders tanıtım sayfası.
- Ostim Teknik Üniversitesi MEC 307/308 Makine Tasarımı içerikleri.
- İkisi de konu sırası ve izlence karşılaştırması için yararlı.

MIT OCW 2.72 (Elements of Mechanical Design), NPTEL "Design of Machine
Elements" ve The Efficient Engineer'ın yorulma ve cıvatalı bağlantı videoları
önerilir, ama linkleri doğrulanamadı.

**Solar Team'de karşılığı (rehber 6.1, 6.2, 3.7, 3.8, 4.2): "Takımda en sık
kullanacağın ders."**
- Göbek, porya ve aks dönen eğilme altında çalışır, yani **yorulma** problemi
  (3.7: keskin iç köşe bırakma, radius ver).
- Cıvata ön yükü (4.2: M8, 25 N·m → ~15,6 kN): bir ders problemi gibi çöz.
  Sonra dişler yağlanınca (K ≈ 0,15) ne değiştiğini hesapla.
- Rulman ömrü L10 = (C/P)³ (3.7). Konu MAK.EL II'de, ama göbek tasarımında
  hemen lazım olur.
- Motor bağlantısı ve aktarma (3.8). Boru kafes kaynakları.
- **6.2 önerisi:** Ders ödevini veya projesini takım parçası üzerinden yap:
  göbek–rulman–aks.

**Nasıl çalışılır:** %80 problem + tablo kullanımı. Dönem boyunca büyüyen
2 sayfalık bir "tasarım formül sayfası" tut. Sınavda formül kağıdına izin
olup olmadığını sor. Marin + Goodman hesabını küçük bir Python scriptine dök
ve her problemde sonucu onunla kontrol et (rehber 12: YZ + mekanik). Vize
öncesi yorulmanın 5 problem tipini ayrı ayrı çalış.

---

### TÜRK DİLİ — Türk Dili · Per 19–21, çevrimiçi

**Kimlik:** YÖK ortak zorunlu dersi. Kod öneki 15101, şube C. Hangi dönemin
dersi olduğu (I mi II mi) ve sınav biçimi doğrulanamadı. Pano anahtarı:
`turkdili`.

**Tipik içerik:**
- Türk Dili I: dil ve kültür, Türkçenin tarihi, ses bilgisi, yazım ve
  noktalama.
- Türk Dili II: cümle bilgisi, anlatım bozuklukları, paragraf ve kompozisyon,
  resmî yazışma, rapor, dilekçe, özgeçmiş, bilimsel metin.

**Zor kısmı:** İçerik zor değil. Asıl risk, çevrimiçi olduğu için dersin
ihmal edilmesi ve sınav tarihi ya da ödev teslimi gibi işlerin kaçırılması.

**Kaynak:** TDK Yazım Kılavuzu ve dersin kendi materyali. Link bu görevde
doğrulanamadı.

**Solar Team'de karşılığı:** TEKNOFEST'te **raporlar puanı etkiler** (rehber
0. ve 1. bölüm). Yazım kuralları, anlatım bozuklukları ve rapor dili, takım
raporunun kalitesine doğrudan yansır. Haftalık durum mesajı da (10.4) aynı
beceriyi ister.

**Nasıl çalışılır:** Haftada 10–15 dk yeterli. Bir ödev ya da kompozisyon
çıkarsa konusunu takım raporuyla birleştir ("aynı saati iki kez kullan",
rehber 10.7). Sınav öncesi 2 × 25 dk kart ve yazım kuralları testi yap.

---

### ERHVKİL — adı bilinmiyor (Rektörlük seçmeli) · Cum 09–12, D-14

**Bulgu:**
- `[80111]` öneki, ESOGÜ'de Rektörlük **alan dışı seçmeli** derslerinin kod
  önekiyle (801114xxx) uyumlu. Sosyal seçmeli dersler ise 8012xxxxx
  biçiminde; örneğin 801211008 İnsan Hakları.
- ESOGÜ'nün 2026–2027 kayıt belgesine göre alan dışı dersler Rektörlük
  bünyesinde "REKTÖRLÜK ALANDIŞI DERSLER" başlığı altında tanımlı.
- Dersin tam adı bulunamadı. Kısaltmadaki "HV KİL" bölümü en çok "**Hava
  Kirliliği**"ne benziyor. "ER" bölümü belirsiz. Başka bir alan dışı seçmeli
  de olabilir.
- Tam ad OBS'deki ders bilgisinde ya da Rektörlük seçmeli ders listesinde
  yazar.

Pano anahtarı: `erhvkil`.

**Geçici plan:** İzlence gelene kadar dersin kavram ağırlıklı olduğunu varsay.
Cuma 17:20 bloğunda 15 dk aynı gün tekrar ve Pazar kart bloğu yeterli. Ad ve
izlence öğrenilince bu bölümü güncelle: konu listesi, değerlendirme ve kaynak.

**Solar Team'de karşılığı:** Ders "Hava Kirliliği" ise elektrikli aracın yerel
emisyon avantajı ve raporlardaki çevresel etki bölümleriyle zayıf bir bağı
olur. Değilse bağlantı kurmaya zorlama.

---

## Kaynak kütüphanesi

**Not:** Bu görevde web arama kotası doldu. WebFetch ise hiçbir alan adını
çözemedi. Bu yüzden aşağıdaki tabloda yalnızca **web aramasında çıkan**
linkler var. Sayfaların içeriği doğrudan açılamadı; özetler arama
sonuçlarından alındı. Video kanallarının linkleri eklenmedi. İkinci tabloda
listelendiler; `/ders` veya `/calis` ilk kullanımda WebSearch ile bulup
doğrulasın ve buraya eklesin.

| Ders | Ad | Link | Tür | Dil | Neden |
|---|---|---|---|---|---|
| Genel | ESOGÜ Makina 2021–2023 Ders Kataloğu | [makina.ogu.edu.tr](https://makina.ogu.edu.tr/Sayfa/Index/75/2021-2023-ders-katalogu) | Katalog | TR | Ders kodları, AKTS ve yarıyıllar |
| Genel | ESOGÜ Makina 2024 Ders Kataloğu | [makina.ogu.edu.tr](https://makina.ogu.edu.tr/Sayfa/Index/134/2024-ders-katalogu) | Katalog | TR | Giriş yılına göre geçerli katalog olabilir |
| Genel | ESOGÜ Makina 2015–2020 Ders Kataloğu | [makina.ogu.edu.tr](https://makina.ogu.edu.tr/Sayfa/Index/39/2015-2020-ders-katalogu) | Katalog | TR | Mechanism Design 151815356 burada |
| Genel | ESOGÜ Ders Kataloğu ve İçerikleri | [makina.ogu.edu.tr](https://makina.ogu.edu.tr/Sayfa/Index/16/ders-katalogu-ve-icerikleri) | Dizin | TR | Ders bilgi formlarına giriş |
| Genel | ESOGÜ Makina Aktif Yarıyıl | [makina.ogu.edu.tr](https://makina.ogu.edu.tr/Sayfa/Index/27/aktif-yariyil) | Duyuru | TR | Dönemin ders programı ve duyuruları |
| MÜHTER II | Mühendislik Termodinamiği II ders bilgi formu (ESOGÜ) | [PDF](https://makina.ogu.edu.tr/Storage/makina/Uploads/M%C3%BChendislik-Termodinami%C4%9Fi-II-DBF_TR.pdf) | İzlence | TR | Konular, %40/%60 ağırlık, Çengel & Boles |
| MEC.DES | Mekanizma Tekniği ders bilgi formu (ESOGÜ) | [PDF](https://makina.ogu.edu.tr/Storage/makina/Uploads/Mekanizma-Teknigi-DBF_TR.pdf) | İzlence | TR | Konu sırası ve kaynak listesi |
| MÜHTER II | Sakarya Üni. Termodinamik II ders sayfası | [ebs.sakarya.edu.tr](https://ebs.sakarya.edu.tr/Ders/Detay/574230) | İzlence | TR | Konu sırası ve kaynak karşılaştırması |
| MÜHTER II | Prof. Dr. Hüseyin Günerhan, Termodinamik I sayfası | [huseyingunerhan.com](https://www.huseyingunerhan.com/termo1/termo1.html) | Ders notu | TR | Termo I eksiklerini Türkçe kapatmak için |
| MEC.MAT | Marmara Üni. ME2072 Mechanics of Materials | [meobs.marmara.edu.tr](https://meobs.marmara.edu.tr/Ders/mechanics-of-materials/me2072-37317-3365) | İzlence | EN | Hibbeler tabanlı İngilizce izlence |
| MEC.MAT | Işık Üni. ENGR2102 Mechanics of Materials (Mukavemet) katalog formu | [PDF](https://www.isikun.edu.tr/sites/default/files/2024-09/6028_1_engr2102-mechanics-of-materials-mukavemet.pdf) | İzlence | EN/TR | Haftalık konu sırası karşılaştırması |
| MAK.EL I | ESTÜ Machine Design I (Makine Elemanları I) ders tanıtımı | [eskisehir.edu.tr](https://www.eskisehir.edu.tr/akademik/fakulteler/ders/144062/machine-design-i-makine-elemanlari-i/ders-tanitim) | İzlence | EN/TR | ESTÜ eşdeğeri; önkoşullar Mukavemet ve Teknik Resim |
| MAK.EL I | Ostim Teknik Üni. Makine Müh. ders içerikleri (MEC 307/308) | [ostimteknik.edu.tr](https://www.ostimteknik.edu.tr/makine-muhendisligi-bolumu-ingilizce-204/113) | İzlence | EN | Yük ve gerilme analizi, hasar teorileri, yorulma sırası |
| ERHVKİL | ESOGÜ Kimya Müh. duyurusu: Alan Dışı Seçmeli Ders Listesi (Rektörlük) | [kimyamuh.ogu.edu.tr](https://kimyamuh.ogu.edu.tr/Duyuru/Detay/1494/alan-disi-secmeli-ders-listesi-rektorluk) | Liste | TR | 801114xxx kodlu ders adları |
| ERHVKİL | ESOGÜ OİDB: Seçmeli ders bina ve sınıfları | [PDF](https://oidb.ogu.edu.tr/Storage/OgrenciIsleri/Uploads/SE%C3%87MEL%C4%B0-DERS-B%C4%B0NA-VE-SINIFLARI-DUYURU.pdf) | Liste | TR | Ders adı ↔ derslik (D-14) eşleştirmesi |
| ERHVKİL | ESOGÜ Bilgisayar Müh.: 2025–26 Güz Rektörlük seçmeli bina ve sınıfları | [ceng.esogu.edu.tr](https://ceng.esogu.edu.tr/Duyuru/Detay/262/2025-26-guz-yariyili-rektorluk-sosyal-secmeli-i-ve-rektorluk-alan-disi-ders-bina-ve-siniflari) | Duyuru | TR | Aynı eşleştirme, önceki dönem |
| Genel | ESOGÜ OİDB 2026–2027 Güz kayıt yenileme belgesi | [PDF](https://oidb.ogu.edu.tr/Storage/OgrenciIsleri/Uploads/2026-2027-E%C4%9E%C4%B0T%C4%B0M-%C3%96%C4%9ERET%C4%B0M-YILI-G%C3%9CZ-D%C3%96NEM%C4%B0-KAYIT-YEN%C4%B0LEME-%C4%B0%C5%9ELEMLER%C4%B0.pdf) | Belge | TR | Kayıt tarihleri, Rektörlük seçmelileri |
| Genel | ESOGÜ Öğrenci İşleri Daire Başkanlığı | [oidb.esogu.edu.tr](https://oidb.esogu.edu.tr/) | Portal | TR | Akademik takvim, sınav duyuruları |
| Genel (ESTÜ ise) | ESTÜ Makine Müh. 2025–2026 Ders Planı | [PDF](https://mf.eskisehir.edu.tr/Uploads/mf/files/Makine%20M%C3%BCh%202025-2026.pdf) | Ders planı | TR/EN | Kullanıcı ESTÜ'lüyse doğru katalog bu |
| Genel (ESTÜ ise) | ESTÜ AKTS: Makine Mühendisliği dersleri | [akts.eskisehir.edu.tr](https://akts.eskisehir.edu.tr/tr/program/dersler/256/13) | Katalog | TR | Rehberde de geçen sayfa |
| Genel (ESTÜ ise) | ESTÜ Ortak Dersler Bölümü ders listesi | [odb.eskisehir.edu.tr](https://odb.eskisehir.edu.tr/tr/Icerik/Detay/koordinatorluk-ortak-ders-listesi) | Liste | TR | ERHVKİL ESTÜ'de aranacaksa |
| Yöntem | Dunlosky ve ark. 2013; Cepeda ve ark. 2008 | `planlayici/yontemler.md` (madde 9 ve Kaynaklar) | Makale | EN | Kendini test etme ve aralıklı tekrarın dayanağı |

**Doğrulanacak kaynaklar (link eklenmedi; adlarıyla ara ve doğrula):**

| Ders | Kaynak | Neden önerildi |
|---|---|---|
| Hepsi | YouTube: The Efficient Engineer | Rehberde (15.2) önerilir. Mukavemet, yorulma ve termodinamik animasyonları |
| MEC.MAT | MIT OpenCourseWare 2.001 Mechanics & Materials I | Notlar ve problem setleri |
| MAK.EL I | MIT OpenCourseWare 2.72 Elements of Mechanical Design | Tasarım odaklı; mil, cıvata, rulman |
| İMALAT | MIT OpenCourseWare 2.008 Design and Manufacturing II | Süreç fiziği ve maliyet |
| MEC.DES | NPTEL Kinematics of Machines (IIT Kanpur) | Tam dönemlik video dersi |
| MAK.EL I | NPTEL Design of Machine Elements | Tam dönemlik video dersi |
| MÜHTER II | NPTEL Engineering Thermodynamics | Tam dönemlik video dersi |
| Türkçe | YouTube'da şu ifadelerle ara: "mukavemet soru çözümü", "makine elemanları yorulma soru çözümü", "rankine çevrimi soru çözümü", "mekanizma tekniği hız analizi" | Türkçe kanallar bu görevde doğrulanamadı |
| TÜRK DİLİ | TDK Yazım Kılavuzu (çevrimiçi) | Yazım ve noktalama |

---

## AI özet ve tavsiye kuralları

Kullanıcı ders notu, slayt, PDF ya da tahta veya defter fotoğrafı verdiğinde
Claude (`/ders` A akışı) aşağıdaki çıktıyı bu sırayla üretir. Telefonda
okunacağı için sonuç önce gelir.

1. **Başlık satırı:** Ders | tarih | konu | bu dosyadaki konu sırasında kaçıncı
   adım olduğu ("MEC.MAT · 14.10 · Burulma · 4/11").
2. **Özet (5–8 madde):** Ne anlatıldı, neden önemli. Notta olmayan bir şeyi
   eklersen "ek bilgi" olarak işaretle.
3. **Kilit formüller tablosu:**

   ```
   formül | semboller ve SI birimleri | geçerlilik koşulu | tipik hata
   ```

   Örnek: `τ = Tρ/J | T [N·m], ρ [m], J [m⁴] → τ [Pa] | dairesel kesit,
   lineer elastik | dikdörtgen kesitte kullanmak`.
4. **Kavram haritası (2–3 satır):** Önceki konulara ve diğer derslere bağlantı.
   Örnek: "MEC.MAT burulma → MAK.EL I mil tasarımı".
5. **Kendini test et (5 soru):** 3'ü hesap, 2'si kavram. Cevaplar ayrı bir
   "Cevaplar" bölümünde verilir. Önce kullanıcı dener. Vizeye 7 günden az
   kaldıysa 8 soru olur.
6. **Çözümlü örnek (1 tane):** Problem defteri kalıbıyla yazılır: verilen,
   istenen, şekil, varsayım, çözüm, birim kontrolü, mertebe kontrolü, anahtar
   fikir.
7. **Solar Team bağlantısı (1–2 cümle):** Rehber bölüm numarasıyla. Gerçek bir
   bağ yoksa "doğrudan bağlantı yok" yaz, zorlama.
8. **Kaynak:** Kitap bölümü ve bu dosyanın kütüphanesinden 1 link. Link yoksa
   "doğrulanmış link yok" yaz. **Link uydurma.**
9. **Tekrar tarihleri:** +1, +3 ve +7 gün, takvim tarihleriyle. Her biri
   10–15 dk sürer ve o günün ders bloğunun başında yapılır. Cumartesi'ye düşen
   tekrar Pazar'a kayar.
10. **Tavsiye (en fazla 3 satır):** En zayıf görünen nokta, sıradaki somut adım
    ve hangi blokta yapılacağı.

**Kurallar:**
- **Uydurma yok.** Fotoğrafta okunmayan sayıyı ya da sembolü tahmin etme;
  "şu kısım okunmuyor" de. Hocanın formülü kitaptakinden farklıysa hocanınkini
  kullan, farkı not et.
- **Notasyonu koru.** Ders kitabının ve hocanın sembollerini kullan:
  Shigley'de Se, Sut, Kf; Çengel'de h, s, x; Hibbeler'de işaret konvansiyonu.
- **Birim her yerde.** Formül, ara sonuç ve cevap SI birimiyle yazılır.
- **Akademik dürüstlük.** Teslim edilecek ödevin birebir çözümü yazılmaz. Yol
  gösterilir, benzer bir örnek çözülür, kullanıcının çözümü kontrol edilir.
  Hocanın kuralı farklıysa ona uyulur.
- **Güvenlik-kritik takım hesabı** (fren, direksiyon, süspansiyon, emniyet
  kemeri bağlantısı): Ders düzeyindeki hesap onaylı tasarım değildir. Son söz
  el hesabı ve kıdemli onayındadır (rehber 12.2).
- **Kayıt.** Not `notlar/<anahtar>-<YYYYMMDD>` belgesine yazılır, hatalar
  `notlar/<anahtar>-hatalar` belgesine eklenir. Anahtarlar bu dosyanın başında.
- **Kapasite.** 1-3-7 tekrar görevleri `tahmin_dk: 10–15` ile açılır. Aynı güne
  düşenler tek görevde birleşir ("Tekrar: MEC.MAT + MÜHTER II, 25 dk"). Haftalık
  toplam bu dosyadaki şablonu aşarsa `planla.py kapasite` ile kontrol et ve
  kullanıcıya açıkça söyle.
- **Sınav dönemi** (profilde `sinav_donemleri`): Özet kısalır, soru sayısı
  artar. Her oturum kendini test etmeyle başlar. Son gün yeni konu verilmez.

---

## Kullanıcıya teyit ettirilecekler

Kullanıcıya şu sırayla sor. Cevaplar gelince bu dosyayı ve profildeki `baglam`
alanını güncelle.

1. **Hangi üniversitedesin: ESTÜ mü, ESOGÜ mü?**
   - Neden soruyoruz: Programdaki kodlar ve ders süreleri ESOGÜ Makina
     kataloğuyla birebir eşleşiyor. Örnekler:
     - MAK.EL I: ESOGÜ'de 151815357, 3 saat. ESTÜ'de MKM302, İngilizce, 4+0.
     - MÜHTER II: ESOGÜ'de 151815359. ESTÜ'de TER208 "Thermodynamics II".
     - İMALAT: ESOGÜ'de 151815331 "İmalat Mühendisliği". ESTÜ'de MKM304
       "Manufacturing Techniques", 2+2.
     - `[80111]`: ESOGÜ Rektörlük alan dışı seçmeli öneki.
   - Profil ve rehber ise "ESTÜ" diyor. ESTÜ'lüysen ders adlarını ESTÜ'nün
     2025–2026 planından yeniden eşle.
2. **MEC.DES'in tam adı** "Mechanism Design / Mekanizma Tekniği" mi
   (ESOGÜ 151815356)? Ders İngilizce mi işleniyor?
3. **MEC.MAT, Mukavemet (151813234) mi?** Alttan mı alıyorsun? Ders İngilizce
   şubede mi? Mukavemet alttansa MAK.EL I ile birlikte en yüksek öncelik olur.
4. **ERHVKİL'in tam adı nedir?** OBS'deki ders bilgisinden bak. Öğrenince
   izlenceyi ve değerlendirme biçimini de paylaş.
5. **Türk Dili I mi, II mi?** Sınavı çevrimiçi mi, yüz yüze mi?
6. **Her dersin değerlendirmesi:** Vize ve final ağırlığı, ödev, proje,
   laboratuvar, quiz var mı? MÜHTER II için %40/%60 biliniyor, diğerleri
   bilinmiyor.
7. **Vize tarihleri.** Bilinince `sinav_donemleri` ve vize geri sayımı kurulur.
8. **Hangi katalog geçerli?** 2021–2023 mü, 2024 mü (giriş yılına göre)?
9. **Hocaların önerdiği kitaplar** ve sınavda formül kağıdı ya da tablo izni.
10. **Haftalık süre kararı:** Kapasite içinde ≈ 8 saat mi kalsın, yoksa
    Perşembe YZ bloğu ve Pazar borsa derse verilerek ≈ 9,5 saate mi çıkılsın?
