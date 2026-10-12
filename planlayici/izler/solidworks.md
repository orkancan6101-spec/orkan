# SolidWorks

> Öğrenme izi müfredatı. `/calis solidworks` bu dosyayı okur. Pano belgesi:
> `izler/solidworks`. Son araştırma: 12 Ekim 2026.
>
> **Kaynak notu:** Buradaki linklerin hepsi 12 Ekim 2026'daki web
> aramalarında görüldü. Sayfaların içi açılamadı (WebFetch DNS hatası verdi).
> Bu yüzden fiyat, sınav formatı ve lisans bilgileri arama özetlerine
> dayanıyor. Sınava kaydolmadan ya da lisans almadan önce resmi sayfadan
> doğrula.

---

## Hedef ve ölçüt

**Ana hedef:** Takımın mekanik biriminde tek başına üretilebilir parça,
montaj ve teknik resim çıkarabilmek. Ölçülebilir kanıt olarak **CSWA
(Certified SOLIDWORKS Associate)** sertifikasını almak.

| Tarih | Ölçüt (geçti/kaldı) |
|---|---|
| **18 Eki 2026** | F0 kanıtları hazır: 3 parça, 1 montaj, 1 teknik resim (PDF). Bütün sketch'ler tam tanımlı (siyah). CSWA örnek sınavının 2 temel parça sorusu süre tutularak çözülmüş ve başlangıç puanı kaydedilmiş. |
| **1 Kas 2026** | Parametrik fren diski, global değişkenle 3 farklı çapta **rebuild hatası olmadan** güncelleniyor. Bir TooTallToby modeli ≤ 25 dk'da çizilmiş ve kütlesi doğru. |
| **15 Kas 2026** | Kremayer-pinyon direksiyon montajı kilitten kilide hareket ediyor. Çakışma (interference) raporu 0 ya da her çakışma açıklanmış. |
| **29 Kas 2026** | ISO teknik resim (A3, PDF) bir takım arkadaşına ya da mentora kontrol ettirilmiş, en fazla 3 düzeltme çıkmış. |
| **13 Ara 2026** | Boru çerçeve (weldment) ve kesim listesi resmi hazır. Sac braketin DXF açınımı çıkarılmış. |
| **31 Ara 2026** | **Zamanlı CSWA örnek sınavında %75+** (180 dk içinde). Asıl hedef %85. |
| **Ocak sonu – Şubat başı 2027** (yarıyıl tatili, kesin tarih akademik takvime göre) | **CSWA geçildi.** Standart sınavda %70 ve üstü, akademik sürümde iki bölümün her birinde 80 puan ve üstü. |
| **Mart 2027** | Yüzey modelle ölçekli gövde burnu ve dişi kalıp yarısı çizilmiş. Takımın kompozit sorumlusu gözden geçirmiş. |

