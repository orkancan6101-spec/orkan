#!/usr/bin/env python3
"""Mekanik Mühendis Yol Haritası PDF'ini üretir.

İçerik bu dosyadaki verilerdir; HTML bunlardan üretilir ve Chromium ile PDF'e basılır.

Kullanım:
    python3 build.py

Gerekenler: Chromium/Chrome (CHROME ortam değişkeniyle de verilebilir), curl ve
ilk çalıştırmada IBM Plex fontlarını indirmek için internet.
Çıktı: ../yol-haritasi.pdf
"""
import glob
import html
import os
import re
import shutil
import subprocess
from pathlib import Path

BURASI = Path(__file__).resolve().parent
FONT_DIR = BURASI / ".fonts"
HTML_YOLU = BURASI / "yol-haritasi.html"
PDF_YOLU = BURASI.parent / "yol-haritasi.pdf"

GF_URL = ("https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@"
          "0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@500;600&display=swap")
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36"
ALT_KUMELER = {"latin", "latin-ext", "greek"}  # Türkçe karakterler latin-ext'te, ρ η π greek'te

# --------------------------------------------------------------------------- içerik

HATLAR = {  # anahtar: (ad, ana renk, açık zemin, çizgi)
    "yapi": ("Yapı", "#2563eb", "#eff6ff", "#bfdbfe"),
    "akis": ("Akış & Isı", "#ea580c", "#fff7ed", "#fed7aa"),
    "dinamik": ("Dinamik", "#16a34a", "#f0fdf4", "#bbf7d0"),
    "uretim": ("Üretim & Test", "#9333ea", "#faf5ff", "#e9d5ff"),
    "dijital": ("Dijital", "#0891b2", "#ecfeff", "#a5f3fc"),
    "sistem": ("Sistem", "#475569", "#f8fafc", "#cbd5e1"),
}

ONCELIK = {
    "cekirdek": ("Çekirdek", "Herkes bilmeli"),
    "guclendirici": ("Güçlendirici", "Seni hızlandırır"),
    "uzmanlik": ("Uzmanlık", "Derinleşeceğin alan"),
}

ASAMALAR = [
    (1, "Temel", "Hesap dili",
     "Bu dersler olmadan yazılımlar sadece renkli resim üretir. Bir sonucun doğru olup "
     "olmadığını anlamanın tek yolu burada."),
    (2, "Araçlar", "Fikri parçaya çevir",
     "Tasarımı dijitalde kurmak, üretilebilir hale getirmek ve hesabı hızlandırmak."),
    (3, "Analiz", "Üretmeden önce bil",
     "Kalıp, CNC saati ve malzeme pahalı. Kararı deneme-yanılmayla değil, simülasyonla ver."),
    (4, "Doğrulama", "Gerçeği ölç, sistemi yönet",
     "Simülasyon ancak testle doğrulanınca değer taşır; araç ancak belgelenince yönetilir."),
    (5, "Kaldıraç", "Hızlan ve ölçekle",
     "Mekanik bilgini yazılımla çarp: aynı işi on kat hızlı yap, on kat fazla dene."),
]

HEDEF = "Mekaniği derinden bilen, yazılımı ve yapay zekâyı kaldıraç olarak kullanan mühendis"

