# Borsa (BIST, kısa vade)

> **İz önceliği:** 4/4 (en son) · **Blok:** Pazar–Perşembe 23:00–23:30, sert
> bitiş · **Haftalık:** 150 dk · **Sınav haftasında:** durur
> **Skill'ler:** akşam rutini için `/borsa`, öğrenme oturumu için `/calis borsa`
> **Son güncelleme:** 12.10.2026. Linkler bu tarihte web aramasıyla görüldü.
> borsaistanbul.com ve kap.org.tr sayfaları ağ kısıtı yüzünden doğrudan
> açılamadı. Bilgiler arama sonuçlarındaki özetlerden alındı. Saat, oran ve
> tarihleri gerçek paraya geçmeden önce resmi sayfadan bir kez daha doğrula.

---

## Çerçeve ve uyarı

- **Bu bir eğitim ve süreç dosyası.** Hisse önerisi, al-sat sinyali ya da
  hedef fiyat içermez. Claude da bunları vermez. Dosyadaki fiyatlar hesap
  örneğidir, gerçek bir hisseyi göstermez.
- **Amaç şimdilik para kazanmak değil.** Önce kurallı bir süreç kurmak, sonra
  bunu kâğıt üzerinde kanıtlamak gerekiyor. Kâr belki sonra gelir, belki hiç
  gelmez. İkisi de kabul edilebilir sonuçlar.
- **Veriler ne diyor?** Kısa vadeli işlem yapan bireysel yatırımcıların büyük
  çoğunluğu ya piyasanın gerisinde kalıyor ya da zarar ediyor. Nedenleri çoğu
  zaman işlem sıklığı, maliyet ve aşırı güven:
  - **ABD, 66.465 hane, 1991–1996:** En sık işlem yapan grup yılda %11,4
    kazanmış, piyasa ise %17,9 getirmiş. Yazarlara göre farkı hisse seçimi
    değil, işlem sıklığı ve maliyet yaratmış (Barber & Odean, 2000).
  - **Tayvan, gün içi işlemciler:** Masraflar düşüldükten sonra öngörülebilir
    biçimde kâr eden işlemciler tüm gün içi işlemcilerin %3'ünden az
    (Barber, Lee, Liu, Odean).
  - **Brezilya, endeks vadelisinde gün içi işlem, 2013–2015:** 300 günden uzun
    devam edenlerin %97'si zarar etmiş. Öğrenmeyle düzeldiğine dair kanıt da
    bulunmamış (Chague, De-Losso, Giovannetti).
  - **BIST, 2011–2012, yaklaşık 20.000 yatırımcı:** Yatırımcıların yaklaşık
    %70'i piyasayı yenememiş. İşlem hacmi yüksek olanlar daha kötü sonuç
    almış (İstanbul Bilgi Üniversitesi açık arşivindeki çalışma; yalnızca
    özetini görebildim).
  - **Bu sonuçlar sana ne kadar uyuyor?** Çalışmaların çoğu gün içi işleme
    ait. Senin yapacağın swing işlemi aynı şey değil. Ama zarar ettiren
    etkenler ortak: sık işlem, maliyet ve aşırı güven. Bu dosyanın yanıtı
    şunlar: az işlem, yazılı plan, küçük risk ve dürüst tutulan bir günlük.
- **Kaybetmeyi göze alamayacağın parayla işlem yapılmaz.** Harçlık, kira,
  burs, KYK ve acil durum fonu bu kapsama girer.
- **Kaldıraç kullanılmaz.** Kredili işlem, açığa satış, VİOP, varant, forex
  ve kripto bu izin kapsamı dışında.

---

## Hedef ve ölçüt

**8 haftalık hedef:** Hafta 1 altyapı, Hafta 2–7 kâğıt üzerinde işlem (6
hafta), Hafta 8 karar kapısı. Sınav haftaları sayılmaz; o haftalarda sayaç
durur.

| Ölçüt | Hedef | Nasıl ölçülür |
|---|---|---|
| Kâğıt üzerinde işlem süresi | 6 hafta (sınav haftaları hariç) | `izler/borsa.ilerleme.kagit_hafta` |
| Günlük tutma oranı | %100 | Kayıtlı işlem / açılan işlem ve kayıtlı oturum / yapılan oturum |
| Kural ihlali | 0 | Pazar değerlendirmesinde sayılır. İhlal olan hafta tekrar edilir. |
| Yazılı plan oranı | %100 | Planı olmayan her işlem bir ihlaldir. |
| 23:30 sınırı | 0 aşım | Oturumun bitiş saati |
| Kâğıt üzerinde işlem sayısı | En az 15 (ideali 20–30) | Günlük |
| Ortalama kayıp | ≤ 1,1R | Zarar-kes kuralına uyulduğunu gösterir |
| Faz çıktıları | Hepsi tamam | Her fazın "kanıt çıktısı" |

- **Kâr bir geçiş ölçütü değil.** 6 haftada yapılan 15–30 işlem, beceriyi
  şanstan ayırmaya yetmez. Beklenen değer yine de izlenir. Masraflar düşülünce
  negatif çıkıyorsa gerçek paraya geçilmez.
- **Gerçek paraya geçiş kapısı (Hafta 8):** Yukarıdaki ölçütlerin hepsi
  tutmalı, masraflı beklenen değer ≥ 0 olmalı ve kararı kullanıcı yazılı
  olarak vermeli. Claude yalnızca istatistikleri gösterir. Kapı geçilemezse
  kâğıt üzerinde 4 hafta daha devam edilir. İzi kapatmak da geçerli bir
  karardır.
- **Pano belgesi `izler/borsa`:** `oncelik: 4`, `alan: kisisel`,
  `haftalik_hedef_dk: 150`, `varsayilan_oturum_dk: 30`, `faz`, `sonraki`,
  `ilerleme: {kagit_hafta, islem_sayisi, ihlal, gunluk_orani, beklenen_R}`.

---

## Öğrenme fazları

**Haftalık ritim (Faz 1–3):** 30 dakikanın bir kısmı ders, bir kısmı rutin.

| Akşam | 23:00–23:15 | 23:15–23:30 |
|---|---|---|
| Pazar | Haftalık değerlendirme | Kısa rutin |
| Pazartesi | Faz dersi | Kısa rutin |
| Salı | Tam rutin | (devam) |
| Çarşamba | Faz dersi | Kısa rutin |
| Perşembe | Tam rutin | (devam) |

