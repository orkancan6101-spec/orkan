# Yapay Zekâ

> İz kodu: `yz` · Pano belgesi: `izler/yz` · Öncelik: 2. sıra (dersler, takım ve
> SolidWorks'ten sonra) · Haftalık hedef: 150 dk (3 × 50 dk) · Sınav haftası: 1 × 50 dk
> Son güncelleme: 12 Ekim 2026. Linkler bu tarihte web aramasıyla ya da doğrudan
> erişimle doğrulandı (bkz. en alttaki doğrulama notu).

Bu izin amacı "AI builder" olmak: Claude Code ve Claude API ile çalışan sistemler
kurmak, otomasyon yazmak ve kendi mobil uygulamanı mağazaya çıkarmak. Kurs bitirmek
amaç değil. Her fazın sonunda **çalışan bir şey** olmalı.

---

## Hedef ve ölçüt

**12 aylık hedef (Ekim 2027):** Claude Code'u skill, hook, subagent, MCP ve rutinlerle
kullanan; Claude API ile değerlendirmesi (eval) yapılmış küçük araçlar ve kendi MCP
sunucusunu yazmış; kendi mobil uygulamasını en az bir mağazada yayımlamış bir makine
mühendisi.

| Tarih | Ölçülebilir ölçüt | Kanıt |
|---|---|---|
| 25 Ekim 2026 | Mobil uygulamanın teknoloji kararı verildi, 1 sayfalık ürün notu yazıldı, uygulama reposunda CLAUDE.md var | `urun-notu.md`, CLAUDE.md |
| 6 Aralık 2026 | Uygulama reposunda Claude Code seti 5/5 çalışıyor: 1 skill, 1 hook, 1 subagent, 1 MCP bağlantısı, 1 rutin | Repo + `kanitlar.md` |
| 31 Ocak 2027 | MVP v0.1 kendi telefonunda çalışıyor. 7 gün kendin kullandın. 5 kullanıcı görüşmesi yapıldı | Build, kullanım notu, görüşme özetleri |
| 31 Mart 2027 | Google Play kapalı testi (ve/veya TestFlight) en az 12 test kullanıcısıyla başladı. Claude API ile yazılmış geri bildirim sınıflandırıcısı 20 örneklik eval'de en az %80 doğru | Test linki, eval raporu, maliyet notu |
| 30 Nisan 2027 | Kapalı test **20 kullanıcıda**. Google'ın 14 günlük şartı doldu. İlk geri bildirim turu bitti | Play Console / TestFlight ekranı, geri bildirim özeti |
| 31 Mayıs 2027 | Kendi yazdığın MCP sunucusu (en az 3 araç) Claude Code'a bağlı ve kullanılıyor. Agent SDK ile 1 küçük ajan çalışıyor | Repo, README, test |
| 31 Temmuz 2027 | Uygulama en az bir mağazada yayında (production) | Mağaza linki |
| 31 Ağustos 2027 | 1 otomasyon 4 hafta kesintisiz çalıştı. Gelir kararı yazılı olarak verildi (ödeme denemesi ya da gerekçeli "şimdilik ücretsiz") | Çalışma kaydı, karar notu |
| 30 Eylül 2027 (opsiyonel) | 1 mühendislik aracı (ör. coast-down analizi) + 1 sayfalık vaka çalışması | Repo, vaka sayfası |

**Pasif gelir neden ölçüt değil?** RevenueCat'in 2026 raporuna göre yeni abonelik
uygulamalarının yalnızca **%17'si** ilk iki yılında aylık 1.000 $ tekrarlayan gelire
ulaşabiliyor (bir önceki yıl %19'du). Aylık 10.000 $'a ulaşanların payı **%4,6**. Bu
veri, zaten abonelik altyapısı kurmuş uygulamalardan geliyor. Genel tablo büyük
ihtimalle daha kötü. Gelir senin kontrolünde değil; yayımlamak, kullanıcıya ulaşmak ve
öğrenmek senin kontrolünde. O yüzden hedefler bunlar. **Bonus hedef:** ilk ödeyen
kullanıcı (1 kişi bile olsa).

Uygulamanın gerçek getirisi şunlar: kendi işine yarayan bir araç, uçtan uca ürün
çıkarma deneyimi (fikir → kullanıcı → mağaza → geri bildirim) ve portföy. Bunlar
gelir olmasa bile garantili.

---

## Kullanıcının durumu ve kısıtlar

- **Kim:** ESTÜ Makine Mühendisliği 3. sınıf, ESTU Solar Team mekanik birimi.
- **Neden:** "Kendimi makine mühendisi olarak sınırlamak istemiyorum." Claude,
  otomasyonlar, sistemler. Kendi uygulamasını çıkarmak, pasif gelir, kendine
  yararlı olmak, sektörü öğrenmek.
- **Mevcut seviye:** Claude Pro ve Claude Code kullanıyor. Lokalde kendi
  uygulamalarını geliştiriyor. Bir mobil uygulama tasarlıyor. Teknolojisi henüz
  belli değil (F0'da netleşecek).
- **Elindeki laboratuvar:** Bu planlama asistanı reposu zaten çalışan bir Claude Code
  sistemi: `CLAUDE.md`, `.claude/skills/`, `.claude/settings.json` içinde hook'lar,
  bulutta rutinler, Plan Panosu'nda veritabanı. Bunları okumak, F1'in en iyi örnek
  kaynağı.
- **Süre:** Normal haftada ≈150 dk (3 × 50 dk). Sınav haftalarında 1 oturum.
  12 ayda toplam ≈100 saat. Bu az bir süre. Bu yüzden müfredat dar ve kanıt odaklı.
- **Öncelik:** Dersler ve takım her zaman önce gelir. Çakışmada bu iz kaybeder.
- **Bütçe (öğrenci):**
  - Apple Developer Program **99 $/yıl**. Google Play geliştirici hesabı **25 $,
    tek seferlik** (üçüncü taraf kaynaklara göre; kayıtta kontrol et).
  - Claude Pro aboneliği **API kullanımını kapsamaz.** API için Console'da ayrı
    kredi gerekir. Öğrenme aşamasında aylık birkaç dolar yeter (bkz. F3 maliyet
    notu). Console'da harcama limiti koy.
  - Pro planında bulut oturumları ve rutinler var. Ancak sohbet, Claude Code ve
    rutinler aynı kullanım limitini paylaşır.
- **Google Play kuralı:** Yeni kişisel geliştirici hesaplarında production'a çıkmadan
  önce **en az 12 test kullanıcısıyla, 14 gün kesintisiz kapalı test** şart. Takvimdeki
  "20 kullanıcı" hedefi bu yüzden var.
- **Takım gizliliği:** Takımın CAD'i, sponsor bilgileri ve yayımlanmamış tasarımları
  harici araçlara yüklenmez (Solar Team rehberi §12.2).

---

## Müfredat (fazlar)

### Nasıl okunur

Her faz üç hatta ilerler. Bu hatlar haftalık ritimdeki oturumlara karşılık gelir:

- **A · Öğrenme:** Fazın konusu. Kaynak + mini uygulama.
- **B · Proje:** Mobil uygulama. Bu izin "uygulama" kısmı budur.
- **C · Lab:** Öğrenme hattının kanıt çıktısını inşa etmek (skill, MCP sunucusu,
  otomasyon). C oturumunun ilk 20 dakikası trend takibidir.

Adım kodları `F<faz>-<hat><sıra>` biçimindedir. Örnek: `F1-A3`. Panodaki `sonraki`
alanı üç hattın sıradaki adımını tutar: `A:F1-A3 · B:F1-B2 · C:F1-C3`.

**Faz kapısı:** Fazın kanıtı yoksa sonraki faza geçilmez. Bir faz planlanan bitişini
2 haftadan fazla aşarsa üç seçenek sunulur: kapsamı küçült, süreyi uzat ya da adımı
bırak. Sınav haftası denk gelirse faz otomatik olarak 1 hafta uzar.

---

### F0 · Başlangıç ve karar
**12–25 Ekim 2026 · 2 hafta · 6 oturum**

Amaç: Elindekini görmek, mobil uygulamanın teknolojisine karar vermek ve uygulamayı
Claude Code ile çalışmaya hazırlamak.

**A · Öğrenme**
- `F0-A1` Claude Code en iyi pratikler. Önce keşfet, sonra planla, sonra kodla.
  Claude'a işini doğrulayacak bir yol ver (test, lint). CLAUDE.md'yi kısa tut.
  30 dk oku, 15 dk kendi uygulamanda plan modunu dene.
  → https://code.claude.com/docs/en/best-practices
- `F0-A2` CLAUDE.md ve hafıza + MVP nasıl planlanır.
  → https://code.claude.com/docs/en/memory
  → https://ycombinator.com/library/Io-how-to-build-an-mvp

**B · Proje**
- `F0-B1` Envanter: Lokaldeki uygulamaların listesi (ne yapıyor, ne durumda, hangi
  teknoloji). Mobil uygulama için teknoloji kararı (aşağıdaki karar kuralı).
- `F0-B2` `urun-notu.md` (1 sayfa): çözdüğü sorun, kimin için, **tek temel akış**,
  "başarılı sayarım" ölçütü, görüşme yapılacak 5 kişi. Uygulama reposunda `/init`
  çalıştır, çıkan CLAUDE.md'yi elle sadeleştir.

**C · Lab (+20 dk trend)**
- `F0-C1` Trend listesini yer imlerine ekle (bkz. Trend takibi). Bu planlayıcı
  reposunun `.claude/` klasörünü oku: `CLAUDE.md`, bir `SKILL.md`,
  `settings.json` içindeki hook'lar. "Bunu ben yazsaydım ne değiştirirdim?" notu al.
- `F0-C2` Anthropic Academy'ye kaydol, "Claude Code in Action" kursuna başla.
  → https://www.anthropic.com/learn · https://anthropic.skilljar.com/

**Kanıt:** Teknoloji kararı (3 satır gerekçe) + `urun-notu.md` + uygulama reposunda
CLAUDE.md.

#### Teknoloji karar kuralı: Expo (React Native) mı, Flutter mı?

1. **Zaten bir teknolojiyle başladıysan değiştirme.** Bu izdeki en büyük risk yanlış
   teknoloji değil, bitmemiş proje.
2. **Henüz başlamadıysan Expo (React Native + TypeScript) öner.** Gerekçeler:
   - JavaScript/TypeScript bilgisi web, otomasyon ve MCP sunucusu yazarken de işe
     yarar. Tek dil, birçok iş.
   - Expo'nun resmi "Build with AI" öğreticisi ve Claude Code'a bağlanabilen bir
     **Expo MCP sunucusu** var.
   - Expo'nun uygulama içi satın alma rehberi, önerdiği kütüphaneler arasında
     RevenueCat'in `react-native-purchases` kütüphanesini sayıyor. RevenueCat'in de
     Expo öğreticisi var.
   - EAS Build ve EAS Submit ile derleme ve mağazaya gönderme tek araçta.
3. **Flutter'ı seç:** Dart öğrenmeye istekliysen, her platformda birebir aynı görünen
   bir arayüz istiyorsan ya da elinde zaten bir Flutter projesi varsa.
4. Uyarı: Uygulama içi satın alma, Expo Go'da değil **development build**'de çalışır.

---

### F1 · Claude Code ustalığı
**26 Ekim – 6 Aralık 2026 · 6 hafta (vize haftaları uzatır)**

Her hafta bir konu. A'da öğren, C'nin lab kısmında uygulama reposuna uygula, B'de
uygulamanın ana akışını ilerlet.

| Hafta | A · Öğren (kaynak) | C · Lab kanıtı |
|---|---|---|
| `F1-A1` / `F1-C1` (26 Eki) | Skills → https://code.claude.com/docs/en/skills · örnekler: https://github.com/anthropics/skills | İlk skill. Ör. `/surum-notu`: son commit'lerden sürüm notu çıkarır |
| `F1-A2` / `F1-C2` (2 Kas) | Hooks → https://code.claude.com/docs/en/hooks-guide | Dosya düzenlemesinden sonra lint/format/test çalıştıran hook |
| `F1-A3` / `F1-C3` (9 Kas) | Subagents → https://code.claude.com/docs/en/sub-agents | `kod-inceleyici` subagent'ı (yalnızca okuma araçları) |
| `F1-A4` / `F1-C4` (16 Kas) | MCP → https://code.claude.com/docs/en/mcp | Expo MCP sunucusunu bağla (Expo seçildiyse; https://expo.dev/blog/become-an-ai-native-developer-with-the-expo-mcp-server). Değilse işine yarayan başka bir MCP sunucusu |
| `F1-A5` / `F1-C5` (23 Kas) | Bulut oturumları ve rutinler → https://code.claude.com/docs/en/claude-code-on-the-web · https://code.claude.com/docs/en/routines | Haftalık 1 rutin. Ör. pazartesi 08:52'de uygulama reposunda "açık TODO + son hafta değişiklikleri" raporu |
| `F1-A6` / `F1-C6` (30 Kas) | Bağlam, maliyet, eklentiler → https://code.claude.com/docs/en/costs · https://code.claude.com/docs/en/features-overview · https://code.claude.com/docs/en/plugins/overview | Bir oturumda `/context` ve `/usage` çıktısını oku. 5 kanıtı `kanitlar.md`'de listele |

Komut başvurusu (gerektikçe): https://code.claude.com/docs/en/commands

Akademi kursu "Claude Code in Action" bu fazla paralel ilerler (A oturumlarının son
15 dakikası). İsteğe bağlı ikinci kaynak:
https://deeplearning.ai/short-courses/claude-code-a-highly-agentic-coding-assistant

**B · Proje:** `F1-B1` … `F1-B6`. Ana akışın ekranları. Her oturumda tek bir görev.
Claude Code'a önce plan modunda ver, planı onayla, sonra uygulat. Her oturumu
telefonda ya da emülatörde çalıştırarak bitir.

**Rutin notu:** Rutinler en sık saatte bir çalışabilir ve Pro kullanım limitinden
yer. Haftada 1 çalışan bir rutin yeter.

**Kanıt:** 5/5 set (skill, hook, subagent, MCP bağlantısı, rutin) + ana akışın ilk
ekranları çalışıyor.

---

### F2 · MVP v0.1 ve kullanıcı doğrulama
**7 Aralık 2026 – 31 Ocak 2027 · 8 hafta (final haftalarında haftada 1 oturum)**

**A · Öğrenme (Expo yolu)**
- `F2-A1` Expo öğreticisine genel bakış → https://docs.expo.dev/tutorial/overview/
- `F2-A2` Claude Code ile ilk uygulama: Build with AI →
  https://docs.expo.dev/tutorial/build-with-ai/create-your-first-app
- `F2-A3` Gezinme (navigation) ve ekran yapısı (öğreticinin ilgili bölümleri)
- `F2-A4` Veri saklama ve gerçek cihazda test
- `F2-A5` Kullanıcı görüşmesi nasıl yapılır? "The Mom Test" mantığı: Fikrini değil,
  kişinin geçmişteki somut davranışını sor. ("En son ne zaman yaşadın? Ne yaptın?")
  Kitap: https://www.simonandschuster.com.au/books/The-Mom-Test/Rob-Fitzpatrick/9798893312560

Flutter yolu seçildiyse A1–A4 yerine: https://docs.flutter.dev/learn

**B · Proje**
- Tek temel akış uçtan uca çalışsın. Ekstra özellik yok.
- Kendi telefonunda v0.1. 7 gün boyunca kendin kullan (dogfooding). Her gün 1 satır
  not: "Nerede takıldım?"

**C · Lab:** 5 görüşmenin notlarını işle. Claude ile özetle: tekrar eden sorun, şu an
kullanılan çözüm, ödeme ya da zaman harcama sinyali. Görüşmelerin kendisi oturum
dışında yapılır (15'er dk). Planlayıcıya görev olarak eklenir.

**Karar kapısı (31 Ocak):** 5 kişiden en az 2'si sorunu son bir ayda yaşadığını ve
bir çözüm denediğini anlatmadıysa sorunu yeniden tanımla. Bu bir başlangıç eşiği,
kendi kararın. Uygulama yine de "kendi aracın" olarak devam edebilir.

**Kanıt:** v0.1 telefonda + 7 günlük kullanım notu + 5 görüşme özeti + "devam /
değiştir" kararı.

---

### F3 · Kapalı test + LLM temelleri ve Claude API
**1 Şubat – 28 Mart 2027 · 8 hafta (sömestr dahil)**

**A · Öğrenme**
- `F3-A1` LLM nasıl çalışır (hafif): token, bağlam, olasılıksal çıktı, halüsinasyon.
  Microsoft "Generative AI for Beginners" 1. ve 2. dersler (**Türkçe çeviri var**) →
  https://github.com/microsoft/generative-ai-for-beginners/blob/main/translations/tr/README.md
- `F3-A2` Bağlam penceresi, model seçimi, fiyat. Alıştırma: aşağıdaki maliyet
  hesabını kendi uygulaman için yap.
  → https://platform.claude.com/docs/en/build-with-claude/context-windows
  → https://platform.claude.com/docs/en/about-claude/models/choosing-a-model
  → https://platform.claude.com/docs/en/about-claude/pricing
- `F3-A3` Prompt mühendisliği → https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview
  + interaktif öğretici, bölüm 1–4 → https://github.com/anthropics/courses
- `F3-A4` Bağlam mühendisliği (context engineering) →
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- `F3-A5` Claude API temelleri (Python): `anthropics/courses` → "Anthropic API
  fundamentals". Python paslıysa önce gerektiği kadar https://www.py4e.com
  (bu adım 2 oturum sürebilir).
- `F3-A6` Yapılandırılmış çıktı (JSON) →
  https://platform.claude.com/docs/en/build-with-claude/structured-outputs
- `F3-A7` Değerlendirme (eval) mantığı. Başarı ölçütünü önce yaz, sonra test seti
  kur, sonra ölç.
  → https://platform.claude.com/docs/en/test-and-evaluate/develop-tests
  → https://simonwillison.net/2024/Mar/31/your-ai-product-needs-evals/ (Hamel Husain'in yazısının özeti ve linki)
- `F3-A8` (seçmeli) `anthropics/courses` → "Prompt evaluations" ya da derin gitmek
  istersen Karpathy'nin 7. dersi "Let's build GPT" → https://karpathy.ai/zero-to-hero.html

Not: `anthropics/courses` öğrenciler için ucuz olsun diye eski bir Haiku modelini
kullanıyor. Kodda model adını güncel bir modelle değiştir.

**C · Lab: Geri bildirim sınıflandırıcısı (Python + Claude API)**
- Girdi: test kullanıcısı yorumları. Kapalı test başlamadan önce görüşme notları ya da
  elle yazılmış örnekler.
- Çıktı (JSON): `{"tur": "hata|istek|ovgu|kafa_karisikligi", "oncelik": 1-3, "ozet": "..."}`
- Eval: Elle etiketlenmiş 20 örnek. Doğruluk en az %80 olsun. Yanlışları oku, prompt'u
  düzelt, tekrar ölç.
- Model: önce en ucuz model (Haiku). Yetmezse bir üst model.
- API anahtarı `.env` dosyasında durur ve `.gitignore`'a eklenir. **Mobil uygulamanın
  içine asla API anahtarı koyma.** Uygulamadan Claude çağrılacaksa araya küçük bir
  sunucu (backend) gerekir.

**B · Proje: Kapalı teste çıkış**
- EAS Build ile derleme → Google Play Console hesabı → iç test → **kapalı test (en az
  12 kişi, 14 gün kesintisiz)** → (opsiyonel) Apple hesabı + TestFlight.
  → https://docs.expo.dev/deploy/submit-to-app-stores/
  → https://support.google.com/googleplay/android-developer/answer/14151465
- Gizlilik politikası sayfası, mağaza açıklaması taslağı, ekran görüntüleri.
- **Özellik dondurma:** Kapalı test başlayana kadar yeni özellik yok. Fikirleri
  `sonra.md` dosyasına yaz.
- Hangi platformdan başlanacağı: Görüşmelerde hedef kullanıcıların hangi telefonu
  kullandığını sor. Bütçe açısından Android önce gelmek daha ucuz (25 $ tek sefer,
  Apple'da 99 $/yıl).

**Maliyet notu (Ekim 2026 fiyatları, 1 milyon token başına, giriş / çıkış):**
Haiku 5.5: 0,10 $ / 0,50 $ · Sonnet 5.5: 2 $ / 10 $ · Opus 5.5: 4 $ / 20 $.
Batch API %50 indirimli. Önbellek (prompt caching) tekrarlanan girdiyi ucuzlatır.
Örnek: Ayda 1.000 çağrı, her biri 2.000 giriş + 500 çıkış token'ı.
Haiku 5.5 ile ≈0,45 $/ay, Sonnet 5.5 ile ≈9 $/ay, Opus 5.5 ile ≈18 $/ay.
Fiyatlar değişir. Hesaptan önce fiyat sayfasına bak.

**Kanıt (31 Mart 2027):** Kapalı test en az 12 kişiyle başladı + sınıflandırıcı +
eval raporu (doğruluk, örnek sayısı, maliyet).

---

### F4 · Araçlar, ajanlar, kendi MCP sunucun + 20 test kullanıcısı
**29 Mart – 30 Mayıs 2027 · 9 hafta (vize haftaları uzatır)**

**A · Öğrenme**
- `F4-A1` Araç kullanımı (tool use) →
  https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview
  + `anthropics/courses` → "Tool use" ilk bölümler
- `F4-A2` Etkili ajan kurmak. Önce en basit çözüm: çoğu iş bir iş akışıyla
  (workflow) çözülür, her iş ajan gerektirmez.
  → https://www.anthropic.com/engineering/building-effective-agents
- `F4-A3` Ajanlar için araç yazmak →
  https://www.anthropic.com/engineering/writing-tools-for-agents
- `F4-A4` MCP sunucusu yazmak (Python) →
  https://modelcontextprotocol.io/docs/develop/build-server
  + Akademi "Introduction to Model Context Protocol" (https://anthropic.skilljar.com/)
  + referans sunucular: https://github.com/modelcontextprotocol/servers
- `F4-A5` Agent SDK → https://code.claude.com/docs/en/agent-sdk/overview ·
  https://code.claude.com/docs/en/agent-sdk/quickstart
- `F4-A6` Agent SDK'da özel araçlar →
  https://code.claude.com/docs/en/agent-sdk/custom-tools ·
  kod: https://github.com/anthropics/claude-agent-sdk-python
- `F4-A7` Agent Skills'in arka planı →
  https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- Tarif kitabı (gerektikçe): https://github.com/anthropics/claude-cookbooks

**C · Lab: Kendi MCP sunucun (Python, en az 3 araç)**. İki seçenekten birini seç:
- **Seçenek 1 · `uygulama-geri-bildirim`:** F3'teki sınıflandırıcıyı araca çevir.
  Araçlar: yorum sınıflandır, haftalık özet çıkar, öncelik listesi ver.
- **Seçenek 2 · `solar-hesap`:** `solar-team/enerji_butcesi.py` fonksiyonlarını araç
  olarak sun. Hem takıma hem bu ize sayılır. Gizli takım verisi kullanılmaz.
- Sonra Agent SDK ile küçük bir ajan yaz: Haftalık geri bildirim raporunu senin MCP
  sunucunu kullanarak hazırlasın.

**B · Proje**
- 20 test kullanıcısına ulaş. 2 sürüm döngüsü (v0.2, v0.3).
- Tutunmayı ölç: 2. haftada uygulamayı hâlâ açan kaç kişi var?
- 14 günlük kapalı test şartı dolunca Google Play'de production erişimi için başvur.

**Kanıt:** 30 Nisan: 20 test kullanıcısı + geri bildirim özeti. 31 Mayıs: MCP
sunucusu (README + 3 araç + 1 test) Claude Code'a bağlı. Agent SDK scripti çalışıyor.

---

### F5 · Yayın, gelir deneyi ve otomasyon
**31 Mayıs – 29 Ağustos 2027 · finaller + yaz + yarış dönemi**

**A · Öğrenme**
- `F5-A1` Gerçekçi beklenti: RevenueCat "State of Subscription Apps" →
  https://www.revenuecat.com/state-of-subscription-apps
- `F5-A2` Mağaza kesintileri. Apple Small Business Program'da önceki yıl kazancı 1 milyon $'ı
  geçmeyen ve yeni geliştiriciler için komisyon %15. Google Play'de yılın ilk 1 milyon $'ı
  için hizmet bedeli %15 (kayıt gerekir).
  → https://developer.apple.com/app-store/small-business-program/
  → https://support.google.com/googleplay/android-developer/answer/10632485
  → https://developer.apple.com/programs/
- `F5-A3` Uygulama içi satın alma ve abonelik →
  https://docs.expo.dev/guides/in-app-purchases/ ·
  https://revenuecat.com/blog/expo-in-app-purchase-tutorial ·
  https://expo.dev/blog/how-to-build-seamless-subscriptions-with-expo-and-revenuecat
- `F5-A4` İş akışı otomasyonu: n8n kendi bilgisayarında (Docker) →
  https://docs.n8n.io/hosting/ · karşılaştırma (üçüncü taraf):
  https://automationatlas.io/answers/make-vs-zapier-vs-n8n-2026/
- `F5-A5` Rutinlerin API ve GitHub tetikleyicileri (tekrar) →
  https://code.claude.com/docs/en/routines

**Otomasyon aracı seçimi (öğrenci için):**

| Araç | Ücretsiz kullanım (2026 ortası, üçüncü taraf verisi; kontrol et) | Ne zaman |
|---|---|---|
| **Claude Code rutinleri** | Pro'da var, ek ücret yok (kullanım limitini paylaşır) | İlk tercih. Zaten kullanıyorsun; Claude'un akıl yürütmesi gereken işler |
| **n8n (Community Edition, kendi sunucunda)** | Ücretsiz, çalıştırma sınırı yok; Docker ya da VPS gerekir | Webhook ve çok adımlı entegrasyon öğrenmek için. Lokal Docker yeterli |
| **Make** | Ayda 1.000 işlem, 2 aktif senaryo | Kod yazmadan hızlı bağlantı gerekirse |
| **Zapier** | Ayda 100 görev | Öğrenci için en kısıtlı seçenek. Gerek yok |

**C · Lab:** 1 otomasyon kur. Örnek: "Haftalık uygulama raporu". Yorumlar ya da form
cevapları → sınıflandırıcı (F3) → özet → Gmail taslağı. Rutin ya da n8n ile yap.
Diğeri opsiyonel.

**B · Proje**
- Production yayını (önce Google Play).
- **Gelir karar kapısı:** Test kullanıcılarında somut bir sinyal varsa (ör. 4. haftada
  hâlâ düzenli kullanan bir çekirdek grup, "ödeme olsa öderdim" lafı değil, davranış)
  ödeme duvarını (paywall) önce sandbox'ta dene. Sinyal yoksa uygulama ücretsiz
  kalır. Kişisel araç ve portföy olarak devam eder. Bu da geçerli bir sonuç.
- Gelir başlamadan önce Türkiye'deki vergi yükümlülüğünü bir mali müşavire ya da
  resmi kaynağa sor.

**Kanıt:** 31 Temmuz: mağazada yayında. 31 Ağustos: otomasyon 4 hafta kesintisiz
çalıştı + gelir kararı yazılı.

---

### F6 · (Opsiyonel) Makine mühendisliği köprüsü
**Eylül 2027 ve sonrası. Takımın ihtiyacı doğarsa daha erken.**

Solar Team rehberinin 12. bölümüyle aynı hat (`solar-team/mekanik-muhendis-rehberi.md`
§12.4). Takımın yol haritası coast-down aracını Ocak–Mart 2027'ye koyuyor. O iş
takım zamanında yapılırsa Claude Code ile yap ve öğrendiklerini buraya kanıt olarak
yaz.

| Proje | Ne öğretir | Kaynak |
|---|---|---|
| Coast-down analiz aracı (CSV → CdA, Crr + belirsizlik) | pandas, eğri uydurma, birim testleri | Rehber §2.5 ve §12.4 |
| Tur simülatörü (`enerji_butcesi.py` genişletme) | Parametrik model, senaryo karşılaştırma | Rehber §12.4 |
| PyMAPDL ile parametrik tarama (braket kalınlığı → kütle–gerilme eğrisi) | Simülasyon otomasyonu | https://ansys.com/training-center/course-catalog/structures/getting-started-with-pymapdl |
| Vekil model (surrogate): tarama sonuçlarından kriging ile gerilme tahmini | Veri odaklı mühendislik | https://smt.readthedocs.io/ · https://databookuw.com/ (kitap ücretli; sitede ders videoları ve kod var) |
| `solar-hesap` MCP sunucusuna yeni araçlar | Mühendislik araçlarını Claude'a açmak | F4 lab |

**Kırmızı çizgi:** Güvenlik açısından kritik hesaplarda (fren, direksiyon, roll bar)
yapay zekâ çıktısı nihai değildir. El hesabı ve kıdemli onayı şarttır.

**Kanıt:** 1 araç + birim testleri + 1 sayfalık vaka çalışması (problem → yöntem →
sonuç → ders).

---

## Haftalık ritim

| Oturum | Tür | Süre | Enerji | İçerik |
|---|---|---|---|---|
| **A** | Öğrenme | 50 dk | derin | Fazın sıradaki A adımı + mini uygulama |
| **B** | Proje | 50 dk | derin / orta | Mobil uygulama (her zaman) |
| **C** | Trend + Lab | 20 + 30 dk | orta | 20 dk trend takibi, 30 dk fazın lab kanıtı |

- Dağılım: ≈%33 öğrenme, ≈%53 inşa etme (B + lab), ≈%13 trend. Bu iz bir
  "yaparak öğrenme" izi.
- **Sıra:** A ve B haftanın ilk yarısında, C hafta sonuna yakın olsun. Haftaya
  öğrenerek başla, haftayı kanıtla kapat.
- **Sınav haftası:** Yalnızca 1 oturum, "B-hafif": küçük hata düzeltme, arayüz
  rötuşu ya da test kullanıcılarına cevap. Trend ve yeni konu yok. Sınavdan önceki
  48 saatte bu iz için oturum yok.
- **Sömestr ve yaz:** İstersen haftada +1 B oturumu. Zorunlu değil.
- **Kaçırılan oturum telafi edilmez.** Bir sonraki hafta oturum sayısı ikiye
  katlanmaz, plan kayar.

---

## 50 dakikalık oturum şablonları

### A · Öğrenme oturumu
| Dakika | Ne yapılır |
|---|---|
| 0–5 | Panodaki `sonraki` adımı ve son `ozet`'i oku. Bugünün tek cümlelik hedefini yaz. |
| 5–30 | Kaynağı aktif oku ya da izle. Her bölümden sonra dur, aynısını kendi reponda dene. Video toplam 25 dakikayı geçmez. |
| 30–45 | Mini uygulama. Öğrendiğin şeyin en küçük çalışan örneği. (Ör. hooks günü: tek satırlık bir hook.) |
| 45–50 | Kendi cümlelerinle 2 cümle açıklama yaz. `/calis yz bitti: ...` ile kaydet. |

### B · Proje oturumu (mobil uygulama)
| Dakika | Ne yapılır |
|---|---|
| 0–5 | Tek görev seç (`sonraki` ya da yapılacaklar listesinin en üstü). "Bitti" tanımını yaz. |
| 5–12 | Claude Code'a plan modunda ver. Planı oku, gereksiz kapsamı kes, onayla. |
| 12–40 | Uygulat ve doğrula. Telefonda ya da emülatörde çalıştır, test et. Anlamadığın değişikliği sor. |
| 40–46 | Commit + 1 satırlık sürüm notu. |
| 46–50 | Bir sonraki görevi 10–25 dakikalık somut bir eylem olarak yaz. Kaydet. |

### C · Trend + Lab oturumu
| Dakika | Ne yapılır |
|---|---|
| 0–20 | Trend listesini sırayla tara (bkz. Trend takibi). Çıktı tek satır: "Denemeye değer: X" ya da "Bu hafta yok". |
| 20–45 | Lab: Fazın kanıt çıktısı (skill, hook, MCP aracı, otomasyon). Çalışır hâle getir. |
| 45–50 | Kanıtı `kanitlar.md`'ye ve panoya yaz. Bir sonraki lab adımını belirle. |

---

## Kaynak kütüphanesi

Ücretsiz kaynaklar önce. "Süre" kabaca hesaplanmıştır.

### Claude Code
| Ad | Link | Tür | Dil | Neden | Süre / ücret |
|---|---|---|---|---|---|
| Claude Code en iyi pratikler | https://code.claude.com/docs/en/best-practices | Resmi doküman | EN | Tüm izin temeli | 30–45 dk · ücretsiz |
| CLAUDE.md ve hafıza | https://code.claude.com/docs/en/memory | Resmi doküman | EN | Proje talimatları | 20 dk · ücretsiz |
| Claude Code'u genişletmek (ne zaman ne kullanılır) | https://code.claude.com/docs/en/features-overview | Resmi doküman | EN | Skill, hook, subagent, MCP ve plugin arasında seçim | 20 dk · ücretsiz |
| Skills | https://code.claude.com/docs/en/skills | Resmi doküman | EN | Kendi komutların | 30 dk · ücretsiz |
| Hooks rehberi | https://code.claude.com/docs/en/hooks-guide | Resmi doküman | EN | Otomatik kontrol ve koruma | 30 dk · ücretsiz |
| Subagents | https://code.claude.com/docs/en/sub-agents | Resmi doküman | EN | Bağlamı korumak, uzman ajan | 25 dk · ücretsiz |
| MCP (Claude Code'da) | https://code.claude.com/docs/en/mcp | Resmi doküman | EN | Dış araçlara bağlanma | 30 dk · ücretsiz |
| Komutlar | https://code.claude.com/docs/en/commands | Başvuru | EN | Slash komutları | gerektikçe |
| Bulutta Claude Code | https://code.claude.com/docs/en/claude-code-on-the-web | Resmi doküman | EN | Telefondan ve buluttan çalışma (Pro'da var) | 20 dk · ücretsiz |
| Rutinler | https://code.claude.com/docs/en/routines | Resmi doküman | EN | Zamanlanmış otomasyon (Pro'da var) | 25 dk · ücretsiz |
| Maliyet yönetimi | https://code.claude.com/docs/en/costs | Resmi doküman | EN | Bağlamı ve limitleri yönetmek | 20 dk · ücretsiz |
| Plugin'ler | https://code.claude.com/docs/en/plugins/overview | Resmi doküman | EN | Kurulumunu paketlemek | 15 dk · ücretsiz |
| Anthropic Academy (Claude Code in Action, Building with the Claude API, Introduction to MCP, MCP Advanced Topics) | https://www.anthropic.com/learn · https://anthropic.skilljar.com/ | Video kurs + sınav | EN | Resmi, sırayla, sertifikalı | kurs başına ≈1–2 sa · ücretsiz |
| Claude Code: A Highly Agentic Coding Assistant (DeepLearning.AI × Anthropic) | https://deeplearning.ai/short-courses/claude-code-a-highly-agentic-coding-assistant | Video kurs | EN | Örnek projelerle ikinci bakış (opsiyonel) | ≈1 sa 50 dk · genelde ücretsiz (koşulları kontrol et) |
| anthropics/skills | https://github.com/anthropics/skills | Örnek repo | EN | Gerçek SKILL.md örnekleri | gerektikçe · ücretsiz |

### Claude API, ajanlar, MCP
| Ad | Link | Tür | Dil | Neden | Süre / ücret |
|---|---|---|---|---|---|
| Claude Developer Platform başlangıç | https://platform.claude.com/docs/en/get-started | Resmi doküman | EN | İlk API çağrısı | 20 dk · API kredisi |
| Prompt mühendisliği | https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview | Resmi doküman | EN | Talimat yazma tekniği | 45 dk · ücretsiz |
| anthropics/courses (API temelleri, prompt öğreticisi, gerçek dünya prompt'ları, prompt eval, tool use) | https://github.com/anthropics/courses | Jupyter dersleri | EN | Resmi, uygulamalı, sıralı | toplam ≈15–20 sa · API maliyeti düşük |
| Claude Cookbooks (eski adı anthropic-cookbook) | https://github.com/anthropics/claude-cookbooks | Tarif notebook'ları | EN | RAG, tool use, sınıflandırma örnekleri | gerektikçe · ücretsiz |
| Araç kullanımı (tool use) | https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview | Resmi doküman | EN | Ajanların temeli | 40 dk · ücretsiz |
| Yapılandırılmış çıktı | https://platform.claude.com/docs/en/build-with-claude/structured-outputs | Resmi doküman | EN | Güvenilir JSON | 20 dk · ücretsiz |
| Building effective agents | https://www.anthropic.com/engineering/building-effective-agents | Mühendislik yazısı | EN | Ne zaman ajan, ne zaman iş akışı | 30 dk · ücretsiz |
| Effective context engineering | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | Mühendislik yazısı | EN | Bağlamı tasarlamak | 30 dk · ücretsiz |
| Writing tools for agents | https://www.anthropic.com/engineering/writing-tools-for-agents | Mühendislik yazısı | EN | İyi araç tasarımı (MCP için şart) | 30 dk · ücretsiz |
| Agent Skills yazısı | https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills | Mühendislik yazısı | EN | Skill'lerin mantığı | 20 dk · ücretsiz |
| Agent SDK | https://code.claude.com/docs/en/agent-sdk/overview | Resmi doküman | EN | Claude Code'u kütüphane olarak kullanmak | 30 dk · API kredisi |
| claude-agent-sdk-python | https://github.com/anthropics/claude-agent-sdk-python | Kod | EN | Python örnekleri | gerektikçe |
| MCP sunucusu yazma öğreticisi | https://modelcontextprotocol.io/docs/develop/build-server | Resmi öğretici | EN | İlk MCP sunucun (Python veya TS) | 1–2 sa · ücretsiz |
| MCP referans sunucuları | https://github.com/modelcontextprotocol/servers | Kod | EN | Gerçek sunucu örnekleri | gerektikçe |

### Temeller (hafif)
| Ad | Link | Tür | Dil | Neden | Süre / ücret |
|---|---|---|---|---|---|
| Python for Everybody | https://www.py4e.com | Kurs + kitap | EN | Python'u sıfırdan, ücretsiz | ihtiyaç kadar · ücretsiz |
| Generative AI for Beginners (Microsoft, 21 ders) | https://github.com/microsoft/generative-ai-for-beginners/blob/main/translations/tr/README.md | Ders repo | **TR** çeviri + EN | LLM kavramları Türkçe. Kod örnekleri OpenAI/Azure ile; kavramlar Claude'a aktarılır | ders başına ≈30–60 dk · ücretsiz |
| AI Agents for Beginners (Microsoft) | https://github.com/microsoft/ai-agents-for-beginners/blob/main/translations/tr/README.md | Ders repo | **TR** çeviri + EN | Ajan kavramlarına ikinci kaynak (opsiyonel) | ücretsiz |
| Bağlam penceresi | https://platform.claude.com/docs/en/build-with-claude/context-windows | Resmi doküman | EN | Token ve bağlam sınırı | 15 dk · ücretsiz |
| Model seçimi | https://platform.claude.com/docs/en/about-claude/models/choosing-a-model | Resmi doküman | EN | Maliyet ve kalite dengesi | 15 dk · ücretsiz |
| Fiyatlandırma | https://platform.claude.com/docs/en/about-claude/pricing | Resmi doküman | EN | Maliyet hesabı | 10 dk · ücretsiz |
| Prompt caching | https://platform.claude.com/docs/en/build-with-claude/prompt-caching | Resmi doküman | EN | Tekrarlanan girdiyi ucuzlatmak | 15 dk · ücretsiz |
| Eval kurmak | https://platform.claude.com/docs/en/test-and-evaluate/develop-tests | Resmi doküman | EN | Başarı ölçütü + test seti | 30 dk · ücretsiz |
| "Your AI Product Needs Evals" özeti (Hamel Husain) | https://simonwillison.net/2024/Mar/31/your-ai-product-needs-evals/ | Blog | EN | Eval'in neden şart olduğu | 15 dk · ücretsiz |
| LLM Course (mlabonne) | https://github.com/mlabonne/llm-course | Yol haritası | EN | "LLM Engineer" bölümü. "Scientist" kısmı bu iz için gerekmez | seçmeli · ücretsiz |
| Neural Networks: Zero to Hero (Karpathy) | https://karpathy.ai/zero-to-hero.html · https://github.com/karpathy/nn-zero-to-hero | Video + notebook | EN | Derin anlayış. 8 ders, opsiyonel | ders başına 1–2+ sa · ücretsiz |

### Mobil uygulama ve ürün
| Ad | Link | Tür | Dil | Neden | Süre / ücret |
|---|---|---|---|---|---|
| Expo öğreticisi | https://docs.expo.dev/tutorial/overview/ | Resmi öğretici | EN | Android, iOS ve web için uygulama | 3–5 sa · ücretsiz |
| Expo "Build with AI" | https://docs.expo.dev/tutorial/build-with-ai/create-your-first-app | Resmi öğretici | EN | Ajanla uygulama kurma | 1 sa · ücretsiz |
| Expo MCP sunucusu | https://expo.dev/blog/become-an-ai-native-developer-with-the-expo-mcp-server | Resmi blog | EN | Claude Code'a güncel Expo dokümanı ve simülatör erişimi (önizleme; bazı özellikler için plan şartını kontrol et) | 15 dk |
| Mağazaya gönderme (EAS Submit) | https://docs.expo.dev/deploy/submit-to-app-stores/ | Resmi doküman | EN | App Store ve Google Play adımları | 30 dk · ücretsiz |
| Expo uygulama içi satın alma | https://docs.expo.dev/guides/in-app-purchases/ | Resmi doküman | EN | IAP seçenekleri; development build şart | 20 dk · ücretsiz |
| RevenueCat Expo öğreticisi | https://revenuecat.com/blog/expo-in-app-purchase-tutorial | Öğretici | EN | Abonelik ve paywall kurulumu | 1–2 sa · RevenueCat fiyatını kayıtta kontrol et |
| Expo + RevenueCat abonelikler | https://expo.dev/blog/how-to-build-seamless-subscriptions-with-expo-and-revenuecat | Resmi blog | EN | Uçtan uca abonelik akışı | 30 dk |
| Flutter öğrenme yolu (alternatif) | https://docs.flutter.dev/learn | Resmi doküman | EN | Flutter seçilirse | ücretsiz |
| Google Play test şartı (12 kişi, 14 gün) | https://support.google.com/googleplay/android-developer/answer/14151465 | Resmi yardım | EN | Takvimi belirleyen kural | 10 dk |
| Google Play hizmet bedelleri | https://support.google.com/googleplay/android-developer/answer/10632485 | Resmi yardım | EN | %15 kademe | 10 dk |
| Apple Developer Program | https://developer.apple.com/programs/ | Resmi sayfa | EN | 99 $/yıl; TestFlight ile 10.000'e kadar dış test kullanıcısı | 10 dk |
| Apple Small Business Program | https://developer.apple.com/app-store/small-business-program/ | Resmi sayfa | EN | %15 komisyon | 10 dk |
| RevenueCat State of Subscription Apps 2026 | https://www.revenuecat.com/state-of-subscription-apps | Rapor | EN | Gerçekçi gelir beklentisi | 30 dk (özet) · ücretsiz |
| YC: How to build an MVP | https://ycombinator.com/library/Io-how-to-build-an-mvp | Video | EN | MVP kapsamını küçültmek | kısa · ücretsiz |
| YC Startup School | https://startupschool.org/ | Kurs | EN | Ürün ve kullanıcı bulma (opsiyonel) | seçmeli · ücretsiz |
| The Mom Test (Rob Fitzpatrick) | https://www.simonandschuster.com.au/books/The-Mom-Test/Rob-Fitzpatrick/9798893312560 | Kitap | EN | Kullanıcı görüşmesinde dürüst cevap almak | kısa kitap · ücretli |

### Otomasyon ve mühendislik köprüsü
| Ad | Link | Tür | Dil | Neden | Süre / ücret |
|---|---|---|---|---|---|
| n8n kendi sunucunda kurulum | https://docs.n8n.io/hosting/ | Resmi doküman | EN | Ücretsiz Community Edition | 1 sa · ücretsiz (Docker) |
| Make / Zapier / n8n karşılaştırması | https://automationatlas.io/answers/make-vs-zapier-vs-n8n-2026/ | Üçüncü taraf | EN | Fiyat ve özellik özeti; satın almadan önce kontrol et | 10 dk |
| Getting Started with PyMAPDL (Ansys) | https://ansys.com/training-center/course-catalog/structures/getting-started-with-pymapdl | Kurs | EN | Python ile Ansys otomasyonu | kendi hızında; Ansys Student ücretsiz |
| SMT: Surrogate Modeling Toolbox | https://smt.readthedocs.io/ | Kütüphane dokümanı | EN | Kriging ve vekil modeller | gerektikçe · ücretsiz |
| Data-Driven Science and Engineering (Brunton & Kutz) | https://databookuw.com/ | Kitap sitesi | EN | Mühendislikte makine öğrenmesi | kitap ücretli; video ve kod ücretsiz |

---

## Trend takibi

**Haftada 1 kez, C oturumunun ilk 20 dakikası. 20 dakikayı geçmez.** Sırayla tara,
bitince kapat.

| Sıra | Kaynak | Link | Süre |
|---|---|---|---|
| 1 | Claude Code değişiklik günlüğü | https://code.claude.com/docs/en/changelog | 5 dk |
| 2 | Anthropic haberleri + mühendislik blogu | https://www.anthropic.com/news · https://www.anthropic.com/engineering | 5 dk |
| 3 | Claude Developer Platform sürüm notları | https://platform.claude.com/docs/en/release-notes/overview | 2 dk |
| 4 | Expo blogu (Flutter seçildiyse Flutter dokümanı) | https://expo.dev/blog | 3 dk |
| 5 | Haftaya göre sırayla: Simon Willison'ın blogu ya da The Batch bülteni | https://simonwillison.net/ · https://deeplearning.ai/the-batch/about | 5 dk |

**Kurallar**
- Çıktı tek satır: "Denemeye değer: X (neden)" ya da "Bu hafta yok".
- Ayda en fazla **1 yeni araç** denenir. Deneme, lab oturumuna görev olarak girer.
  Trend süresinde denenmez.
- Bülten aboneliklerini e-postada ayrı bir etikete topla. Gün içinde okuma.

---

## AI özet ve tavsiye kuralları

`/calis yz` oturumu kapanırken Claude şunları üretir:

**1. Oturum özeti (en fazla 6 satır, telefonda okunacak)**
1. **Öğrenilen:** 2–3 madde.
2. **Kanıt:** Ne üretildi, nerede (dosya yolu ya da link). Kanıt yoksa "yok" yazar.
3. **Düzeltme / uyarı:** Hatalı anlaşılan kavram ya da riskli kod (ör. API anahtarı
   repoda).
4. **Sonraki adım:** Adım kodu + 10–25 dakikalık ilk fiziksel eylem.
   Ör. "`F1-C2`: `.claude/settings.json`'a PostToolUse hook'u ekle, bir dosya
   düzenleyip lint'in çalıştığını gör."
5. **Hafta:** `X / 150 dk`, oturum türleri (A/B/C).

**2. Panoya yazılacaklar (`izler/yz`)**
- `oturumlar` ← `{tarih, dk, not}`. `not` alanı oturum türünü içerir: `"B: giriş ekranı bitti"`.
- `sonraki` ← `A:F?-A? · B:F?-B? · C:F?-C?`
- `faz` ← `F0` … `F6`. Yalnızca kanıt varsa ilerletilir.
- `ilerleme` önerilen yapı:
  ```json
  {
    "kanitlar": [{"tarih": "2026-11-01", "faz": "F1", "ad": "ilk skill /surum-notu", "yer": "uygulama-repo/.claude/skills/surum-notu"}],
    "uygulama": {"surum": "v0.1", "test_kullanici": 0, "aktif_2hafta": 0, "magaza": "yok"},
    "api_harcama_usd": 0,
    "dagilim_dk": {"ogrenme": 0, "proje": 0, "lab": 0, "trend": 0}
  }
  ```
- `ozet` ← 1. maddedeki özet.

**3. Tavsiye kuralları**
- **Denge:** 10 gündür B (proje) oturumu yoksa sıradaki oturum B'dir.
- **Tüketim alarmı:** Arka arkaya 2 A oturumu mini uygulama olmadan bittiyse,
  sıradaki A oturumu bir şey inşa ederek bitmek zorunda.
- **Anlatabiliyor musun?** Her A oturumunda kullanıcıdan bir kavramı 2 cümleyle
  açıklamasını iste. Açıklayamıyorsa konu "öğrenildi" sayılmaz, sonraki oturumda
  alıştırmayla tekrar edilir. Aynı kural B'de de geçerli: Claude Code'un yazdığı
  önemli bir değişikliği açıklayamıyorsa, Claude açıklasın ve kullanıcı küçük bir
  değişikliği kendisi yapsın.
- **Faz aşımı:** Faz 2 haftadan fazla gecikirse dürüst söyle ve 3 seçenek sun:
  kapsamı küçült, süreyi uzat, adımı bırak.
- **Sınav dönemi:** Önce dersleri hatırlat. Yalnızca "B-hafif" öner.
- **Link:** Yalnızca bu dosyadaki linkleri ver. Yeni kaynak gerekirse WebSearch ile
  bul, doğrula, sonra bu dosyaya ekle.
- **Maliyet:** API kullanıldıysa tahmini harcamayı `api_harcama_usd`'ye ekle.
- **Ayın son oturumu:** 5 satırlık ay özeti + CV/LinkedIn için tek cümlelik
  "bu ay ne inşa ettim" cümlesi.
- **Gelir konuşması:** Kullanıcı gelir beklentisini abartırsa RevenueCat verisini
  hatırlat (%17 / %4,6). Ama hevesini kırma. Kontrol edilebilir bir sonraki adımı
  göster.

---

## İlerleme ölçümü

| Ölçü | Hedef | Nerede |
|---|---|---|
| Haftalık süre | 150 dk (sınav haftasında 50 dk) | `oturumlar` |
| İnşa oranı | Sürenin en az %50'si B + lab | `dagilim_dk` |
| Kanıt sayısı | Her fazda en az 1 çalışan çıktı | `kanitlar` |
| Uygulama | Sürüm, test kullanıcısı, 2. hafta tutunma, mağaza durumu | `uygulama` |
| API maliyeti | Öğrenme aşamasında aylık 5 $ altı | `api_harcama_usd` |
| "Göster-anlat" | Ayda 1 kez birine 5 dakikada çalışan bir şey göster | `ozet` |

**Değerlendirme tarihleri** (haftalık planlama rutininde hatırlatılır):
6 Aralık 2026 · 31 Ocak 2027 · 31 Mart 2027 · 31 Mayıs 2027 · 31 Ağustos 2027 · Ekim 2027 (yıllık).

Her değerlendirmede 3 soru:
1. Hangi kanıt çıktısı gerçekten **kullanılıyor**?
2. Plan nerede kaydı ve neden? (Süre mi, kapsam mı, motivasyon mu?)
3. Bir sonraki dönem için neyi bırakıyorum?

---

## Riskler ve tavsiyeler

| Risk | Belirti | Önlem |
|---|---|---|
| **Öğretici videolarda kaybolmak** | Kurs ilerliyor, repo değişmiyor | Video oturumun yarısını geçmez. Aynı anda tek kurs. Hedef kurs bitirmek değil, kanıt üretmek. "20 dk izle, 20 dk yap." |
| **Projeyi bitirmemek** | Sürekli yeni özellik ya da yeni proje fikri | Tek temel akış. Kapalı testten önce özellik dondurma. Yeni fikirler `sonra.md`'ye. Aynı anda tek ana proje. |
| **Derslerle çakışma** | Vize haftasında YZ oturumu, ders geride | Öncelik sırası tartışılmaz. Sınav haftası tek oturum, sınavdan önceki 48 saat sıfır. Kaçan oturum telafi edilmez. |
| **Parlak nesne sendromu** | Her hafta yeni araç ya da model deneniyor | Trend 20 dk. Ayda en fazla 1 deneme. |
| **Anlamadan kabul etmek** | Claude Code'un yazdığını açıklayamamak | "Anlatabiliyor musun?" kuralı. Testler. Diff'i okumadan commit yok. |
| **Gelir hayal kırıklığı** | "Para gelmiyor, bırakayım" | Hedefler yayın, kullanıcı ve öğrenme üzerine kurulu. Gelir bonus. Önce kullanım, sonra ödeme. |
| **Gereksiz harcama** | Ücretli araçlara erken abonelik | Önce ücretsiz katman. Android ile başla (25 $ tek sefer). Apple'ın 99 $'ını iOS kullanıcısı talebi görünce öde. API'de harcama limiti. |
| **Güvenlik ve gizlilik** | API anahtarı repoda ya da uygulamada; test kullanıcısının kişisel verisi | Anahtar `.env` + `.gitignore`. Uygulamada anahtar yok, araya backend. En az veri topla. KVKK'ya uygun bir gizlilik politikası yaz. |
| **Pro kullanım limiti** | Rutinler ve uzun ajan döngüleri limiti bitiriyor | Rutin haftada 1. `/usage` ile kontrol et. Ağır işi limit sıfırlanmadan önceki güne koyma. |
| **Takım verisi** | Takımın CAD'i ya da sponsor bilgisi harici araçta | Solar Team rehberi §12.2 kırmızı çizgileri. `solar-hesap` sunucusu yalnızca açık hesap araçlarını içerir. |
| **Tükenmişlik** | Üst üste kaçan haftalar, suçluluk | Bu iz 2. öncelik. Bir hafta boş geçebilir. Plan kayar, telafi yok. |

---

## Doğrulama notu

- **Doğrudan erişimle doğrulananlar (12 Ekim 2026):** `code.claude.com`,
  `platform.claude.com`, `anthropic.com` (engineering, news; `learn` adresi
  `academy.claude.com`'a yönleniyor) sayfaları ve
  `developer.apple.com` sayfaları. GitHub repoları (`anthropics/courses`,
  `anthropics/claude-cookbooks`, `anthropics/skills`,
  `anthropics/claude-agent-sdk-python`, `modelcontextprotocol/servers`,
  `microsoft/generative-ai-for-beginners`, `microsoft/ai-agents-for-beginners`,
  `mlabonne/llm-course`, `karpathy/nn-zero-to-hero`) README'leri okunarak
  doğrulandı. Microsoft repolarındaki Türkçe çeviri sayfaları da açılıyor.
  `anthropics/anthropic-cookbook` adresi `claude-cookbooks` reposuna
  yönleniyor.
- **Web aramasında görülerek doğrulananlar:** Expo, Flutter, RevenueCat, Google Play
  yardım, n8n, DeepLearning.AI, Skilljar, MCP, YC, py4e, Karpathy, Simon Willison,
  The Batch, Ansys, SMT ve databookuw sayfaları.
- **Eklenmeyenler:** BTK Akademi (Türkçe, ücretsiz Python ve yapay zekâ eğitimleri
  olduğu haberlerde geçiyor) ve 3Blue1Brown. Arama kotası dolduğu için linkleri
  doğrulanamadı. Eklemeden önce WebSearch ile doğrula.
- **Değişebilecek bilgiler:** Fiyatlar (Claude API, Apple, Google, Make, Zapier),
  Google Play test şartı ve Anthropic Academy'deki kurs listesi. Karar vermeden önce
  ilgili sayfayı yeniden kontrol et.