BECERILER = [
    dict(no=1, asama=1, hat="dinamik", oncelik="cekirdek",
         ad="Statik & Dinamik",
         kisa="Her hesabın başlangıcı: parçaya gelen yükü bul",
         once="Fizik, matematik (vektör, türev-integral)",
         yarar="Aracın her parçasına gelen kuvveti bulmanın yolu. Süspansiyon kollarındaki "
               "kuvvetler, frenlemede öne kayan yük ve virajda dış tekerleğe binen yük buradan "
               "hesaplanır.",
         neden="Yükü bilinmeden tasarlanan parça ya kırılır ya gereksiz ağır olur. FEA dahil her "
               "analiz doğru bir serbest cisim diyagramıyla başlar; programa yanlış yük girersen "
               "sonuç da yanlış çıkar.",
         ogren=["Serbest cisim diyagramı alışkanlığı: her problemde önce çiz",
                "3B denge: 6 denklem, 6 bilinmeyen (süspansiyon bağlantı kuvvetleri)",
                "İki kuvvet elemanı: rot başlı çubuk yalnızca çeker veya iter",
                "Newton–Euler: ivmelenme, frenleme ve viraj kuvvetleri",
                "Yük transferi: ΔW = m·a·h / L",
                "Sürtünme ve yuvarlanma direnci"],
         terimler=[("Free body diagram", "serbest cisim diyagramı"), ("Load case", "yük durumu"),
                   ("Reaction force", "tepki kuvveti"), ("Two-force member", "iki kuvvet elemanı"),
                   ("Weight transfer", "yük transferi"), ("Center of gravity", "ağırlık merkezi"),
                   ("Moment arm", "moment kolu")],
         hazir="Frenlemede ön tekerleklere binen yükü ve bir süspansiyon kolundaki kuvveti kâğıt "
               "üzerinde hesaplayabiliyorsun.",
         kaynak="Hibbeler, Engineering Mechanics: Statics & Dynamics · Milliken, Race Car Vehicle "
                "Dynamics (yük transferi bölümleri)"),
    dict(no=2, asama=1, hat="yapi", oncelik="cekirdek",
         ad="Mukavemet",
         kisa="Kırılır mı, eğilir mi, burkulur mu?",
         once="Statik",
         yarar="Parçanın kırılıp kırılmayacağını, ne kadar eğileceğini ve burkulup "
               "burkulmayacağını söyler: şasi boruları, salıncaklar, akslar, braketler, roll bar.",
         neden="Hafif ama güvenli parça tasarlamanın tek yolu. FEA sonucunu kontrol edeceğin el "
               "hesapları buradan gelir; mukavemet bilmeyen FEA kullanıcısı ekrandaki renklere "
               "inanır.",
         ogren=["Eğilme σ = M·c/I, burulma τ = T·r/J, eksenel yük, kesme",
                "Sehim formülleri: konsol ve basit mesnetli kiriş",
                "Bileşik gerilme, Mohr çemberi, asal gerilmeler",
                "Akma kriterleri: von Mises, Tresca",
                "Euler burkulması: P_cr = π²·E·I / (K·L)²",
                "Gerilme yığılması (Kt): delik, köşe, kademe",
                "İnce cidarlı borular ve kesit seçimi"],
         terimler=[("Stress / strain", "gerilme / şekil değiştirme"),
                   ("Yield strength", "akma dayanımı"), ("Safety factor", "emniyet katsayısı"),
                   ("Deflection", "sehim"), ("Buckling", "burkulma"),
                   ("Stress concentration", "gerilme yığılması"),
                   ("Moment of inertia", "atalet momenti"), ("Stiffness", "rijitlik")],
         hazir="Bir kolun kritik kesitini bulup gerilme ve sehimini el hesabıyla çıkarabiliyor, "
               "sonucu FEA ile %10–20 içinde tutturabiliyorsun.",
         kaynak="Hibbeler, Mechanics of Materials · Beer & Johnston, Mechanics of Materials"),
    dict(no=3, asama=1, hat="yapi", oncelik="cekirdek",
         ad="Malzeme Bilimi",
         kisa="Doğru malzeme = hafif ve güvenli parça",
         once="Temel kimya ve fizik",
         yarar="Hangi parçanın alüminyum, çelik, titanyum ya da karbon olacağına karar vermeni "
               "sağlar; ısıl işlemin ve kaynağın malzemeyi nasıl değiştirdiğini anlatır.",
         neden="Yanlış malzeme ya fazla kütle ya erken kırılma demektir. Çelik, alüminyum ve "
               "titanyumun rijitlik/ağırlık oranı neredeyse aynıdır (E/ρ ≈ 25); hafiflik doğru "
               "seçimden, geometriden ve kompozitten gelir. Bunu bilmeyen “alüminyum yaparız, "
               "hafif olur” der.",
         ogren=["6061-T6 ve 7075-T6 alüminyum, 4130 çelik, Ti-6Al-4V: dayanım, rijitlik, yoğunluk",
                "Isıl işlem ve kaynak: T6 alüminyum kaynak bölgesinde zayıflar",
                "Yorulma davranışı: alüminyumun sürekli mukavemet sınırı yoktur",
                "Korozyon; özellikle karbon–alüminyum temasında galvanik korozyon",
                "Kompozitin bileşenleri: lif, reçine, çekirdek",
                "Malzeme seçim mantığı: Ashby diyagramları"],
         terimler=[("Young's modulus", "elastisite modülü"),
                   ("Specific stiffness", "özgül rijitlik"), ("Heat treatment", "ısıl işlem"),
                   ("HAZ", "ısı tesiri altındaki bölge"), ("Ductility", "süneklik"),
                   ("Galvanic corrosion", "galvanik korozyon"), ("Fatigue limit", "yorulma sınırı")],
         hazir="Bir parça için iki malzemeyi kütle, dayanım, üretilebilirlik ve maliyet üzerinden "
               "karşılaştırıp gerekçeli seçim yapabiliyorsun.",
         kaynak="Callister, Materials Science and Engineering · Ashby, Materials Selection in "
                "Mechanical Design"),
    dict(no=4, asama=1, hat="yapi", oncelik="cekirdek",
         ad="Makine Elemanları & Yorulma",
         kisa="Cıvata, rulman, mil: araç bunlarla bir arada durur",
         once="Mukavemet, Malzeme Bilimi",
         yarar="Cıvata, rulman, mil, kama, kaynak, yay, dişli ve zincir hesabı: göbek–aks–rulman "
               "grubu, motor bağlantısı, fren ve direksiyon bağlantıları.",
         neden="Araç bu elemanlarla bir arada durur ve yarış araçlarında sık görülen arızalar da "
               "buradan çıkar: gevşeyen cıvata, yorulan parça, ömrünü doldurmuş rulman. Takımda "
               "en sık kullanacağın ders budur.",
         ogren=["Cıvatalı bağlantı: ön yük, sıkma torku T = K·F·d, dayanım sınıfları (8.8, 10.9, "
                "12.9), gevşemeye karşı önlemler",
                "Yorulma: S-N eğrisi, Goodman diyagramı, gerilme yığılmasının etkisi",
                "Rulman seçimi ve ömrü: L10 = (C/P)³; keçe tipinin sürtünmeye etkisi",
                "Mil ve aks tasarımı: dönen eğilme",
                "Kaynak dikişi hesabı",
                "Zincir, kayış ve dişli aktarma",
                "Tolerans ve geçmeler: rulman yuvası"],
         terimler=[("Preload", "ön yük"), ("Torque spec", "sıkma torku"),
                   ("Property class", "dayanım sınıfı"), ("S-N curve", "S-N eğrisi"),
                   ("Endurance limit", "sürekli mukavemet sınırı"), ("Bearing life", "rulman ömrü"),
                   ("Fit", "geçme"), ("Thread locker", "vida sabitleyici")],
         hazir="Bir tekerlek göbeği için rulman seçip ömrünü hesaplayabiliyor, bağlantı "
               "cıvatalarının torkunu ve ön yükünü gerekçelendirebiliyorsun.",
         kaynak="Shigley's Mechanical Engineering Design · Carroll Smith, Nuts, Bolts, Fasteners "
                "and Plumbing Handbook"),
    dict(no=5, asama=1, hat="akis", oncelik="cekirdek",
         ad="Akışkanlar Mekaniği & Isı Transferi",
         kisa="Havanın direnci ve ısının yönetimi",
         once="Dinamik, Termodinamik",
         yarar="Gövdenin havayla etkileşimi (sürükleme, kaldırma, sınır tabaka) ve ısının "
               "hareketi: batarya, motor, fren ve sürücü kabininin soğutulması.",
         neden="Hız arttıkça aracın en büyük kaybı aerodinamik dirençtir; aerodinamik güç hızın "
               "küpüyle artar. Isı hem verimi düşürür hem güvenlik riski yaratır. CFD'yi doğru "
               "kullanmak için teorisini bilmen şart; yoksa program ne verirse ona inanırsın.",
         ogren=["Bernoulli, basınç katsayısı (Cp), Reynolds sayısı",
                "Sınır tabaka: laminer, türbülanslı, geçiş, akış ayrılması",
                "Sürükleme türleri: basınç (biçim) ve yüzey sürtünmesi; CdA kavramı",
                "Boyut analizi ve benzerlik: rüzgâr tüneli modelleri",
                "Isı iletimi, taşınımı ve ışınımı; taşınım katsayısı",
                "Basit soğutma hesabı: Q = ṁ·c_p·ΔT"],
         terimler=[("Drag coefficient", "sürükleme katsayısı"), ("CdA", "sürükleme alanı"),
                   ("Boundary layer", "sınır tabaka"), ("Separation", "akış ayrılması"),
                   ("Wake", "iz bölgesi"), ("Reynolds number", "Reynolds sayısı"),
                   ("Convection", "taşınım")],
         hazir="Bir gövdenin arka kısmının neden yavaş daraldığını anlatabiliyor ve bir bataryayı "
               "soğutmak için gereken hava debisini kabaca hesaplayabiliyorsun.",
         kaynak="Çengel & Cimbala, Fluid Mechanics · Çengel & Ghajar, Heat and Mass Transfer "
                "(Türkçe çevirileri var)"),
    dict(no=6, asama=1, hat="dinamik", oncelik="guclendirici",
         ad="Mekanizma Tekniği & Titreşim",
         kisa="Süspansiyon bir mekanizmadır; rezonans kırar",
         once="Dinamik",
         yarar="Süspansiyon ve direksiyon aslında birer mekanizmadır (dört çubuk bağlantıları). "
               "Titreşim ise yol ve motor kaynaklı salınımları, rezonansı ve konforu belirler.",
         neden="Süspansiyon çalışırken tekerleğin açısı değişir; bunu hesaplayamazsan lastik yana "
               "sürtünür ve sürekli enerji kaybedersin. Rezonansa giren braket kırılır, titreşim "
               "cıvataları gevşetir.",
         ogren=["Dört çubuk mekanizması: konum ve hız analizi",
                "Ani dönme merkezi, serbestlik derecesi (Grübler)",
                "Tek ve çok serbestlik dereceli titreşim; f = (1/2π)·√(k/m)",
                "Sönüm, rezonans, zorlanmış titreşim",
                "Çeyrek araç modeli: yaylı ve yaysız kütle",
                "Modal analiz kavramı"],
         terimler=[("Linkage", "mekanizma"), ("Instant center", "ani dönme merkezi"),
                   ("Degree of freedom", "serbestlik derecesi"),
                   ("Natural frequency", "doğal frekans"), ("Damping", "sönüm"),
                   ("Resonance", "rezonans"), ("Quarter-car model", "çeyrek araç modeli")],
         hazir="Bir çift salıncak süspansiyonun ani dönme merkezini çizebiliyor, bir braketin doğal "
               "frekansını tahmin edip modal analizle karşılaştırabiliyorsun.",
         kaynak="Norton, Design of Machinery · Rao, Mechanical Vibrations"),
    dict(no=7, asama=2, hat="uretim", oncelik="cekirdek",
         ad="CAD",
         kisa="Takımın ortak dili; her analiz buradan beslenir",
         once="Teknik resim",
         yarar="Aracın dijital ikizi: parça tasarımı, montaj, yerleşim, çakışma kontrolü, kütle "
               "hesabı, teknik resim ve üretim dosyaları.",
         neden="Takımın ortak dili CAD'dir; FEA, CFD, kinematik ve üretimin hepsi CAD'den beslenir. "
               "CAD'de yavaş ya da dağınık çalışan kişi her toplantıda ve her revizyonda geride "
               "kalır.",
         ogren=["Parametrik modelleme ve tasarım niyeti: ölçü değişince model bozulmamalı",
                "İskelet modelle yukarıdan aşağı montaj: bağlantı noktaları tek referansta",
                "Yüzey modelleme: gövde ve kalıp",
                "Kaynaklı yapılar ve sac metal",
                "Çakışma analizi ve kütle özellikleri",
                "Teknik resim, tolerans, GD&T",
                "Dosya ve versiyon düzeni; STEP, STL, DXF çıktıları"],
         terimler=[("Design intent", "tasarım niyeti"), ("Assembly / mate", "montaj / kısıt"),
                   ("Skeleton model", "iskelet model"), ("Surface", "yüzey"),
                   ("Interference", "çakışma"), ("Packaging", "yerleşim"),
                   ("GD&T", "geometrik toleranslandırma"), ("BOM", "malzeme listesi")],
         hazir="Bir süspansiyon köşesini iskelet modelden parametrik kurabiliyor; bir bağlantı "
               "noktası değişince tüm montajın doğru güncellendiğini gösterebiliyorsun.",
         kaynak="Takımın kullandığı CAD'in resmi eğitimleri · SolidWorks ise CSWA → CSWP "
                "sertifikaları"),
    dict(no=8, asama=2, hat="uretim", oncelik="cekirdek",
         ad="Üretim Bilgisi & DFM",
         kisa="Üretilemeyen parça tasarım değil, çizimdir",
         once="CAD, Malzeme Bilimi",
         yarar="Parçanın nasıl, ne kadar sürede ve kaça üretileceğini belirler: CNC, kaynak, lazer "
               "ve su jeti kesim, 3B baskı, kompozit üretim (kalıp, katman serimi, vakum "
               "torbalama, kür).",
         neden="Üretilemeyen parça tasarım değil, çizimdir. Üretimi bilen mühendis ilk seferde "
               "yapılabilir parça çizer; takım zaman ve para kaybetmez. Donanım girişimlerinin en "
               "zor kısmı da budur: prototipten üretime geçiş.",
         ogren=["CNC mantığı: takım erişimi, iç köşe radyusu, bağlama",
                "TIG kaynağı ve kaynak fikstürü",
                "Tolerans–maliyet ilişkisi: gereksiz hassasiyet pahalıdır",
                "3B baskı: FDM, SLA, SLS; aparat, prototip, kalıp",
                "Kompozit üretim: kalıp zinciri, vakum torbası katmanları, kür, kalite kontrol",
                "Montaj ve servis için tasarım: anahtar boşluğu",
                "İş güvenliği: epoksi, karbon tozu, tezgâh"],
         terimler=[("DFM / DFA", "üretim / montaj için tasarım"), ("CAM", "bilgisayar destekli üretim"),
                   ("Fixture", "fikstür"), ("Tool access", "takım erişimi"),
                   ("Tolerance stack-up", "tolerans zinciri"),
                   ("Vacuum bagging", "vakum torbalama"), ("Peel ply", "soyma kumaşı"),
                   ("Cure", "kür")],
         hazir="Tasarladığın parçayı atölyede kendin üretebiliyor ya da üreticiye tek seferde doğru "
               "teknik resim ve dosya verebiliyorsun.",
         kaynak="Atölyede bizzat üretim · Kalpakjian & Schmid, Manufacturing Engineering and "
                "Technology · McBeath, Competition Car Composites"),
    dict(no=9, asama=2, hat="dijital", oncelik="guclendirici",
         ad="Python ile Mühendislik Hesabı",
         kisa="El hesabını tekrar kullanılabilir araca çevir",
         once="Temel programlama (yoksa buradan başla)",
         yarar="El hesabını tekrar kullanılabilir bir araca çevirir: fren boyutlandırma, cıvata ön "
               "yükü, yük transferi, enerji tüketimi, test verisi analizi ve grafik.",
         neden="Aynı hesabı 50 farklı parametre için saniyeler içinde yaparsın; “şu değişirse ne "
               "olur?” sorusuna anında cevap verirsin. Mekanik bilip kod yazabilen kişi takımda "
               "nadirdir ve karar hızını doğrudan artırır.",
         ogren=["numpy, matplotlib, pandas",
                "scipy: denklem çözme, optimizasyon, eğri uydurma (curve_fit)",
                "Birimlerle çalışma ve birim testleri: hesabın doğruluğunu kanıtla",
                "Parametrik tarama ve duyarlılık analizi",
                "Jupyter ile hesap raporu"],
         terimler=[("Script", "betik"), ("Parametric sweep", "parametrik tarama"),
                   ("Sensitivity analysis", "duyarlılık analizi"), ("Curve fit", "eğri uydurma"),
                   ("Unit test", "birim testi"), ("Notebook", "defter")],
         hazir="Bir fren sistemi hesabını girdileri değiştirilebilir bir Python aracına çevirip "
               "sonucunu el hesabıyla doğrulayabiliyorsun.",
         kaynak="Kong, Siauw & Bayen, Python Programming and Numerical Methods (ücretsiz, "
                "çevrimiçi)"),
    dict(no=10, asama=3, hat="yapi", oncelik="cekirdek",
         ad="FEA · ANSYS Mechanical",
         kisa="Üretmeden gör, kütleyi güvenle azalt",
         once="Mukavemet, Makine Elemanları, CAD",
         yarar="Parçayı üretmeden önce gerilme, şekil değiştirme, doğal frekans ve burkulma yükünü "
               "gösterir: braket, porya, şasi, roll bar, göbek ve bağlantı noktaları.",
         neden="Kütleyi güvenle azaltmanın yolu budur: nerede malzeme fazla, nerede eksik "
               "görürsün. Takımda en çok talep edilen analiz becerisidir. Ama yanlış sınır koşulu "
               "ya da ağla tamamen yanlış sonuç üretir; doğru kullanmayı bilen kişi bu yüzden "
               "değerlidir.",
         ogren=["Workbench akışı ve birimler; basit problemleri el hesabıyla doğrula",
                "Ağ: eleman tipi ve derecesi, kalite ölçütleri, yakınsama çalışması",
                "Sınır koşulları: ankastre tuzağı, uzak yer değiştirme, elastik destek, simetri",
                "Tekillik ile gerçek gerilme yığılmasını ayırt etmek",
                "Temaslar ve cıvata ön yükü",
                "Modal analiz ve lineer burkulma",
                "İleri: yorulma, topoloji optimizasyonu, parametrik tarama"],
         terimler=[("Mesh", "ağ"), ("Convergence", "yakınsama"),
                   ("Boundary condition", "sınır koşulu"), ("Fixed support", "ankastre"),
                   ("Remote displacement", "uzak yer değiştirme"), ("Contact", "temas"),
                   ("Singularity", "tekillik"), ("Shell / solid / beam", "kabuk / katı / kiriş")],
         hazir="Bir braket analizinde sınır koşullarını gerekçelendirebiliyor, en az 3 ağla "
               "yakınsama gösteriyor ve sonucu el hesabıyla doğrulayabiliyorsun.",
         kaynak="Ansys Innovation Courses (ücretsiz) · Cornell, A Hands-on Introduction to "
                "Engineering Simulations (edX) · Gokhale, Practical Finite Element Analysis · "
                "Ansys Student ücretsiz; yapısal analizde 128 bin düğüm/eleman sınırı"),
    dict(no=11, asama=3, hat="yapi", oncelik="uzmanlik",
         ad="Kompozit Tasarımı · CLT & ANSYS ACP",
         kisa="Karbonun gücü doğru katman yönünden gelir",
         once="Mukavemet, Malzeme Bilimi, FEA",
         yarar="Karbon fiber gövde, şasi, koltuk ve panellerin katman sayısını, yönünü ve "
               "sandviç yapısını tasarlamak ve analiz etmek.",
         neden="Karbonun asıl avantajı lifi yük yönüne çevirdiğinde ve sandviç yapı kullandığında "
               "ortaya çıkar. Yarı-izotropik bir plaka özgül rijitlikte alüminyumdan ancak %20–25 "
               "iyidir; oysa çekirdek ekleyip kalınlığı iki katına çıkarmak rijitliği yaklaşık 7 "
               "kat artırırken ağırlığı yalnızca %3 kadar artırır. Bu kararlar kilolarca fark yaratır.",
         ogren=["Lif, reçine ve çekirdek malzemeleri; dokuma ve tek yönlü kumaş",
                "Klasik laminat teorisi (ABD matrisi)",
                "Simetrik ve dengeli dizilim; yarı-izotropik laminat",
                "Sandviç yapı: yüz, çekirdek, çekirdek kayması, yerel ezilme",
                "Hasar kriterleri: Tsai-Wu, Hashin; ilk katman hasarı",
                "Insert ve bağlantı detayları; delik çevresinde takviye",
                "ANSYS ACP ile katman modelleme; eLamX² ile hızlı hesap"],
         terimler=[("Ply / layup", "katman / dizilim"), ("UD", "tek yönlü"), ("Twill", "dimi dokuma"),
                   ("Quasi-isotropic", "yarı-izotropik"), ("Sandwich core", "sandviç çekirdek"),
                   ("Honeycomb", "bal peteği"), ("Insert", "gömülü bağlantı"),
                   ("Delamination", "katman ayrılması")],
         hazir="Bir sandviç panelin katman planını çıkarıp ACP'de analiz edebiliyor ve sonucu "
               "3 nokta eğme testiyle karşılaştırabiliyorsun.",
         kaynak="Gibson, Principles of Composite Material Mechanics · Ansys ACP eğitimleri · "
                "eLamX² (ücretsiz)"),
    dict(no=12, asama=3, hat="akis", oncelik="uzmanlik",
         ad="CFD · ANSYS Fluent",
         kisa="Sürüklemeyi ve soğutmayı üretmeden tahmin et",
         once="Akışkanlar & Isı Transferi, CAD",
         yarar="Gövdenin etrafındaki hava akışını üretmeden simüle eder: sürükleme (CdA), "
               "kaldırma, akış ayrılması, yan rüzgâr. Batarya, motor ve fren soğutma kanallarının "
               "tasarımında da kullanılır.",
         neden="Yüksek hızda enerjinin büyük kısmı havayı yarmaya gider: örnek bir güneş arabası "
               "modelinde 85 km/h'de tekerlek gücünün yaklaşık %70'i aerodinamiğe harcanır. Gövde kalıbı "
               "pahalı olduğu için biçim kararları üretimden önce CFD ile verilir. Düşük hızlı "
               "araçlarda da soğutma akışı ve gövde detayları CFD ile iyileşir.",
         ogren=["Geometri temizliği ve akış hacmi",
                "Ağ: sınır tabaka katmanları, y+ hedefi",
                "Sınır koşulları: hız girişi, basınç çıkışı, hareketli zemin, dönen tekerlek",
                "Türbülans modelleri: k-ω SST; laminer bölge için geçiş modeli",
                "Yakınsama: artıklar + kuvvet monitörleri; ağ bağımsızlığı",
                "Sonuç okuma: Cp, duvar kayma gerilmesi, ayrılma hatları",
                "Doğrulama sırası: 2B NACA 0012 → 3B Ahmed gövdesi → kendi gövden"],
         terimler=[("Domain", "akış hacmi"), ("Inflation layer", "sınır tabaka ağı"),
                   ("y+", "boyutsuz duvar mesafesi"), ("Turbulence model", "türbülans modeli"),
                   ("Residuals", "artıklar"), ("Mesh independence", "ağ bağımsızlığı"),
                   ("Pressure coefficient", "basınç katsayısı")],
         hazir="Ahmed gövdesinin sürükleme katsayısını literatüre yakın bulabiliyor ve aynı "
               "yöntemle kendi gövdenin CdA'sını ağ bağımsızlığı göstererek hesaplayabiliyorsun.",
         kaynak="Versteeg & Malalasekera, An Introduction to CFD · Fluid Mechanics 101 (YouTube) · "
                "Ansys Student akışta 1 milyon hücreyle sınırlı: yarım model kullan"),
    dict(no=13, asama=3, hat="dinamik", oncelik="uzmanlik",
         ad="Taşıt Dinamiği & Süspansiyon Kinematiği",
         kisa="Doğru geometri: güvenli araç, sürtünmesiz teker",
         once="Statik & Dinamik, Mekanizma & Titreşim, CAD",
         yarar="Süspansiyon, direksiyon ve fren geometrisinin tasarımı: kamber, kaster, toe, "
               "Ackermann, yuvarlanma merkezi, yük transferi, fren dağılımı ve devrilme eşiği.",
         neden="Yanlış geometri hem güvenliği hem verimi bozar. Süspansiyon çalışırken toe "
               "değişirse lastik sürekli yana sürtünür ve görünmez bir enerji kaybı oluşur. "
               "Ağırlık merkezi yüksekse araç virajda devrilme sınırına yaklaşır. Frenin hangi "
               "aksa ne kadar yük vereceği de buradan hesaplanır.",
         ogren=["Hizalama açıları: kamber, kaster, toe, pivot eğimi, ofset, mekanik iz",
                "Ackermann geometrisi ve dönüş yarıçapı",
                "Yuvarlanma merkezi, kamber kazancı, bump steer",
                "Boyuna ve yanal yük transferi; devrilme eşiği a/g = t/(2h)",
                "Fren zinciri: yavaşlama → teker kuvveti → tork → hidrolik basınç → pedal",
                "Lastik: kayma açısı, yuvarlanma direnci",
                "Araçlar: CAD eskiz kinematiği, Lotus Suspension Analysis, OptimumKinematics"],
         terimler=[("Camber / caster", "kamber / kaster"), ("Toe-in / toe-out", "toplama / açma"),
                   ("Roll center", "yuvarlanma merkezi"), ("Bump steer", "tümsek yönlendirmesi"),
                   ("Scrub radius", "ofset"), ("Slip angle", "kayma açısı"),
                   ("Brake bias", "fren dağılımı"), ("Unsprung mass", "yaysız kütle")],
         hazir="Bir süspansiyonun bump steer eğrisini çıkarabiliyor ve bir aracın frenini yavaşlama "
               "hedefinden pedal kuvvetine kadar hesaplayabiliyorsun.",
         kaynak="Milliken & Milliken, Race Car Vehicle Dynamics · Gillespie, Fundamentals of "
                "Vehicle Dynamics"),
    dict(no=14, asama=4, hat="uretim", oncelik="cekirdek",
         ad="Test & Ölçüm",
         kisa="Ölçülmemiş değer tahmindir",
         once="Ölçme tekniği, FEA veya CFD temeli",
         yarar="Hesapların ve simülasyonların gerçekle ne kadar örtüştüğünü ölçer: coast-down "
               "(CdA ve Crr), serbest dönüş (sürtünme), gerinim ölçer (gerçek gerilme), tartım, "
               "fren ve devrilme testleri, yün ipi testi (akış).",
         neden="Ölçülmemiş değer tahmindir. Simülasyonun doğruluğunu ancak testle kanıtlarsın; "
               "birçok takım tasarımdan değil, test edilmemiş varsayımlardan kaybeder. Test "
               "verisi bir sonraki aracın en değerli girdisidir.",
         ogren=["Coast-down testi: yavaşlama(v) = A + B·v² → Crr ve CdA",
                "Serbest dönüş (spin-down): balata ve rulman sürtünmesini karşılaştır",
                "Gerinim ölçer ve Wheatstone köprüsü",
                "Veri toplama: sensör, örnekleme hızı, gürültü, filtreleme",
                "Ölçüm belirsizliği ve tekrar sayısı",
                "Test planı: hangi gereksinim hangi testle doğrulanır"],
         terimler=[("Coast-down", "serbest yavaşlama"), ("Spin-down", "serbest dönüş"),
                   ("Strain gauge", "gerinim ölçer"), ("DAQ", "veri toplama"),
                   ("Sampling rate", "örnekleme hızı"), ("Uncertainty", "belirsizlik"),
                   ("Validation", "doğrulama")],
         hazir="Bir coast-down testini planlayıp uygulayabiliyor, verisinden CdA ve Crr'yi "
               "belirsizlik aralığıyla çıkarabiliyorsun.",
         kaynak="Figliola & Beasley, Theory and Design for Mechanical Measurements"),
    dict(no=15, asama=4, hat="dijital", oncelik="guclendirici",
         ad="Enerji Modeli & Veri Analizi",
         kisa="Her kararın kaç Wh ettiğini bil",
         once="Python, Akışkanlar, Taşıt Dinamiği",
         yarar="Aracın bir turda ve bir yarışta ne kadar enerji harcayacağını hesaplar: "
               "aerodinamik, yuvarlanma, eğim, ivmelenme ve verim zinciri. Telemetri verisini "
               "analiz eder, sürüş stratejisine girdi verir.",
         neden="Her mekanik kararın bir enerji bedeli vardır: 10 kg, %10 CdA, sürten bir balata "
               "kaç Wh eder? Model olmadan öncelikler tahmine kalır. Düşük hızda yuvarlanma "
               "direnci, yüksek hızda aerodinamik baskındır; %4'lük bir yokuş gereken gücü yaklaşık "
               "5 katına çıkarır. Nereye yatırım yapacağını model söyler.",
         ogren=["Yol yükü: F = ½·ρ·CdA·v² + Crr·m·g·cosθ + m·g·sinθ + m·a",
                "Verim zinciri: η = η_motor · η_sürücü · η_aktarma",
                "Pist profiliyle tur simülasyonu",
                "Duyarlılık analizi: hangi parametre kaç Wh",
                "Telemetri ve test verisini temizleme, görselleştirme"],
         terimler=[("Road load", "yol yükü"), ("Energy budget", "enerji bütçesi"),
                   ("Efficiency chain", "verim zinciri"), ("Speed profile", "hız profili"),
                   ("Telemetry", "telemetri"), ("SoC", "şarj durumu")],
         hazir="“Bu parçayı 2 kg hafifletirsek yarışta kaç Wh kazanırız?” sorusuna sayıyla cevap "
               "verebiliyorsun.",
         kaynak="Carroll, The Winning Solar Car · Bu klasördeki enerji_butcesi.py"),
    dict(no=16, asama=4, hat="sistem", oncelik="cekirdek",
         ad="Gereksinim Yönetimi & Dokümantasyon",
         kisa="Teknik kontrolden geç, bilgiyi kalıcı kıl",
         once="Yok; ilk günden başla",
         yarar="Şartnamedeki her kuralı ölçülebilir bir gereksinime çevirir ve nasıl "
               "doğrulanacağını takip eder; tasarım kararlarını, hesapları ve teknik resimleri "
               "kalıcı hale getirir.",
         neden="Teknik kontrolden geçemeyen araç yarışamaz; raporlar da puan getirir. Yazılmayan "
               "tasarım kararı her yıl yeniden sorulur. Profesyonel mühendislikte ve "
               "girişimcilikte de aynı beceri geçerli: yatırımcıya, müşteriye ve denetçiye "
               "“neden” sorusunun cevabını belgeyle vermek.",
         ogren=["Gereksinim matrisi: madde → gereksinim → sayısal sınır → doğrulama yöntemi",
                "Karar matrisi (Pugh) ve ödünleşim çalışması",
                "FMEA: neyin, nasıl, hangi etkiyle bozulabileceği",
                "Tasarım incelemesi (PDR/CDR) hazırlığı",
                "Teknik rapor: yöntem, varsayım, sonuç, belirsizlik",
                "Versiyon ve isimlendirme düzeni, karar günlüğü"],
         terimler=[("Requirements matrix", "gereksinim matrisi"), ("Verification", "doğrulama"),
                   ("Trade study", "ödünleşim çalışması"),
                   ("FMEA", "hata türleri ve etkileri analizi"),
                   ("Design review", "tasarım incelemesi"), ("Design freeze", "tasarım dondurma"),
                   ("ICD", "arayüz kontrol dokümanı")],
         hazir="Bir alt sistem için şartnameden gereksinim matrisini çıkarıp her maddenin kanıtını "
               "(hesap, test, resim) gösterebiliyorsun.",
         kaynak="NASA Systems Engineering Handbook (ücretsiz) · Ulrich & Eppinger, Product Design "
                "and Development"),
    dict(no=17, asama=5, hat="dijital", oncelik="guclendirici",
         ad="Otomasyon & Yapay Zekâ",
         kisa="Aynı işi 10 kat hızlı yap, 10 kat fazla dene",
         once="Python, FEA veya CFD, CAD",
         yarar="Tekrarlayan mühendislik işlerini otomatikleştirir: yüzlerce tasarım varyantını "
               "otomatik analiz etmek (PyAnsys, Workbench parametreleri, optiSLang), CAD'i kodla "
               "üretmek (SolidWorks API, CadQuery), test verisinden model çıkarmak, şartname ve "
               "raporlarla çalışan yapay zekâ ajanları kurmak.",
         neden="Aynı işi 10 kat hızlı yapan mühendis 10 kat fazla tasarım dener. Simülasyonu "
               "hızlandıran vekil modeller ve generatif tasarım hızla büyüyen alanlar (PhysicsX, "
               "Neural Concept, Monolith AI). Bu alanın en kıt kaynağı hem fiziği hem yazılımı "
               "bilen mühendis; girişimci mühendis hedefinin kesişim noktası burası.",
         ogren=["PyAnsys (PyMAPDL, PyMechanical, PyFluent) ile analiz otomasyonu",
                "Parametrik tarama ve optimizasyon: Workbench parametreleri, optiSLang",
                "CAD otomasyonu: SolidWorks API, CadQuery / build123d",
                "Veri tabanlı modeller: regresyon, vekil model, deney tasarımı (DOE)",
                "Yapay zekâ ajanlarıyla mühendislik: hesap kontrolü, şartname analizi, rapor taslağı",
                "Sınır: güvenlik-kritik sonuçları her zaman el hesabı ve testle doğrula"],
         terimler=[("Automation", "otomasyon"), ("Parametric study", "parametrik çalışma"),
                   ("DOE", "deney tasarımı"), ("Surrogate model", "vekil model"),
                   ("Generative design", "generatif tasarım"), ("Optimization", "optimizasyon"),
                   ("Agent", "ajan")],
         hazir="Bir braketin geometri taramasını kodla otomatik çalıştırıp kütle–gerilme eğrisini "
               "tek komutla üretebiliyorsun.",
         kaynak="PyAnsys dokümantasyonu · CadQuery dokümantasyonu"),
]

