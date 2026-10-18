#!/usr/bin/env python3
"""ESOGÜ Otomotiv Kulübü sponsorluk stickerı üretici.

İki tasarım üretir (yazılar eğriye çevrilmiş, baskıya hazır SVG):
  sponsor-sticker-yatay.svg     150 x 80 mm, köşeleri yuvarlatılmış
  sponsor-sticker-yuvarlak.svg  Ø 90 mm, beyaz kesim payıyla

Metni değiştirmek için aşağıdaki METIN sözlüğünü düzenle, sonra:
  pip install fonttools brotli
  python3 kulup/sticker/uret.py
  node kulup/sticker/render.mjs      # PNG (300 dpi) ve PDF
"""
import math
import os

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.ttLib import TTFont

KLASOR = os.path.dirname(os.path.abspath(__file__))

METIN = {
    "universite": "ESKİŞEHİR OSMANGAZİ ÜNİVERSİTESİ",
    "ust": "OTOMOTİV",
    "alt": "KULÜBÜ",
    "rozet": "RESMİ SPONSOR",
    "sezon": "2026 – 2027",
    "cember_ust": "ESOGÜ OTOMOTİV KULÜBÜ",
    "cember_alt": "RESMİ SPONSOR",
}

# Logodaki renkler (orijinal görselden ölçüldü) + parlak vurgu tonları
KOYU = "#0E1B1F"
TEAL = "#00586A"
TEAL_KOYU = "#003C48"
TEAL_PARLAK = "#19B4C8"
GUMUS = "#B3B3B3"


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
                gs = f.getGlyphSet()
                return gs, ad
        raise KeyError(f"glif yok: {ch!r}")

    def glif(self, ch):
        gs, ad = self._glif(ch)
        pen = SVGPathPen(gs)
        gs[ad].draw(pen)
        return pen.getCommands(), gs[ad].width

    def genislik(self, metin, boyut, aralik=0.0):
        k = boyut / self.em
        toplam = sum(self._glif(c)[0][self._glif(c)[1]].width for c in metin) * k
        return toplam + aralik * (len(metin) - 1)

    def sinirlar(self, metin):
        """Font birimlerinde (xmin, ymin, xmax, ymax), y yukarı."""
        x, kutu = 0, None
        for c in metin:
            gs, ad = self._glif(c)
            bp = BoundsPen(gs)
            gs[ad].draw(bp)
            if bp.bounds:
                b = (bp.bounds[0] + x, bp.bounds[1], bp.bounds[2] + x, bp.bounds[3])
                kutu = b if kutu is None else (min(kutu[0], b[0]), min(kutu[1], b[1]),
                                               max(kutu[2], b[2]), max(kutu[3], b[3]))
            x += gs[ad].width
        return kutu

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