Kısa rutin üç adımdan oluşur: KAP taraması, açık pozisyon kontrolü ve en
fazla 1 yeni plan.

### Faz 0 · Altyapı ve kurallar (Hafta 1, işlem yok)
- **Süre:** 5 oturum × 30 dk, tamamı öğrenme ve kurulum.
- **Konular:**
  1. **Piyasa işleyişi.** Aşağıdaki bilgi kartını oku ve kendi cümlelerinle
     yaz.
  2. **Emir türleri.** Piyasa, limit ve koşullu (stop) emir. Kullanacağın
     aracı kurum uygulamasının hangilerini desteklediğini ve seans dışında
     emir alıp almadığını kontrol et.
  3. **Araçlar.** TradingView'da ücretsiz hesap aç ve Paper Trading'i bağla.
     KAP Mobil'de takip listesi kur. İşlem günlüğü panoda tutulacak.
  4. **Risk kuralları.** Kuralları oku, kendi cümlelerinle yeniden yaz ve
     kâğıt sermayeyi belirle. Bu tutar, ileride gerçekte kullanacağın tutarla
     aynı ölçekte olmalı (örneğin 20.000 TL).
  5. **Kurulum.** Aşağıdaki kurulumlardan birini seç ve tanımını yaz.
- **Kanıt çıktısı:**
  - "BIST'te bir gün" başlıklı 10 satırlık not: saatler, T+2 ve VBTS.
  - Kendi cümlelerinle yazılmış risk kuralları.
  - TradingView'da Paper Trading'in bağlı olması. İzleme listesinde BIST 100
    ve 3 sektör endeksi bulunmalı.
  - KAP Mobil'de en fazla 10 şirketin takipte olması.
  - Seçtiğin kurulumun tek paragraflık tanımı.
- **Kaynaklar:** BIST işlem saatleri, Equity Market Functioning, 2026 tatil
  tablosu, KAP Site Kılavuzu, TradingView Paper Trading, SPK Finansal
  Okuryazarlık Platformu'nun "borsa" kategorisi (linkler kütüphanede).

**BIST bilgi kartı (pay piyasası)**

| Konu | Bilgi | Kaynak |
|---|---|---|
| Açılış seansı | 09:40'ta emir toplama başlar (2019 çizelgesine göre 09:40–09:55). Sonra açılış fiyatı belirlenir. Emir toplama, belirtilen saatten sonraki 30 saniye içinde rastgele bir anda kesilir. | BIST işlem saatleri, 2019 çizelgesi |
| Sürekli işlem | 10:00–18:00. Öğle arası 2019'da kaldırıldı. | BIST işlem saatleri, 2019 çizelgesi |
| Kapanış seansı | 18:01–18:05 emir toplama, 18:05–18:07 fiyat belirleme, 18:08–18:10 kapanış fiyatından işlem | BIST Market Functioning |
| Devre kesici | Son 30 dakikada (17:30'dan sonra) tetiklenirse işlem durur ve 18:00'deki kapanış seansıyla devam eder. | BIST Market Functioning |
| Yarım gün ve tatil | Arife günleri yarım gündür. 2026 tablosunu kontrol et. | 2026 tatil tablosu |
| Takas | T+2: alımın ödemesi ve satışın parası işlem gününden sonraki 2. iş gününde kesinleşir. Tatillerde süre uzar. BIST, T+1 geçiş çalışmalarını 31.12.2026'ya kadar tamamlamayı hedefliyor; geçiş tarihini duyurulardan izle. | BIST duyurusu, Foreks |
| Fiyat marjı | Günlük fiyat değişim sınırı (taban/tavan) vardır. Mart 2020'de tüm gruplar için %10'a indirildiği duyurulmuştu. Güncel oranı Pay Piyasası Prosedürü'nden doğrula. | BirGün (2020), Prosedür |
| VBTS | Aşırı oynaklıkta otomatik tedbirler devreye girer. Kademeler: açığa satış ve kredili işlem yasağı, sonra brüt takas, sonra tek fiyat. Sonradan emir paketi kısıtı ve internetten emir yasağı da eklendi. Tedbirler seans sonrası KAP'ta duyurulur ve süresi duyuruda yazar. | Fintables, QNB Invest |

### Faz 1 · Kavramlar ve risk matematiği (Hafta 2–3, kâğıt üzerinde işlem başlar)
- **Konular:**
  - **Piyasa kavramları:** likidite, hacim, spread (alış ile satış arasındaki
    fark), volatilite (ATR).
  - **Endeksler:** XU100, XU030 ve sektör endeksleri (örneğin XBANK, XUSIN,
    XUTEK). Sektör rotasyonu: paranın sektörler arasında dönmesi.
  - **Risk matematiği:** pozisyon büyüklüğü, R-katı (sonucu riske edilen
    tutar cinsinden ölçmek) ve beklenen değer.
  - **Kayıp serisi:** %20 kayıptan sonra başa baş için %25 kazanç, %50
    kayıptan sonra %100 kazanç gerekir.
  - **Maliyetler ve gap riski:** Maliyet = komisyon + spread + kayma. Gap
    riski: fiyat bir sonraki gün zarar-kes seviyesinin altında açılabilir.
- **Kanıt çıktısı:**
  - Kendi cümlelerinle yazılmış 12 kavramlık bir sözlük.
  - Pozisyon büyüklüğü hesap tablosu ve 10 örnek hesap.
  - "%1 riskle art arda 10 zarar ederse sermayem ne olur?" hesabı (yanıt:
    yaklaşık −%9,6).
- **Kaynaklar:** Zerodha Varsity risk modülü, SEC'in "Day Trading: Your
  Dollars at Risk" yayını, Cevaplarla Borsa ve Sermaye Piyasası.

### Faz 2 · Teknik analizin temelleri (Hafta 4–5)
- **Konular:**
  - Trend: yükselen dipler ve tepeler.
  - Destek ve direnç.
  - Hareketli ortalamalar (20, 50 ve 200 günlük). Bunları yalnızca yön
    filtresi olarak kullan.
  - Hacim teyidi.
  - ATR ile zarar-kes mesafesini belirleme.
  - Zaman dilimi: günlük grafik ana grafiktir, haftalık grafik bağlamı
    gösterir.
- **Teknik analizi abartma.** Göstergeler geçmiş fiyattan türetilir;
  geleceği bilmez. Amaç kehanet değil, olasılık düşünmek ve kurala uymak. Tek
  kurulum ve en fazla 2–3 araç yeter.
- **Kanıt çıktısı:**
  - Kurulumunun geçmiş grafiklerdeki 20 örneği, ekran görüntüleriyle. İşe
    yaramayan örnekler de dahil edilmeli.
  - Kurulum tanımının ikinci sürümü.
- **Kaynaklar:** Murphy (başvuru kitabı), Elder, TradingView.

### Faz 3 · Temel analizin özü, makro takvim ve vergi (Hafta 6–7)
- **Bilanço dönemleri:**
  - Şirketler 3, 6, 9 ve 12 aylık finansal raporlarını KAP'ta "Finansal
    Rapor" türünde yayımlar.
  - Yasal süreler SPK'nın II-14.1 sayılı tebliğinde yer alır. Süreler
    konsolide/konsolide olmayan ve bağımsız denetimli/denetimsiz raporlar
    için farklıdır.
  - 9 aylık raporlar pratikte Ekim sonu ile Kasım ortası arasında yoğunlaşır.
    Örneğin 2025'te bazı şirketler 31 Ekim'de, bazıları 10 Kasım'da açıkladı.
  - **Okuma:** Satışlar, net kâr ve borçluluk satırlarına bak. Geçen yılın
    aynı dönemiyle karşılaştır.
- **Özel durum açıklamaları:** sermaye artırımı, kâr payı, yeni iş ilişkisi,
  pay geri alımı, VBTS tedbiri.
- **Makro takvim:**
  - **TCMB PPK 2026:** 22 Ocak, 12 Mart, 22 Nisan, 11 Haziran, 23 Temmuz,
    10 Eylül, **22 Ekim (Perşembe)** ve **10 Aralık (Perşembe)**. Kararlar
    14:00'te açıklanır. Enflasyon Raporu **12 Kasım (Perşembe)**.
  - **TÜİK TÜFE:** Ayın ilk günlerinde açıklanır (2026 takviminde örneğin
    5 Ocak ve 5 Haziran). 2026'dan itibaren temel yıl 2025=100.
- **Vergi (bireysel yatırımcı, 2026):**
  - **Hisse alım-satım kazancı:** BIST'te işlem gören hisselerde (menkul
    kıymet yatırım ortaklıkları hariç) stopaj %0'dır ve nihaidir, beyan
    gerekmez. Bu düzenleme GVK geçici 67. maddeye dayanır; madde 31.12.2030'a
    kadar uzatıldı.
  - **Temettü (kâr payı):** 22.12.2024'ten beri %15 stopaj uygulanıyor (9286
    sayılı Cumhurbaşkanı Kararı). Beyan gerekip gerekmediği diğer gelirlerine
    bağlı.
  - **Fonlarda kurallar farklı.** Örneğin 27.03.2026'dan sonra alınan, TEFAS
    dışındaki hisse yoğun serbest fonlarda stopaj %17,5 oldu.
  - Kâğıt üzerinde işlemde vergi yoktur. Oranlar değişebileceği için gerçek
    paraya geçmeden önce aracı kurumundan ya da GİB'den güncel durumu kontrol
    et.
