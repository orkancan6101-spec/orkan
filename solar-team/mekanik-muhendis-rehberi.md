# Güneş Arabası Takımında Mekanik Mühendis Adayı Rehberi

**ESTU Solar Team mekanik birimi için: ne öğrenmeli, hangi derslere yüklenmeli, hangi terimleri bilmeli, takımda nasıl fark yaratmalı**

- **Kimin için:** ESTÜ Makine Mühendisliği 3. sınıf öğrencisi, ESTU Solar Team mekanik biriminin yeni üyesi
- **Tarih:** 26 Eylül 2026
- **Nasıl okunur:** Önce Bölüm 0'ı, sonra Bölüm 1 ve 2'yi oku. Geri kalanı başvuru kaynağı; ihtiyaç duydukça dön.
- **Eşlik eden araç:** [`enerji_butcesi.py`](enerji_butcesi.py) — Bölüm 2'deki tabloları üreten hesap scripti

---

## İçindekiler

0. Tek sayfalık özet
1. Oyunu tanı: takım ve yarışma
2. Watt gibi düşünmek: verimlilik aracının fiziği
3. Mekanik birim ne yapar: alt sistemler
4. El hesabı örnekleri
5. Yazılım ve araç seti (ANSYS öğrenme yolu dahil)
6. Dersler: hangisi nerede işine yarar
7. Sayılarla sezgi
8. Terimler sözlüğü
9. Toplantı dili: duyacağın cümleler ne demek
10. Takımda verimli olmak
11. Sık yapılan hatalar
12. Yapay zekâ + mekanik: iki dünyanı birleştirmek
13. 12 aylık yol haritası
14. Kendini test et
15. Kaynaklar

---

## 0. Tek sayfalık özet

1. **Takımın bugünkü oyunu verimlilik.** ESTU Solar Team son yıllarda TEKNOFEST Uluslararası Efficiency Challenge'ın **Elektromobil** kategorisinde yarışıyor. Bu yarışta en hızlı araç değil, kurallara uyup parkuru **en az enerjiyle** bitiren araç öne geçer. Raporlar ve yerlilik de puanı etkiler. Bu yüzden mekanik birimin temel birimleri **Watt ve gram**.
2. **Şartname senin anayasan.** Güncel şartnameyi baştan sona oku. İlk somut iş olarak mekanik gereksinim matrisini çıkar (Bölüm 1.4).
3. **Watt gibi düşün.** Her kararın etkisini şu soruyla ölç: "Bu, yarış boyunca kaç Wh'e mal oluyor?" Belirleyici olanlar kütle, Crr, CdA, verim ve parazitik kayıplar: balata sürtünmesi, rulman, hizalama (Bölüm 2).
4. **CAD'de akıcı ol.** Takım hangi CAD'i kullanıyorsa onda hızlı ve düzenli çalışmak her şeyin ön şartı.
5. **ANSYS'i doğru sırayla öğren.** Sıra: statik analiz → ağ (mesh) yakınsaması → gerçekçi sınır koşulları → temaslar → modal → burkulma. Sonra takımın ihtiyacına göre kompozit (ACP) ya da aerodinamik (Fluent) (Bölüm 5).
6. **Önce el hesabı, sonra FEA.** FEA sonucu el hesabınla aynı mertebede değilse, aksi kanıtlanana kadar yanlış kabul et.
7. **Kompozit üretimi elinle öğren.** Phantom'un gövdesi ve şasisi tamamen karbon fiberdi. Katman serimi, vakum torbalama ve kür atölyede öğrenilir.
8. **Bir parçayı baştan sona sahiplen.** Zincir şu: gereksinim → CAD → hesap → teknik resim → üretim → test → doküman. Takımda güven kazanmanın en hızlı yolu bu.
9. **Dersleri araçla bağla.** Takımda doğrudan karşılığı olan dersler: Makine Elemanları, Mukavemet, Akışkanlar, Isı Transferi, Mekanizma/Makine Dinamiği, Titreşim, Sonlu Elemanlar. Takımdaki işini bitirme projesine ve TÜBİTAK 2209'a bağla.
10. **Yapay zekâ senin kaldıracın.** Hesap scriptleri, test verisi analizi ve simülasyon otomasyonu seni takımda farklı kılar. Ama güvenlik-kritik hesaplarda son söz el hesabı ve kıdemli onayıdır.

---

## 1. Oyunu tanı: takım ve yarışma

### 1.1 ESTU Solar Team kısaca

Haberlerden ve üniversite sayfalarından derlendi (kaynaklar Bölüm 15'te):

| Dönem | Olay |
|---|---|
| 2006 | "Anadolu Solar Team" adıyla kuruluş |
| 2015 | Avustralya'daki World Solar Challenge'da 3.022 km'lik parkuru tamamladı. Takıma göre bunu başaran ilk ve tek Türk takımı. |
| 2019 | ESTÜ bünyesinde "ESTU Solar Team" adıyla devam |
| 2022 | **Phantom:** Gövde ve şasi tamamen karbon fiber. Tekerlek mekanizmaları, güç aktarma organları ve direksiyon sistemi takım üyelerince tasarlanıp üretildi. |
| 2023 | TEKNOFEST Efficiency Challenge Elektromobil kategorisinde Türkiye ikinciliği (Phantom) |
| Sonrası | **Asena:** Haberlere göre %95 yerlilik, %97 motor sürücü verimi, %91,5 motor verimi |

Aynı ekosistemden bir örnek daha: ESTÜ Makine'den 4. sınıf öğrencileri Efficiency Challenge araçları için karbon fiber ve sandviç kompozit bir koltuk geliştirdi. Klasik koltuk yaklaşık 10 kg, yenisi yaklaşık 1,5 kg (%85 hafif). Proje Doç. Dr. Fatih Turan danışmanlığında yaklaşık 1,5 yıl sürdü. Takımdaki bir mekanik problemin **bitirme projesine** dönüşebileceğinin somut örneği (Bölüm 6.3).

### 1.2 Yarışma: TEKNOFEST Uluslararası Efficiency Challenge

- **Düzenleyen:** TÜBİTAK, TEKNOFEST kapsamında. Yarışlar 2005'te güneş arabalarıyla (Formula G) başladı. Zamanla iki kategoriye dönüştü: elektromobil (bataryalı) ve hidromobil (hidrojen yakıt pilli).
- **Aşamalar:** Takvim ve ayrıntılar her yıl değişebilir, güncel şartnameden kontrol et. Tipik akış: Gelişme Raporu → Teknik Tasarım Raporu (TTR) → dinamik sürüş ve fren testi videoları → final. Finalde teknik kontrol, antrenman turları, final yarışı ve ivmelenme etkinliği var.
- **Pist:** Körfez Yarış Pisti (Kocaeli). TÜBİTAK'ın yarış haberine göre 1.370 m uzunluğunda, 3'ü sağ 6'sı sol 9 virajlı ve en yüksek eğimi %4. Bu %4'ün ne kadar önemli olduğunu Bölüm 2'de göreceksin.
- **Yerlilik:** Motor, batarya yönetim sistemi (BMS) ve motor sürücü gibi parçaları yerli geliştiren takımlar ödüllendiriliyor. Mekanik tarafta da belge istekleri var:
  - Direksiyon dönüşü ile tekerlek dönüşü arasındaki tüm elemanların teknik resmi ve tüm sistemin 3B CAD montajı isteniyor.
  - Fren sistemini kendiniz tasarlıyorsanız tasarım ve üretim adımlarını açıkça tanımlamanız gerekiyor.
- **Güvenlik:** 2024 şartnamesinde emniyet kemerleri, kask/tulum/eldiven/ayakkabı, yangın söndürücü, roll bar ve roll cage için ayrı maddeler var. 2025'ten itibaren kurallar bölüm bölüm kitapçıklar halinde yayımlanıyor. Mekanik için en kritik ikisi: "Teknik Kurallar" ve "Teknik Kontrol ve Final Etkinlik Kuralları".
- **Puanlama:** Enerji, süre, rapor ve yerlilik ağırlıkları her yıl şartnamede tanımlanır. Ezberleme, her sezon yeniden oku.

**Mekanik birim açısından kazanmanın 4 şartı:**

1. **Teknik kontrolden geçmek:** Şartnameye uyum. Geçemeyen araç yarışamaz.
2. **Parkuru bitirmek:** Güvenilirlik. Bitiremeyen aracın verimi sıfırdır.
3. **En az enerjiyi harcamak:** Verimlilik.
4. **Puanı belgelemek:** TTR, videolar, yerlilik belgeleri, teknik resimler.

### 1.3 "Solar" mirası: güneş arabası yarışları

Takımın adı ve 2015'teki World Solar Challenge deneyimi güneş arabası geçmişinden geliyor. Günün birinde yeniden güneş arabası projesi açılırsa bilmen gerekenler:

- **Başlıca yarışlar:** Bridgestone World Solar Challenge (Avustralya, Darwin–Adelaide, yaklaşık 3.000 km; sıradaki 2027'de), American Solar Challenge, iLumen European Solar Challenge (Belçika).
- **Kurallar değişken:** 2025 BWSC'de Challenger sınıfı için güneş paneli alanı 6 m²'ye kadar çıkarıldı. Araçta depolanabilen enerji ise 11 MJ (~3,1 kWh) ile sınırlandı.
- **Mekanik farkı:** Hızlar 80–100 km/h olduğu için aerodinamik açık ara baskındır (Bölüm 2). Panelin gövdeye entegrasyonu, binlerce kilometrelik güvenilirlik ve açık yol koşulları da işin içine girer.

Bu rehberdeki her şey iki yarış türü için de geçerli. Değişen yalnızca öncelik sırası.

### 1.4 İlk somut görevin: şartnameden mekanik gereksinim matrisi

Takıma "ne yapabilirim?" diye sorduğunda bundan daha değerli bir teklif az bulunur: **"Güncel şartnameden mekanik gereksinim matrisini çıkarayım."**

| No | Madde | Gereksinim (kısa) | Sayısal sınır | Alt sistem | Doğrulama | Sorumlu | Durum |
|---|---|---|---|---|---|---|---|
| M-01 | (no) | Direksiyon elemanlarının teknik resmi + 3B CAD montajı | — | Direksiyon | Doküman | | Açık |
| M-02 | (no) | Roll bar / roll cage ölçü ve dayanım şartı | şartnameden | Şasi, güvenlik | Analiz + muayene | | Açık |
| M-03 | (no) | Fren sistemi şartı ve fren testi | şartnameden | Fren | Test (video) | | Açık |
| … | | | | | | | |

**Doğrulama türleri:** Analiz (hesap, FEA), Test, Muayene (göz ve ölçü kontrolü), Doküman.

**Yapay zekâ ipucu:** İlk taslağı PDF'ten bir yapay zekâ aracıyla çıkarabilirsin. Ama her satırı orijinal maddeyle **kendin** karşılaştırmadan tabloya güvenme. Teknik kontrolde "yapay zekâ öyle demişti" diye bir savunma yok.

---

## 2. Watt gibi düşünmek: verimlilik aracının fiziği

### 2.1 Tek denklem

```
F = ½·ρ·CdA·v²  +  Crr·m·g·cosθ  +  m·g·sinθ  +  m·a
    aerodinamik      yuvarlanma       eğim        ivmelenme

P_teker   = F · v
P_batarya = P_teker / η          η = η_motor · η_sürücü · η_aktarma
```

- **ρ:** hava yoğunluğu (~1,2 kg/m³)
- **CdA:** sürükleme alanı (m²)
- **Crr:** yuvarlanma direnci katsayısı
- **m:** sürücü dahil toplam kütle
- **θ:** yol eğimi
- **η:** batarya → teker verim zinciri

Asena için açıklanan değerlerle: 0,915 (motor) × 0,97 (sürücü) × 0,97 (aktarma, **varsayım**) ≈ **0,86**. Verimler çarpılır, yani her kademede kaybedilen 1 puan tüm zincire yansır.

### 2.2 Sayılarla: iki örnek araç

Aşağıdaki tablolar [`enerji_butcesi.py`](enerji_butcesi.py) ile üretildi. **Araç değerleri varsayımdır.** Kendi aracınızın ölçülmüş değerleriyle yeniden çalıştır.

**A) EC elektromobil örneği:** m = 190 kg (sürücü dahil), CdA = 0,15 m², Crr = 0,006, η = 0,86

| Hız (km/h) | Aero (W) | Yuvarlanma (W) | Batarya (W) | Tüketim (Wh/km) | Aero payı |
|---:|---:|---:|---:|---:|---:|
| 20 | 15 | 62 | 90 | 4,5 | %20 |
| 30 | 52 | 93 | 169 | 5,6 | %36 |
| 35 | 83 | 109 | 223 | 6,4 | %43 |
| 40 | 123 | 124 | 288 | 7,2 | %50 |
| 50 | 241 | 155 | 461 | 9,2 | %61 |

35 km/h'de tek bir iyileştirme yapılırsa (başlangıç: 223 W):

| Değişiklik | Batarya gücüne etkisi |
|---|---:|
| Crr %10 azalırsa | −12,6 W (−%5,7) |
| CdA %10 azalırsa | −9,6 W (−%4,3) |
| Kütle 10 kg azalırsa (yalnızca düz yol) | −6,7 W (−%3,0) |
| Verim 2 puan artarsa | −5,1 W (−%2,3) |
| **Aynı hızda %4 yokuş** | **1.065 W (düz yolun 4,8 katı)** |
| 0 → 35 km/h tek kalkış | 2,9 Wh |

**B) WSC tipi güneş arabası örneği:** m = 260 kg, CdA = 0,08 m², Crr = 0,004, η = 0,95

