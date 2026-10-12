#!/usr/bin/env python3
"""Planlayıcı motoru: önceliklendirme, kapasite kontrolü, gün planı ve .ics çıktısı.

Yalnızca standart kütüphaneyi kullanır. Yöntemlerin gerekçesi planlayici/yontemler.md'de.

Veri kaynağı (--veri):
  * Plan Panosu veritabanından ArtifactData `list ... out_dir=<dizin>` ile inen dizin
    (<dizin>/gorevler/*.json, <dizin>/ayarlar/profil.json), ya da
  * {"gorevler": [...], "profil": {...}} biçiminde tek bir JSON dosyası.

Örnekler:
  python3 planlayici/planla.py oncelik  --veri /tmp/db
  python3 planlayici/planla.py kapasite --veri /tmp/db
  python3 planlayici/planla.py gun      --veri /tmp/db --tarih 2026-10-13 --mesgul mesgul.json --kaydet plan.json
  python3 planlayici/planla.py ics      --plan plan.json --cikti plan.ics
  python3 planlayici/planla.py katsayi  --veri /tmp/db
  python3 planlayici/planla.py siralama --veri /tmp/db --kaydet siralama.json
"""
from __future__ import annotations

import argparse
import json
import math
import statistics
import sys
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

try:
    from zoneinfo import ZoneInfo

    TZ = ZoneInfo("Europe/Istanbul")
except Exception:  # tzdata yoksa: Türkiye 2016'dan beri sabit UTC+3
    TZ = timezone(timedelta(hours=3))

GUN_ADLARI = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]
GUN_ANAHTARLARI = ["pazartesi", "sali", "carsamba", "persembe", "cuma", "cumartesi", "pazar"]
KAPALI = {"tamamlandi", "iptal"}
PLANLANMAZ = KAPALI | {"bekliyor", "gelen"}

VARSAYILAN_PROFIL = {
    # Bir gün için anahtar sırası: "0".."6" (0=Pazartesi) → "pazartesi".. → "hafta_ici"/"hafta_sonu"
    "calisma_pencereleri": {
        "hafta_ici": [["09:00", "12:30"], ["13:30", "18:00"], ["20:00", "22:30"]],
        "hafta_sonu": [["10:00", "13:00"], ["15:00", "18:30"]],
    },
    "gunluk_max_is_dk": {"hafta_ici": 300, "hafta_sonu": 240},
    "zirve_saatleri": [["09:00", "12:30"]],
    # Ders programı, takım toplantısı gibi her hafta tekrarlayan meşguliyetler
    "haftalik_sabitler": [],
    "gunluk_derin_limit_dk": 240,
    "blok_dk": 90,
    "mola_dk": 10,
    "tampon_orani": 0.2,
    "tahmin_katsayisi": None,  # None → tamamlanan görevlerden öğrenilir
    "varsayilan_tahmin_dk": 60,
}


# ---------------------------------------------------------------- zaman yardımcıları

def simdi_istanbul() -> datetime:
    return datetime.now(TZ).replace(tzinfo=None, second=0, microsecond=0)


def dk(saat: str) -> int:
    s, d = saat.split(":")
    return int(s) * 60 + int(d)


def saat(dakika: int) -> str:
    return f"{dakika // 60:02d}:{dakika % 60:02d}"


def tarih_saat(deger: str | None, gun_sonu: bool = True) -> datetime | None:
    """'YYYY-MM-DD' → o günün 23:59'u (son tarih olarak), 'YYYY-MM-DDTHH:MM' → kendisi."""
    if not deger:
        return None
    deger = str(deger).strip().replace(" ", "T")
    if "T" in deger:
        dt = datetime.fromisoformat(deger[:16])
    else:
        d = date.fromisoformat(deger[:10])
        dt = datetime(d.year, d.month, d.day, 23, 59) if gun_sonu else datetime(d.year, d.month, d.day)
    return dt.replace(tzinfo=None)


def gun_degeri(sozluk: dict, gun: date, varsayilan=None):
    for anahtar in (str(gun.weekday()), GUN_ANAHTARLARI[gun.weekday()],
                    "hafta_sonu" if gun.weekday() >= 5 else "hafta_ici"):
        if anahtar in sozluk:
            return sozluk[anahtar]
    return varsayilan