- **Kanıt çıktısı:**
  - İzleme listendeki 5 şirket için 5 satırlık şirket kartları: ne iş
    yaptığı, son çeyrekteki satış ve kâr değişimi, sonraki bilanço penceresi
    ve KAP'taki son önemli bildirim.
  - Önümüzdeki 1 ayın olay takvimi.
- **Kaynaklar:** KAP Bildirim Sorgu, PPK takvimi, TÜİK takvimi, vergi
  kaynakları.

### Faz 4 · Karar kapısı (Hafta 8)
- **Konular:**
  - 6 haftanın istatistiklerini çıkar. Haftalık değerlendirmedeki
    formüllerin hepsi kullanılır.
  - WOOP yap (`yontemler.md` §12). Dilek, sonuç, engel ve plan adımlarıyla
    ilerle; tipik engel "kayıptan sonra kuralı esnetmek"tir.
- **Kanıt çıktısı:** 1 sayfalık karar: devam, kâğıt üzerinde kal ya da izi
  kapat.

### Faz 5 · Küçük tutarla gerçek para (isteğe bağlı, Hafta 9+)
- Yalnızca Hafta 8'deki kapı geçildiyse ve kararı kullanıcı verdiyse.
- **Tutar:** Kaybedilmesi sorun olmayacak küçük bir tutar.
- **Risk:** İlk 20 işlemde işlem başına %0,5, sonrasında %1. Kuralların hepsi
  aynen geçerli.
- **Aracı kurum seçimi:** SPK yetkisi, komisyon oranı ve uygulamanın koşullu
  emir desteği.
- **Geri dönüş kuralı:** Aylık −%6'ya ulaşılırsa 2 hafta kâğıt üzerinde
  işleme dönülür.

---

## Akşam 30 dk rutini

Rutin her akşam 23:00'te başlar ve 23:30'da kesin olarak biter. Yarım kalan
bir plan, ertesi gün işlem yapılmayacağı anlamına gelir.

| Saat | Adım | Ne yapılır | Kayıt |
|---|---|---|---|
| 23:00–23:05 | **Piyasa özeti** | BIST 100'ün günlük % değişimi, en güçlü ve en zayıf 2 sektör endeksi, USD/TRY. Yarının olay takvimine bak: PPK, TÜFE, bilanço. Olay günüyse rutine "olay günü: yeni giriş yok" yaz. | `piyasa_notu` (3 satır) |
| 23:05–23:10 | **KAP taraması** | KAP Mobil'deki takip listesinin bugünkü bildirimlerine bak: özel durum açıklamaları, finansal raporlar, VBTS duyuruları. Açık pozisyonla ilgili önemli bir bildirim varsa plan yalnızca riski azaltma yönünde değişebilir. | Önemli bildirimler `piyasa_notu` alanına |
| 23:10–23:20 | **İzleme listesi** | En fazla 5 adayı aşağıdaki kontrol listesiyle gözden geçir. Açık pozisyonların zarar-kes ve hedef seviyelerini kontrol et; zarar-kes yalnızca kâr yönüne taşınabilir. | `izleme_listesi` |
| 23:20–23:28 | **İşlem planı** | Yeni plan sayısı en fazla 2. Şablon aşağıda. Kurallara uymayan plan reddedilir. | `planlar[]` |
| 23:28–23:30 | **Kapanış** | Tek satırlık not yaz, Claude'a "kaydet" de ve ekranı kapat. | `duygu_notu` |

