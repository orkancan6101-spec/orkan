# Sponsorluk ek logosu

ESOGÜ Otomotiv Kulübü sponsorları için sade, düz renkli ek logo. Mevcut
kulüp logosunun düz hâlini ve yalnızca orijinal 4 rengi kullanır
(koyu `#0E1B1F`, teal `#00586A`, gümüş `#B3B3B3`, açık `#EEF2F3`).

| Dosya | Ölçü | Not |
|---|---|---|
| `ek-logo-a-yatay.*` | 140 × 80 mm | Orijinal düzen, altta teal bantta RESMİ SPONSOR |
| `ek-logo-b-muhur.*` | Ø 80 mm | Yuvarlak mühür |
| `ek-logo-c-kalkan.*` | 70 × 86 mm | Logodaki OK kalkanı biçiminde amblem |
| `onizleme.png` | | Üçü bir arada karşılaştırma |

- **Matbaaya** `.pdf` (vektörel, gerçek ölçü) ya da `.svg` ver. Yazılar
  eğriye çevrilmiştir, yazı tipi gerekmez. Kesim çizgisi dış kenardır.
- `.png` dosyaları 300 dpi ve şeffaf arka planlıdır.
- Düz renk olduğu için CMYK'ya çevirmek sorunsuzdur. İstenirse matbaa
  4 rengi Pantone'a da eşleyebilir.

## Metni değiştirmek

`uret.py` içindeki `METIN` sözlüğünü düzenle, sonra:

```
pip install fonttools brotli
python3 kulup/sticker/uret.py
node kulup/sticker/render.mjs   # PNG ve PDF (playwright gerekir)
```

Yazı tipi: Barlow Condensed (SIL OFL, `fonts/OFL.txt`).
