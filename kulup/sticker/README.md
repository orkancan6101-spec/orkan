# Sponsorluk stickerı

ESOGÜ Otomotiv Kulübü sponsorlarına verilecek iki sticker tasarımı.

| Dosya | Ölçü | Not |
|---|---|---|
| `sponsor-sticker-yatay.*` | 150 × 80 mm | Köşeler yuvarlatılmış (r = 6,4 mm), cam/vitrin için |
| `sponsor-sticker-yuvarlak.*` | Ø 90 mm | 2,5 mm beyaz kesim payı dahil, laptop/kask/kasa için |

- **Matbaaya** `.pdf` (vektörel, gerçek ölçü) ya da `.svg` ver. Yazılar
  eğriye çevrilmiştir, yazı tipi gerekmez.
- **Kesim çizgisi** tasarımın dış kenarıdır.
- `.png` dosyaları 300 dpi ve şeffaf arka planlıdır. Önizleme ve sosyal medya için.
- Renkler RGB. Baskıda CMYK'ya dönünce parlak teal biraz matlaşabilir.
  Parlak (gloss) laminasyonlu vinil önerilir.

## Metni değiştirmek

`uret.py` içindeki `METIN` sözlüğünü düzenle (sezon, rozet yazısı vb.), sonra:

```
pip install fonttools brotli
python3 kulup/sticker/uret.py
node kulup/sticker/render.mjs   # PNG ve PDF (playwright gerekir)
```

Yazı tipi: Barlow Condensed (SIL OFL, `fonts/OFL.txt`).
