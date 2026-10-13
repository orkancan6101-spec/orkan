"""Kulüp panelinin başlangıç verisini üretir.

Ekip listesi (yönetim şeması) ve her departmanın hazır tablolarını JSON
belgeleri olarak bir klasöre yazar. Bu dosyalar `ArtifactData batch` ile
panelin veritabanına (`kisiler/<id>`, `dosyalar/<id>`) yüklenir.

Kullanım:
    python3 kulup/tohum.py <cikti_klasoru>

Tablolar boş gelir; yalnızca kontrol listesi niteliğindeki tablolara
(etkinlik adımları, marka kiti, sponsorluk paketleri, Erasmus+ kaynakları)
genel satırlar eklenir. Firma, kişi, tutar gibi kayıtlar uydurulmaz.
"""
import json
import os
import sys

DONEM_BAS = "2026-10-13T19:30:00.000Z"

KISILER = [
    # id, ad, departman, seviye, rol, açıklama
    ("atahan-akcin", "Atahan Akçin", "kurumsal", "baskan", "Departman Başkanı",
     "Sponsorluk stratejilerini belirler ve ana firmalarla üst düzey iletişimi kurar."),
    ("kerem-can", "Kerem Can", "kurumsal", "yardimci", "Başkan Yardımcısı",
     "Sponsorluk dosyalarını takip eder; sözleşme ve bütçe süreçlerini denetler."),
    ("berika-sila-cetin", "Berika Sıla Çetin", "kurumsal", "ekip", "Sponsorluk Sorumlusu",
     "Potansiyel sponsorları araştırır ve mail süreçlerini yürütür."),
    ("ahmet-sunar", "Ahmet Sunar", "kurumsal", "ekip", "Sponsor Teklif Sorumlusu",
     "Sponsorlara gidecek tanıtım dosyasını ve teklif paketlerini hazırlar; sponsor görüşmelerine katılır."),
    ("ertugrul-aktan", "Ertuğrul Aktan", "kurumsal", "ekip", "Sektörel İlişkiler Sorumlusu",
     "Otomotiv firmaları, fabrikalar ve konuşmacılarla ilk teması kurar."),
    ("enes-yilmaz", "Enes Yılmaz", "kurumsal", "ekip", "Dış İlişkiler Sorumlusu",
     "Diğer üniversite kulüpleri, belediyeler ve odalarla (MMO vb.) iletişimi sağlar."),
    ("ayca-yazgan", "Ayça Yazgan", "kurumsal", "ekip", "Mezun İlişkileri Sorumlusu",
     "Sektörde çalışan ESOGÜ mezunlarına ulaşır; onları konuşmacı, mentor ve sponsor bağlantısı olarak kulübe kazandırır."),
    ("elif-garipoglu", "Elif Garipoğlu", "iletisim", "baskan", "Departman Başkanı",
     "Kulübün marka kimliğini, paylaşım takvimini ve iletişim dilini yönetir."),
    ("yagmur-ilci", "Yağmur İlci", "iletisim", "yardimci", "Başkan Yardımcısı",
     "Görsel ve yazılı içeriklerin kalitesini denetler, başkana destek olur."),
    ("nisasu-oktay", "Nisasu Oktay", "iletisim", "ekip", "Görsel Tasarım ve Video Editörü",
     "Afiş, post, reels ve etkinlik kurgularını hazırlar."),
    ("cem-cihan-kozali", "Cem Cihan Kozalı", "organizasyon", "baskan", "Departman Başkanı",
     "Yıllık etkinlik takvimini planlar ve yönetir."),
    ("busra-cakci", "Büşra Çakcı", "organizasyon", "yardimci", "Başkan Yardımcısı",
     "Etkinlik izinlerini, rektörlük/fakülte iletişimini ve bütçe akışını takip eder."),
    ("sevval-can", "Şevval Can", "organizasyon", "ekip", "Üye İlişkileri Sorumlusu",
     "Etkinlik günü görevli üyeleri koordine eder; kayıt masası, salon, ulaşım ve ses/ışık gibi saha işlerini yürütür."),
    ("mehmet-emin-alan", "Mehmet Emin Alan", "erasmus", "baskan", "Departman Başkanı",
     "AB projelerini ve Gençlik Değişimleri'ni takip eder."),
    ("kerem-omer-sengoz", "Kerem Ömer Şengöz", "erasmus", "ekip", "Etkinlik ve Paylaşım Sorumlusu",
     "Webinar takvimini düzenler ve organizasyonuna destek olur; başkanın takip ettiği projeleri departman gruplarında yayar."),
]

