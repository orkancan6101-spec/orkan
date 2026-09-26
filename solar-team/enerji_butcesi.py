#!/usr/bin/env python3
"""Verimlilik aracı / güneş arabası için enerji bütçesi hesaplayıcı.

Sabit hızda yol yükü denklemi:
    F_aero  = 1/2 * rho * CdA * v^2
    F_yuv   = Crr * m * g * cos(theta)
    F_egim  = m * g * sin(theta)
    P_teker = (F_aero + F_yuv + F_egim) * v
    P_bat   = P_teker / eta      (eta = motor x motor sürücü x aktarma verimi)

Örnek araç değerleri VARSAYIMDIR; kendi aracının ölçülmüş değerleriyle değiştir.

Kullanım:
    python3 enerji_butcesi.py                       # iki örnek araç
    python3 enerji_butcesi.py --arac ec --cda 0.12  # örneği değiştirerek dene
"""
import argparse
import math

RHO = 1.2   # hava yoğunluğu [kg/m^3], ~20 °C, deniz seviyesi
G = 9.81    # yerçekimi ivmesi [m/s^2]

ORNEK_ARACLAR = {
    "ec": dict(ad="EC elektromobil (örnek varsayımlar)", kutle=190, cda=0.15,
               crr=0.006, verim=0.86, hiz=35, hizlar=(20, 30, 35, 40, 50)),
    "wsc": dict(ad="WSC tipi güneş arabası (örnek varsayımlar)", kutle=260, cda=0.08,
                crr=0.004, verim=0.95, hiz=85, hizlar=(60, 70, 80, 90, 100)),
}


def guc(p, v_kmh, egim=0.0):
    """Sabit hızda güç bileşenleri [W]. egim: yokuş oranı (0.04 = %4), >= 0."""
    v = v_kmh / 3.6
    theta = math.atan(egim)
    p_aero = 0.5 * RHO * p["cda"] * v**2 * v
    p_yuv = p["crr"] * p["kutle"] * G * math.cos(theta) * v
    p_egim = p["kutle"] * G * math.sin(theta) * v
    p_teker = p_aero + p_yuv + p_egim
    return dict(aero=p_aero, yuv=p_yuv, egim=p_egim, teker=p_teker,
                bat=p_teker / p["verim"])


def rapor(p):
    print(f"\n=== {p['ad']} ===")
    print(f"m = {p['kutle']:g} kg (sürücü dahil) | CdA = {p['cda']:g} m² | "
          f"Crr = {p['crr']:g} | verim = {p['verim']:g}")

    print(f"\n{'Hız':>6} {'Aero':>7} {'Yuvarl.':>8} {'Teker':>7} {'Batarya':>8} "
          f"{'Tüketim':>8} {'Aero payı':>10}")
    print(f"{'km/h':>6} {'W':>7} {'W':>8} {'W':>7} {'W':>8} {'Wh/km':>8} {'%':>10}")
    for v in p["hizlar"]:
        r = guc(p, v)
        print(f"{v:>6g} {r['aero']:>7.0f} {r['yuv']:>8.0f} {r['teker']:>7.0f} "
              f"{r['bat']:>8.0f} {r['bat'] / v:>8.1f} {100 * r['aero'] / r['teker']:>9.0f}%")

    v = p["hiz"]
    taban = guc(p, v)["bat"]
    print(f"\n{v:g} km/h'de batarya gücü: {taban:.0f} W. Tek bir iyileştirme yapılırsa:")
    senaryolar = {
        "CdA %10 azalırsa": dict(p, cda=p["cda"] * 0.9),
        "Crr %10 azalırsa": dict(p, crr=p["crr"] * 0.9),
        "Kütle 10 kg azalırsa": dict(p, kutle=p["kutle"] - 10),
        "Verim 2 puan artarsa": dict(p, verim=p["verim"] + 0.02),
    }
    for ad, s in senaryolar.items():
        fark = guc(s, v)["bat"] - taban
        print(f"  {ad:<22} {fark:>+7.1f} W  ({100 * fark / taban:>+5.1f}%)")

    yokus = guc(p, v, egim=0.04)
    kalkis_wh = 0.5 * p["kutle"] * (v / 3.6) ** 2 / p["verim"] / 3600
    print(f"  %4 yokuşta aynı hız   : {yokus['bat']:.0f} W  (düz yolun "
          f"{yokus['bat'] / taban:.1f} katı)")
    print(f"  0 → {v:g} km/h tek kalkış: {kalkis_wh:.1f} Wh kinetik enerji (batarya tarafı)")


def main():
    ap = argparse.ArgumentParser(description="Verimlilik aracı enerji bütçesi")
    ap.add_argument("--arac", choices=sorted(ORNEK_ARACLAR), help="yalnızca bu örnek")
    ap.add_argument("--kutle", type=float, help="toplam kütle, sürücü dahil [kg]")
    ap.add_argument("--cda", type=float, help="sürükleme alanı Cd*A [m^2]")
    ap.add_argument("--crr", type=float, help="yuvarlanma direnci katsayısı [-]")
    ap.add_argument("--verim", type=float, help="batarya -> teker toplam verim [0-1]")
    ap.add_argument("--hiz", type=float, help="hassasiyet analizinin referans hızı [km/h]")
    a = ap.parse_args()

    secilen = [a.arac] if a.arac else list(ORNEK_ARACLAR)
    for anahtar in secilen:
        p = dict(ORNEK_ARACLAR[anahtar])
        for alan in ("kutle", "cda", "crr", "verim", "hiz"):
            if getattr(a, alan) is not None:
                p[alan] = getattr(a, alan)
        p["hizlar"] = sorted(set(p["hizlar"]) | {p["hiz"]})
        rapor(p)


if __name__ == "__main__":
    main()