# ---------------------------------------------------------------- ortak tanımlar
def tanimlar():
    return f"""
  <linearGradient id="krom" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFFFFF"/>
    <stop offset="0.45" stop-color="#E9EEF0"/>
    <stop offset="0.52" stop-color="#AEB7BB"/>
    <stop offset="0.62" stop-color="#D8DEE1"/>
    <stop offset="1" stop-color="#F7F9FA"/>
  </linearGradient>
  <linearGradient id="tealYazi" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#3FD3E4"/>
    <stop offset="0.5" stop-color="{TEAL_PARLAK}"/>
    <stop offset="0.52" stop-color="#0A93A8"/>
    <stop offset="1" stop-color="#0FA6BA"/>
  </linearGradient>
  <linearGradient id="gumusJant" gradientUnits="userSpaceOnUse" x1="-335" y1="-335" x2="335" y2="335">
    <stop offset="0" stop-color="#F6F8F9"/>
    <stop offset="0.3" stop-color="#C9CED0"/>
    <stop offset="0.48" stop-color="#8F979A"/>
    <stop offset="0.62" stop-color="#DDE1E3"/>
    <stop offset="0.82" stop-color="#A7AEB1"/>
    <stop offset="1" stop-color="#E8EBEC"/>
  </linearGradient>
  <linearGradient id="gumusKol" gradientUnits="userSpaceOnUse" x1="0" y1="-140" x2="0" y2="300">
    <stop offset="0" stop-color="#EEF1F2"/>
    <stop offset="0.45" stop-color="#C4C9CB"/>
    <stop offset="1" stop-color="#9AA1A4"/>
  </linearGradient>
  <radialGradient id="gobek" gradientUnits="userSpaceOnUse" cx="-30" cy="-50" r="140">
    <stop offset="0" stop-color="#F7F9FA"/>
    <stop offset="0.7" stop-color="#C6CBCD"/>
    <stop offset="1" stop-color="#A3AAAD"/>
  </radialGradient>
  <radialGradient id="yuz" gradientUnits="userSpaceOnUse" cx="-60" cy="-110" r="400">
    <stop offset="0" stop-color="#0F8399"/>
    <stop offset="0.45" stop-color="{TEAL}"/>
    <stop offset="1" stop-color="#002F39"/>
  </radialGradient>
  <linearGradient id="parlaklik" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.28"/>
    <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="hale">
    <stop offset="0" stop-color="{TEAL_PARLAK}" stop-opacity="0.75"/>
    <stop offset="0.55" stop-color="{TEAL}" stop-opacity="0.35"/>
    <stop offset="1" stop-color="{TEAL}" stop-opacity="0"/>
  </radialGradient>
  <filter id="golge" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="14"/>
  </filter>
  <filter id="golgeKucuk" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur stdDeviation="5"/>
  </filter>
  <clipPath id="yuzKirp"><circle r="300"/></clipPath>
  <clipPath id="kalkanIc"><path d="{KALKAN_IC}"/></clipPath>
  <pattern id="karbon" width="24" height="24" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="24" height="24" fill="#0B1619"/>
    <rect width="12" height="12" fill="#14262B"/>
    <rect x="12" y="12" width="12" height="12" fill="#14262B"/>
    <rect width="12" height="4" fill="#1B3238"/>
    <rect x="12" y="12" width="4" height="12" fill="#1B3238"/>
  </pattern>
  <pattern id="dama" width="40" height="40" patternUnits="userSpaceOnUse">
    <rect width="20" height="20" fill="#FFFFFF"/>
    <rect x="20" y="20" width="20" height="20" fill="#FFFFFF"/>
  </pattern>
  <pattern id="damaKucuk" width="16" height="16" patternUnits="userSpaceOnUse">
    <rect width="16" height="16" fill="{KOYU}"/>
    <rect width="8" height="8" fill="#FFFFFF"/>
    <rect x="8" y="8" width="8" height="8" fill="#FFFFFF"/>
  </pattern>"""


# Logo geometrisi: merkez (0,0), dış yarıçap 335 (orijinal görseldeki ölçü)
KALKAN_DIS = "M 0 -78 L 72 -59 L 72 8 C 72 52 40 80 0 99 C -40 80 -72 52 -72 8 L -72 -59 Z"
KALKAN_IC = "M 0 -65 L 60 -49 L 60 8 C 60 45 33 68 0 84 C -33 68 -60 45 -60 8 L -60 -49 Z"


