# Planlayıcının dayandığı yöntemler

Asistanın her kararı aşağıdaki yöntemlerden birine dayanır. Her maddede önce
araştırmanın ne söylediği, sonra sistemin bunu nasıl uyguladığı yazıyor.

---

## 1. Planlama yanılgısı: süreleri sistematik olarak küçük tahmin ederiz

**Araştırma.** Buehler, Griffin ve Ross (1994) öğrencilere bitirme tezlerinin
ne kadar süreceğini sordu. Ortalama tahmin 33,9 gündü, gerçekleşen süre ise 55,5
gün. Öğrencilerin yalnızca yaklaşık %30'u tahmin ettikleri tarihte bitirdi. "En
kötü senaryo" tahminlerini bile yarıdan fazlası aştı.

**Sistemde.**
- Her görevin ham tahmini **kişisel tahmin katsayısıyla** çarpılır. Katsayı
  başlangıçta 1,5'tir. Tamamlanan görevlerde gerçek süre girildikçe
  `gerçek / tahmin` oranlarının medyanından yeniden hesaplanır
  (`planla.py katsayi`) ve [1,0 – 3,0] aralığında tutulur.
- Plan son tarihe göre değil, son tarihten önceki **güvenli bitiş** tarihine
  göre yapılır.

## 2. Parçalama: işi alt adımlara bölmek tahmini düzeltir

**Araştırma.** Kruger ve Evans (2004) işi alt adımlarına ayırarak tahmin
etmenin ("unpacking") planlama yanılgısını azalttığını buldu. Benzer bir etkiyi
Forsyth ve Burt (2008) da gösterdi. Etki, az adımlı ya da çok kolay işlerde
zayıflıyor.

**Sistemde.** 2 saatten uzun veya birden çok adımlı her görev alt görevlere
bölünür. Tahmin alt görevlerin toplamından gelir. Kısa ve basit işler
bölünmez, çünkü orada fayda yok.

## 3. Uygulama niyetleri: "Eğer/ne zaman X olursa, Y'yi yapacağım"

**Araştırma.** Gollwitzer ve Sheeran'ın (2006) 94 bağımsız testi kapsayan
meta-analizine göre "ne zaman, nerede, nasıl" planı kurmak hedefe ulaşmayı
orta-büyük düzeyde artırıyor (d = 0,65).

**Sistemde.** Önemli her görevin bir `niyet` alanı var. Örnek: "Salı 09:00'da
kütüphanede, telefonu dolapta bırakıp şasi raporunun 2. bölümünü yazacağım."
Takvime eklenen bloklar da bu niyetin somut karşılığı: saat, yer ve ilk adım
etkinlik açıklamasına yazılır.

## 4. Plan yapmak zihni boşaltır

**Araştırma.** Masicampo ve Baumeister (2011) yarım kalan hedeflerin zihni
meşgul ettiğini, ama bu hedefler için somut bir plan yapmanın bu zihinsel
"sızıntıyı" büyük ölçüde ortadan kaldırdığını gösterdi.