| Hız (km/h) | Aero (W) | Yuvarlanma (W) | Batarya (W) | Tüketim (Wh/km) | Aero payı |
|---:|---:|---:|---:|---:|---:|
| 60 | 222 | 170 | 413 | 6,9 | %57 |
| 80 | 527 | 227 | 793 | 9,9 | %70 |
| 85 | 632 | 241 | 919 | 10,8 | %72 |
| 100 | 1.029 | 283 | 1.381 | 13,8 | %78 |

85 km/h'de tek iyileştirmenin etkisi:

- CdA −%10 → −66,5 W (−%7,2)
- Crr −%10 → −25,4 W (−%2,8)
- Kütle −10 kg → −9,8 W (−%1,1)
- Verim +2 puan → −18,9 W (−%2,1)

### 2.3 Buradan çıkan 6 ders

1. **Hangi parametrenin önemli olduğu hıza bağlı.** Aerodinamik güç v³ ile büyür. EC hızlarında yuvarlanma direnci aerodinamikle başa baş, hatta önde. WSC hızlarında ise aerodinamik açık ara baskın. "Gövdeyi daha aerodinamik yapalım" her zaman en iyi hamle değildir, önce hız profiline bak.
2. **Kütlenin asıl bedeli yokuşta ve kalkışta ödenir.** Düz yolda 10 kg yalnızca %3 fark ediyor gibi görünür. Ama %4 yokuşta güç 4–5 katına çıkıyor. Kütle her tırmanışta ve her hızlanışta tekrar cezalandırılır.
3. **Kapalı pistte yükseklik farkı sıfırdır ama enerji kaybı sıfır değildir.** Yokuşta harcadığın enerjinin bir kısmı inişte geri gelir, ama yalnızca frene basmazsan. Verim zincirindeki kayıplar ve frende ısıya giden enerji geri gelmez. Sürüş stratejisi ile mekanik tasarım burada buluşur.
4. **Tasarımı en zorlu yokuş boyutlandırır.** Motor, batarya ve aktarma oranı seçimi buna göre yapılır. Örnek araçta %4 yokuşu sabit hızda çıkmak için tekerlekte yaklaşık 21 N·m tork gerekiyor (R = 0,25 m; aerodinamik direnç ve ivmelenme hariç).
5. **Verim zinciri çarpımsal.** Mekanik aktarma kayıpları da (zincir hizası, rulman, dişli) doğrudan bu çarpıma girer.
6. **Hiçbir değer tahminde kalmamalı.** CdA ve Crr ölçülür (coast-down), kütle tartılır, verim test edilir. Tasarım kararlarını ölçülmüş sayılar üzerine kur.

### 2.4 En ucuz Watt'lar: parazitik kayıplar

Tasarım toplantısında pek konuşulmazlar ama yarış kaybettirirler:

- **Balata sürtünmesi:** Fren diskine hafifçe değen balata sürekli fren yapar. Tekerleği elle çevirip ne kadar sürede durduğunu karşılaştır (spin-down testi).
- **Rulman sürtünmesi:** Temaslı lastik keçeli rulmanlar (2RS) metal kapaklılara (ZZ) göre daha çok sürtünür. Aşırı ön yük ve fazla gres de sürtünmeyi artırır.
- **Hizalama hatası:** Toe veya kamber yanlışsa lastik yana sürtünerek ilerler (scrub). Görünmez ama sürekli bir kayıptır.
- **Lastik basıncı ve seçimi:** Crr'yi doğrudan belirler. Üreticinin izin verdiği aralıkta test ederek optimize et.
- **Zincir/kayış:** Hizasızlık, yanlış gerginlik, kir, yağsızlık.
- **Esneme:** Yük altında esneyen şasi, salıncak ya da direksiyon kolu hizalamayı bozar. Rijitlik bu yüzden bir verim meselesidir.
- **Gövde yüzeyi:** Basamaklar, panel aralıkları, gereksiz açıklıklar ve çıkıntılar sürüklemeyi artırır.

### 2.5 Coast-down testi: CdA ve Crr'yi ölçmek

Düz ve rüzgârsız bir yolda aracı belli bir hıza çıkar, motoru devreden çıkar ve serbestçe yavaşlamasını kaydet:

```
m_eş · dv/dt = −( ½·ρ·CdA·v²  +  Crr·m·g )

yavaşlama(v) = A + B·v²      A = Crr·g·(m / m_eş)      B = ρ·CdA / (2·m_eş)
```

- **m_eş (eşdeğer kütle):** Dönen parçaların (tekerlek, motor rotoru) ataletini de içeren kütle.
- Hız–zaman verisinden ivmeyi hesapla ve yavaşlamayı v²'ye karşı çiz. Doğrunun kesişimi Crr'yi, eğimi CdA'yı verir.
- Testi iki yönde tekrarlayıp ortalama al. Böylece eğim ve rüzgâr etkisi azalır.
- Python + yapay zekâ için mükemmel bir ilk proje (Bölüm 12.4).

---

## 3. Mekanik birim ne yapar: alt sistemler

Her alt sistem için ne işe yaradığı, bilmen gerekenler ve tipik hatalar. Terimlerin karşılıkları Bölüm 8'de.

### 3.1 Şasi ve yapı

**Ne işe yarar:** Süspansiyon, sürücü, batarya ve motor yüklerini taşıyan omurgadır. Sürücüyü korur.

**Yapı tipleri:**
- **Karbon monokok (sandviç):** Hafif ve rijit. Kalıp ve üretim emeği yüksek. Phantom bu yoldan gitti.
- **Boru kafes (space frame):** Çelik (ör. 4130) veya alüminyum boru. Kaynak ve fikstür ister. Hızlı üretilir, kolay tamir edilir ama daha ağırdır.
- **Hibrit:** Karbon gövde ile metal alt çerçeve veya roll bar.

**Bilmen gerekenler:**
- **Yük durumları (load cases):** Dikey tümsek, frenleme, viraj ve bunların birleşimi. Devrilme ve çarpma koşulları şartnameden gelir. Takımlar genelde statik yükü dinamik bir katsayıyla büyütür (ör. dikeyde 2–3 g). Takımın kabul ettiği katsayıları öğren ve **nedenini sor**.
- **Yük yolu (load path):** Yük nereden girip nereye akıyor? Hardpoint'ler bu yolun düğümleridir.
- **Rijitlik:** Burulma rijitliği (N·m/°) ve eğilme rijitliği. Esneyen şasi hizalamayı bozar, bozuk hizalama Watt kaybettirir.
- **Bağlantılar:** Kompozite gömülü insert'ler, yerel takviye katları (doubler), yüksek yoğunluklu köpük veya alüminyum bloklar, yapıştırma + cıvata. Cıvatada tork ve ön yük hesabı (Bölüm 4.2).
- **Emniyet katsayısı:** Belirsizliğe karşı sigortadır. Fazlası gereksiz kütle, azı risk.

**Tipik hata:** FEA'da modeli gerçekte tutulmayan yerlerden ankastre edip (fixed support) sahte gerilme ve rijitlik elde etmek. Insert çevresini modellememek.

### 3.2 Kompozit tasarım ve üretim

Phantom'un gövdesi ve şasisi karbon olduğu için bu alan takımda büyük ihtimalle kritik.

**Malzemeler:**
- **Karbon elyaf:** Dokuma (dimi/twill, bezayağı/plain; 3K, 12K) ya da tek yönlü (UD).
- **Cam elyaf:** Ucuz ve elektriksel yalıtkan; galvanik izolasyon katı olarak da kullanılır.
- **Aramid (Kevlar):** Darbe ve delinme dayanımı iyi.
- **Çekirdekler:** Nomex veya alüminyum bal peteği; PVC, PET veya PMI köpük.
- **Reçine:** Epoksi sistemleri.

**Üretim yöntemleri:** El yatırma + vakum torbalama, vakum infüzyonu, prepreg + fırın ya da otoklav. Takımın hangisini kullandığını ve nedenini öğren.

**Kalıp zinciri:** CAD yüzeyi → erkek model (plug; MDF, köpük veya tooling board, CNC ile işlenir) → yüzey hazırlığı (zımpara, astar, cila, kalıp ayırıcı) → dişi kalıp → parça.

**Vakum torbası katmanları (içten dışa):** kalıp (ayırıcı uygulanmış) → laminat → soyma kumaşı (peel ply) → delikli ayırıcı film → nefes kumaşı (breather) → vakum torbası (sızdırmazlık bandıyla kapatılır). İnfüzyonda araya akış filesi ve reçine giriş/çıkış hatları girer.

**Laminat tasarımı:**
- Katman yönleri 0°, ±45° ve 90°. Yükü lif yönüyle taşı: lif, yükün aktığı yöne bakmalı.
- **Simetrik ve dengeli** dizilim şart; yoksa parça kürden çarpık çıkar.
- Yarı-izotropik dizilim (ör. [0/±45/90]s) her yönde benzer davranır.
- Katman bitişlerinde kademeli düşüş (ply drop) ve bindirmeler.

**Kür:** Reçinenin kullanım süresi (pot life), kür sıcaklığı ve süresi, son kür (post-cure). **Camsı geçiş sıcaklığı (Tg)** önemli: güneşte ısınan koyu renkli bir gövde düşük Tg'li reçinede yumuşayabilir.

**Kalite kontrol:**
- Kusurlar: boşluk (void), kuru bölge, reçinece zengin bölge, delaminasyon.
- Tıklama testi (tap test): madeni parayla vur, boş ses kusur gösterir.
- Parçayı tart: ağırlık, reçine oranının göstergesidir.
- Test kuponları: ör. ASTM D3039 çekme testi.

**Tasarım hesabı:** Klasik laminat teorisi (CLT, ABD matrisi), hasar kriterleri (Tsai-Wu, Hashin, maksimum gerilme) ve ilk katman hasarı (first ply failure). Araçlar: Ansys ACP, ücretsiz eLamX².

**Kritik detaylar:**
- **Galvanik korozyon:** Karbon alüminyuma doğrudan değerse nemli ortamda alüminyum korozyona uğrar. Araya cam elyaf katı ya da yalıtım koy.
- **Isıl genleşme farkı:** Karbonun lif yönündeki genleşmesi neredeyse sıfır, alüminyumunki ~23×10⁻⁶ /°C.
- **Gerilme yığılması:** Delik ve insert çevresinde yoğunlaşır; dar iç köşelerde kumaş köprü yapar (bridging).

**Sağlık:** Epoksi deride hassasiyet yapabilir ve bu alerji çoğu zaman kalıcıdır. Nitril eldiven ve uzun kol kullan. Kesim ve zımparada karbon tozuna karşı P2/P3 maske, gözlük ve toz emme şart. Malzemenin güvenlik bilgi formunu (SDS) oku.

### 3.3 Gövde ve aerodinamik

**Sürükleme türleri:**
- **Basınç (biçim) sürüklemesi:** Akış ayrılması ve arkadaki iz bölgesinden gelir.
- **Yüzey sürtünme sürüklemesi:** Islak alana ve sınır tabakanın laminer/türbülanslı olmasına bağlıdır.
- **İndüklenmiş sürükleme:** Kaldırma üreten gövdelerde oluşur.
- **Parazit sürüklemeler:** Tekerlek, ayna, açıklıklar.

**Reynolds sayısı:** 3 m'lik bir gövde için 35 km/h'de Re ≈ 2×10⁶, 85 km/h'de Re ≈ 5×10⁶. Bu aralıkta laminerden türbülansa geçişin nerede olduğu önemlidir. Yüzey kalitesi, ek yerleri ve basamaklar geçişi erkene çeker.

**Tasarım prensipleri:**
- Damla (teardrop) profili ve uzun, yavaş daralan kuyruk; ayrılmayı geciktirir.
- Küçük ön kesit alanı.
- Tekerlek kaportaları.
- Az çıkıntı.
- Tasarlanmış soğutma girişi ve çıkışı (ör. NACA girişi).
- Yumuşak kanopi geçişleri.

**Kaldırma ve yan rüzgâr:** Kaldırmayı sıfıra yakın tut. Yan rüzgârda basınç merkezinin ağırlık merkezine göre konumu stabiliteyi belirler.

**CFD iş akışı:**
1. Geometri temizliği.
2. Akış hacmi (domain).
3. Ağ: sınır tabaka için inflation/prism katmanları ve hedef y+.
4. Sınır koşulları: hız girişi, basınç çıkışı, hareketli zemin, dönen tekerlek.
5. Türbülans modeli: k-ω SST; laminer bölge önemliyse geçiş modelli (Transition) SST.
6. Yakınsama: artıklar (residuals) ve kuvvet monitörleri birlikte.
7. Ağ bağımsızlığı: en az 3 ağ.
8. Sonuç: Cp, duvar kayma gerilmesi, akım çizgileri, ayrılma hatları.
9. Doğrulama: coast-down, yün ipi testi.

