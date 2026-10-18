#!/usr/bin/env python3
"""ESOGÜ Otomotiv Kulübü sponsorluk ek logosu (sade, düz renk).

Mevcut kulüp logosunun düz hâliyle üç sticker üretir. Yazılar eğriye
çevrilmiştir, SVG'ler baskıya hazırdır:
  ek-logo-a-yatay.svg    140 x 80 mm  orijinal düzen + altta RESMİ SPONSOR bandı
  ek-logo-b-muhur.svg    Ø 80 mm      yuvarlak mühür
  ek-logo-c-kalkan.svg   70 x 86 mm   logodaki kalkan biçiminde amblem
  onizleme.svg           üçü bir arada karşılaştırma sayfası

Metni değiştirmek için METIN sözlüğünü düzenle, sonra:
  pip install fonttools brotli
  python3 kulup/sticker/uret.py
  node kulup/sticker/render.mjs      # PNG (300 dpi) ve PDF
"""
import math
import os

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

KLASOR = os.path.dirname(os.path.abspath(__file__))

METIN = {
    "ust": "OTOMOTİV",
    "alt": "KULÜBÜ",
    "sponsor": "RESMİ SPONSOR",
    "kulup": "OTOMOTİV KULÜBÜ",
    "muhur_ust": "ESOGÜ OTOMOTİV KULÜBÜ",
    "kisa": "ESOGÜ",
}

# Orijinal logo görselinden ölçülen 4 renk; başka renk yok
KOYU = "#0E1B1F"
TEAL = "#00586A"
GUMUS = "#B3B3B3"
ACIK = "#EEF2F3"


# ---------------------------------------------------------------- yazı tipi
class Yazi:
    """fontsource latin + latin-ext alt kümelerini tek yazı tipi gibi kullanır."""

    def __init__(self, agirlik):
        self.fontlar = [
            TTFont(os.path.join(KLASOR, "fonts", f"barlow-condensed-{alt}-{agirlik}.woff2"))
            for alt in ("latin", "latin-ext")
        ]
        self.em = self.fontlar[0]["head"].unitsPerEm
        self.kep = self.fontlar[0]["OS/2"].sCapHeight

    def _glif(self, ch):
        for f in self.fontlar:
            ad = f.getBestCmap().get(ord(ch))
            if ad:
                return f.getGlyphSet(), ad
        raise KeyError(f"glif yok: {ch!r}")

    def glif(self, ch):
        gs, ad = self._glif(ch)
        pen = SVGPathPen(gs)
        gs[ad].draw(pen)
        return pen.getCommands(), gs[ad].width

    def genislik(self, metin, boyut, aralik=0.0):
        k = boyut / self.em
        toplam = 0
        for c in metin:
            gs, ad = self._glif(c)
            toplam += gs[ad].width
        return toplam * k + aralik * (len(metin) - 1)

    def boyut_icin_kep(self, kep_yuksekligi):
        """İstenen büyük harf yüksekliğini veren yazı boyutu."""
        return kep_yuksekligi * self.em / self.kep

    def satir(self, metin, x, y, boyut, aralik=0.0, hiza="sol", **ozellik):
        """Taban çizgisi y'de duran, eğriye çevrilmiş tek satır metin."""
        k = boyut / self.em
        w = self.genislik(metin, boyut, aralik)
        if hiza == "orta":
            x -= w / 2
        elif hiza == "sag":
            x -= w
        parcalar, cx = [], 0.0
        for c in metin:
            d, adv = self.glif(c)
            if d:
                parcalar.append(
                    f'<path transform="translate({x + cx:.2f} {y:.2f}) scale({k:.5f} {-k:.5f})" d="{d}"/>'
                )
            cx += adv * k + aralik
        return f"<g{_oz(ozellik)}>{''.join(parcalar)}</g>"

    def cember(self, metin, cx, cy, r, boyut, aralik=0.0, alt=False, **ozellik):
        """Çember üzerine ortalanmış metin. alt=True: alt yayda soldan sağa okunur."""
        k = boyut / self.em
        w = self.genislik(metin, boyut, aralik)
        merkez = 90 if alt else -90
        bas = math.radians(merkez) + (w / 2 / r if alt else -w / 2 / r)
        parcalar, s = [], 0.0
        for c in metin:
            d, adv = self.glif(c)
            a = adv * k
            t = bas - (s + a / 2) / r if alt else bas + (s + a / 2) / r
            px, py = cx + r * math.cos(t), cy + r * math.sin(t)
            don = math.degrees(t) - 90 if alt else math.degrees(t) + 90
            if d:
                parcalar.append(
                    f'<path transform="translate({px:.2f} {py:.2f}) rotate({don:.3f}) '
                    f'translate({-a / 2:.2f} 0) scale({k:.5f} {-k:.5f})" d="{d}"/>'
                )
            s += a + aralik
        return f"<g{_oz(ozellik)}>{''.join(parcalar)}</g>"