def cikar(araliklar: list[list[int]], engel: tuple[int, int]) -> list[list[int]]:
    """Dakika aralıklarından bir engel aralığını çıkarır."""
    es, eb = engel
    sonuc = []
    for s, b in araliklar:
        if eb <= s or es >= b:
            sonuc.append([s, b])
            continue
        if s < es:
            sonuc.append([s, es])
        if eb < b:
            sonuc.append([eb, b])
    return sonuc


def ortusme(a: tuple[int, int], b: tuple[int, int]) -> int:
    return max(0, min(a[1], b[1]) - max(a[0], b[0]))


# ---------------------------------------------------------------- veri yükleme

def _belge_ac(dosya: Path) -> dict:
    ham = json.loads(dosya.read_text(encoding="utf-8"))
    # ArtifactData bazı çıktılarda belgeyi {"id", "version", "data": {...}} içine sarar
    if isinstance(ham, dict) and isinstance(ham.get("data"), dict) and (
        "version" in ham or "id" in ham or "doc_id" in ham
    ):
        govde = dict(ham["data"])
        govde.setdefault("id", ham.get("id") or ham.get("doc_id") or dosya.stem)
        return govde
    if isinstance(ham, dict):
        ham.setdefault("id", dosya.stem)
    return ham


def yukle(yol: str) -> tuple[list[dict], dict]:
    p = Path(yol)
    if p.is_dir():
        gdir = p / "gorevler"
        gorevler = [_belge_ac(f) for f in sorted(gdir.glob("*.json"))] if gdir.is_dir() else []
        pf = p / "ayarlar" / "profil.json"
        profil = _belge_ac(pf) if pf.is_file() else {}
    else:
        d = json.loads(p.read_text(encoding="utf-8"))
        gorevler, profil = d.get("gorevler", []), d.get("profil", {})
    for i, g in enumerate(gorevler):
        g.setdefault("id", f"g{i + 1}")
    return gorevler, profil_hazirla(profil)


def profil_hazirla(profil: dict | None) -> dict:
    sonuc = json.loads(json.dumps(VARSAYILAN_PROFIL))
    for k, v in (profil or {}).items():
        if v is not None or k == "tahmin_katsayisi":
            sonuc[k] = v
    return sonuc


def mesgul_yukle(yol: str | None) -> list[tuple[datetime, datetime, str]]:
    """Takvimden gelen meşgul aralıklar: [{"bas": ISO, "bit": ISO, "baslik": str}, ...]."""
    if not yol:
        return []
    ham = json.loads(Path(yol).read_text(encoding="utf-8"))
    if isinstance(ham, dict):
        ham = ham.get("etkinlikler") or ham.get("events") or []
    sonuc = []
    for e in ham:
        bas = tarih_saat(e.get("bas") or e.get("start"), gun_sonu=False)
        bit = tarih_saat(e.get("bit") or e.get("end"), gun_sonu=False)
        if bas and bit and bit > bas:
            sonuc.append((bas, bit, e.get("baslik") or e.get("summary") or "Meşgul"))
    return sonuc


# ---------------------------------------------------------------- görev hazırlığı

def hazirla(gorevler: list[dict]) -> dict[str, dict]:
    """Görevleri id'ye göre dizer; alt görevlere üst görevin son tarihini, önemini ve alanını aktarır."""
    tablo = {str(g["id"]): dict(g) for g in gorevler}
    for g in tablo.values():
        g["_cocuklar"] = []
    for g in tablo.values():
        ust = tablo.get(str(g.get("ust_id") or ""))
        if ust:
            ust["_cocuklar"].append(g["id"])
            for alan in ("son_tarih", "onem", "alan", "enerji"):
                if g.get(alan) in (None, ""):
                    g[alan] = ust.get(alan)
    for g in tablo.values():
        acik_cocuk = [c for c in g["_cocuklar"] if tablo[c].get("durum") not in KAPALI]
        g["_yaprak"] = not acik_cocuk
    return tablo


def tahmin_katsayisi(gorevler: list[dict], profil: dict) -> tuple[float, str]:
    if isinstance(profil.get("tahmin_katsayisi"), (int, float)):
        return float(profil["tahmin_katsayisi"]), "profilde sabitlenmiş"
    oranlar = [
        g["gercek_dk"] / g["tahmin_dk"]
        for g in gorevler
        if g.get("durum") == "tamamlandi"
        and isinstance(g.get("gercek_dk"), (int, float)) and g["gercek_dk"] > 0
        and isinstance(g.get("tahmin_dk"), (int, float)) and g["tahmin_dk"] > 0
    ]
    n = len(oranlar)
    if n == 0:
        return 1.5, "varsayılan (henüz gerçek süre verisi yok)"
    medyan = min(3.0, max(1.0, statistics.median(oranlar)))
    if n < 5:
        karisik = (1.5 * (5 - n) + medyan * n) / 5
        return round(karisik, 2), f"{n} görevden kısmen öğrenildi (medyan {medyan:.2f})"
    return round(medyan, 2), f"{n} tamamlanan görevin medyanı"