def logo(cx, cy, R, hale=True):
    """Direksiyon logosu; (cx, cy) merkezli, R dış yarıçaplı."""
    s = R / 335
    p = []
    if hale:
        p.append('<circle r="520" fill="url(#hale)"/>')
    p.append('<circle cy="14" r="338" fill="#000" opacity="0.55" filter="url(#golge)"/>')
    # jant ve yüz
    p.append('<circle r="335" fill="url(#gumusJant)"/>')
    p.append('<circle r="335" fill="none" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="3"/>')
    p.append('<circle r="296" fill="url(#yuz)"/>')
    p.append('<circle r="296" fill="none" stroke="#001E25" stroke-opacity="0.6" stroke-width="6"/>')
    # kollar (jantın altında kalacak şekilde kırpılır)
    kollar = [
        "M -330 -131 L 0 -3 L 0 76 L -330 -66 Z",
        "M 330 -131 L 0 -3 L 0 76 L 330 -66 Z",
        "M -119 0 L 119 0 L 0 300 Z",
    ]
    p.append('<g clip-path="url(#yuzKirp)">')
    for d in kollar:
        p.append(f'<path d="{d}" fill="#000" opacity="0.45" transform="translate(0 10)" filter="url(#golgeKucuk)"/>')
    for d in kollar:
        p.append(f'<path d="{d}" fill="url(#gumusKol)"/>')
    # kollardaki ışık çizgisi
    p.append('<path d="M -330 -131 L 0 -3 M 330 -131 L 0 -3" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="3" fill="none"/>')
    # alt koldaki üçgen boşluk
    p.append('<path d="M -58 60 L 58 60 L 0 240 Z" fill="url(#yuz)"/>')
    p.append("</g>")
    # jant iç kenarını kolların üstüne yeniden çiz
    p.append('<circle r="315.5" fill="none" stroke="url(#gumusJant)" stroke-width="39"/>')
    # göbek
    p.append('<circle cy="4" r="108" fill="#000" opacity="0.5" filter="url(#golgeKucuk)"/>')
    p.append('<circle cy="-4" r="105" fill="url(#gobek)"/>')
    p.append('<circle cy="-4" r="105" fill="none" stroke="#FFFFFF" stroke-opacity="0.6" stroke-width="2.5"/>')
    # kalkan ve OK monogramı
    p.append('<g transform="translate(0 -4)">')
    p.append(f'<path d="{KALKAN_DIS}" fill="url(#yuz)"/>')
    p.append(f'<path d="{KALKAN_IC}" fill="#C9CED0"/>')
    p.append(f'<g clip-path="url(#kalkanIc)" fill="{TEAL}">')
    p.append('<rect x="-3" y="-80" width="6" height="180"/>')  # O | K arası
    p.append('<rect x="-40" y="-38" width="22" height="86" rx="11"/>')  # O iç boşluğu
    p.append('<path d="M 21 -80 L 45 -80 L 21 -14 Z"/>')  # K üst çentik
    p.append('<path d="M 72 -16 L 31 10 L 47 100 L 72 100 Z"/>')  # K sağ çentik
    p.append("</g></g>")
    # cam parlaklığı
    p.append('<path d="M -280 -40 A 290 290 0 0 1 280 -40 Q 0 -150 -280 -40 Z" fill="url(#parlaklik)"/>')
    return f'<g transform="translate({cx} {cy}) scale({s:.5f})">{"".join(p)}</g>'


def yildiz(cx, cy, r, renk):
    noktalar = []
    for i in range(10):
        a = math.radians(-90 + i * 36)
        rr = r if i % 2 == 0 else r * 0.42
        noktalar.append(f"{cx + rr * math.cos(a):.2f},{cy + rr * math.sin(a):.2f}")
    return f'<polygon points="{" ".join(noktalar)}" fill="{renk}"/>'


def svg(gen_mm, yuk_mm, vb_w, vb_h, govde):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{gen_mm}mm" height="{yuk_mm}mm" '
        f'viewBox="0 0 {vb_w} {vb_h}">\n<defs>{tanimlar()}\n</defs>\n{govde}\n</svg>\n'
    )