def _oz(ozellik):
    return "".join(f' {a.replace("_", "-")}="{v}"' for a, v in ozellik.items())


def _aralik(yazi, metin, boyut, hedef):
    """Metni hedef genişliğe yaymak için harf aralığı."""
    return (hedef - yazi.genislik(metin, boyut)) / max(len(metin) - 1, 1)


# ---------------------------------------------------------------- logo
# Geometri orijinal görselden ölçüldü: merkez (0,0), dış yarıçap 335
KALKAN_DIS = "M 0 -78 L 72 -59 L 72 8 C 72 52 40 80 0 99 C -40 80 -72 52 -72 8 L -72 -59 Z"
KALKAN_IC = "M 0 -65 L 60 -49 L 60 8 C 60 45 33 68 0 84 C -33 68 -60 45 -60 8 L -60 -49 Z"

TANIMLAR = f"""
  <clipPath id="yuzKirp"><circle r="300"/></clipPath>
  <clipPath id="kalkanIc"><path d="{KALKAN_IC}"/></clipPath>"""


def logo(cx, cy, R):
    """Kulüp logosunun düz renkli hâli; (cx, cy) merkezli, R dış yarıçaplı."""
    return (
        f'<g transform="translate({cx} {cy}) scale({R / 335:.5f})">'
        f'<circle r="335" fill="{GUMUS}"/>'
        f'<circle r="296" fill="{TEAL}"/>'
        f'<g clip-path="url(#yuzKirp)" fill="{GUMUS}">'
        '<path d="M -330 -131 L 0 -3 L 0 76 L -330 -66 Z"/>'
        '<path d="M 330 -131 L 0 -3 L 0 76 L 330 -66 Z"/>'
        '<path d="M -119 0 L 119 0 L 0 300 Z"/>'
        f'<path d="M -58 60 L 58 60 L 0 240 Z" fill="{TEAL}"/>'
        "</g>"
        f'<circle cy="-4" r="105" fill="{GUMUS}"/>'
        '<g transform="translate(0 -4)">'
        f'<path d="{KALKAN_DIS}" fill="{TEAL}"/>'
        f'<path d="{KALKAN_IC}" fill="{GUMUS}"/>'
        f'<g clip-path="url(#kalkanIc)" fill="{TEAL}">'
        '<rect x="-3" y="-80" width="6" height="180"/>'  # O | K arası
        '<rect x="-40" y="-38" width="22" height="86" rx="11"/>'  # O iç boşluğu
        '<path d="M 21 -80 L 45 -80 L 21 -14 Z"/>'  # K üst çentik
        '<path d="M 72 -16 L 31 10 L 47 100 L 72 100 Z"/>'  # K sağ çentik
        "</g></g></g>"
    )


# ---------------------------------------------------------------- A: yatay imza
def tasarim_a():
    """Orijinal düzen: logo + OTOMOTİV / KULÜBÜ, altta gümüş çizgi ve teal bantta RESMİ SPONSOR."""
    W, H, r = 1400, 800, 48
    kalin, orta = Yazi("800-normal"), Yazi("700-normal")
    bant_y = 668
    g = [
        f'<clipPath id="aKart"><rect width="{W}" height="{H}" rx="{r}"/></clipPath>',
        '<g clip-path="url(#aKart)">',
        f'<rect width="{W}" height="{H}" fill="{KOYU}"/>',
        logo(318, 334, 236),
    ]
    x0, x1 = 640, 1320
    boyut = (x1 - x0) / (kalin.genislik(METIN["ust"], 1000) / 1000)
    kep = boyut * kalin.kep / kalin.em
    ust_y = 334 - 0.2 * kep
    alt_y = ust_y + 1.42 * kep
    g.append(kalin.satir(METIN["ust"], x0, ust_y, boyut, fill=ACIK))
    g.append(kalin.satir(METIN["alt"], x0, alt_y, boyut, fill=GUMUS))
    # alt bant: orijinaldeki gümüş çizgi + teal şerit
    g.append(f'<rect y="{bant_y}" width="{W}" height="10" fill="{GUMUS}"/>')
    g.append(f'<rect y="{bant_y + 10}" width="{W}" height="{H - bant_y - 10}" fill="{TEAL}"/>')
    s_boyut = orta.boyut_icin_kep(50)
    g.append(orta.satir(METIN["sponsor"], W / 2, bant_y + 10 + (H - bant_y - 10) / 2 + 25, s_boyut,
                        aralik=22, hiza="orta", fill=ACIK))
    g.append("</g>")
    return "\n".join(g), W, H, 140, 80