### İzleme listesi kriterleri
**Evren filtresi.** Bir pay yalnızca şu koşulların hepsini sağlıyorsa listeye
girebilir:
- BIST 100 endeksinde olmalı. Bu kural likidite içindir; bir öneri değildir.
- Hakkında aktif bir VBTS tedbiri bulunmamalı (KAP'ta kontrol et).
- Önümüzdeki 5 iş günü içinde bilinen bir kâr payı hak kullanım tarihi,
  sermaye artırımı ya da genel kurul olmamalı.
- 20 günlük ortalama işlem hacmi, Faz 1'de belirlediğin eşiğin üzerinde
  olmalı.

**Kurulum.** Paper trading dönemi boyunca yalnızca birini seç. Bunlar ders
kitabı kalıplarıdır, sinyal değildir.
- **A · Trend içinde geri çekilme:** Günlük grafikte yükselen dipler ve
  tepeler vardır. Fiyat 20 günlük ortalamaya ya da önceki dirence (artık
  destek) geri çekilir. Zarar-kes, geri çekilmenin dibinin ya da 1,5 ATR'nin
  altına konur.
- **B · Hacimli direnç kırılımı:** Fiyat birkaç haftalık bir yatay bandın
  üstünde kapanır ve hacim ortalamanın belirgin üstündedir. Zarar-kes bandın
  içine konur.

**Kontrol listesi.** Her aday için yazılı olarak cevapla:
1. **Yön:** Fiyat 50 günlük ortalamanın üstünde mi? Endeks ve sektör endeksi
   aynı yönde mi?
2. **Seviye:** Giriş en yakın destek ve dirence göre nerede? Zarar-kes anlamlı
   bir seviyenin ötesinde mi?
3. **Hacim:** Hareketi hacim teyit ediyor mu?
4. **Risk/ödül:** En az 1:2 mi?
5. **Geçersizlik:** "Bu fikir şu olursa yanlıştır: …" cümlesini tamamla.
6. **Olay riski:** Bilanço penceresinde mi? Yarın PPK ya da TÜFE günü mü?
7. **Fikrin kaynağı:** Kendi taraman mı, yoksa sosyal medya mı? Sosyal
   medyadan gelen fikir listeye alınmaz.

### İşlem planı şablonu
```
Sembol: ____   Kurulum: A / B   Kâğıt üzerinde: evet / hayır
Giriş koşulu: ____ (limit fiyat ya da "şu seviyenin üstünde kapanış")
Zarar-kes: ____   Hedef: ____   Risk/ödül: ____ (en az 2)
Adet = (Sermaye × risk %) / (Giriş − Zarar-kes) = ____
Risk: ____ TL (sermayenin %___)   Pozisyon değeri: ____ TL (sermayenin %___, en fazla %25)
Geçersizlik: ____
Emir: yarın 09:40'tan sonra limit emir + koşullu zarar-kes (Paper'da giriş + zarar-kes + hedef birlikte)
Planın geçerliliği: 3 işlem günü. Bu sürede tetiklenmezse plan silinir.
```

**Hesap örneği (hayali fiyatlar):**
- Kâğıt sermaye 20.000 TL, işlem başına risk %1 → 200 TL.
- Giriş 50,00, zarar-kes 47,50 → pay başına risk 2,50 TL.
- Adet: 200 / 2,50 = 80 → pozisyon değeri 4.000 TL. Bu, sermayenin %20'si;
  %25 sınırının altında, uygun.
- Hedef 55,00 → risk/ödül 5,00 / 2,50 = 2. Uygun.
- **Gap riski:** Fiyat ertesi gün 46,00'dan açılırsa kayıp 200 TL değil
  320 TL olur, yani 1,6R. Risk tavanı bu yüzden düşük tutulur.

---

## Risk kuralları

Kurallar uygulama niyeti biçiminde yazılmıştır ("eğer … ise …";
`yontemler.md` §3). Kâğıt üzerinde işlemde de aynen geçerlidir. Bir kuralın
çiğnenmesi, sonuç ne olursa olsun bir ihlaldir.

1. **İşlem başına risk sermayenin en fazla %1'i.** Gerçek paranın ilk 20
   işleminde bu sınır %0,5'tir.
2. **Pozisyon büyüklüğü formülle hesaplanır:** Adet = (Sermaye × risk %) /
   (Giriş − Zarar-kes). Tek bir pozisyonun değeri sermayenin %25'ini aşamaz.
3. **Toplam açık risk en fazla %3.** Aynı anda en fazla 3 pozisyon açık
   olabilir. Aynı sektörden en fazla 2 pozisyon olabilir.
4. **Zarar-kes, işleme girmeden önce yazılır ve emir olarak sisteme girilir.**
   Zarar-kes yalnızca kâr yönüne taşınabilir; asla genişletilmez.
5. **Fiyat zarar-kes seviyesine gelirse pozisyon sorgusuz kapanır.** "Biraz
   daha bekleyeyim" demek yok.
6. **Risk/ödül oranı 1:2'nin altındaysa plan reddedilir.**
7. **Yazılı planı olmayan işlem yapılmaz.** Plan gün içinde değiştirilmez.
   Tek istisna riski azaltmaktır, yani erken çıkış.
8. **Zarardaki pozisyona ekleme yapılmaz.** Ortalama düşürmek yasak.
9. **Kaldıraç kullanılmaz.** Kredili işlem, açığa satış, VİOP, varant,
   opsiyon, forex ve kripto yasak.
10. **Evren filtresi:** Yalnızca BIST 100 içindeki, VBTS tedbiri olmayan
    paylarla işlem yapılır.
11. **Olay günleri:** PPK ve TÜFE günlerinde yeni giriş yapılmaz. Bilançosunu
    henüz açıklamamış bir paya bilanço penceresinde girilecekse risk yarıya
    (%0,5) iner.
12. **Haftalık zarar −%3'e ulaşırsa** o hafta yeni işlem açılmaz. **Aylık
    zarar −%6'ya ulaşırsa** 2 hafta kâğıt üzerinde işleme dönülür.
13. **Art arda 3 zarar gelirse** 2 işlem günü ara verilir. Bu süre "intikam
    işlemi" yapmayı önlemek içindir.
14. **Sosyal medyadan gelen tüyo, Telegram/WhatsApp grubu ya da "garantili
    kazanç" vaadiyle işlem yapılmaz.** Bilgi kaynağı KAP ve resmi kurumlardır.
15. **23:30'dan sonra plan yazılmaz ve grafiğe bakılmaz.** Gece gelen bir
    haber, ertesi akşamın rutininde değerlendirilir.
16. **Sınav haftasında yeni pozisyon açılmaz.** Sınav haftasından önceki
    Perşembe açık pozisyonlar ya kapatılır ya da koşullu zarar-kes emriyle
    bırakılır.
17. **Kâğıt üzerinde işlem dönemi bitmeden gerçek parayla işlem yapılmaz.**
18. **Kaybetmeyi göze alamayacağın para kullanılmaz.**

---

## İşlem günlüğü şablonu

Günlük, pano belgesi olarak tutulur: `borsa_gunlugu/<YYYY-MM-DD>`. Bu belge
`/borsa` skill'inin kullandığı alanları genişletir.

| Alan | Açıklama |
|---|---|
| `tarih` | YYYY-MM-DD (rutinin yapıldığı akşam) |
| `kagit_uzerinde` | true / false |
| `piyasa_notu` | 3 satırlık özet: BIST 100, sektörler, yarının olayları, önemli KAP bildirimleri |
| `izleme_listesi` | Aday semboller ve kontrol listesindeki cevaplar (kısa) |
| `planlar[]` | `{sembol, kurulum, giris, zarar_kes, hedef, risk_odul, lot, risk_tl, risk_yuzde, pozisyon_yuzde, gecersizlik, gerekce, gecerlilik}` |
| `islemler[]` | Gerçekleşen işlemler: `{sembol, giris_tarih, giris_fiyat, cikis_tarih, cikis_fiyat, cikis_nedeni (hedef / zarar-kes / zaman / geçersizlik / kural dışı), sonuc_tl, sonuc_R, masraf_tl}` |
| `kural_ihlali` | Yoksa `[]`. Varsa `[{kural_no, ne_oldu}]` |
| `duygu_notu` | Girişten önce: güven 1–5, kaygı 1–5, FOMO var mı? Çıkıştan sonra: tek cümle |
| `ekran_kontrol` | Gün içinde fiyata kaç kez bakıldığı (hedef: 0–2) |
| `oturum` | `{bas, bit, dk}`. Bitiş 23:30'u geçmemeli. |
| `ders` | Bugün öğrenilen tek şey, tek cümle |
| `ekran_goruntusu` | Giriş ve çıkış anlarının grafik görüntülerinin linki (isteğe bağlı) |

---

## Haftalık değerlendirme

**Ne zaman:** Pazar 23:00–23:15. Alternatif olarak gündüz `/haftalik-plan`
sırasında yapılabilir; o zaman Pazar akşamı tam rutine ayrılır.

1. **Günlüğü oku.** Son 7 günün `borsa_gunlugu` belgelerini ve kapanan
   işlemleri gözden geçir.
2. **İstatistikleri hesapla.** Hesabı Claude yapar, sen kontrol edersin:
   - İşlem sayısı ve kazanma oranı (K).
   - Ortalama kazanç (R) ve ortalama kayıp (R).
   - **Beklenen değer** = K × ortalama kazanç R − (1 − K) × ortalama kayıp R.
     Masraflar düşülerek hesaplanır.
   - En büyük düşüş (zirveden dibe %).
   - Toplam açık risk hiç %3'ü aştı mı?
3. **Kural ihlallerine bak.** Kaç ihlal oldu, hangi kurallar çiğnendi?
   İhlalli işlemlerin sonucu ayrıca yazılır. "İhlal edip kazandım" en tehlikeli
   satırdır.
4. **Süreç ölçütlerini kontrol et:**
   - Günlük tutma oranı.
   - 23:30'u aşan oturum sayısı.
   - Ortalama `ekran_kontrol` sayısı.
   - Kaçırılan oturum sayısı.
5. **Öğrendiklerini yaz:**
   - En sık yaptığın 1 hata.
   - En iyi uyguladığın 1 kural.
   - Kurulumla ilgili 1 gözlem.
6. **Gelecek haftaya tek bir davranış hedefi koy.** Örnek: "Zarar-kes emrini
   girişle aynı anda gireceğim."
7. **Panoyu güncelle.** `izler/borsa.ilerleme` alanlarını güncelle. İhlal
   varsa `kagit_hafta` artmaz.

---

## Kaynak kütüphanesi

Linklerin hepsi 12.10.2026'da web aramasında görüldü.

**Resmi piyasa bilgisi**

| Ad | Link | Tür | Dil | Neden | Ücret |
|---|---|---|---|---|---|
| Borsa İstanbul: Pay Piyasası İşlem Saatleri | [link](https://borsaistanbul.com/tr/sayfa/220/pay-piyasasi-islem-saatleri) | Resmi sayfa | TR | Güncel seans saatleri | Ücretsiz |
| Borsa İstanbul: Equity Market Trading Hours | [link](https://www.borsaistanbul.com/en/markets/equity-market/trading-hours) | Resmi sayfa | EN | Seans saatleri | Ücretsiz |
| Borsa İstanbul: Market Functioning | [link](https://www.borsaistanbul.com/en/markets/equity-market/market-functioning) | Resmi sayfa | EN | Kapanış seansı, devre kesici | Ücretsiz |
| Borsa İstanbul: Kapanış Seansı | [link](https://www.borsaistanbul.com/tr/sayfa/340/kapanis-seansi) | Resmi sayfa | TR | Kapanış seansının aşamaları | Ücretsiz |
| Pay Piyasası 2026 Tatil Tablosu | [link](https://www.borsaistanbul.com/files/pay-piyasasi-2026-yili-tatil-tablosu.pdf) | PDF | TR | Yarım günler, tatiller | Ücretsiz |
| Pay Piyasası Prosedürü | [link](https://www.borsaistanbul.com/files/pay-piyasasi-proseduru.pdf) | Mevzuat | TR | Fiyat marjı, fiyat adımı, emir kuralları | Ücretsiz |
| Pay Piyasası işlem saatleri çizelgesi (2019) | [link](https://www.borsaistanbul.com/files/pay-piyasasi-islem-yontemleri-ve-seans-saatleri-cizelgeleri-4-Kasim-2019-tarihi-itibariyle.pdf) | PDF | TR | Seans aşamaları (eski tarihli, karşılaştırma için) | Ücretsiz |
| BIST: T+2 → T+1 değerlendirme duyurusu | [link](https://borsaistanbul.com/duyuru/14796/borsa-istanbul-pay-piyasasi-t2-takas-suresinin-t1-olarak-kisaltilmasina-iliskin-degerlendirme-calismalarina-baslanmistir) | Duyuru | TR | Takas süresi | Ücretsiz |
| Foreks: T+1 için 31.12.2026 hedefi | [link](https://www.foreks.com/haber/detay/68b2d13eb209972f87e976d3/PICNEWS/tr/borsa-istanbul-t1-e-gecis-calismalarinin-31-aralik-2026-tarihi-itibariyla-tamamlanmasini-hedefliyor/) | Haber | TR | T+1 takvimi | Ücretsiz |
| BirGün: 2020 fiyat marjı kararı | [link](https://www.birgun.net/haber/borsa-istanbul-yeni-onlemleri-acikladi-421432) | Haber | TR | %10 marjın geçmişi | Ücretsiz |
| Fintables: VBTS nedir? | [link](https://fintables.com/arastirma/yazilar/yatirim-stratejileri/volatilite-bazli-tedbir-sistemi-nedir) | Makale | TR | Tedbir kademeleri | Ücretsiz |
| QNB Invest: VBTS nedir? | [link](https://www.qnbinvest.com.tr/investodak/qnbarastirma/volatilite-bazli-tedbir-sistemi-vbts-nedir) | Makale | TR | Tedbir sistemi, ikinci kaynak | Ücretsiz |

**KAP ve araçlar**

| Ad | Link | Tür | Dil | Neden | Ücret |
|---|---|---|---|---|---|
| KAP ana sayfa | [link](https://www.kap.org.tr/tr) | Resmi platform | TR | Tüm şirket bildirimleri | Ücretsiz |
| KAP Bildirim Sorgu | [link](https://kap.org.tr/tr/bildirim-sorgu) | Sorgu aracı | TR | Şirket, tür ve tarihe göre filtreleme (ÖDA, Finansal Rapor) | Ücretsiz |
| KAP Site Kılavuzu | [link](https://www.kap.org.tr/tr/api/about/content-file/402832a195b3017d0195bd17e2e07e9a) | PDF | TR | Filtreler ve detaylı sorgu | Ücretsiz |
| KAP Yardım | [link](https://kap.org.tr/tr/icerik/Diger/yardim) | Yardım | TR | Kullanım | Ücretsiz |
| KAP Mobil (MKK), uygulama bilgisi | [link](https://apps.appfollow.io/ios/kap-mobil/1446248337?country=tr) | Uygulama | TR | Takip listesi (100 şirkete kadar) ve anlık bildirim. App Store / Google Play'de "KAP Mobil" olarak ara. | Ücretsiz |
| TradingView: Paper Trading temel işlevler | [link](https://www.tradingview.com/support/solutions/43000516466-paper-trading-main-functionality/) | Destek | EN | Kâğıt üzerinde işlem; giriş, zarar-kes ve hedef emirleri | Ücretsiz |
| TradingView: Paper hesabı bağlama | [link](https://www.tradingview.com/support/solutions/43000479975-how-to-connect-or-disconnect-a-paper-trading-account/) | Destek | EN | Kurulum adımları | Ücretsiz |
| BrokerChooser: TradingView'da kâğıt üzerinde işlem | [link](https://brokerchooser.com/tr/invest-long-term/tools/tradingview/paper-trading) | Rehber | TR | Türkçe adım adım kurulum | Ücretsiz |
| TradingView: aracı kurum ayarlarında veri türü | [link](https://th.tradingview.com/support/solutions/43000693755/) | Destek | EN | BIST verisinin gerçek zamanlı mı gecikmeli mi olduğu | Ücretsiz |

**Makro takvim ve vergi**

| Ad | Link | Tür | Dil | Neden | Ücret |
|---|---|---|---|---|---|
| CNBC-e: TCMB 2026 PPK ve rapor takvimi | [link](https://www.cnbce.com/faiz/turkiye-cumhuriyet-merkez-bankasi-2026-yili-para-politikasi-kurulu-ppk-toplantilari-ve-rapor-takvimini-acikladi-h22037) | Haber | TR | PPK tarihleri | Ücretsiz |
| QNB Invest: TCMB 2026–2027 faiz kararı takvimi | [link](https://www.qnbinvest.com.tr/investodak/qnbarastirma/tcmb-2026-2027-faiz-karari-takvimi-aciklandi-yatirimcilar-icin-kritik-tarihler) | Analiz | TR | PPK tarihleri, ikinci kaynak | Ücretsiz |
| Foreks: TÜİK 2026 veri yayın takvimi | [link](https://www.foreks.com/haber/detay/69566f3367ad3132ebdf7774/PICNEWS/tr/tuik-2026-yili-veri-yayin-takvimini-acikladi-01-01-26/) | Haber | TR | TÜFE açıklama günleri | Ücretsiz |
| Bloomberg HT: TÜFE'de yeni temel yıl | [link](https://www.bloomberght.com/tuik-ten-yeni-enflasyon-formulu-3760415) | Haber | TR | 2025=100 değişikliği | Ücretsiz |
| TSKB: Taxation of Securities 2026 | [link](https://www.tskb.com.tr/uploads/file/taxation-of-securities-and-other-capital-market-instruments-2026.pdf) | PDF | EN | Hisse kazancında %0 stopaj | Ücretsiz |
| Borsa İstanbul: Taxation Module | [link](https://www.borsaistanbul.com/en/taxation-module) | Resmi sayfa | EN | Vergi özeti (2030 uzatmasından önceki tarihli olabilir) | Ücretsiz |
| RegFollower: Geçici 67'nin 2030'a uzatılması | [link](https://regfollower.com/turkey-extends-withholding-provisions-related-certain-capital-market-earnings-until-2030/) | Haber | EN | Stopaj rejiminin süresi | Ücretsiz |
| PwC Vergi Bülteni 2024/69 | [link](https://www.pwc.com.tr/tr/hizmetlerimiz/vergi/bultenler/2024/kar-payi-stopaj-oranini-15e-cikartan-cumhurbaskani-karari.html) | Bülten | TR | Temettü stopajı %15 | Ücretsiz |
| Alomaliye: 11107 sayılı karar (fonlar) | [link](https://www.alomaliye.com/2026/03/27/gvk-gecici-67-nci-maddesinde-yer-alan-tevkifat-oranlari-karar-sayisi-11107/) | Mevzuat haberi | TR | 2026'daki fon stopajı değişikliği | Ücretsiz |

**Eğitim**

| Ad | Link | Tür | Dil | Neden | Ücret |
|---|---|---|---|---|---|
| SPK Finansal Okuryazarlık Platformu | [link](https://spk.gov.tr/finansal-okuryazarlik-platformu) | Video eğitim + sertifika | TR | Borsa kategorisi; e-Devlet ile 1., 2. ve 3. düzey katılım sertifikası | Ücretsiz |
| SPK: Platform açılış duyurusu | [link](https://spk.gov.tr/duyurular/baskanin-konusmalari/2024/finansal-okuryazarlik-platformu-acildi) | Duyuru | TR | Platformun kapsamı | Ücretsiz |
| Borsa İstanbul: Cevaplarla Borsa ve Sermaye Piyasası | [link](https://www.borsaistanbul.com/data/kilavuzlar/Cevaplarla_Borsa_ve_Sermaye_Piyasasi.pdf) | Kılavuz (PDF) | TR | Temel kavramlar soru-cevap biçiminde (tarihi eski olabilir) | Ücretsiz |
| Zerodha Varsity: Risk Management & Trading Psychology | [link](https://zerodha.com/varsity/module/risk-management/) | Çevrim içi modül | EN | Pozisyon büyüklüğü bölümleri | Ücretsiz |
| SEC: Day Trading: Your Dollars at Risk | [link](https://www.sec.gov/investor/pubs/daytips.htm) | Yatırımcı uyarısı | EN | Gerçekçi beklenti | Ücretsiz |
| Investor.gov: Day trading risks | [link](https://www.investor.gov/introduction-investing/investing-basics/glossary/day-trading-risks) | Sözlük | EN | Kısa risk özeti | Ücretsiz |

> **Borsa İstanbul Akademi:** Bu adla güncel bir ücretsiz eğitim programı bu
> araştırmada bulunamadı. Ücretsiz resmi eğitim için SPK'nın platformunu
> kullan. Platformun adresi finansalokuryazarlik.gov.tr; SPK sayfasından
> ulaşılabiliyor.

**Araştırmalar (Çerçeve bölümündeki rakamların kaynakları)**

| Ad | Link | Tür | Dil | Neden | Ücret |
|---|---|---|---|---|---|
| Barber & Odean (2000), *Trading Is Hazardous to Your Wealth* | [link](https://faculty.haas.berkeley.edu/odean/Papers%20current%20versions/Individual_Investor_Performance_Final.pdf) | Makale (J. of Finance) | EN | Sık işlem ve maliyet | Ücretsiz |
| Barber, Lee, Liu, Odean, *The Cross-Section of Speculator Skill* | [link](https://faculty.haas.berkeley.edu/odean/papers/day%20traders/Day%20Trading%20Skill%20110523.pdf) | Makale (Tayvan) | EN | Gün içi işlemcilerin becerisi | Ücretsiz |
| Barber ve diğ., *Learning Fast or Slow?* | [link](https://www.econ.puc-rio.br/uploads/adm/seminarios/Learning_fast_or_slow_180606.pdf) | Çalışma kâğıdı | EN | %3'ten azının öngörülebilir biçimde kâr etmesi | Ücretsiz |
| Chague, De-Losso, Giovannetti, *Day Trading for a Living?* | [link](https://repositorio.fgv.br/items/e87d04fc-4b4c-4a56-ab5a-1c84c1afde1b/full) | Çalışma kâğıdı (Brezilya) | EN | Devam edenlerin %97'sinin zarar etmesi | Ücretsiz |
| BIST bireysel yatırımcı çalışması (2011–2012) | [link](https://openaccess.bilgi.edu.tr/bitstreams/9a6e4287-a9ef-4cb6-83a8-3560a53b665d/download) | Akademik çalışma | TR | Yatırımcıların yaklaşık %70'inin piyasayı yenememesi | Ücretsiz |

**Kitaplar** (öncelik sırasıyla; ilk ikisi yeter)

| Ad | Link | Tür | Dil | Neden | Ücret |
|---|---|---|---|---|---|
| Alexander Elder, *The New Trading for a Living* (Wiley, 2014) | [link](https://newsroom.wiley.com/press-releases/press-release-details/2014/The-New-Trading-for-a-Living-by-Dr-Alexander-Elder/default.aspx) | Kitap | EN | Risk yönetimi, işlem planı şablonları, öz yönetim | Ücretli |
| Mark Douglas, *Trading in the Zone* | [link](https://penguinrandomhouse.com/books/350665/trading-in-the-zone-by-mark-douglas) | Kitap | EN | İşlem psikolojisi, olasılıkla düşünme | Ücretli |
| Daniel Kahneman, *Hızlı ve Yavaş Düşünme* (Varlık) | [link](https://www.idefix.com/hizli-ve-yavas-dusunme-p-224033) | Kitap | TR | Bilişsel önyargılar (aşırı güven, kayıptan kaçınma) | Ücretli |
| Morgan Housel, *Paranın Psikolojisi* | [link](https://www.kitapyurdu.com/kitap/paranin-psikolojisi/749629.html?path=1_87) | Kitap | TR | Parayla ilişki, sabır, risk | Ücretli |
| John J. Murphy, *Technical Analysis of the Financial Markets* | [link](https://www.librarything.com/work/294391) | Başvuru kitabı | EN | Teknik analiz terimleri. Baştan sona okuma, ihtiyaç oldukça bak. | Ücretli |

---

## AI özet ve tavsiye kuralları

**Claude'un yaptıkları:**
- **Süreç ve risk kontrolü.** Her planı Risk kuralları listesine göre denetler.
  Planda eksik alan ya da ihlal varsa planı açıkça reddeder ve hangi kurala
  takıldığını söyler.
- **Hesaplar.** Pozisyon büyüklüğünü, riski TL ve % olarak, risk/ödülü,
  toplam açık riski ve R sonuçlarını hesaplar. Haftalık istatistiklerin
  hesabını da yapar.
- **Günlük analizi.** İhlallerin ve hataların örüntüsünü bulur. Örneğin "3
  zarar-kes ihlalinin üçü de Pazartesi oldu" gibi.
- **Sorgulayıcı sorular.** Ön-mortem yaptırır: "Bu işlem neden başarısız
  olabilir?" Geçersizlik cümlesini ve fikrin kaynağını sorar.
- **Kavram açıklama.** Likidite, VBTS, T+2 ya da bir KAP bildirim türünün ne
  anlama geldiği gibi soruları kısa ve doğru biçimde yanıtlar.
- **Güncel veri.** Gerekirse veriyi WebSearch ile kaynaklı getirir ve
  tarihini yazar. Ezberden rakam vermez.
- **Duygu dilini fark etme.** "Kaçırmayayım", "telafi etmem lazım" ya da
  "bu sefer kesin" gibi ifadeleri görünce soğuma kuralını hatırlatır.
- **Saat ve öncelik.** 23:30'u korur. Sınav haftasında izi durdurur.
- **AI özeti** en fazla 6 satırdır:
  1. Kural uyumu (uygun / ihlal, hangi kural)
  2. Plandaki eksikler
  3. Bu haftanın istatistiği (işlem sayısı, beklenen R, ihlal sayısı)
  4. Tek bir davranış hedefi

**Claude'un yapmadıkları:**
- Hisse önerisi vermez. "Hangi hisseyi alayım?" sorusunu yanıtlamaz.
- Al-sat sinyali, hedef fiyat ya da fiyat tahmini vermez. "Bu hisse yükselir
  mi?" sorusuna cevap vermez.
- Bir hissenin "iyi" ya da "ucuz" olduğuna hüküm vermez. Bunun yerine
  kullanıcının kendi gerekçesini kontrol listesiyle sınar.
- Sosyal medya tüyolarını değerlendirmez; kural 14'ü hatırlatır.
- Kural esnetmeye yardım etmez. Kullanıcı ısrar ederse işlemi ihlal olarak
  kaydeder.
- Gerçek paraya geçme kararını vermez. Yalnızca istatistikleri gösterir.
- Kaldıraç, VİOP, kripto ya da forex önermez ve bunları planlamaz.
- Aracı kurum hesabına erişmez, emir göndermez.
- Claude yatırım danışmanı değildir. Bu dosya ve oturumlar eğitim amaçlıdır.

---

## Riskler ve tavsiyeler

- **Uyku.** 23:30 sert bitiştir, 00:30'da uyku. Yatakta grafiğe bakılmaz.
  Fiyat bildirimleri 23:30–08:00 arasında sessizde kalır. Uykusuzluk
  dürtüselliği artırır; gece verilen bir karar ertesi akşamı bekleyebilir.
  Bir haftada 2 kez 23:30 aşılırsa ertesi hafta yalnızca Salı ve Perşembe
  rutini yapılır.
- **Dersler.** Bu iz 4. öncelikte. Sınav haftasında durur (profildeki
  `sinav_donemleri`). Ders saatinde aracı kurum uygulaması kapalı tutulur.
  Emirler önceden ve koşullu olarak girildiği için gün içinde ekrana bakmak
  gerekmez. Bir haftada 2'den fazla oturum kaçarsa iz küçültülür. Bu üst üste
  iki hafta olursa izi dondurmayı konuş.
- **Duygusal işlem.** Başlıca tuzaklar:
  - **FOMO:** Hareketi kaçırma korkusu.
  - **İntikam işlemi:** Kaybı hemen telafi etmeye çalışmak.
  - **Kayıptan kaçınma:** Zarar-kes seviyesini genişletmek.
  - **Aşırı güven:** Birkaç kazançtan sonra pozisyonu büyütmek. Barber &
    Odean bunu ana neden olarak gösteriyor.
  - **Onay yanlılığı:** Yalnızca fikrini destekleyen bilgiyi aramak.

  Önlemler şunlar: yazılı kurallar, 2 günlük soğuma, ön-mortem ve günlükteki
  `duygu_notu` alanı.
- **Sosyal medya ve manipülasyon.** "Garantili kazanç" vaadi, ücretli sinyal
  grupları ve bir anda popüler olan sığ tahtalar en hızlı para kaybettiren
  yollardır. Bilgi kaynağı KAP ve resmi kurumlardır. VBTS tedbiri gelen
  paylardan uzak dur.
- **Maliyet.** Komisyon, spread ve kayma her işlemde getiriden düşer. Sık
  işlem bu maliyetin katlanması demektir. Günlüğe `masraf_tl` alanını mutlaka
  yaz. Sonuçlarını BIST 100'ün aynı dönemdeki getirisiyle karşılaştır. Endeksi
  yenemiyorsan, harcadığın zamanın da bir bedeli olduğunu hesaba kat.
- **Veri gecikmesi.** TradingView'da BIST verisi, aboneliğe ya da aracı kurum
  bağlantısına göre gerçek zamanlı ya da 15 dakika gecikmeli olabilir. Akşam
  analizi için bu sorun değil. Gün içinde karar vermek zaten kurallara aykırı.
- **Kâğıt üzerinde işlemin yanılgısı.** Kâğıt üzerinde kaybetme korkusu
  yoktur. Gerçek paraya geçince aynı kurallar daha zor gelir. Bu yüzden ilk
  20 gerçek işlemde risk %0,5'tir.
- **Zamanın sızması.** 30 dakika 30 dakikadır. `ekran_kontrol` sayısı
  artıyorsa, iz başka alanlardan (uyku, ders, SolidWorks, YZ) zaman çalıyor
  demektir. Bunu haftalık değerlendirmede açıkça konuş.
- **Bu dönem için not (Ekim–Aralık 2026):**
  - 22 Ekim (Perşembe) PPK günü.
  - Ekim sonu–Kasım ortası 9 aylık bilanço penceresi.
  - Kasım başında TÜFE.
  - 12 Kasım (Perşembe) Enflasyon Raporu.
  - 10 Aralık (Perşembe) PPK günü.

  Bu günlerin önceki akşamı "olay günü" kuralı (kural 11) uygulanır. Vize
  haftaları da bu döneme denk geliyorsa iz durur.