KISA_AD = {  # haritada ve zincirlerde kullanılan kısa adlar
    1: "Statik & Dinamik", 2: "Mukavemet", 3: "Malzeme Bilimi", 4: "Makine Elemanları",
    5: "Akışkanlar & Isı", 6: "Mekanizma & Titreşim", 7: "CAD", 8: "Üretim & DFM",
    9: "Python ile Hesap", 10: "FEA · ANSYS Mechanical", 11: "Kompozit · CLT & ACP",
    12: "CFD · ANSYS Fluent", 13: "Taşıt Dinamiği & Kinematik", 14: "Test & Ölçüm",
    15: "Enerji Modeli & Veri", 16: "Gereksinim & Doküman", 17: "Otomasyon & Yapay Zekâ",
}

SORULAR = [  # takımda sorulan soru → cevap veren beceri zinciri (beceri no'ları)
    ("Bu parça kırılır mı?", [2, 10, 14]),
    ("Bu parçayı daha hafif yapabilir miyiz?", [3, 10, 11]),
    ("Bu cıvata gevşer mi, rulman dayanır mı?", [4]),
    ("Gövde ne kadar enerji yer?", [5, 12, 14]),
    ("Batarya veya motor ısınır mı?", [5, 12]),
    ("Karbonu kaç kat, hangi yönde sereceğiz?", [11]),
    ("Tekerlek neden sürtünüyor?", [13, 14]),
    ("Araç virajda devrilir mi, fren yeter mi?", [1, 13]),
    ("Bu braket titreşimden kırılır mı?", [6, 10]),
    ("Bu parçayı atölyede yapabilir miyiz?", [7, 8]),
    ("Bu değişiklik yarışta kaç Wh eder?", [9, 15]),
    ("Teknik kontrolden geçer miyiz?", [16]),
    ("Bunu 100 varyant için denemek zorunda mıyız?", [9, 17]),
]