**Yün ipi (tuft) testi:** Gövdeye kısa yün iplikler yapıştır, aracı sür ve kamerayla çek. İpliklerin çırpındığı yer ayrılma bölgesidir. Ucuz ve çok öğreticidir.

**Tipik hata:** Yakınsamamış CFD'den Cd okumak. Ağ bağımsızlığı göstermemek. Gerçek araçta olmayan kusursuz yüzeyi simüle edip sonra zımparasız, basamaklı gövde üretmek.

### 3.4 Süspansiyon

**Verimlilik aracında amaç** maksimum yol tutuşu değildir. Amaçlar: hafiflik, hizalamanın yük altında korunması, düşük sürtünme, güvenilirlik ve yeterli konfor. Takımın mevcut çözümünü ve **neden** seçildiğini öğren.

**Tipler:** Çift salıncak (double wishbone), MacPherson, çekili kol (trailing arm), salınım kolu (swing arm), rijit aks.

**Kavramlar:** Kamber, kaster, toe, pivot eğimi (KPI), ofset (scrub radius), mekanik iz (trail), yuvarlanma merkezi (roll center), ani dönme merkezi (instant center), kamber kazancı, bump steer, anti-dive/anti-squat, hareket oranı (motion ratio), tekerlek rijitliği (wheel rate), yay katsayısı, sönüm (basma/açılma), yaylı/yaysız kütle, sürüş frekansı.

**Bilmen gerekenler:**
- **İki kuvvet elemanı:** İki ucu mafsallı (rot başlı) çubuk yalnızca eksenel yük taşır. Basınçta **burkulma** kontrolü şart. Rot başını eğilmeye çalıştırma.
- **Yük hesabı:** Tekerlek yüklerinden (dikey, frenleme, viraj) salıncak kuvvetlerine gidilir. 6 bilinmeyen ve 6 denge denkleminden oluşan statik denge problemidir. CAD'den koordinatları al, Python/MATLAB'da çöz.
- **Hizalama:** İp yöntemi (string alignment) veya lazerle ölç. Ayarı pul (shim) veya rot başı dişlisiyle yap.
- **Araçlar:** CAD eskizinde 2B/3B kinematik, Lotus Suspension Analysis, OptimumKinematics, ADAMS/Car, MATLAB Simscape Multibody.

**Tipik hata:** Kinematik çalışılmadan yapılan tasarım, yani süspansiyon çalışırken toe'nun değişmesi (bump steer). Esneyen bağlantılar.

### 3.5 Direksiyon

- **Ackermann geometrisi:** Virajda iç tekerlek dıştakinden daha çok döner, böylece lastikler kaymadan yuvarlanır.

  ```
  cot δ_dış − cot δ_iç = w / L      (w: pivot eksenleri arası mesafe, L: dingil mesafesi)
  ```
- **Dönüş yarıçapı:** Şartnamedeki tanım neyse (dış tekerlek izi mi, araç zarfı mı) ona göre hesapla ve **test et**. Bisiklet modeliyle yaklaşık R ≈ L / tan δ.
- **Mekanizma:** Kremayer-pinyon, doğrudan bağlantı veya dirsekli kol (bellcrank). Direksiyon oranı, boşluk (olmamalı), mekanik stoperler. Rot (tie rod) için burkulma kontrolü.
- **Şartname:** Direksiyon elemanlarının teknik resmi ve 3B CAD montajı isteniyor. Dokümantasyonu baştan düzgün tut.

**Tipik hata:** Yük altında esneyen direksiyon kolu. Toe değişir, lastik sürter.

### 3.6 Fren

- **Sistem:** Hidrolik disk fren yaygın; bisiklet ve motosiklet bileşenleri sık uyarlanır. Birçok yarış kuralında bağımsız iki fren devresi (yedeklilik) istenir; EC şartnamesindeki güncel şartı kontrol et.
- **Hesap zinciri:** Yavaşlama → yük transferi → teker kuvveti → tork → kaliper sıkma kuvveti → hidrolik basınç → pedal kuvveti (Bölüm 4.1).
- **Verimlilik katili:** Kalıcı balata sürtünmesi. Nedenleri disk salgısı (runout), kaliper hizası ve pistonun geri dönmemesi. Spin-down testiyle yakala.
- **Bakım:** Hava alma (bleeding). Hidrolik sıvı tipi: DOT sıvısı ile mineral yağ **asla karıştırılmaz**, contaları bozar. Fren hattı güzergâhı.
- **Rejeneratif frenleme** elektrik ekibinin işi. Ama mekanik fren her zaman birincil güvenlik sistemidir.
- **Takvim:** EC'de fren testi videosu aşaması var. Fren sistemi araçta ilk bitmesi gereken sistemlerden biri.

### 3.7 Tekerlek, göbek, rulman ve lastik

- **Lastik:** Crr'yi lastik yapısı, basınç, sıcaklık ve yol yüzeyi belirler. İzin verilen basınç aralığında coast-down ile test ederek optimize et.
- **Rulman:** Sabit bilyalı, eğik bilyalı, konik makaralı. Ömür hesabı L10 = (C/P)³ milyon devir (bilyalı rulman). Keçe tipi sürtünmeyi etkiler: temaslı keçe (2RS), metal kapaktan (ZZ) daha çok sürtünür. Ön yük ve geçme toleransları (sıkı/boşluklu).
- **Göbek, porya, aks:** Dönen eğilme altında çalışır, bu yüzden **yorulma** kritiktir. Malzeme 6061-T6 veya 7075-T6 alüminyum ya da çelik. Keskin iç köşe bırakma, radius ver.
- **Jant ve tekerlek kapağı:** Jant bütünlüğü, tel gerginliği. Disk kapaklar aerodinamik kazanç sağlar.
- **Spin-down testi:** Tekerleği elle çevir ve durma süresini ölç. Basit ama güçlü bir karşılaştırma aracı.

### 3.8 Güç aktarma ve motor montajı

- **Göbek motoru** (tekerlek içi, doğrudan tahrik): Aktarma kaybı yoktur ama yaysız kütle artar.
- **Şasiye bağlı motor + zincir/kayış:**
  - Aktarma oranını motorun verimli devir bölgesi ile yarış hızını eşleştirecek şekilde seç.
  - Kalkış ve %4 yokuş için tork yeterli olmalı.
  - Hiza, gerginlik, yağlama ve temizlik aktarma verimini doğrudan etkiler.
- **Hesap:** Motor torku = tekerlek torku / (i · η), i aktarma oranı.
- **Motor bağlantısı:** Hizayı koruyacak rijitlik, titreşim, soğutma (motor ısınırsa verim düşer), servis kolaylığı.
- **Elektrik ekibiyle:** Motorun verim haritasını (tork–devir–verim) iste; aktarma oranını buna göre seç.

### 3.9 Sürücü hücresi, güvenlik ve ergonomi

- **Şartname maddeleri:** Roll bar/roll cage, emniyet kemeri bağlantı noktaları (bunlar için yük hesabı yap), kask ve ekipman, yangın söndürücünün yeri.
- **Koltuk:** ESTÜ'deki kompozit koltuk örneği: ~10 kg → ~1,5 kg.
- **Sürücü ortamı:** Görüş (ayna, kanopi), havalandırma, acil tahliye, pedal kutusunun ayarlanabilirliği, farklı boydaki sürücülere uyum. Kapalı gövdede sıcaklık sürücü performansını düşürür.
- **Ergonomi = güvenlik + verim:** Rahat sürücü daha istikrarlı sürer ve stratejiyi daha iyi uygular.

### 3.10 Batarya kutusu, soğutma ve elektrik ekibiyle arayüz

- **Kutu:** Frenleme ve çarpma yüklerine göre bağlantı noktaları, elektriksel yalıtım, havalandırma ve gaz tahliyesi, yangına dayanım, soğutma hava yolu, servis erişimi, su/toz koruması (IP).
- **Isı:** Q = I²·R. Hava soğutmada ΔT ≈ Q / (ṁ·c_p). Basit hesapla başla, gerekirse Ansys Icepak/Fluent kullan.
- **Arayüz kontrol dokümanı (ICD):** Bağlantı delikleri, kablo güzergâhı, konnektör erişimi, acil durdurma butonunun konumu. Kütle dağılımı da buraya girer: batarya ağırdır, alçak ve merkezde olmalıdır.

### 3.11 Güneş paneli entegrasyonu (güneş arabası projelerinde)

- **Hücre:** Kırılgandır, eğrilik sınırı vardır. Laminasyonu (kaplaması) ve üst kabuğun rijitliği hücre çatlamasını belirler.
- **Isı:** Silisyum hücrelerde sıcaklık arttıkça verim düşer (tipik olarak °C başına ~%0,3–0,4 güç kaybı). Isıl genleşme de hesaba girer.
- **Ödünleşimler:** Aerodinamik biçim ile panel yerleşimi. Kurallar izin veriyorsa şarj molasında panel güneşe yönlendirilir.

---

## 4. El hesabı örnekleri

Toplantılarda konuşulan sayıların nereden geldiğini anlamanın en iyi yolu bu zincirleri bir kez kendin kurmak.

### 4.1 Fren: yavaşlamadan hidrolik basınca

```
Varsayımlar: m = 190 kg, hedef yavaşlama a = 0,6 g, ağırlık merkezi yüksekliği h = 0,35 m,
dingil mesafesi L = 1,6 m, statik ön aks yükü %50, lastik yarıçapı R = 0,25 m,
disk etkin yarıçapı r = 0,08 m, balata sürtünme katsayısı μ = 0,4, kaliper piston çapı 22 mm

1) Toplam fren kuvveti      F   = m·a = 190 · 0,6 · 9,81            ≈ 1.118 N
2) Öne yük transferi        ΔW  = m·a·h / L = 190 · 5,89 · 0,35 / 1,6 ≈ 245 N
3) Ön aks dinamik yükü      932 + 245 = 1.177 N  → toplam ağırlığın %63'ü
4) Ön teker başına kuvvet   1.118 · 0,63 / 2                        ≈ 353 N
5) Ön teker fren torku      T   = 353 · 0,25                        ≈ 88 N·m
6) Kaliper sıkma kuvveti    F_s = T / (2·μ·r) = 88 / (2 · 0,4 · 0,08) ≈ 1.380 N
7) Hidrolik basınç          p   = F_s / A_piston = 1.380 N / 380 mm²  ≈ 3,6 MPa (≈ 36 bar)
```

Son adımda ana merkez çapı ve pedal oranıyla sürücünün pedal kuvvetini bul. Tek devre varsayımıyla 12,7 mm ana merkez ve 4:1 pedal oranı ~115 N verir. Bu zinciri bir kez kurarsan fren toplantısındaki her cümleyi anlarsın.

### 4.2 Cıvata ön yükü

```
T = K · F · d      →      F = T / (K · d)

M8 cıvata, K ≈ 0,2 (kuru çelik), T = 25 N·m   →   F ≈ 25 / (0,2 · 0,008) ≈ 15,6 kN
Kontrol: M8 8.8 gerilme alanı 36,6 mm², tecrübe (proof) dayanımı 580 MPa → ~21 kN
→ Ön yük, tecrübe yükünün ~%75'i. Makul bölge.
```

**Uyarı:** Dişler yağlanırsa K düşer (~0,15). Aynı torkla daha yüksek ön yük oluşur ve cıvata aşırı yüklenebilir. Tork tablolarını (ör. VDI 2230 temelli tablolar) sürtünme koşuluyla birlikte kullan.

### 4.3 Devrilme eşiği

```
a_y / g = t / (2·h)       (rijit araç, yarı-statik yaklaşım)
t = 1,2 m iz genişliği, h = 0,40 m ağırlık merkezi yüksekliği  →  1,5 g
```

Gerçekte süspansiyon ve lastik esnemesi eşiği düşürür. Üç tekerlekli araçlarda eşik çok daha düşüktür. Ağırlık merkezini alçaltmak hem güvenlik hem stabilite demektir.

### 4.4 Sandviç yapının sihri

Aynı yüz malzemesini bir çekirdekle birbirinden uzaklaştırınca:

| Kesit | Göreli eğilme rijitliği | Göreli dayanım | Göreli ağırlık |
|---|---:|---:|---:|
| Tek katı laminat (kalınlık t) | 1 | 1 | 1 |
| Sandviç: toplam 2t (yüzler t/2, çekirdek t) | 7 | 3,5 | ~1,03 |
| Sandviç: toplam 4t (çekirdek 3t) | 37 | 9,25 | ~1,06 |

Rijitlik ve dayanım oranları kiriş teorisinden hesaplandı. Ağırlık oranları Hexcel'in klasik örneğinden alındı ve çekirdek yoğunluğuna bağlıdır. Monokok gövdelerin sırrı bu tablo: **rijitlik, yüzlerin arasındaki mesafenin karesiyle artar.**

---

## 5. Yazılım ve araç seti

### 5.1 Öncelik sırası