DEPARTMANLAR = ["Kurumsal İlişkiler", "İletişim ve Sosyal Medya", "Organizasyon", "Erasmus+"]
PLATFORM = ["Instagram", "LinkedIn", "X", "YouTube", "TikTok", "WhatsApp kanalı"]


def k(id_, ad, tur, sec=None, **ek):
    d = {"id": id_, "ad": ad, "tur": tur}
    if sec:
        d["secenekler"] = list(sec)
    d.update(ek)
    return d


def not_():
    return k("not", "Not", "uzun")


# (id, departman, başlık, açıklama, kolonlar, ek alanlar, hazır satırlar)
DOSYALAR = [
    # ---------------- 01 KURUMSAL İLİŞKİLER ----------------
    ("sponsor-takip", "kurumsal", "Sponsor Takip Listesi",
     "Ulaşılan her firma bir satır. Görüşüldü ve sponsor oldu kutularını işaretleyin, her firmaya not düşün.",
     [k("firma", "Firma", "metin"),
      k("sektor", "Sektör", "secim", ["Otomotiv üreticisi", "Yan sanayi", "Lastik", "Akaryakıt / enerji", "Yazılım / teknoloji", "Makine / ekipman", "Finans / sigorta", "Yerel işletme", "Diğer"]),
      k("yetkili", "Yetkili kişi", "metin"),
      k("iletisim", "İletişim", "metin"),
      k("sorumlu", "Sorumlu üye", "kisi"),
      k("durum", "Durum", "secim", ["Aday", "İletişime geçildi", "Görüşüldü", "Teklif gönderildi", "Beklemede", "Anlaşıldı", "Reddetti"]),
      k("gorusuldu", "Görüşüldü", "tik"),
      k("sponsor", "Sponsor oldu", "tik"),
      k("paket", "Paket", "secim", ["Ana sponsor", "Altın", "Gümüş", "Bronz", "Ayni destek"]),
      k("tutar", "Tutar", "para"),
      k("teklif", "Teklif dosyası", "belge"),
      k("son_temas", "Son temas", "tarih"),
      k("sonraki", "Sonraki adım", "metin", gen=220),
      not_()],
     {"ozel": "sponsor"}, []),
    ("sponsor-paketleri", "kurumsal", "Sponsorluk Paketleri",
     "Teklif dosyasındaki paketler: tutar, sponsora sunulanlar ve kontenjan.",
     [k("paket", "Paket", "metin"), k("tutar", "Tutar", "para"),
      k("karsiliklar", "Sponsora sunulanlar", "uzun", gen=340),
      k("kontenjan", "Kontenjan", "sayi"), k("satilan", "Anlaşılan", "sayi"), not_()],
     {}, [{"paket": "Ana sponsor"}, {"paket": "Altın"}, {"paket": "Gümüş"}, {"paket": "Bronz"}, {"paket": "Ayni destek"}]),
    ("sozlesme-odeme", "kurumsal", "Sözleşme ve Ödeme Takibi",
     "Anlaşılan sponsorlar için sözleşme, fatura/dekont ve sponsora verilen karşılıkların takibi.",
     [k("firma", "Firma", "metin"), k("sozlesme", "Sözleşme imzalandı", "tik"),
      k("sozlesme_dosya", "Sözleşme dosyası", "belge"), k("tutar", "Tutar", "para"),
      k("odeme_tarihi", "Ödeme tarihi", "tarih"), k("fatura", "Fatura / dekont alındı", "tik"),
      k("karsilik", "Karşılıklar verildi", "tik"), k("tesekkur", "Teşekkür / plaket", "tik"),
      k("sorumlu", "Sorumlu üye", "kisi"), not_()],
     {}, []),
    ("firma-gezileri", "kurumsal", "Firma ve Fabrika Gezileri",
     "Teknik gezi talepleri: hangi fabrikaya ne zaman, kaç kişiyle gidileceği.",
     [k("firma", "Firma / fabrika", "metin"), k("sehir", "Şehir", "metin", gen=120),
      k("yetkili", "Yetkili kişi", "metin"), k("iletisim", "İletişim", "metin"),
      k("sorumlu", "Sorumlu üye", "kisi"),
      k("durum", "Durum", "secim", ["Talep gönderildi", "Tarih bekleniyor", "Olumlu", "Planlandı", "Gerçekleşti", "Olumsuz"]),
      k("tarih", "Gezi tarihi", "tarih"), k("kontenjan", "Kontenjan", "sayi"),
      k("ulasim", "Ulaşım ayarlandı", "tik"), not_()],
     {"ajanda": {"tarih": "tarih", "baslik": "firma", "durum": "durum"}}, []),
    ("konusmaci-havuzu", "kurumsal", "Konuşmacı Havuzu",
     "Seminer ve söyleşiler için konuşmacı adayları, davet durumu ve teşekkür takibi.",
     [k("ad", "Ad soyad", "metin"), k("unvan", "Unvan / firma", "metin", gen=220),
      k("konu", "Konu", "metin", gen=220),
      k("kaynak", "Kaynak", "secim", ["Sektör", "Mezun", "Akademisyen", "Diğer"]),
      k("iletisim", "İletişim", "metin"), k("sorumlu", "Sorumlu üye", "kisi"),
      k("durum", "Durum", "secim", ["Aday", "Davet edildi", "Kabul etti", "Konuştu", "Uygun değil"]),
      k("etkinlik", "Etkinlik", "metin"), k("tesekkur", "Teşekkür gönderildi", "tik"), not_()],
     {}, []),
    ("dis-iliskiler", "kurumsal", "Kurum ve Kulüp İlişkileri",
     "Diğer üniversite kulüpleri, belediyeler, meslek odaları (MMO vb.) ve STK'larla iletişim.",
     [k("kurum", "Kurum", "metin"),
      k("tur", "Tür", "secim", ["Üniversite kulübü", "Belediye", "Meslek odası", "Sanayi odası / OSB", "Lise", "STK", "Diğer"]),
      k("yetkili", "Yetkili kişi", "metin"), k("iletisim", "İletişim", "metin"),
      k("sorumlu", "Sorumlu üye", "kisi"), k("isbirligi", "İşbirliği fikri", "metin", gen=240),
      k("durum", "Durum", "secim", ["Fikir", "İletişime geçildi", "Görüşüldü", "Ortak etkinlik planlandı", "Tamamlandı"]),
      k("son_temas", "Son temas", "tarih"), not_()],
     {}, []),
    ("mezun-agi", "kurumsal", "Mezun Ağı",
     "Sektörde çalışan ESOGÜ mezunları: konuşmacı, mentor ve sponsor bağlantısı olarak.",
     [k("ad", "Ad soyad", "metin"), k("mezuniyet", "Mezuniyet yılı", "sayi"),
      k("firma", "Firma", "metin"), k("pozisyon", "Pozisyon", "metin"),
      k("linkedin", "LinkedIn", "link"), k("ulasildi", "Ulaşıldı", "tik"),
      k("rol", "Kulübe katkısı", "secim", ["Konuşmacı", "Mentor", "Sponsor bağlantısı", "Gezi bağlantısı", "Henüz belli değil"]),
      k("sorumlu", "Sorumlu üye", "kisi"), not_()],
     {}, []),
    ("gorusme-kaydi", "kurumsal", "Görüşme ve Yazışma Kaydı",
     "Firma ve kurumlarla yapılan her görüşmenin kısa kaydı. Takip tarihi gelen görüşmeler genel bakışa düşer.",
     [k("tarih", "Tarih", "tarih"), k("kurum", "Firma / kurum", "metin"),
      k("kisi", "Görüşülen", "metin"),
      k("kanal", "Kanal", "secim", ["E-posta", "Telefon", "Yüz yüze", "Online toplantı", "LinkedIn"]),
      k("yapan", "Görüşen üye", "kisi"), k("ozet", "Özet", "uzun", gen=320),
      k("sonraki", "Sonraki adım", "metin", gen=220), k("takip", "Takip tarihi", "tarih", gecikme=True)],
     {"ajanda": {"tarih": "takip", "baslik": "kurum"}}, []),

    # ---------------- 02 İLETİŞİM VE SOSYAL MEDYA ----------------
    ("icerik-takvimi", "iletisim", "İçerik Takvimi",
     "Paylaşım planı: hangi gün, hangi platformda, hangi içerik. Onaylananları işaretleyin.",
     [k("tarih", "Yayın tarihi", "tarih"), k("platform", "Platform", "secim", PLATFORM),
      k("format", "Format", "secim", ["Post", "Carousel", "Reels", "Story", "Video", "Duyuru"]),
      k("konu", "Konu", "metin", gen=220), k("metin", "Gönderi metni", "uzun", gen=300),
      k("tasarim", "Tasarım", "kisi"), k("sorumlu", "Yayından sorumlu", "kisi"),
      k("durum", "Durum", "secim", ["Fikir", "Hazırlanıyor", "Onay bekliyor", "Planlandı", "Yayınlandı"]),
      k("onay", "Onaylandı", "tik"), k("link", "Gönderi linki", "link"), not_()],
     {"ajanda": {"tarih": "tarih", "baslik": "konu", "durum": "durum"}}, []),
    ("tasarim-talepleri", "iletisim", "Tasarım Talepleri",
     "Diğer departmanlardan gelen afiş, post, sertifika ve video talepleri.",
     [k("talep", "Talep", "metin", gen=220),
      k("departman", "Talep eden", "secim", DEPARTMANLAR),
      k("tur", "Tür", "secim", ["Afiş", "Post", "Story", "Reels / video", "Sertifika", "Roll-up / banner", "Sunum", "Tanıtım dosyası"]),
      k("teslim", "Teslim tarihi", "tarih", gecikme=True), k("tasarimci", "Tasarımcı", "kisi"),
      k("durum", "Durum", "secim", ["Bekliyor", "Çalışılıyor", "Revize", "Teslim edildi"]),
      k("teslim_edildi", "Teslim edildi", "tik"), k("link", "Dosya linki", "link"), not_()],
     {"ajanda": {"tarih": "teslim", "baslik": "talep", "bitti": "teslim_edildi"}}, []),
    ("marka-kiti", "iletisim", "Marka Kiti",
     "Kulübün kurumsal kimlik dosyaları. Her öğenin güncel sürümünün linkini ekleyin.",
     [k("oge", "Öğe", "metin", gen=220), k("aciklama", "Açıklama", "uzun", gen=300),
      k("link", "Dosya / link", "link"), k("dosya", "Yüklenen dosya", "belge"),
      k("guncel", "Güncel", "tik"), not_()],
     {}, [{"oge": "Logo (renkli, beyaz, siyah; PNG ve SVG)"}, {"oge": "Renk kodları"}, {"oge": "Yazı tipleri"},
          {"oge": "Instagram post şablonu"}, {"oge": "Story şablonu"}, {"oge": "Afiş şablonu"},
          {"oge": "Katılım sertifikası şablonu"}, {"oge": "Sunum şablonu"}, {"oge": "Roll-up / banner"},
          {"oge": "Sponsor logo yerleşim kuralları"}, {"oge": "E-posta imzası"}]),
    ("hesaplar", "iletisim", "Sosyal Medya Hesapları",
     "Kulübün hesapları ve sorumluları. Şifre yazmayın; şifreler yalnızca başkanda ya da ortak bir şifre yöneticisinde dursun.",
     [k("platform", "Platform", "secim", PLATFORM + ["E-posta hesabı", "Web sitesi"]),
      k("kullanici", "Kullanıcı adı", "metin"), k("link", "Link", "link"),
      k("sorumlu", "Hesap sorumlusu", "kisi"), k("iki_adim", "İki adımlı doğrulama açık", "tik"),
      k("kurtarma", "Kurtarma e-postası kimde", "metin", gen=200), not_()],
     {}, []),
    ("aylik-rapor", "iletisim", "Aylık Performans Raporu",
     "Her ay platform bazında takipçi, erişim ve etkileşim rakamları.",
     [k("ay", "Ay", "metin", gen=120), k("platform", "Platform", "secim", PLATFORM),
      k("takipci", "Takipçi", "sayi"), k("yeni", "Yeni takipçi", "sayi"),
      k("erisim", "Erişim", "sayi"), k("etkilesim", "Etkileşim", "sayi"),
      k("en_iyi", "En iyi gönderi", "link"), not_()],
     {}, []),
    ("duyuru-kanallari", "iletisim", "Duyuru Kanalları",
     "Etkinlik duyurusu yapılabilecek kanallar ve yetkilileri.",
     [k("kanal", "Kanal", "metin", gen=220),
      k("tur", "Tür", "secim", ["Üniversite haber sitesi", "Fakülte duyuru", "Bölüm WhatsApp grubu", "Kulüp WhatsApp", "E-posta listesi", "Pano / afiş", "Diğer"]),
      k("yetkili", "Yetkili kişi", "metin"), k("iletisim", "İletişim", "metin"), not_()],
     {}, []),

    # ---------------- 03 ORGANİZASYON ----------------
    ("etkinlik-takvimi", "organizasyon", "Yıllık Etkinlik Takvimi",
     "Dönemin bütün etkinlikleri. İzin, salon ve duyuru kutuları hazırlığın nerede olduğunu gösterir.",
     [k("etkinlik", "Etkinlik", "metin", gen=220),
      k("tur", "Tür", "secim", ["Seminer / söyleşi", "Teknik gezi", "Workshop / eğitim", "Yarışma", "Fuar", "Sosyal etkinlik", "Tanışma / oryantasyon"]),
      k("tarih", "Tarih", "tarih"), k("saat", "Saat", "metin", gen=90), k("yer", "Yer", "metin"),
      k("sorumlu", "Sorumlu", "kisi"),
      k("durum", "Durum", "secim", ["Fikir", "Planlanıyor", "İzin bekliyor", "Onaylandı", "Duyuruldu", "Gerçekleşti", "İptal"]),
      k("izin", "İzin alındı", "tik"), k("salon", "Salon ayarlandı", "tik"), k("duyuru", "Duyuruldu", "tik"),
      k("hedef", "Hedef katılımcı", "sayi"), k("butce", "Bütçe", "para"), not_()],
     {"ozel": "etkinlik", "ajanda": {"tarih": "tarih", "baslik": "etkinlik", "durum": "durum"}}, []),
    ("etkinlik-kontrol", "organizasyon", "Etkinlik Kontrol Listesi",
     "Her etkinlikte tekrarlanan adımlar. Yeni etkinlik için Tablo ayarları → Kopyasını oluştur ile çoğaltın.",
     [k("adim", "Adım", "metin", gen=300),
      k("asama", "Ne zaman", "secim", ["4+ hafta önce", "2–3 hafta önce", "1 hafta önce", "Etkinlik günü", "Etkinlik sonrası"]),
      k("sorumlu", "Sorumlu", "kisi"), k("son_tarih", "Son tarih", "tarih", gecikme=True),
      k("tamam", "Tamam", "tik"), not_()],
     {}, [
         {"adim": "Etkinlik fikri, tarih ve hedef kitle netleşti", "asama": "4+ hafta önce"},
         {"adim": "Konuşmacı / firma teyidi alındı", "asama": "4+ hafta önce"},
         {"adim": "Bütçe çıkarıldı, başkan onayı alındı", "asama": "4+ hafta önce"},
         {"adim": "SKS / rektörlük etkinlik izin dilekçesi verildi", "asama": "4+ hafta önce"},
         {"adim": "Salon rezervasyonu yapıldı", "asama": "2–3 hafta önce"},
         {"adim": "Afiş ve duyuru metni İletişim'den istendi", "asama": "2–3 hafta önce"},
         {"adim": "Kayıt formu açıldı", "asama": "2–3 hafta önce"},
         {"adim": "Sosyal medya ve duyuru kanallarında paylaşıldı", "asama": "1 hafta önce"},
         {"adim": "Ses, ışık ve projeksiyon kontrol edildi", "asama": "1 hafta önce"},
         {"adim": "İkram siparişi verildi", "asama": "1 hafta önce"},
         {"adim": "Katılım sertifikaları hazırlandı", "asama": "1 hafta önce"},
         {"adim": "Görevli üye listesi ve kayıt masası planı çıkarıldı", "asama": "1 hafta önce"},
         {"adim": "Konuşmacı karşılama ve ulaşım ayarlandı", "asama": "Etkinlik günü"},
         {"adim": "Fotoğraf ve video çekimi yapıldı", "asama": "Etkinlik günü"},
         {"adim": "Konuşmacıya teşekkür e-postası ve plaket", "asama": "Etkinlik sonrası"},
         {"adim": "Katılımcı memnuniyet anketi gönderildi", "asama": "Etkinlik sonrası"},
         {"adim": "Harcama belgeleri toplandı", "asama": "Etkinlik sonrası"},
         {"adim": "Etkinlik raporu yazıldı ve SKS'ye iletildi", "asama": "Etkinlik sonrası"},
     ]),
    ("resmi-yazismalar", "organizasyon", "İzin ve Resmi Yazışmalar",
     "Rektörlük, dekanlık ve SKS'ye giden dilekçeler ve onay durumları.",
     [k("konu", "Konu", "metin", gen=240),
      k("makam", "Makam", "secim", ["Rektörlük", "Dekanlık", "SKS Daire Başkanlığı", "Bölüm Başkanlığı", "Belediye", "Diğer"]),
      k("etkinlik", "İlgili etkinlik", "metin"), k("gonderim", "Gönderim tarihi", "tarih"),
      k("evrak_no", "Evrak no", "metin", gen=120), k("sorumlu", "Sorumlu", "kisi"),
      k("durum", "Durum", "secim", ["Hazırlanıyor", "Gönderildi", "İmzada", "Onaylandı", "Reddedildi"]),
      k("onay", "Onaylandı", "tik"), k("belge", "Yazı / onay belgesi", "belge"), not_()],
     {}, []),
    ("butce", "organizasyon", "Bütçe ve Harcamalar",
     "Kulübün gelir ve giderleri. Genel bakıştaki kasa bakiyesi bu tablodan hesaplanır.",
     [k("tarih", "Tarih", "tarih"), k("kalem", "Kalem", "metin", gen=220),
      k("tur", "Tür", "secim", ["Gelir", "Gider"]), k("etkinlik", "Etkinlik", "metin"),
      k("tutar", "Tutar", "para"), k("odeyen", "Ödeyen / sorumlu", "kisi"),
      k("belge", "Fiş / fatura alındı", "tik"), k("iade", "Ödeyene iade edildi", "tik"), not_()],
     {"ozel": "butce"}, []),
    ("gorevli-uyeler", "organizasyon", "Görevli Üye Planı",
     "Etkinlik günü kim nerede görevli. Gelenleri işaretleyin.",
     [k("etkinlik", "Etkinlik", "metin"),
      k("gorev", "Görev", "secim", ["Kayıt masası", "Karşılama", "Salon düzeni", "Ses / ışık", "Fotoğraf / video", "Konuşmacı ağırlama", "İkram", "Ulaşım", "Yönlendirme"]),
      k("uye", "Üye", "metin"), k("koordinator", "Koordinatör", "kisi"),
      k("saat", "Saat", "metin", gen=100), k("geldi", "Geldi", "tik"), not_()],
     {}, []),
    ("uye-listesi", "organizasyon", "Üye Listesi",
     "Kulübe kayıtlı üyeler. Kişisel veriler yalnızca kulüp işleri için kullanılır.",
     [k("ad", "Ad soyad", "metin"), k("bolum", "Bölüm", "metin"),
      k("sinif", "Sınıf", "secim", ["Hazırlık", "1", "2", "3", "4", "Yüksek lisans"]),
      k("telefon", "Telefon", "metin", gen=140), k("eposta", "E-posta", "metin", gen=200),
      k("kayit", "Kayıt tarihi", "tarih"), k("aktif", "Aktif", "tik"),
      k("ilgi", "İlgi alanı", "metin"), not_()],
     {}, []),
    ("envanter", "organizasyon", "Envanter ve Demirbaş",
     "Kulübün malzemeleri: roll-up, bayrak, ses sistemi, kırtasiye. Kimde olduğu belli olsun.",
     [k("malzeme", "Malzeme", "metin", gen=220), k("adet", "Adet", "sayi"),
      k("yer", "Nerede", "metin"), k("kimde", "Kimde", "kisi"),
      k("durum", "Durum", "secim", ["Sağlam", "Arızalı", "Ödünç verildi", "Kayıp"]), not_()],
     {}, []),
    ("etkinlik-raporlari", "organizasyon", "Etkinlik Sonrası Raporlar",
     "Her etkinlikten sonra katılım, memnuniyet, harcama ve öğrenilenler.",
     [k("etkinlik", "Etkinlik", "metin", gen=220), k("tarih", "Tarih", "tarih"),
      k("katilimci", "Katılımcı", "sayi"), k("puan", "Anket ortalaması (5)", "sayi", gen=150),
      k("harcama", "Harcama", "para"), k("iyi", "İyi gidenler", "uzun"),
      k("gelistir", "Geliştirilecekler", "uzun"), k("rapor", "SKS'ye rapor verildi", "tik"), not_()],
     {}, []),

    # ---------------- 04 ERASMUS+ ----------------
    ("proje-cagrilari", "erasmus", "Proje ve Çağrı Takibi",
     "Takip edilen Erasmus+ ve Avrupa Dayanışma Programı çağrıları. Son başvuru tarihleri genel bakışa düşer.",
     [k("program", "Program", "secim", ["KA1 Gençlik Değişimi", "KA1 Gençlik Çalışanları Hareketliliği", "KA154 Gençlik Katılımı", "KA2 Ortaklık", "Avrupa Dayanışma Programı", "DiscoverEU", "Diğer"]),
      k("baslik", "Proje / çağrı", "metin", gen=240), k("ulke", "Ülke", "metin", gen=120),
      k("ev_sahibi", "Ev sahibi kuruluş", "metin"), k("tarihler", "Proje tarihleri", "metin", gen=150),
      k("son_basvuru", "Son başvuru", "tarih", gecikme=True), k("kontenjan", "Kontenjan", "sayi"),
      k("durum", "Durum", "secim", ["İnceleniyor", "Başvuru hazırlanıyor", "Başvuruldu", "Kabul", "Ret", "Tamamlandı"]),
      k("basvuruldu", "Başvuruldu", "tik"), k("link", "Link", "link"),
      k("sorumlu", "Sorumlu", "kisi"), not_()],
     {"ajanda": {"tarih": "son_basvuru", "baslik": "baslik", "bitti": "basvuruldu", "durum": "durum"}}, []),
    ("ortak-kuruluslar", "erasmus", "Ortak Kuruluşlar",
     "Birlikte proje yapılan ya da yapılabilecek yurt dışı kuruluşlar.",
     [k("kurulus", "Kuruluş", "metin", gen=220), k("ulke", "Ülke", "metin", gen=120),
      k("kisi", "İletişim kişisi", "metin"), k("iletisim", "İletişim", "metin"),
      k("oid", "OID numarası", "metin", gen=130), k("gecmis", "Ortak projeler", "uzun"), not_()],
     {}, []),
    ("katilimcilar", "erasmus", "Başvuran ve Katılımcılar",
     "Projelere başvuran üyeler ve belgelerinin durumu.",
     [k("ad", "Ad soyad", "metin"), k("bolum", "Bölüm", "metin"), k("proje", "Proje", "metin"),
      k("dil", "İngilizce seviyesi", "secim", ["A2", "B1", "B2", "C1", "C2"]),
      k("motivasyon", "Motivasyon mektubu", "tik"), k("pasaport", "Pasaport hazır", "tik"),
      k("secildi", "Seçildi", "tik"), k("sigorta", "Sigorta / vize tamam", "tik"), not_()],
     {}, []),
    ("webinar-takvimi", "erasmus", "Webinar Takvimi",
     "Erasmus+ bilgilendirme webinarları: konu, konuşmacı, duyuru ve katılım.",
     [k("tarih", "Tarih", "tarih"), k("saat", "Saat", "metin", gen=90),
      k("konu", "Konu", "metin", gen=220), k("konusmaci", "Konuşmacı", "metin"),
      k("platform", "Platform", "secim", ["Zoom", "Google Meet", "Microsoft Teams", "Instagram canlı", "YouTube canlı"]),
      k("sorumlu", "Sorumlu", "kisi"), k("duyuru", "Duyuruldu", "tik"),
      k("link", "Kayıt / yayın linki", "link"), k("katilim", "Katılım", "sayi"), not_()],
     {"ajanda": {"tarih": "tarih", "baslik": "konu"}}, []),
    ("erasmus-kaynaklar", "erasmus", "Kaynaklar ve Rehberler",
     "Başvuru hazırlarken bakılacak resmi kaynaklar.",
     [k("kaynak", "Kaynak", "metin", gen=260),
      k("tur", "Tür", "secim", ["Program rehberi", "Ulusal ajans", "Çağrı ve ilanlar", "Eğitim / araç", "Şablon"]),
      k("link", "Link", "link", gen=220), not_()],
     {}, [
         {"kaynak": "Erasmus+ Program Rehberi", "tur": "Program rehberi", "link": "https://erasmus-plus.ec.europa.eu/erasmus-programme-guide"},
         {"kaynak": "Türkiye Ulusal Ajansı", "tur": "Ulusal ajans", "link": "https://www.ua.gov.tr"},
         {"kaynak": "Avrupa Gençlik Portalı", "tur": "Çağrı ve ilanlar", "link": "https://youth.europa.eu"},
         {"kaynak": "SALTO-YOUTH (ortak arama, eğitim takvimi)", "tur": "Çağrı ve ilanlar", "link": "https://www.salto-youth.net"},
         {"kaynak": "DiscoverEU", "tur": "Çağrı ve ilanlar", "link": "https://youth.europa.eu/discovereu_en"},
     ]),
]