# --------------------------------------------------------------------------- yardımcılar

e = html.escape
BECERI = {b["no"]: b for b in BECERILER}


def renk_stili(hat):
    _, c, tint, line = HATLAR[hat]
    return f"--c:{c};--tint:{tint};--line:{line}"


def oncelik_nokta(oncelik):
    return f'<span class="dot dot-{oncelik}" title="{e(ONCELIK[oncelik][0])}"></span>'


def ok_svg():
    return ('<svg class="arrow" viewBox="0 0 10 10" aria-hidden="true">'
            '<path d="M2 5h6M5.5 2.5 8 5 5.5 7.5" fill="none" stroke="currentColor" '
            'stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>')


def yol_path(pts):
    """Noktalardan geçen düzgün eğri (Catmull-Rom → kübik Bézier)."""
    d = f"M {pts[0][0]:.1f} {pts[0][1]:.1f}"
    for i in range(len(pts) - 1):
        p0 = pts[i - 1] if i > 0 else pts[i]
        p1, p2 = pts[i], pts[i + 1]
        p3 = pts[i + 2] if i + 2 < len(pts) else p2
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f" C {c1[0]:.1f} {c1[1]:.1f}, {c2[0]:.1f} {c2[1]:.1f}, {p2[0]:.1f} {p2[1]:.1f}"
    return d


