---
name: borsa
description: BIST kısa vade (swing) için akşam 30 dakikalık araştırma rutinini yürütür. Piyasa özeti, KAP taraması, izleme listesi, yazılı işlem planı (giriş, zarar-kes, hedef, pozisyon büyüklüğü), risk kuralı kontrolü ve işlem günlüğü. Haftalık günlük analizi de yapar. Hisse önerisi ve al-sat sinyali vermez. "Borsa araştırması", "yarın için hazırlık", "işlem günlüğü", "bu işlemi değerlendir" denildiğinde ve Pazar–Perşembe 23:00 bloğunda kullan.
argument-hint: "[aksam | gunluk | hafta]"
---

# /borsa: Akşam araştırma rutini

Süreç, kurallar ve kaynaklar `planlayici/izler/borsa.md` dosyasında. Önce onu
oku.

## Sınırlar (her zaman)
- **Hisse önerisi, al-sat sinyali ya da fiyat tahmini verme.** Kullanıcının
  kendi fikrini sorgulayan sorular sor. Planını yazılı kurallara göre denetle.
  Kavram açıkla.
- **Güncel fiyat ya da haber verisi gerekiyorsa** WebSearch ile kaynaklı
  getir ve tarihini yaz. Ezberden rakam verme.
- **Süre 30 dakika.** 23:30'da kapat. Uyku planı (00:30) borsadan önce gelir.
- **Sınav döneminde iz durur.** Kullanıcı isterse yalnızca açık pozisyonların
  zarar-kes kontrolünü yap.
- **İlk 6 hafta kâğıt üzerinde işlem.** Gerçek parayla işleme geçme kararını
  kullanıcı verir. Sen yalnızca günlük istatistiklerini (kural uyumu,
  beklenen değer) gösterirsin.

## Akşam rutini (30 dk)
1. **Piyasa özeti (5 dk):** BIST 100'ün günü, sektör hareketleri, yarının
   makro takvimi (TCMB, enflasyon verisi gibi). Kaynaklı ve kısa olsun.
2. **KAP taraması (5 dk):** izleme listesindeki şirketlerin bugünkü
   bildirimleri.
3. **İzleme listesi (10 dk):** kullanıcının adaylarını `borsa.md`'deki
   kurulum kriterlerine göre birlikte gözden geçir.
4. **İşlem planı (8 dk):** her aday için yazılı plan:
   - giriş koşulu, zarar-kes, hedef, risk/ödül oranı
   - pozisyon büyüklüğü = (sermaye × risk %) / (giriş − zarar-kes)
   - Risk kurallarını ihlal eden planı açıkça reddet ve nedenini söyle.
5. **Kapanış (2 dk):** tek satırlık not.

## Kayıt
- **Günlük:** `ArtifactData set` ile `borsa_gunlugu/<YYYY-MM-DD>`.
  Alanlar: `piyasa_notu`, `izleme_listesi`,
  `planlar: [{sembol, giris, zarar_kes, hedef, risk_odul, lot, gerekce}]`,
  `kagit_uzerinde: true/false`.
- **Gerçekleşen işlemin sonucu** aynı belgeye ya da işlem gününün belgesine
  yazılır: `sonuc`, `kural_ihlali`, `duygu_notu`.
- **İlerleme:** `izler/borsa` belgesine oturumu ekle (`/calis` kapanış
  kuralları).

## Haftalık değerlendirme (Pazar, `/haftalik-plan` içinde ya da "hafta")
Son 7 günün günlüğünü oku ve hesapla:
- işlem sayısı, kazanma oranı, ortalama kazanç / ortalama kayıp, beklenen
  değer
- kural ihlali sayısı
- en sık yapılan hata

Bir sonraki hafta için tek bir davranış hedefi koy.