# ---------------------------------------------------------------- yatay sticker
def yatay():
    W, H, r = 1500, 800, 64
    kalin, orta, ince = Yazi("800-italic"), Yazi("700-normal"), Yazi("600-normal")
    g = []
    g.append(f'<clipPath id="kart"><rect width="{W}" height="{H}" rx="{r}"/></clipPath>')
    g.append('<g clip-path="url(#kart)">')
    g.append(f'<rect width="{W}" height="{H}" fill="url(#karbon)"/>')
    g.append(
        '<linearGradient id="kartGolge" x1="0" y1="0" x2="1" y2="0">'
        f'<stop offset="0" stop-color="{KOYU}" stop-opacity="0.2"/>'
        f'<stop offset="0.5" stop-color="{KOYU}" stop-opacity="0.75"/>'
        f'<stop offset="1" stop-color="{KOYU}" stop-opacity="0.9"/></linearGradient>'
    )
    g.append(f'<rect width="{W}" height="{H}" fill="url(#kartGolge)"/>')
    # sağ üstte solan dama bayrak
    g.append(
        '<radialGradient id="damaSol" cx="1" cy="0" r="0.6">'
        '<stop offset="0" stop-color="#fff" stop-opacity="0.16"/>'
        '<stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'
        '<mask id="damaMaske"><rect width="1500" height="800" fill="url(#damaSol)"/></mask>'
    )
    g.append(f'<rect width="{W}" height="{H}" fill="url(#dama)" mask="url(#damaMaske)"/>')
    # logo
    g.append(logo(370, 375, 265))
    # yazılar
    x0, x1 = 745, 1420
    gen = x1 - x0
    g.append(
        ince.satir(METIN["universite"], x0 + 4, 158, 37,
                   aralik=_aralik(ince, METIN["universite"], 37, gen - 4), fill="#9FB3B9")
    )
    ust_boyut = gen / (kalin.genislik(METIN["ust"], 1000) / 1000)
    g.append(f'<g fill="#000" opacity="0.45" transform="translate(6 8)">'
             f'{kalin.satir(METIN["ust"], x0, 352, ust_boyut)}'
             f'{kalin.satir(METIN["alt"], x0, 538, ust_boyut, aralik=_aralik(kalin, METIN["alt"], ust_boyut, gen))}</g>')
    g.append(kalin.satir(METIN["ust"], x0, 352, ust_boyut, fill="url(#krom)"))
    g.append(
        kalin.satir(METIN["alt"], x0, 538, ust_boyut,
                    aralik=_aralik(kalin, METIN["alt"], ust_boyut, gen), fill="url(#tealYazi)")
    )
    # RESMİ SPONSOR rozeti: dama | teal
    ry, rh, egim, dama_w = 588, 92, 18, 64
    g.append(f'<path d="M {x0 + egim} {ry} L {x0 + dama_w + egim} {ry} L {x0 + dama_w} {ry + rh} L {x0} {ry + rh} Z" fill="url(#damaKucuk)"/>')
    g.append(f'<path d="M {x0 + dama_w + 10 + egim} {ry} L {x1 + egim} {ry} L {x1} {ry + rh} L {x0 + dama_w + 10} {ry + rh} Z" fill="url(#tealYazi)"/>')
    rozet_x0, rozet_x1 = x0 + dama_w + 10 + egim / 2, x1 + egim / 2
    rozet_aralik = 10
    rozet_boyut = (rozet_x1 - rozet_x0 - 80 - rozet_aralik * (len(METIN["rozet"]) - 1)) / (orta.genislik(METIN["rozet"], 1000) / 1000)
    g.append(orta.satir(METIN["rozet"], (rozet_x0 + rozet_x1) / 2, ry + rh / 2 + rozet_boyut * orta.kep / orta.em / 2,
                        rozet_boyut, aralik=rozet_aralik, hiza="orta", fill="#FFFFFF"))
    # alt şerit (orijinaldeki gümüş + teal bant)
    g.append(f'<rect y="{H - 58}" width="{W}" height="10" fill="url(#krom)"/>')
    g.append(f'<rect y="{H - 44}" width="{W}" height="44" fill="{TEAL}"/>')
    g.append(f'<path d="M 1060 {H - 44} L 1500 {H - 44} L 1500 {H} L 1030 {H} Z" fill="{TEAL_PARLAK}"/>')
    g.append(f'<path d="M 1000 {H - 44} L 1040 {H - 44} L 1010 {H} L 970 {H} Z" fill="{TEAL_PARLAK}"/>')
    g.append(orta.satir(METIN["sezon"], 1400, H - 10, 40, aralik=3, hiza="sag", fill=KOYU))
    g.append("</g>")
    # iç çerçeve
    g.append(f'<rect x="14" y="14" width="{W - 28}" height="{H - 28}" rx="{r - 12}" fill="none" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="3"/>')
    return svg(150, 80, W, H, "\n".join(g))