# --------------------------------------------------------------------------- sayfalar

def kapak():
    duraklar = [(72, 262), (140, 236), (72, 206), (140, 176), (72, 146)]
    hedef = (138, 117)
    yol = yol_path([(104, 310)] + duraklar + [hedef])
    izgara = "".join(f'<line x1="{x}" y1="0" x2="{x}" y2="297"/>' for x in range(10, 210, 10))
    izgara += "".join(f'<line x1="0" y1="{y}" x2="210" y2="{y}"/>' for y in range(10, 297, 10))
    parcalar = []
    for (x, y), (no, ad, motto, _) in zip(duraklar, ASAMALAR):
        sol = x < 105
        tx = x - 9 if sol else x + 9
        anchor = "end" if sol else "start"
        parcalar.append(
            f'<circle cx="{x}" cy="{y}" r="5.4" class="durak"/>'
            f'<text x="{x}" y="{y + 1.9}" class="durak-no">{no}</text>'
            f'<text x="{tx}" y="{y - 0.6}" text-anchor="{anchor}" class="durak-ad">{e(ad)}</text>'
            f'<text x="{tx}" y="{y + 4.4}" text-anchor="{anchor}" class="durak-motto">{e(motto)}</text>')
    hx, hy = hedef
    parcalar.append(
        f'<circle cx="{hx}" cy="{hy}" r="6.2" class="hedef"/>'
        f'<path d="M {hx - 1.6} {hy + 3} V {hy - 3.2} L {hx + 2.8} {hy - 1.9} L {hx - 1.6} {hy - 0.4}" '
        f'class="bayrak"/>'
        f'<text x="{hx + 10}" y="{hy - 0.6}" class="durak-ad">Hedef</text>'
        f'<text x="{hx + 10}" y="{hy + 4.4}" class="durak-motto">Girişimci mühendis</text>')
    return f"""
<section class="kapak">
  <svg class="kapak-svg" viewBox="0 0 210 297" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g class="izgara">{izgara}</g>
    <path d="{yol}" class="yol-kenar"/>
    <path d="{yol}" class="yol-asfalt"/>
    <path d="{yol}" class="yol-serit"/>
    {''.join(parcalar)}
  </svg>
  <div class="kapak-ust">Makine Mühendisliği · Güneş arabası ve verimlilik aracı</div>
  <h1 class="kapak-baslik">Mekanik Mühendis<br><span>Yol Haritası</span></h1>
  <p class="kapak-alt">Neyi, neden öğrenmelisin? Temelden kaldıraca 5 aşamada 17 beceri:
  her birinin ne işe yaradığı, neden gerektiği ve hazır olduğunu nasıl anlayacağın.</p>
  <div class="kapak-tarih">Eylül 2026</div>
</section>"""