def main(out):
    os.makedirs(os.path.join(out, "kisiler"), exist_ok=True)
    os.makedirs(os.path.join(out, "dosyalar"), exist_ok=True)
    for i, (id_, ad, dep, sev, rol, ack) in enumerate(KISILER):
        doc = {"ad": ad, "departman": dep, "seviye": sev, "rol": rol, "aciklama": ack, "sira": i + 1, "hesap": ""}
        with open(os.path.join(out, "kisiler", id_ + ".json"), "w", encoding="utf-8") as f:
            json.dump(doc, f, ensure_ascii=False)
    sira = {}
    for id_, dep, baslik, ack, kolonlar, ek, hazir in DOSYALAR:
        sira[dep] = sira.get(dep, 0) + 1
        ids = {c["id"] for c in kolonlar}
        assert len(ids) == len(kolonlar), id_
        satirlar = {}
        for j, r in enumerate(hazir):
            assert set(r) <= ids, (id_, r)
            satirlar[f"r{j + 1:03d}"] = {"_s": j + 1, **r}
        for v in (ek.get("ajanda") or {}).values():
            assert v in ids, (id_, v)
        doc = {"baslik": baslik, "aciklama": ack, "departman": dep, "sira": sira[dep],
               "kolonlar": kolonlar, "satirlar": satirlar, **ek,
               "olusturma": DONEM_BAS, "guncelleme": DONEM_BAS, "guncelleyen": ""}
        with open(os.path.join(out, "dosyalar", id_ + ".json"), "w", encoding="utf-8") as f:
            json.dump(doc, f, ensure_ascii=False)
    print(f"{len(KISILER)} kişi, {len(DOSYALAR)} tablo yazıldı -> {out}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "kulup/.tohum")
