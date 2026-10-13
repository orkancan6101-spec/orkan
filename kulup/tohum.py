"""Kulüp panelinin başlangıç verisini üretir: yalnızca ekip listesi.

Yönetim şemasındaki kişileri JSON belgeleri olarak bir klasöre yazar. Bu
dosyalar `ArtifactData batch` ile panelin veritabanına (`kisiler/<id>`)
yüklenir. Tablolar ve görevler kulüp tarafından panelden eklenir; betik
hazır tablo ya da görev üretmez.

Kullanım:
    python3 kulup/tohum.py <cikti_klasoru>
"""
import json
import os
import sys

KISILER = [
    # id, ad, departman, seviye, rol, açıklama
    ("atahan-akcin", "Atahan Akçin", "kurumsal", "baskan", "Departman Başkanı",
     "Sponsorluk stratejilerini belirler ve ana firmalarla üst düzey iletişimi kurar."),
    ("kerem-can", "Kerem Can", "kurumsal", "yardimci", "Başkan Yardımcısı",
     "Sponsorluk dosyalarını takip eder; sözleşme ve bütçe süreçlerini denetler."),
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

def main(out):
    os.makedirs(os.path.join(out, "kisiler"), exist_ok=True)
    for i, (id_, ad, dep, sev, rol, ack) in enumerate(KISILER):
        doc = {"ad": ad, "departman": dep, "seviye": sev, "rol": rol, "aciklama": ack, "sira": i + 1, "hesap": ""}
        with open(os.path.join(out, "kisiler", id_ + ".json"), "w", encoding="utf-8") as f:
            json.dump(doc, f, ensure_ascii=False)
    print(f"{len(KISILER)} kişi yazıldı -> {out}")


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "kulup/.tohum")