# ---------------------------------------------------------------- B: mühür
def tasarim_b():
    """Yuvarlak mühür: teal bantta çevre yazısı, ortada logo."""
    S, c = 800, 400
    kalin = Yazi("800-normal")
    boyut = kalin.boyut_icin_kep(46)
    kep = 46
    orta_r = 339
    g = [
        f'<circle cx="{c}" cy="{c}" r="400" fill="{GUMUS}"/>',
        f'<circle cx="{c}" cy="{c}" r="388" fill="{TEAL}"/>',
        f'<circle cx="{c}" cy="{c}" r="290" fill="{GUMUS}"/>',
        f'<circle cx="{c}" cy="{c}" r="280" fill="{KOYU}"/>',
        logo(c, c, 222),
        kalin.cember(METIN["muhur_ust"], c, c, orta_r - kep / 2, boyut, aralik=8, fill=ACIK),
        kalin.cember(METIN["sponsor"], c, c, orta_r + kep / 2, boyut, aralik=14, alt=True, fill=ACIK),
    ]
    for x in (c - orta_r, c + orta_r):
        g.append(f'<circle cx="{x}" cy="{c}" r="9" fill="{GUMUS}"/>')
    return "\n".join(g), S, S, 80, 80


# ---------------------------------------------------------------- C: kalkan
def _kalkan_yolu(cx, ust, genislik, yukseklik):
    """Logodaki kalkanın (KALKAN_DIS) ölçeklenmiş hâli."""
    sx, sy = genislik / 144, yukseklik / 177

    def n(x, y):
        return f"{cx + x * sx:.2f} {ust + (y + 78) * sy:.2f}"

    return (f"M {n(0, -78)} L {n(72, -59)} L {n(72, 8)} C {n(72, 52)} {n(40, 80)} {n(0, 99)} "
            f"C {n(-40, 80)} {n(-72, 52)} {n(-72, 8)} L {n(-72, -59)} Z")


def tasarim_c():
    """Kalkan amblem: logodaki OK kalkanının büyütülmüş hâli."""
    W, H = 700, 860
    kalin, orta = Yazi("800-normal"), Yazi("700-normal")
    ic = _kalkan_yolu(350, 26, 700 - 52, 860 - 64)
    g = [
        f'<path d="{_kalkan_yolu(350, 0, W, H)}" fill="{GUMUS}"/>',
        f'<path d="{ic}" fill="{KOYU}"/>',
        f'<clipPath id="cIc"><path d="{ic}"/></clipPath>',
        logo(350, 292, 186),
    ]
    k_boyut = kalin.boyut_icin_kep(44)
    g.append(kalin.satir(METIN["kulup"], 350, 570, k_boyut, aralik=3, hiza="orta", fill=ACIK))
    g.append(f'<g clip-path="url(#cIc)"><rect y="604" width="{W}" height="84" fill="{TEAL}"/>'
             f'<rect y="598" width="{W}" height="6" fill="{GUMUS}"/></g>')
    s_boyut = orta.boyut_icin_kep(40)
    g.append(orta.satir(METIN["sponsor"], 350, 646 + 20, s_boyut, aralik=10, hiza="orta", fill=ACIK))
    e_boyut = orta.boyut_icin_kep(30)
    g.append(orta.satir(METIN["kisa"], 350, 748, e_boyut, aralik=12, hiza="orta", fill=GUMUS))
    return "\n".join(g), W, H, 70, 86


# ---------------------------------------------------------------- çıktı
def svg(govde, vb_w, vb_h, gen_mm, yuk_mm):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{gen_mm}mm" height="{yuk_mm}mm" '
        f'viewBox="0 0 {vb_w} {vb_h}">\n<defs>{TANIMLAR}\n</defs>\n{govde}\n</svg>\n'
    )


def onizleme(tasarimlar):
    """Üç tasarımı açık zeminde yan yana gösteren karşılaştırma sayfası."""
    orta = Yazi("700-normal")
    W, H = 1800, 2060
    yerler = [(200, 100, 1400, 800), (100, 1080, 800, 800), (1060, 1080, 640, 786)]
    etiketler = ["A · Yatay imza", "B · Mühür", "C · Kalkan"]
    g = [f'<rect width="{W}" height="{H}" fill="#E4E9EA"/>']
    for (govde, vw, vh, *_), (x, y, w, h), etiket in zip(tasarimlar, yerler, etiketler):
        g.append(f'<svg x="{x}" y="{y}" width="{w}" height="{h}" viewBox="0 0 {vw} {vh}">{govde}</svg>')
        g.append(orta.satir(etiket, x + w / 2, y + h + 70, orta.boyut_icin_kep(34), aralik=2, hiza="orta", fill=KOYU))
    return svg("\n".join(g), W, H, 180, 206)


if __name__ == "__main__":
    tasarimlar = [tasarim_a(), tasarim_b(), tasarim_c()]
    adlar = ["ek-logo-a-yatay", "ek-logo-b-muhur", "ek-logo-c-kalkan"]
    for ad, t in zip(adlar, tasarimlar):
        with open(os.path.join(KLASOR, f"{ad}.svg"), "w", encoding="utf-8") as f:
            f.write(svg(*t))
    with open(os.path.join(KLASOR, "onizleme.svg"), "w", encoding="utf-8") as f:
        f.write(onizleme(tasarimlar))
    print("yazıldı:", ", ".join(adlar), "onizleme")