| Öncelik | Araç | Ne için |
|---|---|---|
| 1 | **Takımın CAD'i** (SolidWorks, CATIA, NX, Fusion… hangisiyse) | Parça, montaj, yüzey, teknik resim |
| 1 | **Ansys Mechanical (Workbench)** | Statik, modal, burkulma |
| 2 | **Python** (numpy, scipy, pandas, matplotlib) | Hesap scriptleri, test verisi, enerji modeli |
| 2 | **Ansys ACP** veya ücretsiz **eLamX²** | Kompozit laminat tasarımı |
| 2 | **Ansys Fluent**, STAR-CCM+ veya OpenFOAM | Aerodinamik, soğutma |
| 3 | Süspansiyon kinematiği (Lotus, OptimumKinematics, ADAMS, Simscape) | Geometri |
| 3 | CAM (Fusion, SolidCAM) ve 3B yazıcı dilimleyicisi | Üretim |
| 3 | MATLAB/Simulink | Okul ödevleri, sistem modelleri |

Büyük otomotiv ve havacılık firmalarında CATIA ve Siemens NX yaygın. KOBİ'lerde ve öğrenci takımlarında SolidWorks çok kullanılır. Hangisini öğrendiğinden çok **nasıl** öğrendiğin önemli: iyi parametrik modelleme alışkanlıkları her CAD'e taşınır.

### 5.2 CAD'de ustalık listesi

- [ ] Parametrik modelleme ve tasarım niyeti (design intent): ölçüler değişince model bozulmamalı
- [ ] İskelet (skeleton) / top-down montaj: hardpoint'ler tek bir referans dosyasından yönetilir
- [ ] Konfigürasyonlar ve tasarım tabloları
- [ ] Yüzey modelleme (gövde ve kalıp için)
- [ ] Kaynaklı yapılar (weldments) ve sac metal
- [ ] Montaj kısıtları, çakışma (interference) analizi, hareket kontrolü
- [ ] Malzeme atama ve kütle özellikleri (mass properties): kütle bütçesi buradan beslenir
- [ ] Teknik resim (ISO), toleranslar, geçmeler, GD&T temelleri
- [ ] Dosya ve versiyon düzeni (PDM veya takımın klasör/isimlendirme kuralı)
- [ ] Dışa aktarma formatları: STEP (paylaşım), STL (3B baskı), DXF (lazer/su jeti)

SolidWorks kullanılıyorsa **CSWA → CSWP** sertifikaları hem disiplin hem CV için iyi hedeflerdir.

### 5.3 ANSYS öğrenme yolu (10 adım, her adımda bir alıştırma)

| # | Konu | Alıştırma |
|---|---|---|
| 1 | Workbench mantığı: Engineering Data → Geometry → Model → Setup → Solution → Results. **Birimler!** | Konsol kiriş, uç yükü. Sonucu δ = F·L³/(3·E·I) ile karşılaştır. |
| 2 | Ağ (mesh): eleman tipi ve derecesi, kalite ölçütleri, yakınsama | Aynı kirişi 3 farklı ağla çöz, sonuç değişimini tabloya dök. |
| 3 | Gerilme yığılması ve tekillik (singularity) | Delikli plaka: Kt tablosuyla karşılaştır. Keskin köşede ağ inceldikçe gerilmenin nasıl "kaçtığını" gör. |
| 4 | Sınır koşulları: fixed support, remote displacement, elastik destek, bearing load, simetri | Bir braketi 3 farklı sınır koşuluyla çöz, farkı yorumla. |
| 5 | Temaslar (bonded, no separation, frictional) ve cıvata ön yükü | İki plakalı cıvatalı bağlantı. |
| 6 | Modal analiz | Aynı braketin ilk 6 modu. Doğal frekansları motor ve yol kaynaklı frekanslarla karşılaştır. |
| 7 | Lineer burkulma | Rot başlı süspansiyon çubuğu. Sonucu Euler formülüyle karşılaştır. |
| 8 | Kompozit (ACP): katmanlar, oryantasyon, hasar kriterleri | Sandviç panelde 3 nokta eğme. Bölüm 4.4 ile karşılaştır. |
| 9 | İleri: yorulma, topoloji optimizasyonu, parametrik tarama (optiSLang), PyAnsys ile otomasyon | Bir braketin kalınlık taraması: kütle–gerilme eğrisi. |
| 10 | CFD (Fluent) ayrı hattı | 2B NACA 0012 profili → 3B Ahmed gövdesi (literatürle karşılaştır) → takımın gövdesi. |

**Altın kural:** Her analizin yanına bir el hesabı ve bir "bu sonuç mantıklı mı?" paragrafı yaz.

### 5.4 Ansys Student sınırları ve lisans