def harita():
    lejant = "".join(f'<span class="lj" style="{renk_stili(k)}"><i class="sw"></i>{e(v[0])}</span>'
                     for k, v in HATLAR.items())
    lejant += "".join(f'<span class="lj">{oncelik_nokta(k)}{e(v[0])}</span>'
                      for k, v in ONCELIK.items())
    asamalar = []
    for no, ad, motto, neden in ASAMALAR:
        beceriler = [b for b in BECERILER if b["asama"] == no]
        sutun = {6: 3, 3: 3, 4: 2, 1: 1}.get(len(beceriler), 3)
        kutular = "".join(
            f'<div class="kutu" style="{renk_stili(b["hat"])}">'
            f'<div class="kutu-ust"><span class="kutu-no">{b["no"]:02d}</span>{oncelik_nokta(b["oncelik"])}</div>'
            f'<div class="kutu-ad">{e(KISA_AD[b["no"]])}</div>'
            f'<div class="kutu-neden">{e(b["kisa"])}</div></div>'
            for b in beceriler)
        asamalar.append(f"""
    <div class="asama">
      <div class="isaret">{no}</div>
      <div class="asama-baslik"><span class="asama-etiket">AŞAMA {no}</span>{e(ad)}
        <span class="asama-motto">· {e(motto)}</span></div>
      <div class="asama-neden">{e(neden)}</div>
      <div class="kutular s{sutun}">{kutular}</div>
    </div>""")
    return f"""
<section class="sayfa harita">
  <div class="ust-etiket">YOL HARİTASI</div>
  <h2 class="sayfa-baslik">Temelden kaldıraca: 5 aşama, 17 beceri</h2>
  <p class="giris">Yukarıdan aşağı ilerle; her aşama bir öncekinin üstüne kurulur. Kutunun rengi
  hattını, noktası önceliğini gösterir. Her becerinin kartı ilerideki sayfalarda.</p>
  <div class="lejant">{lejant}</div>
  <div class="yol">{''.join(asamalar)}
    <div class="asama hedef-satir">
      <div class="isaret bayrakli"><svg viewBox="0 0 10 10"><path d="M3 9V1.5L8 3.4 3 5.3"/></svg></div>
      <div class="hedef-kutu"><span class="asama-etiket">HEDEF</span>{e(HEDEF)}</div>
    </div>
  </div>
</section>"""


def soru_sayfasi():
    satirlar = []
    for soru, zincir in SORULAR:
        cipler = ok_svg().join(
            f'<span class="cip" style="{renk_stili(BECERI[n]["hat"])}">'
            f'<b>{n:02d}</b> {e(KISA_AD[n].split(" · ")[0])}</span>' for n in zincir)
        satirlar.append(f'<tr><td class="soru">“{e(soru)}”</td><td class="zincir">{cipler}</td></tr>')
    oncelikler = "".join(
        f'<div class="onc-satir">{oncelik_nokta(k)}<b>{e(ad)}</b> {e(aciklama)}</div>'
        for k, (ad, aciklama) in ONCELIK.items())
    return f"""
<section class="sayfa sorular">
  <div class="ust-etiket">NEDEN BU BECERİLER?</div>
  <h2 class="sayfa-baslik">Hangi soruya hangi beceri cevap verir?</h2>
  <p class="giris">Mekanik birimde her gün bu sorular sorulur. Sağdaki zincir, o soruya sayıyla
  cevap verebilmek için gereken becerileri sırasıyla gösterir.</p>
  <table class="soru-tablo">{''.join(satirlar)}</table>
  <div class="oncelik-kutu">
    <div class="ust-etiket">KARTLARDAKİ ÖNCELİK ETİKETLERİ</div>
    {oncelikler}
  </div>
</section>"""


def kart(b):
    ad_hat = HATLAR[b["hat"]][0]
    onc_ad = ONCELIK[b["oncelik"]][0]
    ogren = "".join(f"<li>{e(x)}</li>" for x in b["ogren"])
    terimler = "".join(f'<span class="terim"><b>{e(en)}</b> {e(tr)}</span>' for en, tr in b["terimler"])
    return f"""
<article class="kart" style="{renk_stili(b['hat'])}">
  <header class="kart-bas">
    <div class="kart-no">{b['no']:02d}</div>
    <div>
      <h3>{e(b['ad'])}</h3>
      <div class="kart-meta"><span class="etiket hat">{e(ad_hat)}</span>
        <span class="etiket onc">{oncelik_nokta(b['oncelik'])}{e(onc_ad)}</span>
        <span class="once">Önce: {e(b['once'])}</span></div>
    </div>
  </header>
  <div class="kart-govde">
    <div>
      <div class="lbl">Ne işe yarar?</div><p>{e(b['yarar'])}</p>
      <div class="lbl">Neden öğrenmelisin?</div><p>{e(b['neden'])}</p>
    </div>
    <div>
      <div class="lbl">Neyi öğren?</div><ul>{ogren}</ul>
    </div>
  </div>
  <div class="terimler"><span class="lbl">Terimler</span>{terimler}</div>
  <div class="hazir"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.3 5 8.7 9.6 3.4"/></svg>
    <div><b>Hazır olduğunun işareti:</b> {e(b['hazir'])}</div></div>
  <div class="kaynak"><b>Kaynak:</b> {e(b['kaynak'])}</div>
</article>"""


