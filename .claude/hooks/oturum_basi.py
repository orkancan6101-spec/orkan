#!/usr/bin/env python3
"""SessionStart hook'u: oturumun başında asistana zamanı ve sistemin nerede durduğunu söyler.

Çıktı (stdout) Claude'un bağlamına eklenir.
"""
import sys
from datetime import timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import ortak  # noqa: E402

an = ortak.simdi()
url = ortak.ayarlar().get("pano_url", "(planlayici/ayarlar.json içinde pano_url yok)")
yarin = an + timedelta(days=1)

if an.hour < 11:
    oneri = "Sabah: kullanıcı plan isterse /gunluk-plan."
elif an.hour >= 19:
    oneri = "Akşam: kullanıcı günü kapatmak isterse /gun-sonu; yarının planı için /gunluk-plan (tarih yarın)."
else:
    oneri = "Gün ortası: yeni iş gelirse /gorev; plan kaydıysa /gunluk-plan ile kalan günü yeniden planla."
if an.weekday() == 6:
    oneri += " Bugün pazar: /haftalik-plan zamanı."

print(f"""[Planlama asistanı]
Şu an: {ortak.zaman_cumlesi(an)}. Yarın: {yarin:%Y-%m-%d} {ortak.GUNLER[yarin.weekday()]}.
Plan Panosu (tek doğruluk kaynağı): {url}
Görevler ve planlar git'te değil, panonun veritabanında: önce CLAUDE.md'deki P1 ile veriyi indir.
{oneri}""")