def ham_kalan(g: dict, profil: dict) -> tuple[float, bool]:
    for alan in ("kalan_dk", "tahmin_dk"):
        v = g.get(alan)
        if isinstance(v, (int, float)) and v >= 0:
            return float(v), True
    return float(profil["varsayilan_tahmin_dk"]), False


def efektif_kalan(g: dict, profil: dict, k: float) -> int:
    return int(math.ceil(ham_kalan(g, profil)[0] * k / 5.0) * 5)


def bloke_mu(g: dict, tablo: dict) -> bool:
    for bid in g.get("bagimli") or []:
        b = tablo.get(str(bid))
        if b and b.get("durum") not in KAPALI:
            return True
    return False


def engelledikleri(g: dict, tablo: dict) -> int:
    return sum(
        1 for h in tablo.values()
        if h.get("durum") not in KAPALI and str(g["id"]) in [str(x) for x in h.get("bagimli") or []]
    )


# ---------------------------------------------------------------- kapasite

def etkinlik_mesgulleri(tablo: dict) -> list[tuple[datetime, datetime, str]]:
    """Saati sabit görevler (tur=etkinlik) takvimde meşgul sayılır."""
    sonuc = []
    for g in tablo.values():
        if g.get("tur") == "etkinlik" and g.get("durum") not in KAPALI:
            bas, bit = tarih_saat(g.get("bas"), False), tarih_saat(g.get("bit"), False)
            if bas and bit and bit > bas:
                sonuc.append((bas, bit, g.get("baslik", "Etkinlik")))
    return sonuc