def kartlar():
    parcalar = []
    for no, ad, motto, neden in ASAMALAR:
        beceriler = [b for b in BECERILER if b["asama"] == no]
        bant = (f'<div class="bant"><div class="bant-no">AŞAMA {no}</div>'
                f'<h2>{e(ad)} <span>· {e(motto)}</span></h2><p>{e(neden)}</p></div>')
        # bant ilk kartla aynı sayfada kalsın
        parcalar.append(f'<div class="bant-grup">{bant}{kart(beceriler[0])}</div>')
        parcalar.extend(kart(b) for b in beceriler[1:])
    return f'<section class="kartlar">{"".join(parcalar)}</section>'


def kontrol_listesi():
    gruplar = []
    for no, ad, motto, _ in ASAMALAR:
        maddeler = "".join(
            f'<li style="{renk_stili(b["hat"])}"><span class="kutucuk"></span>'
            f'<div><b>{b["no"]:02d} · {e(b["ad"])}</b><br>{e(b["hazir"])}</div></li>'
            for b in BECERILER if b["asama"] == no)
        gruplar.append(f'<div class="kl-grup"><div class="kl-asama">Aşama {no} · {e(ad)}</div>'
                       f'<ul>{maddeler}</ul></div>')
    return f"""
<section class="sayfa kontrol">
  <div class="ust-etiket">KENDİNİ ÖLÇ</div>
  <h2 class="sayfa-baslik">Yetkinlik kontrol listesi</h2>
  <p class="giris">Bir maddeyi ancak gerçekten yapabildiğinde işaretle. Hepsini işaretlediğinde
  mekanik birimde her konuşmaya katkı verebilir, bir alt sistemi tek başına sırtlayabilirsin.</p>
  {''.join(gruplar)}
</section>"""


CSS = """
@page { size: A4; margin: 14mm 15mm 16mm 15mm;
  @bottom-left { content: "Mekanik Mühendis Yol Haritası"; font-family: "IBM Plex Sans", sans-serif;
                 font-size: 7.5pt; color: #94a3b8; }
  @bottom-right { content: counter(page) " / " counter(pages); font-family: "IBM Plex Mono", monospace;
                  font-size: 7.5pt; color: #94a3b8; } }
@page :first { margin: 0; @bottom-left { content: none; } @bottom-right { content: none; } }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: "IBM Plex Sans", "DejaVu Sans", sans-serif; font-size: 9.2pt;
       line-height: 1.42; color: #0f172a; }
h1, h2, h3 { margin: 0; letter-spacing: -0.01em; }
b { font-weight: 600; }

/* kapak */
.kapak { position: relative; width: 210mm; height: 297mm; overflow: hidden; background: #0b1220;
         color: #fff; break-after: page; }
.kapak-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.izgara line { stroke: #ffffff; stroke-opacity: .045; stroke-width: .25; }
.yol-kenar { fill: none; stroke: #475569; stroke-width: 15.5; stroke-linecap: round; }
.yol-asfalt { fill: none; stroke: #1e293b; stroke-width: 14; stroke-linecap: round; }
.yol-serit { fill: none; stroke: #fbbf24; stroke-width: .9; stroke-dasharray: 4 3.4; }
.durak { fill: #fff; stroke: #0b1220; stroke-width: 1.3; }
.durak-no { font-family: "IBM Plex Mono", monospace; font-weight: 600; font-size: 5.4px;
            text-anchor: middle; fill: #0b1220; }
.durak-ad { font-family: "IBM Plex Sans", sans-serif; font-weight: 700; font-size: 5px; fill: #f8fafc; }
.durak-motto { font-family: "IBM Plex Sans", sans-serif; font-size: 3.6px; fill: #94a3b8; }
.hedef { fill: #fbbf24; stroke: #0b1220; stroke-width: 1.3; }
.bayrak { fill: #0b1220; stroke: #0b1220; stroke-width: .8; stroke-linejoin: round; }
.kapak-ust { position: absolute; left: 20mm; top: 26mm; font-family: "IBM Plex Mono", monospace;
             font-size: 8pt; letter-spacing: .14em; text-transform: uppercase; color: #94a3b8; }
.kapak-baslik { position: absolute; left: 20mm; top: 34mm; font-size: 34pt; line-height: 1.08;
                font-weight: 700; }
.kapak-baslik span { color: #fbbf24; }
.kapak-alt { position: absolute; left: 20mm; top: 69mm; width: 150mm; margin: 0; font-size: 11.5pt;
             line-height: 1.5; color: #cbd5e1; }
.kapak-tarih { position: absolute; left: 20mm; bottom: 14mm; font-family: "IBM Plex Mono", monospace;
               font-size: 8.5pt; color: #94a3b8; }

/* ortak sayfa öğeleri */
.sayfa { break-before: page; }
.ust-etiket { font-family: "IBM Plex Mono", monospace; font-size: 7.4pt; font-weight: 600;
              letter-spacing: .14em; color: #64748b; }
.sayfa-baslik { font-size: 19pt; line-height: 1.2; margin: 1mm 0 2mm; }
.giris { margin: 0 0 4mm; color: #334155; font-size: 9.6pt; max-width: 165mm; }
.dot { display: inline-block; width: 2.4mm; height: 2.4mm; border-radius: 50%; margin-right: 1.2mm;
       vertical-align: -0.2mm; border: .35mm solid #0f172a; }
.dot-cekirdek { background: #0f172a; }
.dot-guclendirici { background: linear-gradient(90deg, #0f172a 50%, #fff 50%); }
.dot-uzmanlik { background: #fff; }

/* yol haritası */
.lejant { display: flex; flex-wrap: wrap; gap: 1.6mm 4.2mm; font-size: 7.9pt; color: #334155;
          margin: 0 0 4.2mm; }
.lj .sw { display: inline-block; width: 3mm; height: 3mm; border-radius: .8mm; background: var(--c);
          margin-right: 1.2mm; vertical-align: -0.4mm; }
.yol { position: relative; padding-left: 17mm; }
.yol::before { content: ""; position: absolute; left: 3.3mm; top: 1mm; bottom: 4mm; width: 9mm;
               background: #1e293b; border-radius: 4.5mm; box-shadow: 0 0 0 .6mm #475569; }
.yol::after { content: ""; position: absolute; left: 7.5mm; top: 5mm; bottom: 8mm; width: .6mm;
              background: repeating-linear-gradient(to bottom, #fbbf24 0 2.4mm, transparent 2.4mm 4.8mm); }
.asama { position: relative; margin: 0 0 3.6mm; }
.isaret { position: absolute; left: -16.3mm; top: -1.4mm; width: 10.6mm; height: 10.6mm;
          border-radius: 50%; background: #fff; border: .8mm solid #0f172a; z-index: 2;
          display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 11pt; }
.asama-baslik { font-size: 12pt; font-weight: 700; line-height: 1.2; }
.asama-etiket { font-family: "IBM Plex Mono", monospace; font-size: 7pt; font-weight: 600;
                letter-spacing: .12em; color: #64748b; margin-right: 2mm; vertical-align: .4mm; }
.asama-motto { font-weight: 400; color: #475569; }
.asama-neden { font-size: 8.4pt; color: #475569; margin: .6mm 0 2.2mm; }
.kutular { display: grid; gap: 2.4mm; }
.kutular.s3 { grid-template-columns: repeat(3, 1fr); }
.kutular.s2 { grid-template-columns: repeat(2, 1fr); }
.kutular.s1 { grid-template-columns: 1fr; }
.kutu { background: var(--tint); border: .3mm solid var(--line); border-left: 1.5mm solid var(--c);
        border-radius: 1.8mm; padding: 1.5mm 2.6mm 1.7mm; }
.kutu-ust { display: flex; justify-content: space-between; align-items: center; }
.kutu-no { font-family: "IBM Plex Mono", monospace; font-size: 7pt; font-weight: 600; color: var(--c); }
.kutu-ust .dot { margin-right: 0; width: 2.2mm; height: 2.2mm; }
.kutu-ad { font-weight: 700; font-size: 9.6pt; line-height: 1.2; margin: .3mm 0 .6mm; }
.kutu-neden { font-size: 8pt; line-height: 1.32; color: #334155; }
.hedef-satir { margin-bottom: 0; }
.isaret.bayrakli { background: #fbbf24; top: .6mm; }
.isaret.bayrakli svg { width: 5mm; height: 5mm; fill: #0f172a; stroke: #0f172a; stroke-width: .9;
                       stroke-linejoin: round; }
.hedef-kutu { background: #0f172a; color: #fff; border-radius: 2mm; padding: 3mm 4mm;
              font-weight: 600; font-size: 10pt; }
.hedef-kutu .asama-etiket { color: #fbbf24; }

/* sorular */
.soru-tablo { width: 100%; border-collapse: separate; border-spacing: 0 1.5mm; margin-bottom: 4mm; }
.soru-tablo td { background: #f8fafc; padding: 2.3mm 3mm; vertical-align: middle; }
.soru-tablo td.soru { width: 40%; font-weight: 600; font-size: 9.4pt; border-radius: 2mm 0 0 2mm;
                      border-left: 1mm solid #0f172a; }
.soru-tablo td.zincir { border-radius: 0 2mm 2mm 0; line-height: 2; }
.cip { display: inline-block; white-space: nowrap; background: var(--tint); border: .3mm solid var(--line);
       color: #0f172a; border-radius: 5mm; padding: 0 2.2mm; font-size: 8pt; line-height: 1.75; }
.cip b { font-family: "IBM Plex Mono", monospace; color: var(--c); margin-right: .6mm; }
.arrow { width: 3mm; height: 3mm; margin: 0 1mm; color: #94a3b8; vertical-align: -0.5mm; }
.oncelik-kutu { border: .3mm solid #e2e8f0; border-radius: 2mm; padding: 3mm 4mm; }
.onc-satir { margin-top: 1.4mm; font-size: 9pt; color: #334155; }
.onc-satir b { color: #0f172a; margin-right: 1.5mm; }

/* kartlar */
.kartlar { break-before: page; }
.bant-grup { break-inside: avoid; }
.bant { background: #0f172a; color: #fff; border-radius: 2.5mm; padding: 3mm 4.5mm 3.2mm; margin: 0 0 3.5mm; }
.bant-no { font-family: "IBM Plex Mono", monospace; font-size: 7.4pt; font-weight: 600;
           letter-spacing: .14em; color: #fbbf24; }
.bant h2 { font-size: 15pt; margin: .5mm 0 .8mm; }
.bant h2 span { font-weight: 400; color: #cbd5e1; }
.bant p { margin: 0; font-size: 8.8pt; color: #cbd5e1; }
.kart { break-inside: avoid; border: .3mm solid #e2e8f0; border-top: 1.5mm solid var(--c);
        border-radius: 2.5mm; padding: 3mm 4mm 3mm; margin: 0 0 4mm; }
.kart-bas { display: flex; gap: 3mm; align-items: flex-start; margin-bottom: 2.2mm; }
.kart-no { font-family: "IBM Plex Mono", monospace; font-weight: 600; font-size: 10pt; color: var(--c);
           background: var(--tint); border: .3mm solid var(--line); border-radius: 1.6mm;
           padding: .8mm 1.8mm; margin-top: .3mm; }
.kart h3 { font-size: 13pt; line-height: 1.2; }
.kart-meta { display: flex; flex-wrap: wrap; gap: 1.2mm 2mm; align-items: center; margin-top: 1mm;
             font-size: 7.8pt; color: #475569; }
.etiket { border-radius: 5mm; padding: .1mm 2mm; font-weight: 600; }
.etiket.hat { background: var(--tint); color: var(--c); border: .3mm solid var(--line); }
.etiket.onc { background: #f1f5f9; color: #0f172a; border: .3mm solid #e2e8f0; }
.etiket .dot { width: 1.9mm; height: 1.9mm; margin-right: 1mm; vertical-align: -0.1mm; }
.kart-govde { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm; }
.lbl { font-family: "IBM Plex Mono", monospace; font-size: 6.9pt; font-weight: 600; letter-spacing: .1em;
       text-transform: uppercase; color: var(--c); margin: 0 0 .7mm; }
.kart-govde p { margin: 0 0 2.2mm; }
.kart-govde ul { margin: 0; padding-left: 3.8mm; }
.kart-govde li { margin: 0 0 .8mm; }
.kart-govde li::marker { color: var(--c); }
.terimler { display: flex; flex-wrap: wrap; gap: 1.1mm; align-items: center; margin-top: 1.6mm; }
.terimler .lbl { margin: 0 1mm 0 0; }
.terim { background: #f1f5f9; border-radius: 1.2mm; padding: .2mm 1.6mm; font-size: 7.8pt; color: #475569; }
.terim b { color: #0f172a; font-weight: 600; }
.hazir { display: flex; gap: 2mm; align-items: flex-start; margin-top: 2.2mm; background: var(--tint);
         border: .3mm solid var(--line); border-radius: 1.8mm; padding: 1.8mm 2.6mm; font-size: 8.7pt; }
.hazir svg { flex: none; width: 4mm; height: 4mm; margin-top: .2mm; fill: none; stroke: var(--c);
             stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.kaynak { margin-top: 1.6mm; font-size: 7.8pt; color: #475569; }
.kaynak b { color: #334155; }

/* kontrol listesi */
.kl-grup { margin-bottom: 3mm; break-inside: avoid; }
.kl-asama { font-weight: 700; font-size: 10pt; margin-bottom: 1.2mm; }
.kl-grup ul { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: 1fr 1fr;
              gap: 1.6mm 4mm; }
.kl-grup li { display: flex; gap: 2mm; font-size: 8.2pt; line-height: 1.35; color: #334155;
              border-left: 1mm solid var(--c); padding-left: 2mm; }
.kl-grup li b { color: #0f172a; }
.kutucuk { flex: none; width: 3.4mm; height: 3.4mm; border: .35mm solid #0f172a; border-radius: .7mm;
           margin-top: .3mm; }
"""


