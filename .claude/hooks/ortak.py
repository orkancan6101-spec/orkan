"""Hook'ların ortak yardımcıları: İstanbul saati ve proje ayarları."""
import json
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

try:
    from zoneinfo import ZoneInfo

    TZ = ZoneInfo("Europe/Istanbul")
except Exception:  # tzdata yoksa: Türkiye 2016'dan beri sabit UTC+3
    TZ = timezone(timedelta(hours=3))

GUNLER = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"]
AYLAR = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
         "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"]

KOK = Path(os.environ.get("CLAUDE_PROJECT_DIR") or Path(__file__).resolve().parents[2])


def simdi() -> datetime:
    return datetime.now(TZ)


def zaman_cumlesi(an: datetime | None = None) -> str:
    an = an or simdi()
    return (f"{an.day} {AYLAR[an.month - 1]} {an.year} {GUNLER[an.weekday()]}, "
            f"saat {an:%H:%M} (Europe/Istanbul) — ISO {an:%Y-%m-%dT%H:%M}")


def ayarlar() -> dict:
    try:
        return json.loads((KOK / "planlayici" / "ayarlar.json").read_text(encoding="utf-8"))
    except Exception:
        return {}