def _aralik(yazi, metin, boyut, hedef):
    """Metni hedef genişliğe yaymak için harf aralığı."""
    return (hedef - yazi.genislik(metin, boyut)) / max(len(metin) - 1, 1)


# ---------------------------------------------------------------- yuvarlak sticker
def yuvarlak():
    S, c = 900, 450
    kalin, orta = Yazi("800-normal"), Yazi("700-normal")
    g = []
    g.append(f'<circle cx="{c}" cy="{c}" r="450" fill="#FFFFFF"/>')  # beyaz kesim payı
    g.append(f'<circle r="335" fill="url(#gumusJant)" transform="translate({c} {c}) scale({426 / 335:.4f})"/>')
    g.append(f'<circle cx="{c}" cy="{c}" r="412" fill="url(#karbon)"/>')
    g.append(
        '<radialGradient id="bant" cx="0.5" cy="0.5" r="0.5">'
        f'<stop offset="0.7" stop-color="{KOYU}" stop-opacity="0.6"/>'
        f'<stop offset="1" stop-color="{KOYU}" stop-opacity="0.95"/></radialGradient>'
    )
    g.append(f'<circle cx="{c}" cy="{c}" r="412" fill="url(#bant)"/>')
    # çevre yazıları
    g.append(kalin.cember(METIN["cember_ust"], c, c, 345, 76, aralik=9, fill="url(#krom)"))
    g.append(kalin.cember(METIN["cember_alt"], c, c, 397, 76, aralik=14, alt=True, fill="url(#tealYazi)"))
    # yanlarda yıldız
    for x in (c - 362, c + 362):
        g.append(yildiz(x, c + 2, 20, TEAL_PARLAK))
    # iç halka ve merkez
    g.append(f'<circle r="335" fill="url(#gumusJant)" transform="translate({c} {c}) scale({298 / 335:.4f})"/>')
    g.append(
        '<radialGradient id="merkez" cx="0.5" cy="0.45" r="0.55">'
        f'<stop offset="0" stop-color="#0B6A7C"/><stop offset="1" stop-color="{KOYU}"/></radialGradient>'
    )
    g.append(f'<circle cx="{c}" cy="{c}" r="282" fill="url(#merkez)"/>')
    g.append(
        f'<clipPath id="merkezKirp"><circle cx="{c}" cy="{c}" r="282"/></clipPath>'
        '<linearGradient id="damaSol2" x1="0" y1="0" x2="0" y2="1">'
        '<stop offset="0" stop-color="#fff" stop-opacity="0"/>'
        '<stop offset="1" stop-color="#fff" stop-opacity="0.2"/></linearGradient>'
        '<mask id="damaMaske2"><rect width="900" height="900" fill="url(#damaSol2)"/></mask>'
    )
    g.append(f'<g clip-path="url(#merkezKirp)"><rect width="900" height="900" fill="url(#dama)" mask="url(#damaMaske2)"/></g>')
    g.append(logo(c, c - 4, 248, hale=False))
    return svg(90, 90, S, S, "\n".join(g))


if __name__ == "__main__":
    for ad, fn in (("sponsor-sticker-yatay.svg", yatay), ("sponsor-sticker-yuvarlak.svg", yuvarlak)):
        yol = os.path.join(KLASOR, ad)
        with open(yol, "w", encoding="utf-8") as f:
            f.write(fn())
        print("yazıldı:", yol)
