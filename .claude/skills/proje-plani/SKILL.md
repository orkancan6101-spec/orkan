---
name: proje-plani
description: Haftalara yayılan büyük bir hedefi (sınav, dönem projesi, takım tasarım raporu, yarışma teslimi, beceri öğrenme, başvuru) son tarihten geriye doğru planlar. Kilometre taşlarını, alt görevleri, tamponu, sınavlar için aralıklı tekrar takvimini ve WOOP engel planını çıkarır. "Sınavım var", "projeyi planla", "X'i öğrenmek istiyorum", "rapor teslimine 3 hafta var" denildiğinde kullan.
argument-hint: "[hedef ve son tarih]"
---

# /proje-plani: Büyük hedefi geriye doğru planla

## 1. Hedefi netleştir (en fazla 4 soru)
`../gorev/soru-bankasi.md` dosyasından "Sınav", "Solar Team işi" ya da
"Öğrenme hedefi" grubunu kullan. Şunları mutlaka öğren:
- Kesin son tarih ve teslim biçimi.
- "Bitti"nin ölçülebilir tanımı.
- Haftada gerçekçi olarak ayrılabilecek süre.
- En olası iç engel (WOOP: "Seni en çok ne durdurabilir?").

## 2. Geriye doğru plan
Planı son tarihten bugüne doğru kur:
1. **Tampon.** Son tarihten önce, toplam sürenin %15–20'si kadar boş bir
   tampon bırak. Kısa projelerde en az 1 gün olsun. Tampondan önceki gün
   **güvenli bitiş** tarihidir.
2. **Kilometre taşları.** 3–6 adet olsun. Her biri ölçülebilir bir çıktı
   olmalı. Örnek bir FEA işi: "Gereksinimler ve yükler belgelendi" →
   "CAD sadeleştirildi" → "Mesh yakınsaması gösterildi" → "Sonuçlar el
   hesabıyla doğrulandı" → "Rapor taslağı".
3. **Alt görevler.** Her kilometre taşının altında 25–90 dakikalık adımlar.
   Her birine `tahmin_dk`, `enerji` ve gerekirse `bagimli` alanı ver.
4. **Fizibilite.** Görevleri panoya yazdıktan sonra `kapasite` komutunu
   çalıştır. Yetişmiyorsa kapsamı ya da tarihleri kullanıcıyla birlikte
   yeniden düzenle.

## 3. Sınavsa: aralıklı tekrar
- Konuları listele ve her biri için kullanıcıdan hakimiyet puanı (1–5) al.
  Zayıf konulara daha çok oturum ver.
- Her konu için ilk çalışma + 2–3 tekrar planla. Tekrar aralıkları sınava
  kalan sürenin yaklaşık %20–40'ı olsun. Örnek: sınava 7 gün varsa 1. gün,
  3. gün, 6. gün. Sınava 1 ay varsa 1., 7., 18., 26. gün.
- Her oturum **soru çözerek** ya da kendini test ederek başlar (`niyet`
  alanına yaz). Yeniden okumak ve altını çizmek oturumun ana işi olamaz.
- Son gece yeni konu planlama. Son gün hafif tekrar ve uyku.
- Gerekçeler `planlayici/yontemler.md` 9. maddede.

## 4. Öğrenme hedefiyse
`solar-team/mekanik-muhendis-rehberi.md` içindeki ilgili sıralamaya uy.
Örnek, ANSYS için: statik → mesh yakınsaması → sınır koşulları → temas →
modal → burkulma. Her kilometre taşı bir "kanıt çıktısı" üretsin: grafik,
rapor ya da parça.

## 5. Kaydet
- Üst görevi (`tur: "gorev"`, proje başlığı, `son_tarih` = gerçek son tarih,
  `analiz` = hedef ve "bitti" tanımı) ve alt görevleri (`ust_id`) panoya yaz.
  Gerekirse kilometre taşlarını ara düzey görevler olarak kaydet.
- WOOP planını üst görevin `niyet` alanına yaz: "Eğer <engel>, o zaman
  <eylem>."
- `siralama`'yı çalıştır ve panoya yaz.

## 6. Takvim
İlk haftanın odak bloklarını takvime eklemeyi öner (`/takvim`). Kalan haftalar
her pazar `/haftalik-plan` ile yerleştirilir.

## Çıktı
Kilometre taşı tablosu (tarih · çıktı · süre), güvenli bitiş tarihi, toplam
süre (katsayılı), fizibilite durumu ve bu haftanın ilk 3 adımı.