- **Ansys Student** ücretsiz (Ansys 2025'te Synopsys bünyesine geçti). 2026 R1 sürümünde sınırlar: yapısal analizde **128 bin düğüm/eleman**, akış analizinde **1 milyon hücre**, en fazla **4 işlemci çekirdeği**.
- Bu sınırlar parça düzeyinde FEA için genelde yeterli. Tam araç dış akışı için dardır: simetri (yarım model) kullan, takımın lisansını sor ya da OpenFOAM'a bak.
- Ansys, SolidWorks, Siemens, Altair ve MathWorks gibi firmaların öğrenci yarış takımlarına yönelik lisans ve sponsorluk programları var. Takımın sponsorluk sorumlusuna sor.

### 5.5 Kod: senin gizli silahın

- **Python:** Parametrik hesap araçları (fren, cıvata, yük transferi), coast-down analizi, enerji ve tur simülasyonu, telemetri verisi analizi. Bu repodaki [`enerji_butcesi.py`](enerji_butcesi.py) ile başla.
- **MATLAB:** Okulda yaygın. Simscape Multibody ile süspansiyon, Simulink ile sistem modelleri.
- **CAD/CAE otomasyonu:** SolidWorks API makroları, CadQuery/build123d (Python ile CAD), PyAnsys (PyMAPDL, PyMechanical, PyFluent).

---

## 6. Dersler: hangisi nerede işine yarar

### 6.1 Ders → takım eşlemesi

| Ders | Takımda karşılığı |
|---|---|
| Statik ve Dinamik | Serbest cisim diyagramı, süspansiyon yükleri, yük transferi. Her hesabın başlangıcı. |
| Mukavemet | Kiriş, burulma, burkulma, bileşik gerilme, Mohr çemberi. Şasi, salıncak, aks. |
| Malzeme Bilimi | Alüminyum, çelik, titanyum, kompozit seçimi; ısıl işlem (T6); kaynakta ITAB. |
| **Makine Elemanları I-II** | Cıvata, rulman, mil, kama, kaynak, yay, dişli, **yorulma**. Göbek, aks, motor bağlantısı. Takımda en sık kullanacağın ders. |
| Akışkanlar Mekaniği | Sürükleme, sınır tabaka, Reynolds. Gövde tasarımı. |
| Termodinamik ve Isı Transferi | Batarya ve motor soğutma, kabin havalandırması, panel sıcaklığı. |
| Mekanizma Tekniği / Makine Dinamiği | Dört çubuk mekanizması, kinematik. Süspansiyon ve direksiyon geometrisi. |
| Titreşim | Doğal frekans, sönüm, rezonans. Modal analiz, sürüş konforu. |
| Sayısal Yöntemler / **Sonlu Elemanlar** | FEA ve CFD'nin teorisi. "Program ne yapıyor?" sorusunun cevabı. |
| Ölçme Tekniği | Gerinim ölçer (strain gauge), sensörler, veri toplama. Test ve doğrulama. |
| İmal Usulleri, Talaşlı İmalat, Kaynak | Üretilebilir tasarım (DFM). |
| Teknik Resim, Bilgisayar Destekli Tasarım | Teknik resim, tolerans, GD&T. |
| Elektrik-Elektronik, Kontrol | Elektrik ekibiyle ortak dil. |
| Mühendislik Ekonomisi, Proje Yönetimi | Bütçe, sponsor, takvim. Girişimcilik için de temel. |

### 6.2 Odak ve seçmeliler

- **3. sınıfta yüklen:** Makine Elemanları, Isı Transferi, Makine Dinamiği/Titreşim, Akışkanlar, Ölçme Tekniği. Bu derslerin ödev ve projelerini mümkünse takım parçası üzerinden yap. Örneğin Makine Elemanları projesinde göbek–rulman–aks tasarımı.
- **Seçmeli önerileri (açılıyorsa):** Sonlu Elemanlar, Hesaplamalı Akışkanlar Dinamiği, Kompozit Malzemeler, Taşıt Dinamiği/Otomotiv, Titreşim, Optimizasyon, Yorulma ve Kırılma, Deney Tasarımı.
- Web aramasında ESTÜ Makine'de "Sonlu Elemanlar Analizine Giriş" dersinin bulunduğunu gördüm. Mutlaka al. Güncel ders ve seçmeli listesini [AKTS sayfasından](https://akts.eskisehir.edu.tr/tr/program/dersler/256/13) kontrol et.

### 6.3 Takım işini akademik ve kariyer kazanımına çevir

- **Bitirme/tasarım projesi:** Kompozit koltuk örneğindeki gibi takımın gerçek bir problemini proje yap. Danışman bul, 3. sınıfın sonunda konuyu netleştir.
- **TÜBİTAK 2209-A** (Üniversite Öğrencileri Araştırma Projeleri) ve **2209-B** (Sanayiye Yönelik Lisans Araştırma Projeleri): Takım parçasını araştırma projesine dönüştürmenin ve bütçe bulmanın yolu.
- **Staj:** Eskişehir'de Ford Otosan Eskişehir fabrikası (ağır ticari araç ve motor), TEI (TUSAŞ Motor Sanayii, havacılık motorları), TÜRASAŞ (raylı sistemler) ve Eskişehir OSB'deki üretim firmaları var. Otomotiv için Kocaeli ve Bursa ekosistemleri de seçenek. Mülakatta en güçlü hikâyen takımda sahiplendiğin parça olacak.

---

## 7. Sayılarla sezgi

### 7.1 Malzemeler (tipik değerler; tasarımda tedarikçinin veri sayfasını kullan)

| Malzeme | Yoğunluk (g/cm³) | E (GPa) | Dayanım (MPa, tipik) | E/ρ |
|---|---:|---:|---|---:|
| Çelik (4130 normalize) | 7,85 | ~200 | akma ~435 | ~25 |
| Al 6061-T6 | 2,70 | ~69 | akma ~275 | ~26 |
| Al 7075-T6 | 2,81 | ~72 | akma ~500 | ~26 |
| Ti-6Al-4V | 4,43 | ~114 | akma ~880 | ~26 |
| Karbon/epoksi UD (0° yönünde) | ~1,58 | ~135 | çekme ~1.500 (basma daha düşük) | ~85 |
| Karbon/epoksi yarı-izotropik | ~1,58 | ~50 | çekme ~500–600 | ~32 |
| Cam/epoksi dokuma | ~1,9 | ~22 | çekme ~300–400 | ~12 |

**Ders:** Çelik, alüminyum ve titanyumun özgül rijitliği (E/ρ) neredeyse aynı (~25). "Alüminyum çelikten hafiftir" doğru ama aynı rijitlik için yaklaşık aynı kütle gerekir. Kazanç geometriden gelir: kesit şekli, sandviç yapı ve yükü taşıyacak yöne çevrilmiş lif. Yarı-izotropik karbon plaka bile özgül rijitlikte alüminyumdan "sadece" %20–25 iyidir. Karbonun büyük farkı lif yönlendirme ve sandviçle ortaya çıkar.

### 7.2 Tipik büyüklükler (mertebe hissi için)

| Büyüklük | Tipik değer |
|---|---|
| Hava yoğunluğu | ~1,2 kg/m³ (20 °C, deniz seviyesi) |
| Havanın dinamik viskozitesi | ~1,8×10⁻⁵ Pa·s |
| Binek otomobil CdA | ~0,6–0,7 m² |
| İyi bir güneş arabası (Challenger) CdA | ~0,06–0,10 m² |
| Otomobil lastiği Crr | ~0,010–0,015 |
| Yol bisikleti lastiği Crr | ~0,003–0,008 (yüzeye ve basınca göre) |
| Güneş arabası lastikleri Crr | ~0,002–0,004 (düzgün asfalt) |
| Göbek motoru verimi | ~%90–98 (tasarıma ve çalışma noktasına göre) |
| Zincir aktarma verimi | ~%95–98 (hizalı ve yağlı) |
| Açık gökte öğle güneşi | ~1.000 W/m² |
| Yarış sınıfı silisyum hücre verimi | ~%22–25 |

---

## 8. Terimler sözlüğü

Takımlarda Türkçe ile İngilizce iç içe konuşulur. Her iki karşılığı bil.

### 8.1 Araç ve enerji

| Terim | Türkçesi | Kısaca |
|---|---|---|
| Road load | Yol yükü | Aracı sabit hızda götürmek için yenilmesi gereken toplam direnç |
| CdA / drag area | Sürükleme alanı | Cd × ön kesit alanı; aerodinamik kaybın tek sayılık özeti |
| Crr | Yuvarlanma direnci katsayısı | Lastik deformasyon kaybı / normal kuvvet |
| Coast-down test | Serbest yavaşlama testi | CdA ve Crr'yi ölçmenin yolu |
| Spin-down test | Serbest dönüş testi | Tekerlek sürtünmesini karşılaştırmanın basit yolu |
| Energy budget | Enerji bütçesi | Yarış boyunca harcanacak Wh planı |
| Mass budget | Kütle bütçesi | Alt sistem başına kütle hedefleri ve takibi |
| Efficiency chain | Verim zinciri | Batarya → sürücü → motor → aktarma → teker; çarpımsal |
| Parasitic losses | Parazitik kayıplar | Balata, rulman, hizalama gibi "görünmez" kayıplar |
| CoG | Ağırlık merkezi | Yüksekliği devrilme ve yük transferini belirler |
| Wheelbase / track | Dingil mesafesi / iz genişliği | Ön-arka ve sağ-sol tekerlek mesafeleri |
| Ground clearance | Yerden yükseklik | Alt gövde ile yol arası mesafe |
| Weight transfer | Yük transferi | Frenleme ve virajda tekerlek yüklerinin değişmesi |
| Sprung / unsprung mass | Yaylı / yaysız kütle | Süspansiyonun üstündeki / altındaki kütle |
| Static stability factor | Statik stabilite faktörü | t / (2h); devrilme eşiği göstergesi |
| Speed profile | Hız profili | Tur boyunca hedeflenen hız; strateji ekibinin işi |

### 8.2 Yapı ve malzeme

| Terim | Türkçesi | Kısaca |
|---|---|---|
| Monocoque | Monokok | Gövdenin kendisinin taşıyıcı olduğu yapı |
| Space frame | Boru kafes şasi | Kaynaklı veya yapıştırılmış borulardan çerçeve |
| Hardpoint | Bağlantı noktası | Süspansiyon, motor vb. elemanların şasiye bağlandığı sabit nokta |
| Load case | Yük durumu | Tasarımın dayanması gereken senaryo (tümsek, fren, viraj…) |
| Load path | Yük yolu | Kuvvetin yapı içinde izlediği yol |
| Torsional stiffness | Burulma rijitliği | N·m/°; şasinin burulmaya direnci |
| Safety factor / margin | Emniyet katsayısı / payı | Dayanım / beklenen gerilme; belirsizliğe karşı pay |
| Yield / UTS | Akma / çekme dayanımı | Kalıcı şekil değiştirmenin / kopmanın başladığı gerilme |
| Young's modulus (E) | Elastisite modülü | Rijitliğin malzeme bileşeni |
| von Mises stress | Von Mises eşdeğer gerilmesi | Sünek metallerde akma kontrolü için tek sayı |
| Principal stress | Asal gerilme | Kayma olmayan yönlerdeki normal gerilmeler |
| Stress concentration (Kt) | Gerilme yığılması | Delik ve köşede gerilmenin katlanması |
| Fatigue / S-N curve | Yorulma / S-N eğrisi | Tekrarlı yükte düşük gerilmede bile kırılma |
| Endurance limit | Sürekli mukavemet sınırı | Çelikte "sonsuz ömür" gerilmesi; alüminyumda yoktur |
| Buckling | Burkulma | Basınç altında ince elemanın aniden yanal çökmesi |
| Deflection | Sehim / çökme | Yük altındaki yer değiştirme |
| Natural frequency | Doğal frekans | Yapının kendiliğinden titreştiği frekans |
| Preload | Ön yük | Cıvatanın sıkınca oluşturduğu eksenel kuvvet |
| Torque spec | Sıkma torku değeri | Cıvata için belirlenen tork |
| Thread locker / nyloc | Vida sabitleyici / fiberli somun | Titreşimle gevşemeye karşı önlemler |
| Safety wire | Emniyet teli | Kritik cıvataların dönmesini engelleyen tel |
| HAZ | ITAB (ısı tesiri altındaki bölge) | Kaynak çevresinde özellikleri değişen bölge; T6 alüminyum burada zayıflar |
| T6 | T6 ısıl işlemi | Çözeltiye alma + yapay yaşlandırma (6061-T6, 7075-T6) |
| Galvanic corrosion | Galvanik korozyon | Farklı iletken malzemelerin temasında korozyon (karbon–alüminyum!) |
| CTE | Isıl genleşme katsayısı | Sıcaklıkla boy değişimi; farklı malzemeler arası uyumsuzluk |

### 8.3 Kompozit

| Terim | Türkçesi | Kısaca |
|---|---|---|
| Prepreg | Ön emdirilmiş kumaş | Reçinesi fabrikada emdirilmiş, soğukta saklanan elyaf |
| Wet layup | El yatırma | Kumaşa reçinenin elle sürülmesi |
| Vacuum bagging | Vakum torbalama | Laminatı atmosfer basıncıyla sıkıştırma |
| Infusion | İnfüzyon | Kuru kumaşa reçinenin vakumla çekilmesi |
| Autoclave / OOA | Otoklav / otoklav dışı | Basınçlı fırında kür / fırın veya oda sıcaklığında kür |
| Ply / layup schedule | Katman / katman dizilim planı | Hangi katman, hangi yön, hangi sıra |
| UD | Tek yönlü elyaf | Tüm lifler aynı yönde; o yönde çok güçlü |
| Twill / plain weave | Dimi / bezayağı dokuma | Dokuma tipleri; dimi kalıba daha iyi oturur |
| 3K / 12K | Demet lif sayısı | Bir demette 3.000 / 12.000 lif |
| Areal weight | Gramaj | g/m² |
| Quasi-isotropic | Yarı-izotropik | Düzlem içinde her yönde benzer davranış |
| Symmetric & balanced | Simetrik ve dengeli | Çarpılmayı önleyen dizilim kuralı |
| Sandwich / core | Sandviç / çekirdek | İki yüz arasında hafif çekirdek |
| Honeycomb | Bal peteği | Nomex veya alüminyum çekirdek |
| Insert / potting | Gömülü bağlantı / dolgu | Sandviçe cıvata bağlamak için gömülen parça ve reçine dolgusu |
| Doubler | Yerel takviye | Yük giren bölgeye eklenen ek katlar |
| Fiber volume fraction (Vf) | Lif hacim oranı | Laminattaki lif oranı; kalite göstergesi |
| Pot life | Kullanım süresi | Karışımın jelleşmeden çalışılabileceği süre |
| Cure / post-cure | Kür / son kür | Reçinenin sertleşmesi / özellik artırıcı ek ısıl işlem |
| Tg | Camsı geçiş sıcaklığı | Reçinenin yumuşamaya başladığı sıcaklık |
| Release agent | Kalıp ayırıcı | Parçanın kalıba yapışmasını önler |
| Peel ply | Soyma kumaşı | Kür sonrası soyulur, yapıştırmaya hazır yüzey bırakır |
| Breather / bleeder | Nefes kumaşı | Vakumu dağıtır, fazla reçineyi emer |
| Flow media | Akış filesi | İnfüzyonda reçinenin yayılmasını hızlandırır |
| Sealant tape | Sızdırmazlık bandı | Torbayı kalıba yapıştıran bant |
| Plug / mold | Model / kalıp | Kalıbın alındığı ana model / parçanın üretildiği kalıp |
| Delamination | Katman ayrılması | Katmanlar arası bağın kopması |
| Void / dry spot | Boşluk / kuru bölge | Üretim kusurları |
| Tap test | Tıklama testi | Madeni parayla vurup boş sesi aramak |
| CLT / ABD matrix | Klasik laminat teorisi | Laminatın rijitliğini hesaplama yöntemi |
| Tsai-Wu / Hashin | Hasar kriterleri | Kompozitin ne zaman hasarlanacağını tahmin eder |
| First ply failure | İlk katman hasarı | İlk katmanın hasarlandığı yük |

### 8.4 Aerodinamik ve CFD

| Terim | Türkçesi | Kısaca |
|---|---|---|
| Cd | Sürükleme katsayısı | Biçimin "kaygan"lığı |
| Frontal area | Ön kesit alanı | Aracın önden izdüşüm alanı |
| Reynolds number | Reynolds sayısı | Atalet / viskoz kuvvet oranı: ρ·v·L/μ |
| Boundary layer | Sınır tabaka | Yüzeye yakın, hızın sıfırdan yükseldiği ince bölge |
| Laminar / turbulent | Laminer / türbülanslı | Düzenli / karışık akış; laminerde sürtünme düşük |
| Transition | Geçiş | Laminerden türbülansa dönüşüm |
| Separation | Akış ayrılması | Akışın yüzeyden kopması; basınç sürüklemesinin kaynağı |
| Wake | İz bölgesi | Aracın arkasındaki düşük basınçlı, karışık bölge |
| Pressure / skin friction drag | Basınç / yüzey sürtünme sürüklemesi | Sürüklemenin iki ana bileşeni |
| Lift / downforce | Kaldırma / bastırma | Dikey aerodinamik kuvvet |
| Yaw / crosswind | Sapma açısı / yan rüzgâr | Akışın araca açılı gelmesi |
| Center of pressure | Basınç merkezi | Aerodinamik kuvvetin etki noktası |
| Cp | Basınç katsayısı | Yüzeydeki basınç dağılımı |
| Fairing / wheel spat | Kaporta / tekerlek kapağı | Akışı düzgünleştiren kaplamalar |
| NACA duct | NACA hava girişi | Düşük sürüklemeli gömme hava girişi |
| Domain | Akış hacmi | CFD'de aracın etrafındaki hesap bölgesi |
| Inflation / prism layers | Sınır tabaka ağ katmanları | Duvara yakın ince, katmanlı ağ |
| y+ | Boyutsuz duvar mesafesi | İlk hücrenin duvara uzaklığı; modele uygun olmalı |
| RANS, k-ω SST | Türbülans modelleri | Otomotiv dış akışında yaygın yaklaşım |
| Residuals | Artıklar | Çözümün yakınsama göstergesi (tek başına yetmez) |
| Mesh independence | Ağ bağımsızlığı | Ağ inceldikçe sonucun değişmemesi |
| Tuft test | Yün ipi testi | Gerçek araçta akış görselleştirme |
| Ahmed body | Ahmed gövdesi | Otomotiv CFD'sinin klasik doğrulama geometrisi |

### 8.5 Süspansiyon, direksiyon, fren, tekerlek

| Terim | Türkçesi | Kısaca |
|---|---|---|
| Double wishbone / A-arm | Çift salıncak / A kolu | Tekerleği iki kolla taşıyan süspansiyon |
| Upright / knuckle | Porya | Tekerlek göbeğini taşıyan, salıncaklara bağlanan parça |
| Ball joint | Rotil | Küresel mafsal |
| Rod end / heim joint | Rot başı | Dişli gövdeli küresel mafsal |
| Tie rod | Rot | Direksiyonu porya'ya bağlayan çubuk |
| Rack and pinion | Kremayer-pinyon | Dönmeyi doğrusal harekete çeviren direksiyon dişlisi |
| Bellcrank | Dirsekli kol | Hareketin yönünü ve oranını değiştiren kol |
| Camber | Kamber | Tekerleğin önden bakışta içe/dışa eğimi |
| Caster | Kaster | Pivot ekseninin yandan bakışta eğimi; düz gitme eğilimi |
| Toe-in / toe-out | Toplama / açma | Tekerleklerin üstten bakışta birbirine göre açısı |
| KPI | Pivot eğimi | Pivot ekseninin önden bakışta eğimi |
| Scrub radius | Ofset | Önden bakışta pivot ekseninin yeri kestiği nokta ile lastik temas yüzeyi merkezi arası |
| Mechanical trail | Mekanik iz | Kasterin yarattığı geri toplayıcı moment kolu |
| Ackermann | Ackermann geometrisi | İç tekerleğin daha çok dönmesi |
| Bump steer | Tümsek yönlendirmesi | Süspansiyon çalışırken istenmeyen toe değişimi |
| Roll center | Yuvarlanma merkezi | Gövdenin virajda etrafında döndüğü sanal nokta |
| Instant center | Ani dönme merkezi | Salıncak hatlarının kesiştiği sanal nokta |
| Camber gain | Kamber kazancı | Süspansiyon çalışırken kamberin değişimi |
| Anti-dive / anti-squat | Dalış / çömelme önleme | Frenleme/hızlanmada gövde hareketini azaltan geometri |
| Motion ratio | Hareket oranı | Yay hareketi / tekerlek hareketi |
| Wheel rate / spring rate | Tekerlek / yay rijitliği | Tekerlekte hissedilen / yayın kendi katsayısı |
| Damper (bump / rebound) | Amortisör (basma / açılma) | Salınımı sönümleyen eleman |
| Slip angle | Kayma açısı | Lastiğin baktığı yön ile gittiği yön arasındaki açı |
| Contact patch | Temas yüzeyi | Lastiğin yola değen alanı |
| Tire scrub | Lastik sürtmesi | Hizasızlık yüzünden lastiğin yana sürtünmesi |
| Master cylinder | Ana merkez | Pedal kuvvetini hidrolik basınca çevirir |
| Caliper / pad / disc | Kaliper / balata / disk | Fren elemanları |
| Disc runout | Disk salgısı | Diskin dönerken yanal oynaması |
| Brake bias | Fren dağılımı | Ön/arka fren kuvveti oranı |
| Bleeding | Hava alma | Hidrolik hattaki havayı çıkarma |
| Residual drag | Kalıcı balata sürtünmesi | Fren bırakıldığında süren sürtünme |
| Hub / bearing | Göbek / rulman | Tekerleği taşıyan ve döndüren elemanlar |
| Bearing preload | Rulman ön yükü | Boşluğu almak için verilen eksenel yük |
| L10 life | L10 ömrü | Rulmanların %90'ının ulaştığı ömür |
| Hub motor | Göbek motoru | Tekerleğin içindeki doğrudan tahrikli motor |
| Sprocket / tensioner | Zincir dişlisi / gergi | Zincirli aktarma elemanları |
| Gear ratio | Aktarma oranı | Motor devri / tekerlek devri |

### 8.6 Üretim

| Terim | Türkçesi | Kısaca |
|---|---|---|
| CNC milling / turning | CNC freze / torna | Talaşlı imalat tezgâhları |
| CAM | Bilgisayar destekli üretim | CAD'den takım yolu çıkarma |
| Fixture / jig | Fikstür / bağlama aparatı | Parçayı üretim veya kaynakta konumlayan düzenek |
| Tolerance / fit | Tolerans / geçme | İzin verilen ölçü sapması / iki parçanın oturma tipi |
| GD&T, datum | Geometrik toleranslandırma, referans | Biçim ve konum toleransları dili |
| Surface roughness (Ra) | Yüzey pürüzlülüğü | Yüzey kalitesi ölçütü |
| DFM / DFA | Üretim / montaj için tasarım | Yapılabilir ve takılabilir tasarım |
| Tool access | Takım erişimi | Anahtarın cıvataya ulaşabilmesi |
| Waterjet / laser | Su jeti / lazer kesim | Plaka kesim yöntemleri |
| TIG welding | TIG kaynağı | İnce cidarlı boru kaynağında yaygın |
| FDM / SLA / SLS | 3B baskı yöntemleri | Prototip, aparat, kanal, kalıp |
| BOM | Malzeme listesi | Parça, adet, malzeme, tedarik bilgisi |
| Revision / ECO | Revizyon / değişiklik talebi | Donmuş tasarımı kayıtlı değiştirme |
| Torque stripe | Tork işareti | Sıkılan cıvatayı boyayla işaretleme; gevşerse görünür |

### 8.7 FEA ve analiz

| Terim | Türkçesi | Kısaca |
|---|---|---|
| Mesh | Ağ | Geometrinin elemanlara bölünmesi |
| Tet / hex, shell / solid / beam | Eleman tipleri | Geometriye ve amaca göre seçilir |
| Element order | Eleman derecesi | 1. derece hızlı, 2. derece daha doğru |
| Skewness / orthogonal quality | Ağ kalite ölçütleri | Bozuk elemanları yakalar |
| Convergence | Yakınsama | Ağ inceldikçe sonucun oturması |
| Boundary condition | Sınır koşulu | Modelin nasıl tutulduğu ve yüklendiği |
| Fixed support | Ankastre | Tüm serbestlikleri kilitler; çoğu zaman gerçekçi değildir |
| Remote displacement / force | Uzak yer değiştirme / kuvvet | Bağlantıyı daha gerçekçi modeller |
| Contact (bonded / frictional) | Temas (yapışık / sürtünmeli) | Parçaların birbirine nasıl dokunduğu |
| Singularity | Tekillik | Ağ inceldikçe sonsuza giden sahte gerilme |
| Modal / buckling analysis | Modal / burkulma analizi | Doğal frekanslar / kritik burkulma yükü |
| Topology optimization | Topoloji optimizasyonu | Malzemenin gerekli yerde kalmasını sağlayan yöntem |
| Sub-modeling | Alt modelleme | Kritik bölgenin ayrıca ince ağla çözülmesi |
| Symmetry | Simetri | Modeli yarıya indirip hesap süresini düşürme |
| Hand calc / sanity check | El hesabı / sağlama | Sonucun mertebesini kontrol etme |

### 8.8 Proje ve takım

| Terim | Türkçesi | Kısaca |
|---|---|---|
| Requirements matrix | Gereksinim matrisi | Tüm şartların ve doğrulama yöntemlerinin tablosu |
| Trade study | Ödünleşim çalışması | Alternatiflerin ölçütlere göre karşılaştırılması |
| Pugh / decision matrix | Karar matrisi | Puanlama tablosu |
| Design review, PDR / CDR | Tasarım incelemesi, ön / kritik | Tasarımın ekip önünde sorgulanması |
| Design freeze | Tasarım dondurma | Sonrasında değişiklik ancak kayıtlı talep ile |
| FMEA | HTEA (hata türleri ve etkileri analizi) | Neyin nasıl bozulabileceğinin sistematik listesi |
| DVP&R | Tasarım doğrulama planı ve raporu | Hangi şart hangi testle doğrulanacak |
| ICD | Arayüz kontrol dokümanı | Ekipler arası ölçü, bağlantı, konnektör anlaşması |
| Packaging | Yerleşim | Parçaların araç içine sığdırılması |
| Clearance / interference | Boşluk / çakışma | Parçalar arası mesafe / iç içe geçme |
| Envelope | Hacim zarfı | Bir parçaya ayrılan hacim |
| Single point of failure | Tek hata noktası | Tek başına bozulursa sistemi durduran eleman |
| Redundancy | Yedeklilik | Aynı işi yapan ikinci sistem |
| Root cause / 5 Whys | Kök neden / 5 Neden | Sorunun asıl kaynağına inme yöntemi |
| Lessons learned | Çıkarılan dersler | Gelecek ekip için kayıt |
| Scrutineering | Teknik kontrol | Yarış öncesi araç muayenesi |
| Bus factor | Otobüs faktörü | Bilgi tek kişideyse o kişi yokken iş durur |
| Definition of done | Bitti tanımı | Bir işin "bitti" sayılması için gerekenler |

### 8.9 Elektrik ekibiyle ortak dil

| Terim | Türkçesi | Kısaca |
|---|---|---|
| BMS | Batarya yönetim sistemi | Hücre gerilimi, sıcaklık, akım izleme ve koruma |
| Cell / module / pack | Hücre / modül / paket | Bataryanın hiyerarşisi |
| Series / parallel (ör. 20S4P) | Seri / paralel | 20 seri, 4 paralel hücre |
| SoC | Şarj durumu | Bataryada kalan enerji yüzdesi |
| Wh vs Ah | Enerji vs yük | Wh = Ah × gerilim |
| C-rate | C oranı | Akımın kapasiteye oranı |
| Thermal runaway | Termal kaçak | Hücrenin kontrolsüz ısınması; kutu tasarımında kritik |
| Motor driver / controller | Motor sürücü | Bataryadan motora gücü kontrol eden elektronik |
| BLDC / PMSM | Fırçasız DC / sabit mıknatıslı senkron motor | Yaygın motor tipleri |
| Regen | Rejeneratif frenleme | Motorun jeneratör olarak çalışıp enerji geri kazanması |
| VCU | Araç kontrol ünitesi | Aracın ana kontrol bilgisayarı |
| CAN bus | CAN hattı | Araç içi haberleşme ağı |
| Telemetry | Telemetri | Araç verisinin anlık olarak pite aktarılması |
| Harness | Kablo demeti | Kablo güzergâhı mekanik tasarımı etkiler |
| IP rating | IP koruma sınıfı | Toz ve suya karşı koruma derecesi |
| E-stop | Acil durdurma | Konumu ve erişimi şartnameyle belirlenir |
| MPPT | Maksimum güç noktası takibi | Güneş panelinden en çok gücü çeken elektronik |

---

## 9. Toplantı dili: duyacağın cümleler ne demek

| Duyduğun cümle | Aslında ne demek, sen ne yapmalısın |
|---|---|
| "Hardpoint'ler dondu." | Süspansiyon ve direksiyon bağlantı koordinatları kesinleşti; şasi ve kalıp bunlara göre üretilecek. Artık "şu deliği 5 mm kaydıralım" demek pahalı. |
| "Packaging sıkıntılı, direksiyon miliyle interference var." | Yerleşimde çakışma var. CAD montajında çakışma analizi yap, parçaları yeniden yerleştir. |
| "SF 1,2'de kalmış." | Emniyet katsayısı düşük. Kesiti veya malzemeyi değiştir ya da yük kabulünü sorgula. |
| "O kırmızı nokta singularity, ona bakma." | Keskin köşe, nokta yük veya ankastre kenar yüzünden oluşan sahte gerilme. Bölgeden uzakta değerlendir ya da geometriye radius ver. |
| "Convergence gösterdin mi?" | Ağı inceltince sonuç değişmiyor mu? En az 3 ağ ile göster. |
| "BC'ler fazla rijit." | Sınır koşulları gerçekte olmayan bir tutulma yaratıyor. Gerçek bağlantıyı modelle. |
| "Layup schedule'ı çıkar." | Hangi bölgede kaç katman, hangi kumaş, hangi yön, hangi sıra; tablo veya çizim olarak yaz. |
| "Bu parça DFM'den geçmez." | Atölyedeki tezgâh ve takımlarla üretilemez ya da çok pahalı. Geometriyi üretime göre sadeleştir. |
| "Takım erişimi yok." | Cıvatayı sıkacak anahtar oraya girmiyor. Montaj düşünülmeden tasarlanmış. |
| "Freeze'i geçtik, ECO aç." | Tasarım donduruldu. Değişiklik ancak kayıtlı bir talep ve etki değerlendirmesiyle yapılır. |
| "Mass budget'ı 2 kg aştık." | Kütle hedefleri aşıldı. Nereden hafifletileceğine karar verilecek; kendi parçanın kütlesini bil. |
| "Balata sürtüyor, spin-down kötü." | Fren serbest değil, tekerlek çabuk duruyor, yani sürekli enerji kaybı var. Kaliper hizası ve disk salgısını kontrol et. |
| "Toe kaçmış, lastik scrub yapıyor." | Tekerlekler paralel değil, lastik yana sürtünüyor. Hizalamayı ölç ve ayarla. |
| "Teknik kontrolde takılırız." | Şartnamenin bir maddesine uymuyoruz. Madde numarasını bul, uyumu kanıtla ya da düzelt. |
| "Bu single point of failure." | Tek başına bozulursa aracı durduracak eleman. Yedekle ya da emniyet payını artır. |
| "Torkları yazıp stripe atalım." | Her cıvatanın tork değerini dokümana yaz, sıktıktan sonra boyayla işaretle. |
| "ICD'yi güncelleyelim." | Elektrik ekibiyle bağlantı noktası, ölçü ve konnektör anlaşmasını yazılı hale getir. |
| "Trade study ile karar verelim." | Alternatifleri kütle, maliyet, üretim süresi, risk ve verim ölçütleriyle puanla. |
| "Önce el hesabı." | FEA'ya girmeden basit kiriş, burulma ve denge hesabıyla beklenen mertebeyi bul. |
| "Pot life'ı kaçırdık, reçine jelleşti." | Karışımın kullanım süresi aşıldı. Planlamayı ve karışım miktarını değiştir. |
| "Torba kaçırıyor." | Vakum kaçağı var. Sızdırmazlık bandını ve torba katlarını kontrol et, vakum düşüş testi yap. |
| "Coast-down'dan CdA ve Crr fit edelim." | Serbest yavaşlama verisine eğri uydurarak iki katsayıyı ayrı ayrı çıkar. |
| "Galvanik riski var, araya cam koy." | Karbon–alüminyum temasını cam elyaf katmanıyla kes. |
| "CoG'yi aşağı alalım." | Ağırlık merkezini alçalt: devrilme eşiği ve stabilite artar. Bataryayı alçağa yerleştir. |
| "Lessons learned'e yaz." | Bu hatayı gelecek yılın ekibi tekrarlamasın diye kayda geçir. |

---

## 10. Takımda verimli olmak

### 10.1 İlk 2 hafta kontrol listesi

- [ ] Güncel şartnameyi baştan sona oku (özellikle teknik kurallar, teknik kontrol ve güvenlik)
- [ ] Önceki araçların (Phantom, Asena) CAD'ini, TTR'sini ve varsa "lessons learned" notlarını incele
- [ ] Atölyede aracın etrafında dolaş ve her parça için "neden böyle tasarlanmış?" diye sor
- [ ] İş güvenliği brifingini al: epoksi, karbon tozu, CNC, kaynak, kaldırma
- [ ] Takımın dosya ve isimlendirme düzenini, versiyon kuralını öğren
- [ ] Kütle bütçesi ve enerji bütçesi tablolarını bul; yoksa kurmayı teklif et
- [ ] Bir kıdemli üyeyi mentör edin
- [ ] Küçük ama gerçek bir parçayı sahiplen (braket, pedal kutusu parçası, ayna bağlantısı…)

### 10.2 "Bitti" tanımı: parça teslim paketi

Bir parça ancak şunlar tamamsa bitmiştir:

- [ ] Gereksinimler: yükler, ölçüler, arayüzler, şartname maddeleri
- [ ] İsimlendirme kuralına uygun, kütle özellikleri doğru CAD
- [ ] El hesabı: yük durumları, formüller, varsayımlar
- [ ] FEA raporu: sınır koşulları, ağ, yakınsama, sonuç, emniyet katsayısı
- [ ] Teknik resim: malzeme, tolerans, adet, yüzey işlemi
- [ ] Üretim notları ve montaj talimatı (tork değerleri dahil)
- [ ] Gerçek kütle (tartım) ve test sonucu
- [ ] Karar günlüğü: neden bu çözüm, hangi alternatifler elendi

### 10.3 Tasarım incelemesine (design review) nasıl girilir

Kısa ve sayılarla:

1. Problem ve gereksinimler (şartname maddeleri dahil)
2. Değerlendirilen alternatifler ve karar matrisi
3. Seçilen tasarım (CAD görselleri, kütle)
4. Hesaplar: el hesabı + FEA (sınır koşulları, ağ, yakınsama, emniyet katsayısı)
5. Üretim yöntemi, maliyet, süre
6. Riskler ve açık sorular: ekipten ne istiyorsun?

### 10.4 Haftalık durum mesajı şablonu

```
[Parça/alt sistem] — Hafta 12
Yaptım:    Porya v3 FEA; 3 ağ ile yakınsama tamam, SF = 1,9 (hedef ≥ 1,5)
Sayılar:   Kütle 412 g (hedef 450 g), maks. gerilme 265 MPa (7075-T6, akma ~500 MPa)
Engel:     Rulman yuvası toleransı için tezgâh bilgisine ihtiyacım var
İhtiyaç:   Atölye sorumlusuyla 15 dk
Gelecek:   Teknik resim + CNC programı
```

### 10.5 Dosya düzeni ve karar günlüğü

- **İsimlendirme örneği:** `<ARAÇ>-<ALTSİSTEM>-<KONUM>-<PARÇA>-<NO>_R<REV>` → `A27-SUS-FL-PORYA-001_R03`. Takımın kuralı varsa ona uy; yoksa önermek iyi bir katkıdır.
- **Karar günlüğü:** Tarih, karar, alternatifler, gerekçe, kim. Öğrenci takımlarının en büyük kaybı, mezun olan kişiyle birlikte giden "neden" bilgisidir.

### 10.6 Atölye ve güvenlik

- Kişisel koruyucu donanım: gözlük, eldiven, maske. Tezgâhta bol kıyafet ve takı olmaz.
- Epoksi ve karbon tozu (Bölüm 3.2). Solvent ve reçine atıklarını kurala göre at.
- Tezgâhı eğitim almadan kullanma. Kaldırma ve aracı sehpaya alma prosedürlerini öğren.
- Atölyeyi bulduğundan temiz bırak: 5S (ayıkla, düzenle, temizle, standartlaştır, sürdür).

### 10.7 Okul, takım ve girişim dengesi

- Haftalık öneri: takım işine 6–10 saat, planlı öğrenmeye (ANSYS, CAD, teori) 3 saat. Bunun 1 saatini "yapay zekâ + mekanik" projelerine ayır.
- Sınav haftalarını takım takvimine baştan yaz ve teslimleri buna göre planla.
- Aynı saati iki kez kullan: ders projesini takım parçasıyla, takım parçasını bitirme projesi ve 2209 ile birleştir.
- Uygulama projen devam ediyor. Takımda "her şeyi yaparım" yerine net bir parça ve teslim tarihi üstlen. Güvenilirlik, üstlenilen iş miktarından daha değerlidir.

### 10.8 İletişim

- **İyi soru şablonu:** "Şunu yapmaya çalışıyorum → şunu denedim → şu sonucu aldım → şurada takıldım → şunu düşünüyorum."
- **"Bilmiyorum, öğrenip dönerim"** güçlü bir cümledir. Uydurmak takımda güveni en hızlı bitiren şeydir.
- Elektrik ekibiyle arayüzleri haftalık kontrol et. Mekanik–elektrik sınırında kaybolan işler en çok gecikmeye yol açar.

### 10.9 Liderliğe giden yol

Üye → parça sahibi → alt sistem sorumlusu → mekanik lider. Bu basamakları çıkaranlar genelde şunlardır:

1. Söz verdiği tarihte teslim eden.
2. Doküman bırakan.
3. Başkasına öğreten.
4. Sorunu çözüm önerisiyle getiren.

---

## 11. Sık yapılan hatalar

| Hata | Neden kötü | Çözüm |
|---|---|---|
| FEA'nın renkli resmine inanmak | Yanlış sınır koşulu veya ağ ile sonuç tamamen yanlış olabilir | El hesabı + yakınsama + sınır koşulu sorgusu |
| Tekilliği gerçek gerilme sanmak | Gereksiz kalınlaştırma veya yanlış alarm | Radius ver, bölgeden uzakta değerlendir, alt modelleme yap |
| Üretilemeyen veya monte edilemeyen parça | Zaman ve malzeme kaybı | DFM/DFA, atölyeye erken danışma, takım erişimi kontrolü |
| Toleransları unutmak | Parçalar oturmaz, rulman boşluk yapar | Tolerans zinciri hesabı, geçme seçimi |
| Servis edilebilirliği düşünmemek | Yarışta 5 dakikalık iş 1 saat sürer | "Lastik veya batarya nasıl değişir?" sorusunu tasarımda sor |
| Son dakika tasarım değişikliği | Zincirleme gecikme ve hata | Tasarım dondurma + değişiklik talebi |
| Şartnameyi okumamak | Teknik kontrolde elenme | Gereksinim matrisi (Bölüm 1.4) |
| Geç test etmek | Sorunlar yarış haftasında çıkar | Erken prototip, parça testleri, test planı |
| Aşırı mühendislik | Gereksiz kütle, yani Watt | Yük durumlarını netleştir, emniyet katsayısını gerekçelendir |
| Kütle takibi yapmamak | Araç hedefin kilolarca üstünde çıkar | Kütle bütçesi, her parçayı tart |
| Dokümansızlık | Mezun olanla bilgi gider | Karar günlüğü, parça teslim paketi |
| Karbon–alüminyum doğrudan temas | Galvanik korozyon | Cam elyaf katı, yalıtım |
| Kompozitte deliği ihmal etmek | Gerilme yığılması, insert sökülmesi | Yerel takviye, insert, çekme testi |
| Cıvatayı "elle sıkı" bırakmak | Titreşimle gevşeme | Tork değeri, sabitleyici, tork işareti |
| Balata ve hizalamayı kontrol etmemek | Görünmez sürekli enerji kaybı | Spin-down testi, hizalama ölçümü |
| Bilgiyi tek kişide tutmak | O kişi yokken iş durur | Eşli çalışma, doküman, kısa sunumlar |

---

## 12. Yapay zekâ + mekanik: iki dünyanı birleştirmek

Makine mühendisliğini bırakmama kararın doğru. Yapay zekâ araçları hızla değişiyor ama fizik değişmiyor. Donanım dünyasında yapay zekâdan en çok değer üretecek kişiler, fiziği bilip yazılımı da kullanabilen mühendisler.

### 12.1 Nerede büyük kaldıraç sağlar

| İş | Yapay zekâ ile | Dikkat |
|---|---|---|
| Hesap araçları (fren, cıvata, yük transferi) | Claude Code ile parametrik Python araçları ve birim testleri | Formülleri kitapla karşılaştır, birimleri test et |
| Şartname → gereksinim matrisi | PDF'ten madde madde tablo taslağı | Her satırı orijinal metinle kendin doğrula |
| Test verisi (coast-down, telemetri) | pandas, eğri uydurma, grafikler | Ham veriyi sakla, filtrelemenin etkisini göster |
| FEA/CFD kurulum kontrolü | Kurulumunu anlatıp eleştiri iste | Model göremez; sayılarla ve ekran görüntüleriyle anlat |
| Simülasyon otomasyonu | PyAnsys, Workbench parametreleri, optiSLang | Önce elle bir kez doğru kur |
| CAD otomasyonu | SolidWorks API makroları, tasarım tabloları, CadQuery | Takımın dosya düzenine uy |
| TTR ve rapor yazımı | Yapı, dil, tutarlılık kontrolü | Teknik içerik ve sayılar senden gelmeli |
| Öğrenme | Konu anlatımı, soru-cevap, Feynman tekniği | Kavramı kitaptan da oku |

### 12.2 Kırmızı çizgiler

- **Güvenlik-kritik hesaplar** (fren, direksiyon, roll bar, emniyet kemeri bağlantıları): Yapay zekâ çıktısı hiçbir zaman nihai değildir. El hesabı, kaynak kitap ve kıdemli üye veya danışman onayı şart.
- **Uydurma veri:** Yapay zekâ malzeme değerini, standart numarasını ya da formülü uydurabilir. Değeri her zaman veri sayfasından ve standarttan doğrula.
- **Gizlilik:** Takımın CAD'ini, sponsor bilgilerini ve yayımlanmamış tasarımları izin almadan harici araçlara yükleme.
- **Sorumluluk:** Yapay zekâ işi hızlandırır ama imza senindir.

### 12.3 Kendi kurulumuna bir "mekanik mentor" ajanı

Claude Code kurulumunda zaten ajanların var. Aşağıdaki tanımı `.claude/agents/mekanik-mentor.md` olarak kaydedip kendi ihtiyacına göre düzenleyebilirsin:

```markdown
---
name: mekanik-mentor
description: Verimlilik aracı / güneş arabası mekanik tasarım mentoru. El hesabı kontrolü, FEA/CFD kurulum incelemesi, şartname uyumu ve tasarım incelemesi hazırlığı için kullan.
tools: Read, Grep, Glob, Bash, WebSearch
---

Sen öğrenci güneş arabası ve verimlilik yarışı takımlarında yıllarca çalışmış kıdemli bir
taşıt mekanik mühendisisin. Karşındaki kişi Makine Mühendisliği 3. sınıf öğrencisi ve
takımın mekanik biriminde yeni.

Kurallar:
1. Bir parça veya analiz sorulduğunda önce gereksinimleri, yük durumlarını, sınır
   koşullarını, malzemeyi ve üretim yöntemini sor.
2. Her FEA/CFD sonucunu bir el hesabıyla mertebe kontrolünden geçir. Formülü ve
   varsayımları açıkça yaz.
3. Malzeme değeri veya standart uydurma. Kaynak ya da veri sayfası iste; bilmiyorsan
   "bilmiyorum" de.
4. Güvenlik-kritik parçalarda (fren, direksiyon, roll bar, emniyet kemeri bağlantıları)
   sonucu nihai kabul etme; kıdemli üye veya danışman onayı gerektiğini hatırlat.
5. Öğretici cevap ver: önce sezgi, sonra denklem, sonra sayı. Sonunda öğrencinin kendi
   başına yapacağı bir alıştırma öner.
6. Türkçe yaz; teknik terimlerin İngilizcesini parantez içinde ver.
7. Takımın gizli CAD veya sponsor verilerini dışarı taşıyan bir işlem önerme.
```

### 12.4 Mühendislik + kod için ilk dört mini proje

1. **Tur simülatörü:** `enerji_butcesi.py`'yi pistin yükseklik profili ve hız stratejisiyle genişlet. Çıktı tur başına Wh olsun. Strateji ekibine doğrudan girdi.
2. **Coast-down analiz aracı:** CSV (zaman, hız) → CdA ve Crr + belirsizlik aralığı (Bölüm 2.5).
3. **Şartname uyum takibi:** Gereksinim matrisi + teknik kontrol kontrol listesi, durumlarıyla birlikte.
4. **Parametrik FEA:** PyAnsys ile bir braketin kalınlık taraması ve kütle–gerilme eğrisi.

Her biri hem takıma gerçek değer katar hem de portföyünde "mekanik + yazılım" kesişimini gösterir.

### 12.5 Girişimci mühendis perspektifi

- **Takım küçük bir donanım girişimidir:** Sınırlı bütçe, yatırımcı gibi sponsorlar, lansman gibi sabit bir yarış tarihi, müşteri gibi jüri ve şartname, ürün olarak araç. Prototipten "çalışan ürün"e geçişin acısını (DFM, tedarik, maliyet, kalite) burada küçük ölçekte yaşarsın. Donanım girişimlerinin en zor kısmı tam olarak budur.
- **Yapay zekâ × mühendislik büyüyen bir alan:** Simülasyonu hızlandıran vekil modeller (surrogate models), generatif tasarım ve test verisinden öğrenen modeller. PhysicsX, Neural Concept ve Monolith AI gibi girişimler bu alanda çalışıyor. Ansys'in SimAI'ı gibi büyük yazılım firmalarının ürünleri de var. Bu alanın en kıt kaynağı hem fiziği hem yazılımı bilen insan, yani hedeflediğin profil.
- **Portföy:** Her parça için tek sayfalık bir vaka çalışması yaz: problem → kısıtlar → tasarım → analiz → üretim → test → ders. İçerik ajanınla bu vakalardan paylaşımlar üretebilirsin. Takımın izniyle ve gizli veri olmadan.

---

## 13. 12 aylık yol haritası

Tipik sezon döngüsü: sonbaharda tasarım, kışın üretim, ilkbaharda test, yazın yarış. Takımın gerçek takvimine göre kaydır.

| Dönem | Hedef | Somut çıktı |
|---|---|---|
| **Ekim 2026** (ilk 30 gün) | Oyunu ve aracı tanı | Mekanik gereksinim matrisi; önceki araç incelemesi notları; bir parça sahiplenmek; CAD hızını artırmak |
| **Kasım–Aralık 2026** | Analiz temeli | ANSYS yolunun 1–6. adımları; parçanın el hesabı + FEA + teknik resmi; ilk kompozit serimine katılmak |
| **Ocak–Mart 2027** (sömestr dahil) | Derinleşme ve uzmanlık seçimi | Uzmanlık hattı: yapı/kompozit, aero/CFD veya süspansiyon-direksiyon-fren. ACP ya da Fluent; CSWA; TTR'de bir bölüm; coast-down analiz aracı |
| **Nisan–Haziran 2027** | Üretim ve test | Parçanın üretimi ve montajı; test planı ve sonuçları; tur simülatörü; bitirme projesi konusunun netleşmesi; 2209 başvurusu (takvime göre) |
| **Temmuz–Eylül 2027** | Yarış ve devir | Yarış haftası görevleri; "lessons learned" dokümanı; yaz stajı ile takımın dengelenmesi; bir sonraki sezonda alt sistem sorumluluğuna aday olmak |

**Uzmanlık seçimi için ipucu:** T-şekilli ol. Tüm alt sistemleri konuşabilecek kadar genişlik, birinde gerçek derinlik. Kod yazabildiğin için "simülasyon + test verisi" hattında çok hızlı fark yaratırsın. Ama sadece "yazılımcı" olarak etiketlenme: mutlaka elinle ürettiğin ve test ettiğin bir parça olsun.

---

## 14. Kendini test et

1. 35 km/h'de CdA'yı %10 düşürmek mi, Crr'yi %10 düşürmek mi daha çok enerji kazandırır? Cevap neden hıza bağlı?
2. Kapalı pistte yokuşta harcanan enerji neden tamamen geri gelmez?
3. Coast-down verisinden CdA ve Crr'yi nasıl ayırırsın?
4. "Fixed support" neden gerilmeleri yapay olarak değiştirebilir? Alternatiflerin ne?
5. Keskin bir iç köşede gerilme ağ inceldikçe artmaya devam ediyor. Bu ne anlama gelir?
6. Ağ yakınsaması nasıl yapılır? "Yakınsadı" demek için ölçütün ne?
7. Rot başlı bir süspansiyon çubuğu hangi yükü taşır? Hangi hasar modunu kontrol edersin?
8. Kamber, kaster ve toe'yu çizerek anlat. Verimlilik aracında hangisinin hatası en çok enerji kaybettirir?
9. Ackermann geometrisi neden gerekli? Formülünü yaz.
10. 190 kg'lık araç 0,6 g ile frenlenirken ön teker başına fren torku kaç N·m olur? Varsayımlarını söyle.
11. M8 cıvatayı 25 N·m ile sıkarsan ön yük yaklaşık kaç kN olur? Dişleri yağlarsan ne değişir?
12. Simetrik ve dengeli laminat ne demek, neden istenir?
13. Sandviç panelde çekirdek kalınlığını artırınca eğilme rijitliği neden bu kadar hızlı artar?
14. Karbonu alüminyuma doğrudan temas ettirirsen ne olur? Nasıl önlersin?
15. Vakum torbalamada katmanları içten dışa sırala.
16. Pot life ve Tg ne demek? Güneşte bekleyen koyu renkli bir gövde için Tg neden önemli?
17. Kalıcı balata sürtünmesini nasıl tespit edersin?
18. Rulmanda 2RS ile ZZ farkı ne? Verimlilik açısından hangisi?
19. İz genişliği 1,2 m iken ağırlık merkezini 0,40 m'den 0,35 m'ye indirirsen devrilme eşiği nasıl değişir?
20. Bir tasarım incelemesine hangi 6 başlıkla girersin?

<details>
<summary>Cevap ipuçları</summary>

1. Bölüm 2.2 tablosu: 35 km/h'de Crr (−%5,7) > CdA (−%4,3); 85 km/h'de CdA baskın. Aero gücü v³, yuvarlanma gücü v ile büyür.
2. Verim zinciri kayıpları (tırmanışta enerji η'ya bölünür) ve inişte frende ısıya giden enerji.
3. Yavaşlamayı v²'ye karşı çiz: kesişim Crr·g·m/m_eş, eğim ρ·CdA/(2·m_eş).
4. Gerçekte esneyen bağlantıyı sonsuz rijit yapar. Alternatifler: remote displacement, elastik destek, bağlantı parçasını modellemek.
5. Tekillik: gerçek gerilme değil. Radius ver ya da bölgeden uzakta değerlendir.
6. En az 3 ağ; ilgilenilen sonuç (ör. belirli bir bölgedeki gerilme) ardışık ağlar arasında birkaç yüzdeden az değişmeli.
7. Yalnızca eksenel yük; basınçta burkulma.
8. Toe hatası: lastiği sürekli yana sürüterek kayıp yaratır.
9. cot δ_dış − cot δ_iç = w / L.
10. Bölüm 4.1: ≈ 88 N·m (h = 0,35 m, L = 1,6 m, R = 0,25 m, statik %50 ön).
11. ≈ 15,6 kN (K ≈ 0,2). Yağlanınca K düşer, aynı torkta ön yük artar.
12. Simetrik: orta düzleme göre ayna dizilim; eğilme-uzama bağlaşımını (B matrisi) sıfırlar, kürde çarpılmayı önler. Dengeli: her +θ katmana karşı bir −θ katman; uzama-kayma bağlaşımını önler.
13. Rijitlik yaklaşık olarak yüzler arası mesafenin karesiyle artar (Bölüm 4.4).
14. Galvanik korozyon; araya cam elyaf katı ya da yalıtım.
15. Kalıp (ayırıcı) → laminat → soyma kumaşı → delikli film → nefes kumaşı → torba.
16. Kullanım süresi / camsı geçiş sıcaklığı. Güneşte gövde ısınır, düşük Tg'li reçine yumuşar.
17. Spin-down testi: tekerleğin durma süresini karşılaştır; frensiz ve frenli durumu kıyasla.
18. 2RS temaslı lastik keçe (daha çok sürtünme), ZZ metal kapak (daha az). Verim için genelde ZZ ya da düşük sürtünmeli keçe; ama toz ve su koşulunu da düşün.
19. 1,2 / (2 · 0,40) = 1,5 g → 1,2 / (2 · 0,35) ≈ 1,71 g.
20. Bölüm 10.3.

</details>

---

## 15. Kaynaklar

### 15.1 Kitaplar

| Kitap | Neden |
|---|---|
| Douglas R. Carroll, *The Winning Solar Car: A Design Guide for Solar Race Car Teams* (SAE) | Tam olarak bu iş için yazılmış |
| Goro Tamai, *The Leading Edge: Aerodynamic Design of Ultra-streamlined Land Vehicles* | Ultra aerodinamik kara taşıtları |
| William F. & Douglas L. Milliken, *Race Car Vehicle Dynamics* (SAE) | Taşıt dinamiğinin başucu kitabı |
| Thomas D. Gillespie, *Fundamentals of Vehicle Dynamics* (SAE) | Taşıt dinamiğine daha yumuşak giriş |
| Carroll Smith, *Engineer to Win* ve *Nuts, Bolts, Fasteners and Plumbing Handbook* | Malzeme, bağlantı elemanları, pratik yarış mühendisliği |
| Budynas & Nisbett, *Shigley's Mechanical Engineering Design* | Makine elemanları ve yorulma |
| Nitin S. Gokhale ve ark., *Practical Finite Element Analysis* | Pratik FEA |
| Versteeg & Malalasekera, *An Introduction to Computational Fluid Dynamics: The Finite Volume Method* | CFD teorisi |
| Joseph Katz, *Race Car Aerodynamics* / *Automotive Aerodynamics* | Taşıt aerodinamiği |
| Wolf-Heinrich Hucho, *Aerodynamics of Road Vehicles* | Taşıt aerodinamiği referansı |
| Ronald F. Gibson, *Principles of Composite Material Mechanics* | Kompozit mekaniği |
| Simon McBeath, *Competition Car Composites* | Pratik kompozit üretimi |
| Karl Ulrich & Steven Eppinger, *Product Design and Development* | Mühendis-girişimci için ürün geliştirme |

### 15.2 Kurslar, kanallar, sertifikalar

- **Ansys Innovation Space / Innovation Courses:** Ücretsiz Ansys eğitimleri ve forum
- **Cornell (edX), "A Hands-on Introduction to Engineering Simulations":** Ansys ile uygulamalı FEA/CFD girişi
- **YouTube:** *The Efficient Engineer* (mühendislik temelleri), *Fluid Mechanics 101* (CFD teorisi)
- **SolidWorks sertifikaları:** CSWA → CSWP
- **Formula Student / FSAE tasarım raporları ve tezleri:** Süspansiyon, fren ve şasi için bol kaynak
- **Güneş arabası takımlarının açık yayınları ve tezleri:** Aerodinamik, kompozit ve strateji konularında çok sayıda

### 15.3 Kurallar

- TEKNOFEST / TÜBİTAK Efficiency Challenge güncel şartnameleri: [teknofest.org yarışma sayfası](https://www.teknofest.org/tr/yarismalar/uluslararasi-efficiency-challenge-elektrikli-arac-yarislari/)
- Bridgestone World Solar Challenge kuralları: [worldsolarchallenge.org](https://worldsolarchallenge.org/)

### 15.4 Bu raporda kullanılan kaynaklar

**Not:** Takım ve yarışma bilgileri web aramasıyla derlendi. Ağ kısıtı nedeniyle birincil sayfaların bir kısmını doğrudan açamadım. Kritik bir bilgiyi kullanmadan önce aşağıdaki kaynaktan doğrula. Bölüm 2 ve 4'teki araç değerleri öğretim amaçlı varsayımdır.

- ESTÜ haberi: [ESTU Solar Team'den Türkiye ikinciliği](https://eskisehir.edu.tr/tr/Haber/Detay/eskisehir-teknik-universitesi-solar-team-ekibinden-turkiye-ikinciligi-2)
- ESTÜ haberi: [ESTU Solar Team yeni elektrikli otomobiliyle Efficiency Challenge'a hazırlanıyor (Phantom)](https://www.eskisehir.edu.tr/tr/Haber/Detay/estu-solar-team-yeni-urettigi-elektrikli-otomobiliyle-bu-yilki-tubitak-efficiency-challenge-yarisina-hazirlaniyor)
- ESTÜ Mühendislik Fakültesi: [Solar Powered Automobile Team](https://mf.eskisehir.edu.tr/en/Icerik/Detay/solar-powered-automobile-team)
- Yeni Enerji: [Güneş enerjili araçlar üreten bir üniversite topluluğu: ESTU Solar Team](https://www.yenienerji.com/haberler/gunes-enerjili-araclar-ureten-bir-universite-toplulugu-estu-solar-team)
- Anadolu Ajansı: [ESTÜ Solar Team, yerli araçları "Asena" ile birinciliği hedefliyor](https://www.aa.com.tr/tr/teknofest/estu-solar-team-yerli-araclari-asena-ile-uluslararasi-efficiency-challengeda-birinciligi-hedefliyor/3661182)
- Anadolu Ajansı: [Çevre dostu enerji kullanan ESTÜ Solar Team, TEKNOFEST'te zirveye göz dikti](https://www.aa.com.tr/tr/bilim-teknoloji/cevre-dostu-enerji-kullanan-estu-solar-team-teknofestte-zirveye-goz-dikti/3300267)
- Haberler.com: [ESTÜ öğrencilerinden %85 hafif kompozit yarış koltuğu](https://www.haberler.com/teknoloji/estu-ogrencilerinden-yuzde-85-hafif-kompozit-yaris-koltugu-19894032-haberi/)
- TÜBİTAK: [Uluslararası Efficiency Challenge Elektrikli Araç Yarışları](https://tubitak.gov.tr/tr/yarismalar/uluslararasi-efficiency-challenge-elektrikli-arac-yarislari)
- TÜBİTAK: [Uluslararası ve Liseler Arası Efficiency Challenge yarışları başladı](https://tubitak.gov.tr/tr/haber/uluslararasi-ve-liseler-arasi-efficiency-challenge-elektrikli-arac-yarislari-basladi)
- TÜBİTAK: [TEKNOFEST kapsamında Efficiency Challenge yarışları sona erdi](https://tubitak.gov.tr/tr/haber/teknofest-kapsaminda-tubitak-tarafindan-gerceklestirilen-efficiency-challenge-elektrikli-arac-yarislari-sona-erdi)
- TEKNOFEST: [Efficiency Challenge 2024 şartnamesi (PDF)](https://cdn.teknofest.org/media/upload/userFormUpload/EC_Yar%C4%B1%C5%9Flar%C4%B1_%C5%9Eartnamesi_2024_V1.7_4yW2C.pdf)
- pv magazine: [New dates, rules for 2025 Bridgestone World Solar Challenge](https://www.pv-magazine.com/2024/05/20/new-dates-rules-announced-for-2025-edition-of-bridgestone-world-solar-challenge/)
- Ansys: [Ansys Student](https://ansys.synopsys.com/academic/students/ansys-student)
- ESTÜ AKTS: [Makine Mühendisliği dersleri](https://akts.eskisehir.edu.tr/tr/program/dersler/256/13)

---

## Ek: `enerji_butcesi.py` kullanımı

```bash
python3 enerji_butcesi.py                          # iki örnek araç
python3 enerji_butcesi.py --arac ec --cda 0.12     # EC örneğinde CdA'yı değiştir
python3 enerji_butcesi.py --arac ec --kutle 175 --crr 0.005 --hiz 30
```

Parametreler: `--kutle` (kg, sürücü dahil), `--cda` (m²), `--crr`, `--verim` (0–1), `--hiz` (hassasiyet analizinin referans hızı, km/h). Script yalnızca Python standart kütüphanesini kullanır.