**CSWA sınavı (araştırma özeti):**
- **Standart sürüm:** 3 saat, geçme notu %70, ücreti 99 USD. İki deneme
  arasında en az 14 gün beklenir ve her deneme için yeni sınav kredisi
  gerekir. Kaynak: [resmi CSWA sayfası](https://www.solidworks.com/certifications/cswa-design-associate),
  [sertifika programı](https://www.solidworks.com/solidworks-certification-program).
- **Akademik sürüm:** Okul "Academic Certification Provider" ise sınav
  okulda gözetimli ve ücretsiz yapılabilir. Tek oturumda 3 saat ya da 2 × 90
  dk olarak verilir. Kaynak: [akademik sürüm](https://www.solidworks.com/certifications/solidworks-cad-design-academic).
  - **Bölüm 1:** 90 dk, 6 soru (2 temel parça, 2 orta düzey parça, 2 montaj),
    geçme 80 puan. Kaynak: [SOLIDWORKS blog, Lesson 6](https://blogs.solidworks.com/products/solidworks/lesson-6-solidworks-academic-certification-cswa-exam-part-1).
  - **Bölüm 2:** 90 dk, 8 soru (3'ü teknik resim yetkinliği), geçme 80
    puan. Kaynak: [Lesson 7](https://blogs.solidworks.com/teacher/2025/08/lesson-7-solidworks-academic-certification-cswa-exam-part-2.html).
- **Eski örnek sınav formatı:** 14 soru, 240 puan, geçme 165, 180 dk. Tek
  soruya ortalama ~13 dk düşer.
- **Soru tipi:** Çoğunlukla modeli çizersin ve kütle ya da ağırlık merkezi
  gibi bir ölçümü girersin. Yanlış birim veya yanlış malzeme, doğru modeli
  de yanlış yapar.
- **Konular:** sketch nesneleri ve ilişkileri; extrude, revolve, sweep, loft;
  fillet, chamfer ve pattern'ler; malzeme ve kütle özellikleri; standart
  mate'ler; teknik resim görünüşleri (projected, auxiliary, section, detail,
  broken-out, break, crop).
- **Dil:** Türkçe sınav dilleri arasında yok ([Türkçe resmi sayfa](https://www.solidworks.com/tr/certifications/cswa-design-associate)).
  Sınava İngilizce girilecek. Arayüzü ve terimleri baştan İngilizce öğren.
- **Sınav istemcisi:** Tangix TesterPRO, 3DEXPERIENCE Certification
  Center'dan indirilir. 3DEXPERIENCE ID gerekir. Örnek sınav bu istemcide de
  çözülebilir.
- **Hazırlık süresi:** Hazırlık sitelerine göre çoğu aday 40–80 saat
  çalışıyor. Bu plan Ekim–Aralık arasında ~42 saat veriyor. Temel bilgin
  olduğu için yeterli olmalı. 20 Aralık'taki deneme kötü geçerse sınavı
  Şubat sonuna kaydır.

---

## Kullanıcının durumu ve kısıtlar

- ESTÜ Makine Mühendisliği 3. sınıf. ESTU Solar Team mekanik biriminde yeni
  (TEKNOFEST Efficiency Challenge, Elektromobil). İlgi alanları: karbon fiber
  gövde/şasi, tekerlek mekanizmaları, fren, direksiyon, süspansiyon.
- SolidWorks seviyesi: "biraz". Temel parça çizebiliyor. Montaj, teknik resim,
  weldment, yüzey ve konfigürasyon büyük olasılıkla yeni.
- **Bütçe:** Bu hafta (13–18 Eki) ~7,5 saat (9 × 50 dk). Sonra haftada
  4 × 50 dk ≈ 3,3 saat (200 dk).
- **Oturum:** 50 dk odak + 10 dk mola. Zirve saatleri 14:00–17:00. Günde en
  fazla 3 blok.
- **Öncelik:** `/calis` sırasında dersler, takım ve SolidWorks birinci
  seviyededir. Takım bir SolidWorks işi verirse o iş bu müfredattan önce
  gelir ve oturum sayılır.
- **Vize/final haftaları:** Haftada en az 2 × 50 dk ile izi canlı tut. Sıfıra
  indirme.

**Erişim ve lisans (kontrol et):**
- **Ücretsiz öğrenci lisansı:** SOLIDWORKS Design Standard for Students
  1 Temmuz 2026'dan itibaren tüm dünyada ücretsiz duyuruldu. Bir yıllıktır ve
  öğrencilik sürdükçe yenilenir. Yalnızca Windows'ta çalışır. Simulation
  eklentisi, CAM, Visualize ve **sertifika kuponu içermez**. Sac metal ve
  weldment içinde. ([ürün sayfası](https://www.solidworks.com/product/students/design-standard),
  [öğrenci sayfası](https://www.solidworks.com/product/students))
- **Sertifika kuponu:** Ücretli Design Premium for Students sürümünde CSWA ve
  CSWP deneme hakları var. Ücretsiz sürümle sınav hakkı için şu yollar var:
  ESTÜ'nün Academic Certification Provider olup olmadığını sor, takımın
  sponsor lisansına bak ya da 99 USD öde.
- **Takım sponsorluğu:** SOLIDWORKS, yarışmaya katılan öğrenci takımlarına
  ücretsiz sponsorluk veriyor. Her üyeye Student Edition lisansı verilir
  (Premium, Simulation Premium, Flow, Motion, CAM). 3DEXPERIENCE bulut
  depolama ve veri yönetimi de alınabilir. Başvuruyu 18 yaş üstü biri, örneğin
  danışman, yapar. **Takımın bu lisansı var mı, ilk iş sor.**
  ([sponsorluk PDF](https://files.solidworks.com/education/DS_SWEDU_StudentSponsorship_FINAL.pdf),
  [başvuru sayfası](https://discover.solidworks.com/apply-for-our-exclusive-student-teams-free-sponsorship-program))
- **MySolidWorks eğitimleri:** Temmuz 2026'dan beri ücretsiz. 400'den fazla
  ders ve CSWA/CSWP hazırlık yolu var. Girmek için 3DEXPERIENCE ID yeter.
  ([duyuru](https://blogs.solidworks.com/products/solidworks/advance-your-skills-anytime-anywhere-mysolidworks-training-resources-are-now-free/),
  [öğrenci erişimi](https://my.solidworks.com/account/student-access))

**İlk oturumdan önce sorulacaklar** (cevaplar planı değiştirir):
1. Takım SolidWorks'ün hangi sürümünü ve hangi lisansı kullanıyor? Dosyalar
   genelde eski sürümde açılmaz, aynı sürümü kur.
2. Bilgisayarın Windows mu? Mac ise okul laboratuvarı ya da sanal makine
   gerekir.
3. Takımın dosya adlandırma kuralı, klasör yapısı ve PDM/bulut düzeni ne?
4. Ders programında 14:00–17:00 arasına denk gelen ders var mı? Varsa
   planlayıcı blokları kaydırır.

---

## Bu hafta: yoğun plan (13–18 Ekim)

9 blok × 50 dk = 450 dk (7,5 sa). Saatler ders programına ve cumartesi
atölyesine göre yerleştirildi. Günlük plan saatleri kaydırabilir, ama
**sıra değişmemeli.** Her bloğun sonunda bir dosya kaydedilir. Dosya düzeni için
"Riskler ve tavsiyeler" bölümüne bak.

| Gün | Blok | Adım | Ne yapılacak | Somut çıktı |
|---|---|---|---|---|
| **Sal 13 Eki** | 14:00–14:50 | F0.1 | Lisans ve sürüm kontrolü. Birim **MMGS**, standart **ISO**. Parça şablonu kaydet. Klasörleri aç (`00_sablon`, `01_alistirma`, `02_takim`, `03_cswa`). Yerleşik eğitimden *Getting Started: Lesson 1 – Parts* (~30 dk). | `MMGS_ISO.prtdot`, `F0-01_lesson1.SLDPRT` |
| | 15:00–15:50 | F0.2 | **Sketch disiplini drill'i.** 5 sketch: origin'e bağlı dikdörtgen, simetrik yuva, eşit 4 delik, yapı çizgisiyle açılı kol, teğet yay. Kurallar: **Fix ilişkisi yok, Fully Define aracı yok**, hepsi elle tam tanımlanacak. | `F0-02_sketch-drill.SLDPRT` (5 siyah sketch) |
| **Çar 14 Eki** | 08:00–08:50 | F0.3 | **L-braket** (5 mm Al): extrude, cut, Hole Wizard (M6), fillet, mirror. Delikler kenarlara göre simetrik. **Değiştir testi:** genişliği 60'tan 80'e çıkar. Delikler doğru kayıyor mu? | `F0-03_l-braket.SLDPRT` + kütle (g) |
| **Per 15 Eki** | 14:00–14:50 | F0.4 | **Tekerlek göbeği / aks burcu:** revolve, chamfer, 4 cıvata deliği circular pattern. Malzeme 6061 Al. Kütle özelliklerini oku ve kaydet. | `F0-04_gobek.SLDPRT` + kütle |
| | 15:00–15:50 | F0.5 | **Takım oynatma listesinin ilk videosu** (link geldiyse): izle, durdur, aynısını çiz, bir parametreyi değiştir. Link yoksa MySolidWorks *Part Modeling Basics* yolunun ilk dersini yap. | Videodaki parça ya da ders parçası |
| **Cum 16 Eki** | 08:00–08:50 | F0.6 | **Mini montaj:** göbek, aks ve 2 rulman (basit halka). Mate'ler: concentric, coincident, distance. Interference Detection çalıştır. İstersen yerleşik *Lesson 2 – Assemblies* (~45 dk) yerine geçebilir. | `F0-06_aks-montaj.SLDASM` + çakışma ekran görüntüsü |
| **Cmt 17 Eki** | 08:30–09:20 (atölyeden önce) | F0.7 | **Teknik resim:** yerleşik *Lesson 3 – Drawings* (~15 dk). Sonra L-braketin resmi: 3 görünüş, 1 kesit, 1 detay, ölçüler, antette "ISO 2768-mK" notu. PDF'e aktar. | `F0-07_l-braket.SLDDRW` + PDF |
| **Paz 18 Eki** | 10:00–10:50 | F0.8 | **Başlangıç ölçümü:** CSWA örnek sınavından 2 temel parça sorusu, süre tutarak. Cevap kütle olarak girilir. Sonra çözüm videosuyla karşılaştır. | `ilerleme.cswa_baslangic` = {doğru/2, dk} |
| | 16:00–16:50 | F0.9 | **Gözden geçirme:** hataları kodla (AI kuralları bölümü). L-braketi bakmadan 15 dakikada yeniden çiz. TooTallToby'de ücretsiz hesap aç ve 1 ücretsiz model dene. F1 planını onayla. | Hata listesi, `sonraki = F1.1` |

Bu haftanın kaynakları:
- Yerleşik eğitimler: [Getting Started (Help)](https://help.solidworks.com/2025/English/swconntutorial/c_swtut_getting_started_online.htm).
  SolidWorks'te `?` menüsü → Tutorials. Süreler: Lesson 1 Parts ≈ 30 dk,
  Lesson 2 Assemblies ≈ 45 dk, Lesson 3 Drawings ≈ 15 dk.
- [MySolidWorks: Getting Started with SOLIDWORKS CAD](https://my.solidworks.com/training/path/106/getting-started-with-solidworks-cad)
- [CSWA örnek sınavı (resmi sayfa)](https://www.solidworks.com/media/cswa-sample-exam).
  [Resmi PDF](https://www.solidworks.com/sites/default/files/2017-12/CSWASampleExam.pdf)
  eski tarihli ama soru tarzı aynı.
- Sınav öncesi bakmamak için çözüm videosunu **sonra** aç:
  [SOLIDWORKS CSWA Practice Exam Walk-Through](https://www.youtube.com/watch?v=XdWYW4HOLT4)

---

## Müfredat (fazlar)

Her fazda 4 oturum/hafta vardır. Adım kodları (`F1.3` gibi) panodaki
`sonraki` alanına yazılır. Fazdan çıkmak için kanıt çıktısı gerekir. Süre
dolup kanıt hazır değilse faz en fazla 1 hafta uzar. Sonra eksik
"borç" olarak not edilir ve sonraki faza geçilir.

### F0 · Başlangıç sprinti — 13–18 Eki (1 hafta, ~7,5 sa)
Ayrıntısı yukarıda. **Kanıt:** 3 parça, 1 montaj, 1 resim PDF'i ve başlangıç
puanı.

### F1 · Parça modelleme ve tasarım niyeti — 19 Eki – 1 Kas (2 hafta)
**Konular:** tasarım niyeti; tam tanımlı sketch; revolve, sweep, loft,
shell, rib, draft; linear/circular/fill pattern ve mirror; referans
geometri (düzlem, eksen); equations ve global variables; çok gövdeli parça
temeli; malzeme ve kütle özellikleri; SimulationXpress.

| Adım | Oturum |
|---|---|
| F1.1 | MySolidWorks *Part Modeling Basics* dersi. Kapak plakası: delik deseni kenarlara bağlı. Değiştir testi. |
| F1.2 | Sweep: Ø6 fren borusu, 3D yolda 3 büküm. Revolve tekrarı. |
| F1.3 | Loft, shell ve draft: basit burun kabuğu (yüzey fazına hazırlık). |
| F1.4 | **Parametrik fren diski I:** global variables `D_dis`, `t`, `n_delik`. Delik deseni sayısı denklemle bağlı. |
| F1.5 | Fren diski II: havalandırma delikleri (circular pattern), malzeme, kütle. 3 çapta (180/200/220) rebuild testi. |
| F1.6 | CSWA tipi "modifikasyon" sorusu: model ölçüsü değişince kütleyi yeniden bul ([Alberta pratik soruları](https://sites.ualberta.ca/~dnobes/Teaching_Section/CSWA/CSWA_Material/CSWA_Exam_Practice_Questions.pdf)). |
| F1.7 | **SimulationXpress:** fren pedalı kolu. Fixed + kuvvet, gerilme, yer değiştirme, FoS. Sonucu σ = M·c/I el hesabıyla karşılaştır. |
| F1.8 | Faz testi: 2 TooTallToby modeli zamanlı, kütleler doğru mu? |

**Kanıt çıktısı:** `F1_fren-diski.SLDPRT`: 3 çapta hatasız rebuild ve kütle
tablosu. `F1_pedal.SLDPRT`: SimulationXpress raporu ve el hesabı (1 paragraf).

**Kaynaklar:**
- [MySolidWorks: Part Modeling Basics](https://my.solidworks.com/training/path/26/part-modeling-basics)
- [Açık ders kitabı: Sketching and Relations](https://pressbooks.pub/solidworks1/chapter/sketch-tools)
- [MySolidWorks: SimulationXpress, fixtures/loads/materials](https://my.solidworks.com/training/master/302/simulationxpress-applying-fixtures-loads-materials)
  ve [çalıştırma ve sonuç](https://my.solidworks.com/training/master/303/1/0/simulationxpress)
- [SimulationXpress Getting Started (Help)](https://help.solidworks.com/2025/english/SolidWorks/cosmosxpresshelp/c_Getting_Started.htm?id=23d354d3ec8540a6be1e2a1dd32021c5)
- [Simulation ile SimulationXpress farkı (SOLIDWORKS blog)](https://blogs.solidworks.com/tech/2017/09/solidworks-simulation-vs-simulationxpress.html):
  SimulationXpress yalnızca tek gövde ve lineer statik analiz yapar. Sabit
  mesnet ile kuvvet/basınç tanımlanabilir.
- [TooTallToby Practice Models](https://www.tootalltoby.com/practice/)

### F2 · Montajlar, mate'ler ve konfigürasyonlar — 2–15 Kas (2 hafta)
**Konular:** aşağıdan yukarı montaj; standart mate'ler; gelişmiş mate'ler
(width, symmetric, limit distance/angle); mekanik mate'ler (hinge, slot,
gear, rack-pinion); interference ve collision detection; montaj kütle
özellikleri; patlatılmış görünüş; layout sketch ile yukarıdan aşağı tasarım
(hardpoint mantığı); konfigürasyonlar ve tasarım tabloları (Excel).

| Adım | Oturum |
|---|---|
| F2.1 | MySolidWorks *Basic Assembly Modeling*. Sabit ve serbest bileşen, mate klasörü düzeni. |
| F2.2 | Gelişmiş ve mekanik mate'ler: limit angle, slot, hinge, rack-pinion. Küçük deneme montajları. |
| F2.3 | **Direksiyon I:** pinyon, kremayer ve gövde. Rack-pinion mate. |
| F2.4 | **Direksiyon II:** rot kolu ve basit aks. Kilitten kilide limit angle. Hareketi kaydet. |
| F2.5 | Interference ve collision detection, montaj kütlesi, patlatılmış görünüş. |
| F2.6 | Layout sketch / yukarıdan aşağı tasarım: süspansiyon hardpoint'leri tek sketch'te, parçalar ona bağlı. Dış referansların riskini gör. |
| F2.7 | Konfigürasyonlar ve **tasarım tablosu:** göbeğin 3 varyantı (aks çapı, cıvata sayısı). |
| F2.8 | Faz testi: CSWA tipi montaj sorusu (ağırlık merkezi koordinatı), zamanlı. |

**Kanıt çıktısı:** `F2_direksiyon.SLDASM` (hareketli, çakışma raporuyla) ve
`F2_gobek-DT.SLDPRT` (3 konfigürasyon, Excel tablosu).

**Kaynaklar:**
- [MySolidWorks: Basic Assembly Modeling](https://my.solidworks.com/training/path/1/basic-assembly-modeling)
- [MySolidWorks: Top-Down Assembly Modeling](https://my.solidworks.com/training/master/88)
- [Help: Assembly Layout Sketch](https://help.solidworks.com/2017/English/SolidWorks/sldworks/c_Assembly_Layout_Sketch.htm),
  [Top-Down Design Overview](https://help.solidworks.com/2019/English/SolidWorks/sldworks/c_Top-Down_Design_Overview.htm)
- [MySolidWorks: Configurations and Display States](https://my.solidworks.com/training/path/111/configurations-and-display-states),
  [Assembly Design Tables](https://my.solidworks.com/training/master/182/3/0/assembly+design+tables)
- [GoEngineer: Design Tables Made Easy](https://www.goengineer.com/blog/solidworks-design-tables-made-easy),
  [Help: dış Excel dosyasını tasarım tablosu yapmak](https://help.solidworks.com/2026/english/solidworks/sldworks/t_inserting_file_design_table.htm).
  Tasarım tablosu için bilgisayarda Excel kurulu olmalı.
- [GoEngineer: yerleşik eğitim Lesson 2 Assemblies videosu](https://www.goengineer.com/videos/getting-started-lesson-2-assemblies-solidworks-built-in-tutorials)

### F3 · Teknik resim, toleranslar, GD&T temeli — 16–29 Kas (2 hafta)
**Konular:** resim şablonu ve antet; ISO birinci açı (E) izdüşümü (takımın
şablonunu kontrol et); CSWA'daki görünüş tipleri; model ölçüleri ve elle
ölçü; genel tolerans (ISO 2768-1/-2, ör. "ISO 2768-mK"); geçmeler (ör. rulman
yuvası H7, aks k6; rulman kataloğuyla doğrula); yüzey pürüzlülüğü; GD&T
temeli (datum, feature control frame, düzlemsellik, diklik, konum); BOM,
balon ve revizyon tablosu.
> Standart farkı: Türkiye/Avrupa ISO GPS (ISO 1101, ISO 8015) kullanır.
> ASME Y14.5'te zarf ilkesi (Kural #1) varsayılandır. ISO'da varsayılan
> bağımsızlık ilkesidir; zarf istenirse Ⓔ ile belirtilir. GD&T Basics sitesi
> ASME tabanlıdır. Sembolleri oradan öğren, kuralı takımın standardından al.

| Adım | Oturum |
|---|---|
| F3.1 | MySolidWorks *SOLIDWORKS Drawings*. Şablon, sheet format, antet alanları (custom properties). |
| F3.2 | Görünüş tipleri: projected, auxiliary, section, detail, broken-out, break, crop. Her birinden 1 örnek. |
| F3.3 | Ölçülendirme ve ISO 2768-mK. Hangi ölçü toleranslı olmalı? |
| F3.4 | Geçme ve yüzey pürüzlülüğü: göbekteki rulman yuvası. |
| F3.5 | GD&T temeli: datum A/B/C, feature control frame, cıvata delikleri için konum toleransı. |
| F3.6 | Montaj resmi: patlatılmış görünüş, BOM, balon, revizyon tablosu. |
| F3.7 | **Kanıt:** göbek parçasının A3 üretim resmi ve direksiyon montaj resmi. PDF + DXF. |
| F3.8 | CSWA teknik resim soruları (örnek sınav) ve mentor kontrolünden gelen düzeltmeler. |

**Kanıt çıktısı:** 2 PDF (parça ve montaj resmi) ve kontrol eden kişinin
düzeltme listesi (≤ 3 madde).

**Kaynaklar:**
- [MySolidWorks: SOLIDWORKS Drawings](https://my.solidworks.com/training/path/4/solidworks-drawings)
- [GD&T Basics: sembol rehberi](https://www.gdandtbasics.com/gdt-symbols/),
  [Feature Control Frame](https://www.gdandtbasics.com/feature-control-frame/),
  [GD&T resimlerinde sık hatalar](https://www.gdandtbasics.com/avoiding-common-errors-in-gdt-drawings/)
- [SolidWorks 2019 Teknik Resim Eğitimi (Udemy, Türkçe, ücretli)](https://www.udemy.com/course/solidworks-2019-teknik-resim-egitimi-detayl-anlatm/):
  isteğe bağlı.

### F4 · Sac metal ve kaynaklı yapılar (şasi) — 30 Kas – 13 Ara (2 hafta)
**Konular:** base, edge ve miter flange; büküm payı ve K-faktörü; gauge
tabloları; flat pattern ve DXF (lazer, su jeti); weldment: 2D/3D sketch
iskeleti; structural member (boru/profil); trim/extend; end cap; gusset;
köşe işlemleri; özel profil; kesim listesi (cut list); weldment resmi.

| Adım | Oturum |
|---|---|
| F4.1 | MySolidWorks *Sheet Metal 1*: base/edge/miter flange, K-faktörü. |
| F4.2 | **Sac braket:** fren kaliperi bağlantısı, 3 mm Al. Flat pattern ve DXF. |
| F4.3 | MySolidWorks *Introduction to Weldments* ve Help *Weldment Parts* eğitimi. |
| F4.4 | **Boru çerçeve I:** koltuk ya da ön alt çerçeve. 3D sketch iskeleti, yuvarlak boru (ör. Ø25×2), trim/extend. |
| F4.5 | Boru çerçeve II: end cap, gusset, özel profil. Hardpoint ölçüsünü değiştir; çerçeve doğru güncelleniyor mu? |
| F4.6 | Kesim listesi ve *Weldment Drawings*: boy ve kesim açıları tablosu. |
| F4.7 | Takımdan gelen gerçek bir weldment/sac işi. Yoksa *Sheet Metal in Weldments*. |
| F4.8 | Faz testi. CSWA hazırlık yolunu aç ve ilk dersi yap. |

**Kanıt çıktısı:** `F4_cerceve.SLDPRT` ile kesim listesi PDF'i ve
`F4_braket.DXF`.

**Kaynaklar:**
- [MySolidWorks: Sheet Metal 1](https://my.solidworks.com/training/path/10),
  [Introduction to Sheet Metal](https://my.solidworks.com/training/master/305/introduction-to-sheet-metal)
- [Help: sac metal açma/katlama eğitimi](https://help.solidworks.com/2024/english/swconntutorial/t_tut_sheetmetal_flattenfold.htm)
- [MySolidWorks: Introduction to Weldments](https://my.solidworks.com/training/master/338/introduction-to-weldments),
  [Weldment Drawings](https://my.solidworks.com/training/master/343/weldment-drawings),
  [Sheet Metal in Weldments](https://my.solidworks.com/training/master/318/sheet-metal-in-weldments)
- [Help: Weldment Parts eğitimi](https://help.solidworks.com/2025/English/swtutorialonline/t_tut_weldments_parts.htm),
  [Weldments genel bakış](https://help.solidworks.com/2024/english/SolidWorks/sldworks/c_Weldments_Overview.htm)
- [Javelin: A Complete Guide to SOLIDWORKS Weldments](https://www.javelin-tech.com/blog/2024/05/solidworks-weldments/)

### F5 · CSWA hazırlık sprinti — 14 Ara 2026 – 3 Oca 2027 (3 hafta)
**Konular:** sınav formatı ve istemcisi; birim ve hassasiyet disiplini; hızlı
parça (soru başına ≤ 13 dk); modifikasyon soruları; montajda ağırlık
merkezi; teknik resim soruları; hata defteri.

| Adım | Oturum |
|---|---|
| F5.1–F5.3 | MySolidWorks *CSWA Exam Prep Course* dersleri. |
| F5.4 | Zamanlı 3 soru (40 dk) + 10 dk hata analizi. |
| F5.5 | **Deneme 1:** Pazar 20 Ara, 14:00–17:00. Tam örnek sınav, 180 dk, mümkünse TesterPRO istemcisinde. Bu hafta ayrıca yalnızca 1 oturum yap. |
| F5.6–F5.7 | Hata defterindeki en zayıf 2 kategoriye hedefli drill. |
| F5.8 | **Deneme 2:** Pazar 27 Ara, 14:00–17:00. İkinci örnek set: Solid Solutions PDF'i ya da Alberta soruları. **Ölçüt: %75+.** |
| F5.9–F5.12 | Kalan zayıf noktalar ve hız çalışması. Sınav randevusu ve kupon işi. |

**Kanıt çıktısı:** 2 zamanlı deneme puanı ve hata defteri. Ölçüt: 31 Aralık'a
kadar %75+.

**Kaynaklar:**
- [MySolidWorks: CSWA Exam Prep Course](https://my.solidworks.com/training/path/14)
- [CSWA örnek sınavı](https://www.solidworks.com/media/cswa-sample-exam),
  [resmi PDF](https://www.solidworks.com/sites/default/files/2017-12/CSWASampleExam.pdf)
- [Solid Solutions: CSWA sınav rehberi ve deneme testi (PDF, 2025)](https://www.solidsolutions.co.uk/wp-content/uploads/2025/12/SOLIDWORKS-Associate-CSWA-Sample-Exam.pdf)
- [University of Alberta: CSWA pratik soruları (PDF)](https://sites.ualberta.ca/~dnobes/Teaching_Section/CSWA/CSWA_Material/CSWA_Exam_Practice_Questions.pdf),
  [CSWA/CSWP yardım sayfası](https://sites.ualberta.ca/~dnobes/Teaching_Section/NOBES_CSWA.html)
- [GoEngineer: CSWA Preparation](https://www.goengineer.com/solidworks-certification/cswa)
- Çözüm videoları (kendi denemenden **sonra** izle):
  [resmi walk-through](https://www.youtube.com/watch?v=XdWYW4HOLT4),
  [TesterPRO ile örnek sınav](https://www.youtube.com/watch?v=eu1zbl1t7zc),
  [Problem 1.1 çözümü](https://www.youtube.com/watch?v=xPdiODMCu1c)
- [Açık ders kitabı: CSWA Preparation](https://pressbooks.pub/solidworks2/part/cswa-preparation)

### F6 · Final dönemi bakımı ve sınav — Ocak 2027
- Haftada 1–2 × 50 dk: 1 zamanlı soru ve 1 TooTallToby modeli. Yeni konu yok.
- Sınavdan 1 hafta önce: TesterPRO istemcisini kur ve 3DEXPERIENCE ID ile
  gir. Örnek sınavı istemcide bir kez çöz.
- **Sınav:** yarıyıl tatilinde (Ocak sonu – Şubat başı). Kalırsan 14 gün
  sonra tekrar girebilirsin. Hata defterini kullan.

### F7 · Yüzey modelleme ve kompozit kalıp temeli — Şubat–Mart 2027 (~4 hafta)
**Konular:** extrude/revolve/sweep/boundary yüzeyleri; trim, extend, knit,
thicken; zebra ve eğrilik kontrolü; draft analizi; parting line; parting ve
shut-off yüzeyleri; tooling split. Kompozit dişi kalıp için: kalıbı draft
açısına göre parçalara bölmek (≥ ~2° pozitif draft), kalıp flanşı, trim payı
(trim allowance), hizalama pimleri.

| Adım | Oturum |
|---|---|
| F7.1 | SOLIDWORKS Part Reviewer *Simple Surface Part 2*: boundary, knit, thicken. |
| F7.2 | MySolidWorks *Surface Modeling: Case Study*. Solid Solutions kaput örneği. |
| F7.3–F7.4 | **Burun yüzeyi:** 3 profil + kılavuz eğriler, boundary surface, zebra kontrolü, 2 mm thicken. |
| F7.5 | MySolidWorks *Mold Design*: draft analizi ve parting line. |
| F7.6 | Help *Generating Parting Lines* ve *Tooling Split* (enjeksiyon kalıbı mantığı). |
| F7.7 | **Dişi kalıp yarısı:** CalSol ve Easy Composites yöntemi. Offset yüzey, flanş, trim payı, bölme planı. |
| F7.8 | Takımın kompozit sorumlusuyla gözden geçirme. Düzeltmeler. |

**Kanıt çıktısı:** `F7_burun.SLDPRT`, `F7_disi-kalip.SLDPRT` ve draft
analizinin ekran görüntüsü.

**Kaynaklar:**
- [SOLIDWORKS blog: Simple Surface Part 2](https://blogs.solidworks.com/tech/2015/11/simple-surface-part-two.html)
- [Solid Solutions: yüzeyi katıya çevirmek (kaput örneği)](https://www.solidsolutions.co.uk/surface-modelling-how-to-convert-surfaces-to-solid-bodies-in-solidworks/)
- [MySolidWorks: Surface Modeling: Case Study](https://my.solidworks.com/training/master/282/)
- [MySolidWorks: Mold Design](https://my.solidworks.com/training/path/38/mold-design),
  [Introduction to Mold Design](https://my.solidworks.com/training/master/235/1/0/introduction+to+mold+design),
  [Tooling Split](https://my.solidworks.com/training/master/242/mold-design-tooling-split)
- [Help: Generating Parting Lines](https://help.solidworks.com/2027/english/swtutorialonline/t_moldstut_generatingpartinglines.htm),
  [Creating a Mold Core and Cavity](https://help.solidworks.com/2023/english/solidworks/sldworks/t_molds_tools_splitting.htm)
- [Hawk Ridge: Parting Line komutu](https://hawkridgesys.com/blog/mold-making-parting-line-command-solidworks)
- [CalSol (Berkeley güneş arabası): Shaping a Solar Car – Designing Molds](https://calsol.berkeley.edu/2018/02/21/shaping-a-solar-car-1-designing-molds/):
  doğrudan takımın problemi.
- [Easy Composites: kompozit kalıp için CAD teknikleri](https://easycomposites.co.uk/learning/CAD-techniques-for-composite-mould-design)

**Sonrası (Nisan 2027 ve sonrası):** CSWP ya da takım için uzmanlık
sınavları (sac metal, weldment). MySolidWorks'te *Sheet Metal in Weldments*
dersi, CSWPA Sheet Metal hazırlık yolunun içinde.

---

## Takım oynatma listeleri

> **YER TUTUCU:** Kullanıcı linkleri verince Claude bu tabloyu doldurur
> (Edit). Link uydurma. Her video, ilgili fazda bir adım olur (`T1.3` gibi).
> Aynı konuda takım videosu varsa genel kaynağın önüne geçer, çünkü takımın
> kurallarını taşır.

| # | Liste adı | Link | Konu | Eşleştiği faz | Video sayısı / süre | İlerleme |
|---|---|---|---|---|---|---|
| T1 | _(bekleniyor)_ | _(bekleniyor)_ | | | | 0 / ? |
| T2 | _(bekleniyor)_ | _(bekleniyor)_ | | | | 0 / ? |
| T3 | _(bekleniyor)_ | _(bekleniyor)_ | | | | 0 / ? |

**Nasıl izlenmeli: izle → durdur → aynısını çiz → değiştir**
1. **İzle (en fazla 3–5 dk):** Bir adımı izle. Hızlıysa 0,75×, yavaşsa 1,25×.
   Ne yapıldığını değil, **neden** yapıldığını not et.
2. **Durdur:** Videoyu durdur. Ekranda video olmadan sırayı tahmin et (geri
   çağırma).
3. **Aynısını çiz:** Aynı adımı kendi dosyanda yap. Takıldığında 10 sn geri
   sar, tamamını yeniden izleme.
4. **Değiştir:** Bölüm bitince bir parametreyi değiştir (çap, adet, açı).
   Model bozulmuyorsa tasarım niyeti doğru kurulmuştur. Bozuluyorsa nedenini
   bul. Asıl öğrenme burada.
5. **Kaydet:** Takımın adlandırma kuralıyla kaydet. Videodaki süre ile kendi
   sürenin oranını yaz (hedef ≤ 1:3).
- Oran: 50 dakikalık oturumda en fazla 15 dk video. Videoyu baştan sona
  izleyip sonra çizmek yok.
- Takım videosundaki kısayol, şablon ve klasör kurallarını
  "Riskler ve tavsiyeler → Dosya düzeni" listesine ekle.

---

## 50 dakikalık oturum şablonu

| Dakika | Ne | Not |
|---|---|---|
| 0–3 | **Başla:** dünkü dosyayı aç, `sonraki` adımını oku. Hedefi tek cümleyle dosya adına yaz. | Ör. "F1.4 fren diski: global variable ile 3 çap" |
| 3–8 | **Isınma (geri çağırma):** önceki oturumdaki bir sketch'i bakmadan 5 dk'da yeniden çiz ya da günün kısayolunu 5 kez kullan. | Hatırlamak, yeniden okumaktan daha kalıcıdır. |
| 8–18 | **Girdi:** video, MySolidWorks dersi ya da Help eğitimi. İzle → durdur döngüsü. | En fazla 10–15 dk |
| 18–40 | **Uygulama:** aynısını çiz. Kurallar: sketch tam tanımlı, Fix yok, feature'lara isim ver, birim MMGS. | Asıl çalışma |
| 40–45 | **Değiştir testi:** 1 parametreyi değiştir, rebuild et (Ctrl+Q). Kütle özelliklerini oku. | Hata varsa nedenini 1 cümleyle yaz. |
| 45–50 | **Kapanış:** dosyayı doğru klasöre kaydet, ekran görüntüsü al. 3 satır not: *ne yaptım / nerede takıldım / sıradaki*. Claude'a "çalıştım, kaydet" de. | Çıktısız oturum yarım sayılır. |
| +10 | **Mola:** ekrandan kalk, su iç. | Telefona bakma. |

**CSWA sprint varyantı (F5):** 0–3 başla; 3–43 zamanlı 3 soru (soru başına
≤ 13 dk, cevap kütle/ağırlık merkezi); 43–50 hata defteri.
**Takım işi varyantı:** 0–5 görevi ve ölçüleri netleştir; 5–45 çiz; 45–50
kaydet ve takıma bildir.

---

## Kaynak kütüphanesi

| Ad | Link | Tür | Dil | Neden | Süre / ücret |
|---|---|---|---|---|---|
| SOLIDWORKS Design Standard for Students | https://www.solidworks.com/product/students/design-standard | Lisans | EN | Ücretsiz masaüstü SolidWorks: sac metal, weldment, yüzey | Ücretsiz, 1 yıl (yenilenir); kupon yok |
| Öğrenci kurulum rehberi | https://files.solidworks.com/education/SW_Student_Std_Installation_Guide_ENG%20v3.pdf | PDF | EN | Kurulum adımları | Ücretsiz |
| Öğrenci takımı sponsorluğu | https://discover.solidworks.com/apply-for-our-exclusive-student-teams-free-sponsorship-program | Lisans | EN | Takım üyelerine Premium ve Simulation, bulut veri yönetimi | Ücretsiz (başvuruyu takım yapar) |
| SOLIDWORKS for Makers | https://www.solidworks.com/solution/solidworks-makers | Lisans | EN | Öğrenci lisansı yoksa yedek seçenek | 48 USD/yıl ya da 15 USD/ay, ticari olmayan kullanım |
| MySolidWorks eğitimleri (ücretsiz oldu) | https://blogs.solidworks.com/products/solidworks/advance-your-skills-anytime-anywhere-mysolidworks-training-resources-are-now-free/ | Kurs | EN | 400+ ders, öğrenme yolları, CSWA hazırlık | Ücretsiz (3DEXPERIENCE ID) |
| MySolidWorks: CSWA Exam Prep Course | https://my.solidworks.com/training/path/14 | Kurs | EN | Resmi sınav hazırlığı | Ücretsiz |
| MySolidWorks: Getting Started | https://my.solidworks.com/training/path/106/getting-started-with-solidworks-cad | Kurs | EN | İlk sketch, parça, montaj ve resim | Kısa |
| Yerleşik eğitimler (Help) | https://help.solidworks.com/2025/English/swconntutorial/c_swtut_getting_started_online.htm | Eğitim | EN | Program içinde adım adım | Lesson 1/2/3: ~30/45/15 dk |
| SOLIDWORKS Tutorials (resmi YouTube) | https://www.youtube.com/@solidworkstutorials_official | Video | EN | Mayıs 2026'da açılan resmi eğitim kanalı, başlangıç bölümü var | Ücretsiz |
| CSWA resmi sayfa | https://www.solidworks.com/certifications/cswa-design-associate | Bilgi | EN | Format, konu listesi, kurallar | Sınav 99 USD |
| CSWA akademik sürüm | https://www.solidworks.com/certifications/solidworks-cad-design-academic | Bilgi | EN | Okul üzerinden ücretsiz sınav seçeneği | Okul ACP ise ücretsiz |
| CSWA örnek sınavı | https://www.solidworks.com/media/cswa-sample-exam | Deneme | EN | Gerçek soru tarzı | Ücretsiz |
| CSWA Practice Exam Walk-Through (SOLIDWORKS) | https://www.youtube.com/watch?v=XdWYW4HOLT4 | Video | EN | Örnek sınavın resmi çözümü | Ücretsiz |
| Solid Solutions CSWA rehberi | https://www.solidsolutions.co.uk/wp-content/uploads/2025/12/SOLIDWORKS-Associate-CSWA-Sample-Exam.pdf | PDF | EN | İkinci deneme seti (2025) | Ücretsiz |
| Alberta CSWA pratik soruları | https://sites.ualberta.ca/~dnobes/Teaching_Section/CSWA/CSWA_Material/CSWA_Exam_Practice_Questions.pdf | PDF | EN | Ek pratik (eski sürüm, sorular geçerli) | Ücretsiz |
| Official Guide to CSWA (Planchard) | https://www.sdcpublications.com/Textbooks/Official-Guide-Certified-SOLIDWORKS-Associate/ISBN/978-1-63057-707-0/ | Kitap | EN | Kapsamlı resmi rehber | Ücretli, isteğe bağlı |
| TooTallToby Practice Models | https://www.tootalltoby.com/practice/ | Alıştırma | EN | Resimden 3D model, kütleyle kontrol (CSWA'ya benzer) | Ücretsiz hesap + premium |
| Model Mania (SOLIDWORKS) | https://www.solidworks.com/community/model-mania-live | Alıştırma | EN | Geçmiş yılların resimleri ve çözüm videoları | Ücretsiz |
| SOLIDWORKS Exercises (CADArtifex) | https://www.cadartifex.com/solidworks-exercises-3-edition | Kitap | EN | 100 resimden modelleme alıştırması | Ücretli |
| Introduction to SolidWorks (açık kitap) | https://pressbooks.pub/solidworks1/chapter/sketch-tools | Kitap | EN | Sketch ve ilişkiler | Ücretsiz |
| SOLIDWORKS Dersleri (YouTube) | https://www.youtube.com/c/SOLIDWORKSDersleri | Video | TR | Başlangıç düzeyi Türkçe anlatım | Ücretsiz |
| SolidWorks 2019 Eğitim Seti, sıfırdan ileri | https://www.youtube.com/playlist?list=PLkmrQtzizt7mUQxHZ5wyCW5IBWFR8fajd | Video | TR | ~97 video, ~10 sa; Türkçe terim desteği | Ücretsiz (2019 sürümü) |
| SolidWorks Eğitim Videoları Türkçe 2021 | https://m.youtube.com/playlist?list=PLs4Go4d50-VtOwwfHSLEIXvI-W96J9-9v | Video | TR | 2D çizim ve temel uygulamalar | Ücretsiz (2021 sürümü) |
| GD&T Basics: semboller | https://www.gdandtbasics.com/gdt-symbols/ | Rehber | EN | 14 GD&T sembolü, kontrol çerçevesi | Ücretsiz (ASME tabanlı) |
| Javelin: Weldments rehberi | https://www.javelin-tech.com/blog/2024/05/solidworks-weldments/ | Blog | EN | Structural member, köşe işlemleri, kesim listesi | Ücretsiz |
| GoEngineer: Design Tables | https://www.goengineer.com/blog/solidworks-design-tables-made-easy | Blog | EN | Excel ile konfigürasyon ailesi | Ücretsiz |
| SimulationXpress ve Simulation farkı | https://blogs.solidworks.com/tech/2017/09/solidworks-simulation-vs-simulationxpress.html | Blog | EN | Sınırları bilmek (tek gövde, lineer statik) | Ücretsiz |
| CalSol: güneş arabası kalıpları | https://calsol.berkeley.edu/2018/02/21/shaping-a-solar-car-1-designing-molds/ | Blog | EN | Karbon gövde için dişi kalıp, bölme ve draft | Ücretsiz |
| Easy Composites: kalıp CAD teknikleri | https://easycomposites.co.uk/learning/CAD-techniques-for-composite-mould-design | Rehber | EN | Parting line, flanş, trim payı | Ücretsiz |
| Solid Solutions: veri yönetiminin 6 altın kuralı | https://solidsolutions.co.uk/Blog/2021/02/The-6-Golden-Rules-of-Managing-Data-in-SOLIDWORKS | Blog | EN | Dosya düzeni, tek doğru kopya | Ücretsiz |
| Visiativ CAD Best Practice Guide | https://visiativ.co.uk/wp-content/uploads/2025/12/Visiativ-SolidWorks-CAD-Best-Practice-Guide.pdf | PDF | EN | Tasarım niyeti ve modelleme alışkanlıkları | Ücretsiz |
| GoEngineer CAD Cheat Sheet | https://www.goengineer.com/solidworks-cad-cheat-sheet | PDF | EN | Kısayollar ve mouse gesture'lar (3 sayfa) | Ücretsiz |

> **Türkçe kaynak notu:** Türkçe videolar 2019–2021 sürümlerine ait. Temel
> mantık aynı ama menüler biraz farklı. Türkçe weldment, sac metal ve CSWA
> kaynağı aramalarda bulunamadı. Bu konularda İngilizce kaynak ve takım
> listeleri esas alınacak.

---

## AI özet ve tavsiye kuralları

`/calis solidworks` kapanışında ("çalıştım", "bitti") Claude şunları yapar.

**1. En fazla 2 soru sor:** "Hangi dosyayı bitirdin, nerede takıldın?" ve
gerekiyorsa "Kütle ya da süre kaç çıktı?"

**2. Telefona sığan özet (en fazla 6 satır, bu sırayla):**
```
Öğrendin: <2 madde, kavram adıyla: "global variable", "limit angle mate">
Hata: [KOD] <ne oldu> → <nasıl düzeltilir, 1 cümle>
Sonraki alıştırma: <adım kodu> <ölçülü parça tarifi: malzeme, ana ölçüler, beklenen çıktı>
Kısayol: <havuzdan, daha önce verilmemiş 1 ipucu>
Hafta: <bu hafta dk> / <hedef dk>
```

**3. Hata kodları** (`ilerleme.hatalar.<KOD>` sayacını artır):

| Kod | Anlamı |
|---|---|
| S | Sketch tam tanımlı değil, Fix ilişkisi ya da Fully Define aracı kullanılmış |
| N | Tasarım niyeti: değiştir testinde model bozuldu |
| R | Rebuild hatası ya da uyarısı bırakıldı |
| M | Mate hatası, aşırı tanımlı ya da yanlış serbestlik |
| B | Birim veya hassasiyet hatası (MMGS/IPS, ondalık basamak) |
| K | Malzeme ya da kütle sonucu yanlış |
| T | Teknik resim kuralı (izdüşüm, eksik ölçü, tolerans) |
| D | Dosya düzeni (isim, klasör, kopya dosya, kırık referans) |
| Z | Süre aşımı (CSWA sorusu > 13 dk) |

**4. Karar kuralları**
- Son 5 oturumda aynı kod 3 kez görüldüyse sonraki oturum o konuda 10 dk'lık
  hedefli bir drill ile başlar.
- Kanıt dosyası yoksa oturum yarım sayılır. `sonraki` aynı adımda kalır.
- Fazın çıkış kanıtı hazırsa `faz` alanını ilerlet. Faz süresi dolduysa en
  fazla 1 hafta uzat, sonra "borç" notuyla geç.
- Hafta cumartesisine kadar 150 dk'nın altındaysa bunu söyle ve
  `planla.py gun` ile boş bir zirve bloğu öner.
- Takım görevi yapıldıysa ilgili fazın adımı sayılır. Hangi adım olduğunu
  belirt.
- Kullanıcı takım oynatma listesi linki verirse "Takım oynatma listeleri"
  tablosunu güncelle. Link uydurma, verilmeyen linki doldurma.
- Konu anlatımı istenirse kısa ve doğru anlat, sonra kaynağa yönlendir.
  Kaynağın yerine geçmeye çalışma.
- Rutin modunda soru sorma. Soruları `ozet` alanına yaz.

**5. Kısayol havuzu** (sırayla ver, verilenleri `ilerleme.kisayollar`'a
yaz):
`S` (kısayol çubuğu) · sağ tık + sürükle (mouse gesture; Tools › Customize'dan
ayarlanır) · `Space` (görünüş yönü menüsü) · `Ctrl+8` (Normal To) ·
`Ctrl+7` (izometrik) · `F` (ekrana sığdır) · `Ctrl+B` (rebuild) · `Ctrl+Q`
(zorla rebuild) · `Enter` (son komutu tekrarla) · çizgi çizerken `A` (teğet
yaya geç) · `Ctrl` + seçim (çoklu seçimle ilişki ekleme) · `Shift` + orta tuş
(zoom), `Ctrl` + orta tuş (pan) · Tools › Customize › Keyboard (kendi
kısayolunu tanımla).

---

## İlerleme ölçümü

**Kontrol noktaları**

| Tarih | Ne ölçülür | Eşik | Eşik altıysa |
|---|---|---|---|
| 18 Eki | F0 kanıtları ve CSWA başlangıç (2 temel parça) | 5 dosya; başlangıç sadece kaydedilir | F0 eksiğini F1'in ilk oturumuna al |
| 1 Kas | Fren diski rebuild testi ve TooTallToby süresi | 3 çapta 0 hata; model ≤ 25 dk | F1'i 1 hafta uzat |
| 15 Kas | Direksiyon montajı | Hareketli; çakışma 0 ya da açıklanmış | Mate drill'i; F2.6'yı (top-down) kısalt |
| 29 Kas | Teknik resim kontrolü | ≤ 3 düzeltme | F3.8'i tekrarla |
| 13 Ara | Weldment, kesim listesi ve DXF | 3 dosya hazır | Takım işi varsa F4.7 yeterli sayılır |
| 20 Ara | Deneme 1 (180 dk) | Kayıt; hedef %65+ | Hata defterinden 2 kategori seç |
| 27–31 Ara | Deneme 2 | **%75+** | Sınavı Şubat sonuna kaydır, F5'i 2 hafta uzat |
| Oca sonu – Şub başı | CSWA | Geçti | 14 gün sonra tekrar gir |

**Her hafta izlenen sayılar:** toplam dk (hedef 200), oturum sayısı (hedef
4), kanıt dosyası (hedef ≥ 2), hata sayacı trendi, CSWA soru başına ortalama
süre (F5'te hedef ≤ 13 dk).

**Pano belgesi `izler/solidworks` başlangıç değerleri (öneri):**
```json
{
  "ad": "SolidWorks", "oncelik": 1, "alan": "solar",
  "haftalik_hedef_dk": 200,
  "ozel_hedefler": [{"bas": "2026-10-13", "bit": "2026-10-18", "hedef_dk": 450}],
  "varsayilan_oturum_dk": 50, "faz": "F0", "sonraki": "F0.1",
  "ilerleme": {
    "kanit_dosyalari": [], "cswa_baslangic": null, "cswa_denemeler": [],
    "tootalltoby": [], "hatalar": {"S":0,"N":0,"R":0,"M":0,"B":0,"K":0,"T":0,"D":0,"Z":0},
    "kisayollar": [], "takim_listeleri": {}
  }
}
```

---

## Riskler ve tavsiyeler

| Risk | Belirti | Önlem |
|---|---|---|
| **Pasif video izleme** | Oturum sonunda dosya yok | En fazla 15 dk video; izle → durdur → çiz; çıktısız oturum yarım sayılır. |
| **Lisans ve sürüm uyumsuzluğu** | Takımın dosyası açılmıyor | Takımın sürümünü kur. SolidWorks dosyaları genelde eski sürümde açılmaz. Öğrenci lisansıyla kaydedilen dosyalar eğitim filigranı taşıyabilir; takımın lisansıyla uyumu sor. |
| **Sınav erişimi ve ücret** | Kupon yok | Önce ESTÜ ACP ve takım sponsorluğunu sor. Sonra Design Premium for Students'a bak. En son 99 USD. Aralık başında netleştir. |
| **İngilizce sınav** | Terimleri bilmeme | Arayüzü İngilizce kullan; Türkçe videolarda terimin İngilizcesini not et. |
| **Vize ve finaller** | Hafta sıfır geçiyor | En az 2 × 50 dk. CSWA tarihi gerekirse Şubat sonuna kayar; dersler önce gelir. |
| **Takım işi ile müfredat çakışması** | Müfredat ilerlemiyor | Takım işi daha değerli. O hafta takım işini ilgili faz adımı say. Sertifika tarihi kayabilir. |
| **Kötü modelleme alışkanlığı** | Değiştirince model bozuluyor | Fix yok. Fully Define aracı yalnızca kontrol için kullanılır. Simetri ilişkisi tercih edilir. Feature'lara isim verilir. Her oturumda değiştir testi yapılır. |
| **Yukarıdan aşağı tasarımda kırık referanslar** | Montaj yavaş, hatalı | Dış referansları yalnızca layout/iskelet sketch'e bağla. Parçalar arasında zincir referans kurma. |
| **SimulationXpress'e fazla güven** | Takım kararı Xpress sonucuna dayanıyor | Xpress yalnızca tek gövde, lineer statik, sabit mesnet ve kuvvet/basınç yapar. İnce parçalarda çözemeyebilir. Takım kararları için Ansys kullan (`solar-team/mekanik-muhendis-rehberi.md` §5.3). Her sonucun yanına el hesabı yaz. |
| **Kalıp tasarımında gerçeklik farkı** | CAD'de olur, atölyede çıkmaz | ≥ ~2° pozitif draft, bölme hatları, flanş ve trim payı. Kompozit sorumlusunun onayı olmadan kalıp çıkarılmaz. |
| **Planlama yanılgısı** | 50 dk'ya 2 adım sığmıyor | Oturum başına tek çıktı. Tahmin katsayısı `planla.py katsayi` ile izlenir. |

**Dosya düzeni ve revizyon alışkanlıkları (ilk günden):**
- Takımın kuralı her zaman önce gelir. Kural yoksa öneri:
  `<proje>-<alt sistem>-<no>_<ad>`, ör. `ESC26-FRN-0103_disk`.
  Revizyonu dosya adına değil **custom property**'ye yaz (`Revision`,
  `Material`, `Designer`). Antet bu alanlardan beslenir.
- `son`, `son2`, `yeni_v3` gibi adlar yok. Her parçanın tek canlı kopyası
  olur.
- Dosyayı Windows Gezgini'nde yeniden adlandırma; referanslar kırılır.
  **Pack and Go** ya da SolidWorks içinden *Save As* (referansla) kullan.
- Paylaşım formatları: STEP (başka CAD/analiz), STL (3B baskı), DXF (lazer
  ve su jeti), PDF (resim).
- Takımın PDM'i ya da 3DEXPERIENCE bulutu varsa check-in/check-out
  disiplinini öğren. Sponsorluk paketinde bulut veri yönetimi var.
- Her oturum sonunda: kaydet, kanıt ekran görüntüsünü al, `ilerleme.kanit_dosyalari`'na ekle.