def html_uret():
    return f"""<!doctype html>
<html lang="tr"><head><meta charset="utf-8">
<title>Mekanik Mühendis Yol Haritası</title>
<link rel="stylesheet" href=".fonts/fonts.css">
<style>{CSS}</style></head>
<body>
{kapak()}
{harita()}
{soru_sayfasi()}
{kartlar()}
{kontrol_listesi()}
</body></html>"""


# --------------------------------------------------------------------------- derleme

def fontlari_hazirla():
    css_yolu = FONT_DIR / "fonts.css"
    if css_yolu.exists():
        return
    FONT_DIR.mkdir(exist_ok=True)
    css = subprocess.run(["curl", "-sSf", "-A", UA, GF_URL], check=True,
                         capture_output=True, text=True).stdout
    bloklar = []
    for kume, blok in re.findall(r"/\* ([a-z-]+) \*/\s*(@font-face \{.*?\})", css, re.S):
        if kume not in ALT_KUMELER:
            continue
        url = re.search(r"url\((https://[^)]+)\)", blok).group(1)
        aile = re.search(r"font-family: '([^']+)'", blok).group(1).replace(" ", "")
        agirlik = re.search(r"font-weight: (\d+)", blok).group(1)
        stil = re.search(r"font-style: (\w+)", blok).group(1)
        dosya = f"{aile}-{agirlik}-{stil}-{kume}.woff2"
        subprocess.run(["curl", "-sSf", "-o", str(FONT_DIR / dosya), url], check=True)
        bloklar.append(blok.replace(url, dosya))
    css_yolu.write_text("\n".join(bloklar), encoding="utf-8")


def chromium_bul():
    adaylar = [os.environ.get("CHROME")]
    adaylar += sorted(glob.glob("/opt/pw-browsers/chromium-*/chrome-linux/chrome"), reverse=True)
    adaylar += [shutil.which(a) for a in ("chromium", "chromium-browser", "google-chrome")]
    for a in adaylar:
        if a and Path(a).exists():
            return a
    raise SystemExit("Chromium bulunamadı; CHROME ortam değişkeniyle yolunu ver.")


def main():
    fontlari_hazirla()
    HTML_YOLU.write_text(html_uret(), encoding="utf-8")
    subprocess.run([chromium_bul(), "--headless=new", "--no-sandbox", "--disable-gpu",
                    "--no-pdf-header-footer", "--run-all-compositor-stages-before-draw",
                    "--virtual-time-budget=15000", f"--print-to-pdf={PDF_YOLU}",
                    HTML_YOLU.as_uri()], check=True, capture_output=True)
    print(f"PDF hazır: {PDF_YOLU}")


if __name__ == "__main__":
    main()