def gun_serbest(profil: dict, gun: date, mesgul, alt: datetime | None = None,
                ust: datetime | None = None) -> list[list[int]]:
    """Bir günün boş çalışma aralıkları (dakika). alt/ust ile kırpılır."""
    pencereler = [[dk(a), dk(b)] for a, b in gun_degeri(profil["calisma_pencereleri"], gun, [])]
    for s in profil.get("haftalik_sabitler") or []:
        sgun = s.get("gun")
        eslesir = sgun == gun.weekday() or str(sgun).lower() in (str(gun.weekday()), GUN_ANAHTARLARI[gun.weekday()])
        if eslesir:
            pencereler = cikar(pencereler, (dk(s["bas"]), dk(s["bit"])))
    gun_bas = datetime(gun.year, gun.month, gun.day)
    for bas, bit, _ in mesgul:
        if bit <= gun_bas or bas >= gun_bas + timedelta(days=1):
            continue
        s = max(0, int((bas - gun_bas).total_seconds() // 60))
        b = min(24 * 60, int(math.ceil((bit - gun_bas).total_seconds() / 60)))
        pencereler = cikar(pencereler, (s, b))
    if alt and alt.date() == gun:
        alt_dk = int(math.ceil((alt.hour * 60 + alt.minute) / 5.0) * 5)
        pencereler = cikar(pencereler, (0, alt_dk))
    if ust and ust.date() == gun:
        pencereler = cikar(pencereler, (ust.hour * 60 + ust.minute, 24 * 60))
    return [p for p in pencereler if p[1] - p[0] >= 5]


def gun_kapasitesi(profil: dict, gun: date, serbest: list[list[int]]) -> int:
    toplam = sum(b - s for s, b in serbest)
    tavan = gun_degeri(profil["gunluk_max_is_dk"], gun, 300)
    return int(min(toplam * (1 - profil["tampon_orani"]), tavan))


def kapasite_dk(profil: dict, bas: datetime, bit: datetime, mesgul) -> int:
    if bit <= bas:
        return 0
    toplam, gun = 0, bas.date()
    while gun <= bit.date():
        serbest = gun_serbest(profil, gun, mesgul, alt=bas, ust=bit)
        toplam += gun_kapasitesi(profil, gun, serbest)
        gun += timedelta(days=1)
    return toplam


# ---------------------------------------------------------------- önceliklendirme

KADRANLAR = {
    1: "1 · Hemen yap",
    2: "2 · Planla ve koru",
    3: "3 · Küçült / devret",
    4: "4 · Bırak / sonra",
}


def degerlendir(g: dict, tablo: dict, profil: dict, k: float, simdi: datetime, mesgul,
                edf_durum: str | None = None) -> dict:
    onem = int(g.get("onem") or 3)
    onem = min(5, max(1, onem))
    E = efektif_kalan(g, profil, k)
    tahmin_var = ham_kalan(g, profil)[1]
    st = tarih_saat(g.get("son_tarih"))
    nedenler, oran, gecikmis = [], None, False

    if st is None:
        U = 1
        nedenler.append("son tarih yok")
    elif st <= simdi:
        U, gecikmis, oran = 5, True, 0.0
        nedenler.append(f"son tarih geçti ({g.get('son_tarih')})")
    else:
        cap = kapasite_dk(profil, simdi, st, mesgul)
        oran = cap / E if E > 0 else float("inf")
        if oran < 1:
            U = 5
            nedenler.append(f"YETİŞMEZ: {E} dk iş var, son tarihe kadar {cap} dk kapasite")
        elif oran < 1.5:
            U = 4
        elif oran < 3:
            U = 3
        elif oran < 6:
            U = 2
        else:
            U = 1
        kalan_saat = (st - simdi).total_seconds() / 3600
        if kalan_saat <= 36:
            U = max(U, 4)
        if oran >= 1:
            nedenler.append(f"son tarihe {kalan_saat / 24:.1f} gün; kapasite/iş oranı {oran:.1f}")

    # Tek başına yetişen iş, diğer işlerle birlikte yetişmeyebilir (EDF kümülatif testi)
    if edf_durum == "yetişmez" and U < 4:
        U = 4
        nedenler.append("diğer son tarihli işlerle birlikte kapasite yetmiyor")
    elif edf_durum == "sıkışık" and U < 3:
        U = 3
        nedenler.append("son tarihe kadar takvim sıkışık")

    engel = engelledikleri(g, tablo)
    skor = round(50 * (onem - 1) / 4 + 50 * (U - 1) / 4) + min(10, 5 * engel) + (10 if gecikmis else 0)
    if engel:
        nedenler.append(f"{engel} görevi bekletiyor")
    if not tahmin_var:
        nedenler.append(f"süre tahmini yok, {profil['varsayilan_tahmin_dk']} dk varsayıldı")
    if (g.get("ertelenme") or 0) >= 3:
        nedenler.append(f"{g['ertelenme']} kez ertelendi: küçült, sil ya da devret")

    onemli, acil = onem >= 4, U >= 4
    kadran = 1 if onemli and acil else 2 if onemli else 3 if acil else 4
    return {
        "id": str(g["id"]),
        "baslik": g.get("baslik", "(başlıksız)"),
        "alan": g.get("alan"),
        "durum": g.get("durum", "aktif"),
        "skor": skor,
        "onem": onem,
        "aciliyet": U,
        "kadran": kadran,
        "kadran_ad": KADRANLAR[kadran],
        "son_tarih": g.get("son_tarih"),
        "efektif_kalan_dk": E,
        "kapasite_orani": None if oran is None or oran == float("inf") else round(oran, 2),
        "gecikmis": gecikmis,
        "bloke": bloke_mu(g, tablo),
        "enerji": g.get("enerji") or "orta",
        "nedenler": nedenler,
    }


def oncelik_listesi(gorevler, profil, simdi=None, mesgul=None) -> tuple[list[dict], float]:
    simdi = simdi or simdi_istanbul()
    tablo = hazirla(gorevler)
    ham_mesgul = list(mesgul or [])
    mesgul = ham_mesgul + etkinlik_mesgulleri(tablo)
    k, _ = tahmin_katsayisi(gorevler, profil)
    edf = {s["id"]: s["durum"] for s in edf_kontrol(gorevler, profil, simdi, ham_mesgul)}
    sonuc = [
        degerlendir(g, tablo, profil, k, simdi, mesgul, edf.get(str(g["id"])))
        for g in tablo.values()
        if g.get("durum") not in KAPALI and g["_yaprak"] and g.get("tur") != "etkinlik"
    ]
    sonuc.sort(key=lambda r: (-r["skor"], r["son_tarih"] or "9999", -r["onem"]))
    return sonuc, k


# ---------------------------------------------------------------- EDF fizibilite

def edf_kontrol(gorevler, profil, simdi=None, mesgul=None) -> list[dict]:
    """Son tarihe göre sıralı kümülatif iş yükünü o tarihe kadarki kapasiteyle karşılaştırır."""
    simdi = simdi or simdi_istanbul()
    tablo = hazirla(gorevler)
    mesgul = list(mesgul or []) + etkinlik_mesgulleri(tablo)
    k, _ = tahmin_katsayisi(gorevler, profil)
    adaylar = [
        g for g in tablo.values()
        if g.get("durum") not in KAPALI | {"bekliyor"} and g["_yaprak"]
        and g.get("tur") != "etkinlik" and tarih_saat(g.get("son_tarih"))
    ]
    adaylar.sort(key=lambda g: tarih_saat(g["son_tarih"]))
    satirlar, kumulatif = [], 0
    for g in adaylar:
        E = efektif_kalan(g, profil, k)
        if E <= 0:
            continue
        kumulatif += E
        st = tarih_saat(g["son_tarih"])
        cap = kapasite_dk(profil, simdi, st, mesgul) if st > simdi else 0
        durum = "yetişmez" if kumulatif > cap else "sıkışık" if kumulatif > 0.8 * cap else "rahat"
        satirlar.append({
            "id": str(g["id"]), "baslik": g.get("baslik"), "son_tarih": g["son_tarih"],
            "is_dk": E, "kumulatif_dk": kumulatif, "kapasite_dk": cap,
            "acik_dk": max(0, kumulatif - cap), "durum": durum,
        })
    return satirlar


# ---------------------------------------------------------------- gün planı

def gun_plani(gorevler, profil, tarih: date, simdi=None, mesgul=None) -> dict:
    simdi = simdi or simdi_istanbul()
    tablo = hazirla(gorevler)
    tum_mesgul = list(mesgul or []) + etkinlik_mesgulleri(tablo)
    sirali, k = oncelik_listesi(gorevler, profil, simdi, mesgul)
    alt = simdi if tarih == simdi.date() else None
    if tarih < simdi.date():
        raise ValueError("Geçmiş bir gün için plan yapılamaz.")

    serbest = gun_serbest(profil, tarih, tum_mesgul, alt=alt)
    bos_dk = sum(b - s for s, b in serbest)
    butce = gun_kapasitesi(profil, tarih, serbest)
    derin_butce = int(profil["gunluk_derin_limit_dk"])
    zirve = [(dk(a), dk(b)) for a, b in profil.get("zirve_saatleri") or []]
    blok, mola = int(profil["blok_dk"]), int(profil["mola_dk"])
    yuvalar = [list(y) for y in serbest]

    def zirvede(y):
        return sum(ortusme(tuple(y), z) for z in zirve) > 0

    def yer_bul(sure: int, enerji: str):
        uygun = [y for y in yuvalar if y[1] - y[0] >= 5]
        if enerji == "derin":
            uygun.sort(key=lambda y: (not zirvede(y), y[0]))
        elif enerji == "hafif":
            uygun.sort(key=lambda y: (zirvede(y), y[0]))
        else:
            uygun.sort(key=lambda y: y[0])
        for y in uygun:
            if y[1] - y[0] >= sure:
                return y, sure
        en_uzun = max(uygun, key=lambda y: y[1] - y[0], default=None)
        if en_uzun and en_uzun[1] - en_uzun[0] >= min(25, sure):
            return en_uzun, en_uzun[1] - en_uzun[0]
        return None, 0

    bloklar, sigmayanlar, uyarilar = [], [], []
    gun_sonu = datetime(tarih.year, tarih.month, tarih.day, 23, 59)
    for r in sirali:
        g = tablo[r["id"]]
        if g.get("durum") in PLANLANMAZ or r["bloke"]:
            continue
        E = r["efektif_kalan_dk"]
        if E <= 0:
            continue
        st = tarih_saat(g.get("son_tarih"))
        if st and st.date() > tarih:
            kalan_gun = sum(
                1 for i in range((st.date() - tarih).days + 1)
                if gun_degeri(profil["calisma_pencereleri"], tarih + timedelta(days=i), [])
            )
            pay = math.ceil(E / max(1, kalan_gun))
            pay = max(pay, min(E, 45))
        elif st:
            pay = E
        else:
            pay = min(E, blok)
        pay = min(E, int(math.ceil(pay / 5.0) * 5))

        yerlesen = 0
        while yerlesen < pay and butce > 0:
            if r["enerji"] == "derin" and derin_butce <= 0:
                break
            istek = min(blok, pay - yerlesen, butce)
            if r["enerji"] == "derin":
                istek = min(istek, derin_butce)
            if istek < min(15, pay - yerlesen):
                break
            yuva, sure = yer_bul(istek, r["enerji"])
            if not yuva:
                break
            bas = yuva[0]
            bloklar.append({
                "bas": saat(bas), "bit": saat(bas + sure), "tur": "odak",
                "gorev_id": r["id"], "baslik": r["baslik"], "enerji": r["enerji"],
            })
            yuva[0] = bas + sure + mola
            yerlesen += sure
            butce -= sure
            if r["enerji"] == "derin":
                derin_butce -= sure
        if yerlesen < pay and (r["kadran"] in (1, 2) or (st and st <= gun_sonu)):
            sigmayanlar.append({
                "gorev_id": r["id"], "baslik": r["baslik"], "eksik_dk": pay - yerlesen,
                "neden": "günlük derin çalışma sınırı" if r["enerji"] == "derin" and derin_butce <= 0
                else "günün kapasitesi doldu",
            })

    gun_bas = datetime(tarih.year, tarih.month, tarih.day)
    for bas, bit, ad in tum_mesgul:
        if bas < gun_bas + timedelta(days=1) and bit > gun_bas:
            s = max(bas, gun_bas)
            b = min(bit, gun_bas + timedelta(hours=23, minutes=59))
            bloklar.append({"bas": s.strftime("%H:%M"), "bit": b.strftime("%H:%M"), "tur": "sabit", "baslik": ad})
    for s in profil.get("haftalik_sabitler") or []:
        sgun = s.get("gun")
        if sgun == tarih.weekday() or str(sgun).lower() in (str(tarih.weekday()), GUN_ANAHTARLARI[tarih.weekday()]):
            bloklar.append({"bas": s["bas"], "bit": s["bit"], "tur": "sabit", "baslik": s.get("baslik", "Sabit program")})
    bloklar.sort(key=lambda b: (b["bas"], b["tur"] != "sabit"))

    # Günün en önemli işleri: planlanan bloklardan önemli kadranlar (1-2), en fazla 3
    rapor = {r["id"]: r for r in sirali}
    planlananlar = list(dict.fromkeys(b["gorev_id"] for b in bloklar if b["tur"] == "odak"))
    onemliler = [i for i in planlananlar if rapor[i]["kadran"] in (1, 2)] or planlananlar
    mit = sorted(onemliler, key=lambda i: -rapor[i]["skor"])[:3]

    for satir in edf_kontrol(gorevler, profil, simdi, mesgul):
        if satir["durum"] == "yetişmez":
            uyarilar.append(
                f"'{satir['baslik']}' ({satir['son_tarih']}) yetişmiyor: "
                f"{satir['acik_dk']} dk açık var. Kapsamı küçült, süre iste ya da başka işi ertele."
            )
    for r in sirali:
        if "kez ertelendi" in " ".join(r["nedenler"]):
            uyarilar.append(f"'{r['baslik']}' sürekli erteleniyor: 10 dakikalık ilk adıma küçültelim mi?")
    planlanan = sum(dk(b["bit"]) - dk(b["bas"]) for b in bloklar if b["tur"] == "odak")
    return {
        "tarih": tarih.isoformat(),
        "gun": GUN_ADLARI[tarih.weekday()],
        "olusturma": simdi.isoformat(timespec="minutes"),
        "tahmin_katsayisi": k,
        "bloklar": bloklar,
        "mit": mit,
        "sigmayanlar": sigmayanlar,
        "analiz_bekleyen": [g["id"] for g in tablo.values() if g.get("durum") == "gelen"],
        "ozet": {
            "bos_dk": bos_dk,
            "kapasite_dk": gun_kapasitesi(profil, tarih, serbest),
            "planlanan_dk": planlanan,
            "derin_dk": int(profil["gunluk_derin_limit_dk"]) - derin_butce,
        },
        "uyarilar": uyarilar,
    }


# ---------------------------------------------------------------- pano raporu

def siralama_raporu(gorevler, profil, simdi=None, mesgul=None) -> dict:
    """Plan Panosu'ndaki `analiz/siralama` belgesi: öncelik sırası + son tarih kontrolü."""
    simdi = simdi or simdi_istanbul()
    sirali, k = oncelik_listesi(gorevler, profil, simdi, mesgul)
    return {
        "olusturma": simdi.isoformat(timespec="minutes"),
        "katsayi": k,
        "katsayi_aciklama": tahmin_katsayisi(gorevler, profil)[1],
        "gorevler": sirali,
        "edf": edf_kontrol(gorevler, profil, simdi, mesgul),
    }


# ---------------------------------------------------------------- .ics

def ics_uret(plan: dict, sadece_odak: bool = True) -> str:
    tarih = date.fromisoformat(plan["tarih"])
    damga = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    def utc(hhmm: str) -> str:
        yerel = datetime(tarih.year, tarih.month, tarih.day, *map(int, hhmm.split(":")), tzinfo=TZ)
        return yerel.astimezone(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    def kacis(metin: str) -> str:
        return metin.replace("\\", "\\\\").replace(";", "\\;").replace(",", "\\,").replace("\n", "\\n")

    satirlar = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//orkan//planlayici//TR", "CALSCALE:GREGORIAN"]
    for b in plan["bloklar"]:
        if sadece_odak and b["tur"] != "odak":
            continue
        uid = f"{plan['tarih']}-{b.get('gorev_id', 'sabit')}-{b['bas'].replace(':', '')}@planlayici"
        satirlar += [
            "BEGIN:VEVENT", f"UID:{uid}", f"DTSTAMP:{damga}",
            f"DTSTART:{utc(b['bas'])}", f"DTEND:{utc(b['bit'])}",
            f"SUMMARY:{kacis('Odak: ' + b['baslik'] if b['tur'] == 'odak' else b['baslik'])}",
            "BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:Odak bloğu başlıyor", "TRIGGER:-PT5M", "END:VALARM",
            "END:VEVENT",
        ]
    satirlar.append("END:VCALENDAR")
    return "\r\n".join(satirlar) + "\r\n"


# ---------------------------------------------------------------- metin çıktıları

def yaz_oncelik(sirali: list[dict], k: float) -> str:
    if not sirali:
        return "Açık görev yok."
    satirlar = [f"Tahmin katsayısı: ×{k}", ""]
    for i, r in enumerate(sirali, 1):
        etiket = []
        if r["bloke"]:
            etiket.append("BLOKE")
        if r["durum"] == "gelen":
            etiket.append("ANALİZ BEKLİYOR")
        if r["durum"] == "bekliyor":
            etiket.append("BAŞKASINI BEKLİYOR")
        ek = f" [{', '.join(etiket)}]" if etiket else ""
        satirlar.append(
            f"{i:>2}. ({r['skor']:>3}) {r['baslik']}{ek}\n"
            f"      {r['kadran_ad']} · önem {r['onem']}/5 · aciliyet {r['aciliyet']}/5 · "
            f"kalan ≈{r['efektif_kalan_dk']} dk · son: {r['son_tarih'] or '—'}\n"
            f"      {'; '.join(r['nedenler'])}"
        )
    return "\n".join(satirlar)


def yaz_edf(satirlar: list[dict]) -> str:
    if not satirlar:
        return "Son tarihli açık görev yok."
    cikti = ["Son tarih    İş(dk)  Kümülatif  Kapasite  Durum      Görev"]
    for s in satirlar:
        cikti.append(
            f"{str(s['son_tarih'])[:16]:<12} {s['is_dk']:>6}  {s['kumulatif_dk']:>9}  {s['kapasite_dk']:>8}  "
            f"{s['durum']:<9}  {s['baslik']}" + (f"  (açık {s['acik_dk']} dk)" if s["acik_dk"] else "")
        )
    return "\n".join(cikti)


def yaz_plan(plan: dict, tablo: dict | None = None) -> str:
    o = plan["ozet"]
    cikti = [
        f"{plan['gun']}, {plan['tarih']}  ·  boş {o['bos_dk']} dk · kapasite {o['kapasite_dk']} dk · "
        f"planlanan {o['planlanan_dk']} dk (derin {o['derin_dk']} dk)",
        "",
    ]
    for b in plan["bloklar"]:
        isaret = "■" if b["tur"] == "sabit" else "▶"
        cikti.append(f"  {b['bas']}–{b['bit']}  {isaret} {b['baslik']}" + (f"  ({b['enerji']})" if b.get("enerji") else ""))
    if plan["mit"]:
        adlar = [next((b["baslik"] for b in plan["bloklar"] if b.get("gorev_id") == i), i) for i in plan["mit"]]
        cikti += ["", "Günün en önemli işleri: " + " | ".join(adlar)]
    if plan["sigmayanlar"]:
        cikti += ["", "Sığmayanlar:"] + [f"  - {s['baslik']}: {s['eksik_dk']} dk ({s['neden']})" for s in plan["sigmayanlar"]]
    if plan["uyarilar"]:
        cikti += ["", "Uyarılar:"] + [f"  ! {u}" for u in plan["uyarilar"]]
    if plan["analiz_bekleyen"]:
        cikti += ["", f"Gelen kutusunda analiz bekleyen {len(plan['analiz_bekleyen'])} görev var."]
    return "\n".join(cikti)


# ---------------------------------------------------------------- komut satırı

def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description="Planlayıcı motoru")
    alt = ap.add_subparsers(dest="komut", required=True)

    def ortak(p):
        p.add_argument("--veri", required=True, help="ArtifactData out_dir dizini ya da JSON dosyası")
        p.add_argument("--simdi", help="YYYY-MM-DDTHH:MM (varsayılan: şu an, İstanbul)")
        p.add_argument("--mesgul", help="Takvim meşguliyetleri JSON dosyası")
        p.add_argument("--json", action="store_true", help="Makine okunur çıktı")

    ortak(alt.add_parser("oncelik", help="Görevleri öncelik puanına göre sırala"))
    ortak(alt.add_parser("kapasite", help="Son tarih fizibilitesi (EDF)"))
    pg = alt.add_parser("gun", help="Bir gün için zaman bloğu planı öner")
    ortak(pg)
    pg.add_argument("--tarih", help="YYYY-MM-DD (varsayılan: bugün)")
    pg.add_argument("--kaydet", help="Planı bu JSON dosyasına yaz (Plan Panosu'na yüklemek için)")
    pg.add_argument("--yorum", help="Asistanın günün planına notu (panoda en üstte görünür)")
    ps = alt.add_parser("siralama", help="Pano için öncelik + son tarih raporu (analiz/siralama)")
    ortak(ps)
    ps.add_argument("--kaydet", required=True, help="Raporu bu JSON dosyasına yaz")
    pk = alt.add_parser("katsayi", help="Kişisel tahmin katsayısını göster")
    pk.add_argument("--veri", required=True)
    pi = alt.add_parser("ics", help="Gün planından .ics dosyası üret")
    pi.add_argument("--plan", required=True)
    pi.add_argument("--cikti", required=True)
    pi.add_argument("--hepsi", action="store_true", help="Sabit blokları da ekle")

    a = ap.parse_args(argv)

    if a.komut == "ics":
        plan = json.loads(Path(a.plan).read_text(encoding="utf-8"))
        Path(a.cikti).write_text(ics_uret(plan, sadece_odak=not a.hepsi), encoding="utf-8")
        print(f"{a.cikti} yazıldı.")
        return 0

    gorevler, profil = yukle(a.veri)
    if a.komut == "katsayi":
        k, aciklama = tahmin_katsayisi(gorevler, profil)
        print(f"×{k} — {aciklama}")
        return 0

    simdi = tarih_saat(a.simdi, gun_sonu=False) if a.simdi else simdi_istanbul()
    mesgul = mesgul_yukle(a.mesgul)
    if a.komut == "oncelik":
        sirali, k = oncelik_listesi(gorevler, profil, simdi, mesgul)
        print(json.dumps({"katsayi": k, "gorevler": sirali}, ensure_ascii=False, indent=2) if a.json else yaz_oncelik(sirali, k))
    elif a.komut == "kapasite":
        satirlar = edf_kontrol(gorevler, profil, simdi, mesgul)
        print(json.dumps(satirlar, ensure_ascii=False, indent=2) if a.json else yaz_edf(satirlar))
    elif a.komut == "siralama":
        rapor = siralama_raporu(gorevler, profil, simdi, mesgul)
        Path(a.kaydet).write_text(json.dumps(rapor, ensure_ascii=False, indent=2), encoding="utf-8")
        print(yaz_oncelik(rapor["gorevler"], rapor["katsayi"]))
        print()
        print(yaz_edf(rapor["edf"]))
    elif a.komut == "gun":
        tarih = date.fromisoformat(a.tarih) if a.tarih else simdi.date()
        plan = gun_plani(gorevler, profil, tarih, simdi, mesgul)
        if a.yorum:
            plan["yorum"] = a.yorum
        if a.kaydet:
            Path(a.kaydet).write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding="utf-8")
        print(json.dumps(plan, ensure_ascii=False, indent=2) if a.json else yaz_plan(plan))
    return 0


if __name__ == "__main__":
    sys.exit(main())