**Sistemde.** Akla gelen her şey anında **gelen kutusuna** atılır (Plan
Panosu'ndaki hızlı ekleme ya da sohbette tek cümle). Asistan bunları sonra
netleştirir. Amaç, hiçbir şeyi aklında tutmak zorunda kalmaman.

## 5. Eisenhower matrisi: önem ve aciliyet ayrı şeylerdir

| | Acil | Acil değil |
|---|---|---|
| **Önemli** | 1. Hemen yap | 2. Planla ve koru (en değerli bölge) |
| **Önemsiz** | 3. Küçült, devret ya da hızlıca bitir | 4. Bırak ya da sonraya at |

**Sistemde.** Önem (1–5) sana sorularak belirlenir. Aciliyet ise hesaplanır:
son tarihe kadar kalan çalışma kapasitesi, kalan iş miktarına bölünür (bkz.
madde 7). Asistan 2. kadranı özellikle korur. Bu kadrandaki işler (ders
çalışmak, takımda bir parçayı sahiplenmek, beceri öğrenmek) asla acil
görünmez, ama uzun vadede en çok değeri onlar üretir.

## 6. Zaman bloklama ve derin çalışma

**Araştırma ve pratik.** Görev listesi değil, takvimde ayrılmış süre iş
bitirir. Newport (2016) zihinsel olarak zorlayıcı işin kesintisiz, uzun
bloklarda yapılması gerektiğini savunur. Dikkat ve enerji gün içinde
dalgalanır.

**Sistemde.**
- Odak blokları en fazla 90 dakikadır ve aralarında 10 dakika mola vardır.
- `derin` enerji gerektiren işler profilindeki **zirve saatlerine**, `hafif`
  işler (e-posta, form doldurma) düşük enerjili saatlere yerleştirilir.
- Günlük derin çalışma toplamı bir üst sınırla kısıtlanır (varsayılan 4
  saat). Bundan fazlası kâğıt üzerinde durur, gerçekte yapılmaz.

## 7. Son tarih fizibilitesi: EDF testi

**Teori.** Gerçek zamanlı sistemlerin çizelgeleme kuramında (Liu ve Layland,
1973) "en erken son tarih önce" (EDF) kuralı, tek işlemcide işler için
uygulanabilir bir çizelge varsa onu bulur. Buradaki "işlemci" sensin.

**Sistemde.** `planla.py kapasite` her son tarih için şunu kontrol eder:
*Bu tarihe kadar bitmesi gereken tüm işlerin toplamı (katsayıyla düzeltilmiş),
bugünden o tarihe kadarki çalışma kapasitemden büyük mü?* Büyükse asistan
hemen alarm verir ve somut seçenekler sunar: kapsamı küçült, süre iste, başka
bir işi ertele ya da devret. Yetişemeyeceğini son gece değil, bugün öğrenirsin.

## 8. Tampon: belirsizliği tek yerde topla

**Pratik.** Goldratt'ın kritik zincir yaklaşımı (1997), her görevin içine
gizli pay koymak yerine payı projenin sonunda tek bir tampon olarak tutmayı
önerir.

**Sistemde.** Günlük planda çalışma süresinin %20'si boş bırakılır
(`tampon_orani`). Büyük projelerde son kilometre taşı ile teslim arasına ayrı
bir tampon konur.

## 9. Sınavlar için aralıklı tekrar ve kendini test etme

**Araştırma.** Cepeda ve arkadaşları (2008) 1.350'den fazla kişiyle yaptıkları
çalışmada en iyi tekrar aralığının sınava kalan süreyle büyüdüğünü buldu.
1 haftalık bir hedef için aralık, kalan sürenin yaklaşık %20–40'ı. 1 yıllık
bir hedef için %5–10'u. Çok kısa aralık, çok uzun aralıktan daha zararlı.
Dunlosky ve arkadaşları (2013) en etkili öğrenme tekniklerinin **kendini test
etme** ve **aralıklı çalışma** olduğunu raporladı. Yeniden okuma ve
altını çizme düşük faydalı çıktı.

**Sistemde.** `/proje-plani` sınav için şunları yapar:
- Konuları oturumlara böler ve tekrarları artan aralıklarla dağıtır
  (örneğin 1. gün, 3. gün, 7. gün).
- Her oturumun ilk işi soru çözmek ya da kendini test etmektir.
- Son gece yeni konu planlanmaz.

## 10. Haftalık gözden geçirme ve "sonraki adım" (GTD)

**Pratik.** Allen'ın *Getting Things Done* yöntemindeki (2001) beş adım
şunlar: topla → netleştir → düzenle → gözden geçir → yap. Her proje için
tek bir **sonraki fiziksel adım** tanımlamak, "ne yapacağımı bilmiyorum"
direncini kırar.

**Sistemde.** Her görevin bir `sonraki_adim` alanı var. Bu, belirsiz bir
"rapor" değil, somut bir eylem olmalı: "raporun şablonunu indir, başlıkları
doldur". `/haftalik-plan` her pazar gelen kutusunu boşaltır, takılan işleri
ayıklar ve haftanın 3 hedefini seçer.

## 11. Erteleme sinyali

**Araştırma.** Steel'in (2007) erteleme meta-analizine göre görevin
sevimsizliği, ödülün uzaklığı ve dikkat dağınıklığı, ertelemenin en güçlü
yordayıcıları.

**Sistemde.** Bir görev 3 kez ertelenirse (`ertelenme >= 3`) asistan onu
körü körüne yeniden planlamaz. Şu sorulardan birini sorar:
- 10 dakikalık bir ilk adıma küçültelim mi?
- Gerçekten yapılması gerekiyor mu? Silelim mi?
- Birine devredebilir misin?
- Neyin seni durdurduğunu konuşalım mı?

## 12. Büyük hedefler için WOOP

**Araştırma.** Oettingen'in zihinsel karşıtlama ile uygulama niyetini
birleştiren yöntemi dört adımdan oluşur: Dilek → Sonuç → Engel → Plan.
Sadece olumlu hayal kurmaktan daha etkilidir.

**Sistemde.** `/proje-plani` büyük hedeflerde en olası iç engeli sorar ve
ona karşı bir "eğer-o zaman" planı ekler. Örnek: "Eğer akşam yorgun gelirsem,
sadece 25 dakika ve sadece soru çözümü yapacağım."

---

## Kaynaklar

- Buehler, R., Griffin, D., & Ross, M. (1994). Exploring the "planning fallacy". *Journal of Personality and Social Psychology*, 67(3), 366–381. [Özet: Wikipedia – Planning fallacy](https://en.wikipedia.org/wiki/Planning_fallacy)
- Kruger, J., & Evans, M. (2004). If you don't want to be late, enumerate: Unpacking reduces the planning fallacy. *Journal of Experimental Social Psychology*, 40, 586–598.
- Forsyth, D. K., & Burt, C. D. B. (2008). Allocating time to future tasks: The effect of task segmentation on planning fallacy bias. *Memory & Cognition*, 36(4), 791–798. [doi:10.3758/MC.36.4.791](https://dx.doi.org/10.3758/MC.36.4.791)
- Gollwitzer, P. M., & Sheeran, P. (2006). Implementation intentions and goal achievement: A meta-analysis of effects and processes. *Advances in Experimental Social Psychology*, 38, 69–119. [Konstanz Üniversitesi kaydı](https://www.socmot.uni-konstanz.de/publications/implementation-intentions-and-goal-achievement-meta-analysis-effects-and-processes)
- Masicampo, E. J., & Baumeister, R. F. (2011). Consider it done! Plan making can eliminate the cognitive effects of unfulfilled goals. *Journal of Personality and Social Psychology*, 101(4), 667–683.
- Cepeda, N. J., Vul, E., Rohrer, D., Wixted, J. T., & Pashler, H. (2008). Spacing effects in learning: A temporal ridgeline of optimal retention. *Psychological Science*, 19(11), 1095–1102. [PDF](https://www.evullab.org/pdf/CepedaVulRohrerWixtedPashler-PS-2008.pdf)
- Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students' learning with effective learning techniques. *Psychological Science in the Public Interest*, 14(1), 4–58.
- Liu, C. L., & Layland, J. W. (1973). Scheduling algorithms for multiprogramming in a hard-real-time environment. *Journal of the ACM*, 20(1), 46–61.
- Steel, P. (2007). The nature of procrastination. *Psychological Bulletin*, 133(1), 65–94.
- Allen, D. (2001). *Getting Things Done*. Penguin.
- Newport, C. (2016). *Deep Work*. Grand Central.
- Goldratt, E. M. (1997). *Critical Chain*. North River Press.
- Oettingen, G. (2014). *Rethinking Positive Thinking*. Current.
