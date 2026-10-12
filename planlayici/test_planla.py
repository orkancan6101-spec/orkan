"""planla.py testleri. Çalıştır: python3 -m unittest planlayici/test_planla.py -v"""
import json
import sys
import tempfile
import unittest
from datetime import date, datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import planla as p  # noqa: E402

SIMDI = datetime(2026, 10, 12, 8, 0)  # Pazartesi sabahı
PAZARTESI = date(2026, 10, 12)


def ornek_gorevler():
    return [
        {"id": "odev", "baslik": "Mukavemet ödevi", "durum": "aktif", "onem": 4,
         "son_tarih": "2026-10-14", "tahmin_dk": 180, "enerji": "derin"},
        {"id": "rapor", "baslik": "Takım tasarım raporu", "durum": "aktif", "onem": 5,
         "son_tarih": "2026-10-13T12:00", "tahmin_dk": 600, "enerji": "derin"},
        {"id": "spor", "baslik": "Koşu", "durum": "aktif", "onem": 2, "tahmin_dk": 45, "enerji": "hafif"},
        {"id": "proje", "baslik": "Fren diski analizi", "durum": "aktif", "onem": 4, "son_tarih": "2026-10-30"},
        {"id": "fea", "baslik": "FEA modelini kur", "durum": "aktif", "ust_id": "proje",
         "tahmin_dk": 120, "bagimli": ["odev"], "enerji": "derin"},
        {"id": "fikir", "baslik": "Staj başvurularına bak", "durum": "gelen"},
        {"id": "eski", "baslik": "Eski iş", "durum": "tamamlandi", "tahmin_dk": 60, "gercek_dk": 120},
    ]


def dakika_araligi(b):
    return p.dk(b["bas"]), p.dk(b["bit"])


class KatsayiTesti(unittest.TestCase):
    def test_veri_yoksa_varsayilan(self):
        k, _ = p.tahmin_katsayisi([], p.profil_hazirla({}))
        self.assertEqual(k, 1.5)

    def test_bes_gorevden_ogrenir_ve_sinirlar(self):
        gorevler = [{"durum": "tamamlandi", "tahmin_dk": 60, "gercek_dk": 120} for _ in range(5)]
        self.assertEqual(p.tahmin_katsayisi(gorevler, p.profil_hazirla({}))[0], 2.0)
        asiri = [{"durum": "tamamlandi", "tahmin_dk": 10, "gercek_dk": 100} for _ in range(5)]
        self.assertEqual(p.tahmin_katsayisi(asiri, p.profil_hazirla({}))[0], 3.0)

    def test_profil_sabitlerse_o_kullanilir(self):
        self.assertEqual(p.tahmin_katsayisi([], p.profil_hazirla({"tahmin_katsayisi": 1.2}))[0], 1.2)


class OncelikTesti(unittest.TestCase):
    def setUp(self):
        self.profil = p.profil_hazirla({})
        self.sirali, self.k = p.oncelik_listesi(ornek_gorevler(), self.profil, SIMDI)
        self.r = {r["id"]: r for r in self.sirali}

    def test_yetismeyen_is_en_ustte_ve_kadran_1(self):
        self.assertEqual(self.sirali[0]["id"], "rapor")
        self.assertEqual(self.r["rapor"]["aciliyet"], 5)
        self.assertEqual(self.r["rapor"]["kadran"], 1)
        self.assertTrue(any("YETİŞMEZ" in n for n in self.r["rapor"]["nedenler"]))

    def test_onemsiz_ve_acil_olmayan_kadran_4(self):
        self.assertEqual(self.r["spor"]["kadran"], 4)

    def test_ust_gorev_listelenmez_alt_gorev_miras_alir(self):
        self.assertNotIn("proje", self.r)
        self.assertEqual(self.r["fea"]["son_tarih"], "2026-10-30")
        self.assertEqual(self.r["fea"]["onem"], 4)

    def test_bagimlilik_bloke_eder(self):
        self.assertTrue(self.r["fea"]["bloke"])
        self.assertIn("1 görevi bekletiyor", " ".join(self.r["odev"]["nedenler"]))

    def test_kapali_gorevler_haric(self):
        self.assertNotIn("eski", self.r)


class EdfTesti(unittest.TestCase):
    def test_kapasite_asimini_bulur(self):
        satirlar = p.edf_kontrol(ornek_gorevler(), p.profil_hazirla({}), SIMDI)
        rapor = next(s for s in satirlar if s["id"] == "rapor")
        self.assertEqual(rapor["durum"], "yetişmez")
        self.assertGreater(rapor["acik_dk"], 0)
        # Kümülatif yük son tarihe göre artar
        self.assertEqual([s["kumulatif_dk"] for s in satirlar], sorted(s["kumulatif_dk"] for s in satirlar))

    def test_bol_zamanda_rahat(self):
        gorevler = [{"id": "a", "baslik": "Kısa iş", "durum": "aktif", "son_tarih": "2026-10-20", "tahmin_dk": 30}]
        self.assertEqual(p.edf_kontrol(gorevler, p.profil_hazirla({}), SIMDI)[0]["durum"], "rahat")


class GunPlaniTesti(unittest.TestCase):
    def setUp(self):
        self.profil = p.profil_hazirla({
            "haftalik_sabitler": [{"gun": "pazartesi", "bas": "10:00", "bit": "12:00", "baslik": "Makine Elemanları"}],
        })
        self.mesgul = [(datetime(2026, 10, 12, 14, 0), datetime(2026, 10, 12, 15, 0), "Solar toplantı")]
        self.plan = p.gun_plani(ornek_gorevler(), self.profil, PAZARTESI, SIMDI, self.mesgul)
        self.odak = [b for b in self.plan["bloklar"] if b["tur"] == "odak"]

    def test_bloklar_cakismaz_ve_pencere_icinde(self):
        araliklar = sorted(dakika_araligi(b) for b in self.odak)
        for (s1, b1), (s2, _) in zip(araliklar, araliklar[1:]):
            self.assertLessEqual(b1, s2)
        pencereler = [(p.dk(a), p.dk(b)) for a, b in self.profil["calisma_pencereleri"]["hafta_ici"]]
        for s, b in araliklar:
            self.assertTrue(any(ps <= s and b <= pb for ps, pb in pencereler), (s, b))

    def test_ders_ve_toplantiyla_cakismaz(self):
        engeller = [(p.dk("10:00"), p.dk("12:00")), (p.dk("14:00"), p.dk("15:00"))]
        for b in self.odak:
            for e in engeller:
                self.assertEqual(p.ortusme(dakika_araligi(b), e), 0, b)

    def test_kapasite_ve_derin_siniri_asilmaz(self):
        self.assertLessEqual(self.plan["ozet"]["planlanan_dk"], self.plan["ozet"]["kapasite_dk"])
        self.assertLessEqual(self.plan["ozet"]["derin_dk"], self.profil["gunluk_derin_limit_dk"])
        for b in self.odak:
            self.assertLessEqual(p.dk(b["bit"]) - p.dk(b["bas"]), self.profil["blok_dk"])

    def test_derin_is_zirvede_baslar(self):
        ilk_derin = min((b for b in self.odak if b["enerji"] == "derin"), key=lambda b: b["bas"])
        self.assertGreaterEqual(p.dk(ilk_derin["bas"]), p.dk("09:00"))
        self.assertLess(p.dk(ilk_derin["bas"]), p.dk("12:30"))

    def test_bloke_ve_gelen_planlanmaz(self):
        idler = {b["gorev_id"] for b in self.odak}
        self.assertNotIn("fea", idler)
        self.assertNotIn("fikir", idler)
        self.assertIn("fikir", self.plan["analiz_bekleyen"])

    def test_yetismeyen_is_icin_uyari_ve_mit(self):
        self.assertEqual(self.plan["mit"][0], "rapor")
        self.assertTrue(any("yetişmiyor" in u for u in self.plan["uyarilar"]))

    def test_gun_icinde_baslarsa_gecmis_saat_kullanilmaz(self):
        ogle = datetime(2026, 10, 12, 16, 7)
        plan = p.gun_plani(ornek_gorevler(), self.profil, PAZARTESI, ogle, self.mesgul)
        for b in plan["bloklar"]:
            if b["tur"] == "odak":
                self.assertGreaterEqual(p.dk(b["bas"]), p.dk("16:10"))

    def test_gecmis_gun_reddedilir(self):
        with self.assertRaises(ValueError):
            p.gun_plani(ornek_gorevler(), self.profil, date(2026, 10, 11), SIMDI)


class RutinVeSinavModuTesti(unittest.TestCase):
    def setUp(self):
        self.profil = p.profil_hazirla({
            "haftalik_sabitler": [
                {"gun": ["pazartesi", "sali", "persembe"], "bas": "14:00", "bit": "14:50",
                 "baslik": "SolidWorks", "tur": "rutin", "iz": "solidworks", "enerji": "derin"},
                {"gun": "her_gun", "bas": "21:30", "bit": "21:55", "baslik": "Almanca",
                 "tur": "rutin", "iz": "almanca", "sinavda": False},
                {"gun": "pazartesi", "bas": "09:00", "bit": "12:00", "baslik": "Ders: MEC.DES.", "tur": "ders"},
            ],
            "sinav_donemleri": [{"bas": "2026-11-09", "bit": "2026-11-15"}],
        })

    def test_gun_listesi_ve_her_gun_eslesir(self):
        pzt = [s["baslik"] for s in p.gun_sabitleri(self.profil, PAZARTESI)]
        self.assertEqual(sorted(pzt), ["Almanca", "Ders: MEC.DES.", "SolidWorks"])
        carsamba = [s["baslik"] for s in p.gun_sabitleri(self.profil, date(2026, 10, 14))]
        self.assertEqual(carsamba, ["Almanca"])

    def test_rutinler_kapasiteden_dusulur(self):
        bos = p.profil_hazirla({})
        serbest = p.gun_serbest(self.profil, PAZARTESI, [])
        self.assertEqual(p.gun_kapasitesi(self.profil, PAZARTESI, serbest),
                         p.gun_kapasitesi(bos, PAZARTESI, p.gun_serbest(bos, PAZARTESI, [])) - 75)

    def test_kirintili_blok_ve_gece_derin_is_yok(self):
        gorevler = [{"id": "sw", "baslik": "SolidWorks", "durum": "aktif", "onem": 5, "son_tarih": "2026-10-18",
                     "tahmin_dk": 300, "zaman_kutusu": True, "enerji": "derin"}]
        cuma = date(2026, 10, 16)
        plan = p.gun_plani(gorevler, self.profil, cuma, SIMDI)
        for b in plan["bloklar"]:
            if b["tur"] == "odak":
                self.assertGreaterEqual(p.dk(b["bit"]) - p.dk(b["bas"]), 25, b)
                self.assertLess(p.dk(b["bas"]), p.dk("21:00"), b)

    def test_rutinden_sonra_mola_birakilir(self):
        plan = p.gun_plani(ornek_gorevler(), self.profil, PAZARTESI, SIMDI)
        for b in plan["bloklar"]:
            if b["tur"] == "odak":
                self.assertNotEqual(b["bas"], "14:50")

    def test_gecerlilik_araligi_disinda_blok_yok(self):
        profil = p.profil_hazirla({"haftalik_sabitler": [
            {"gun": "persembe", "bas": "09:00", "bit": "09:50", "baslik": "Mukavemet", "tur": "rutin",
             "bit_tarih": "2026-11-22"},
            {"gun": "persembe", "bas": "09:00", "bit": "09:50", "baslik": "Yapay zekâ", "tur": "rutin",
             "bas_tarih": "2026-11-23"}]})
        self.assertEqual([s["baslik"] for s in p.gun_sabitleri(profil, date(2026, 10, 15))], ["Mukavemet"])
        self.assertEqual([s["baslik"] for s in p.gun_sabitleri(profil, date(2026, 11, 26))], ["Yapay zekâ"])

    def test_hafif_rutin_kapasiteden_dusulmez(self):
        profil = p.profil_hazirla({"haftalik_sabitler": [
            {"gun": "her_gun", "bas": "23:00", "bit": "23:30", "tur": "rutin", "iz": "borsa", "enerji": "hafif"}]})
        self.assertEqual(p.rutin_dk(profil, PAZARTESI), 0)

    def test_zaman_kutusuna_katsayi_uygulanmaz(self):
        profil = p.profil_hazirla({})
        self.assertEqual(p.efektif_kalan({"tahmin_dk": 300, "zaman_kutusu": True}, profil, 1.5), 300)
        self.assertEqual(p.efektif_kalan({"tahmin_dk": 300}, profil, 1.5), 450)

    def test_sinav_doneminde_isaretli_rutin_duser(self):
        sinav_pazartesi = date(2026, 11, 9)
        adlar = [s["baslik"] for s in p.gun_sabitleri(self.profil, sinav_pazartesi)]
        self.assertNotIn("Almanca", adlar)
        self.assertIn("SolidWorks", adlar)

    def test_plan_rutin_bloklarini_gosterir_ve_cakistirmaz(self):
        plan = p.gun_plani(ornek_gorevler(), self.profil, PAZARTESI, SIMDI)
        rutinler = [b for b in plan["bloklar"] if b["tur"] == "rutin"]
        self.assertEqual({b["iz"] for b in rutinler}, {"solidworks", "almanca"})
        self.assertEqual(plan["ozet"]["rutin_dk"], 75)
        for b in plan["bloklar"]:
            if b["tur"] == "odak":
                for r in rutinler:
                    self.assertEqual(p.ortusme(dakika_araligi(b), dakika_araligi(r)), 0)
        self.assertLessEqual(plan["ozet"]["derin_dk"], self.profil["gunluk_derin_limit_dk"] - 50)


class SiralamaRaporuTesti(unittest.TestCase):
    def test_rapor_sira_ve_edf_icerir(self):
        rapor = p.siralama_raporu(ornek_gorevler(), p.profil_hazirla({}), SIMDI)
        self.assertEqual(rapor["gorevler"][0]["id"], "rapor")
        self.assertTrue(any(s["durum"] == "yetişmez" for s in rapor["edf"]))
        self.assertEqual(rapor["olusturma"], "2026-10-12T08:00")
        json.dumps(rapor)  # panoya yazılabilir olmalı


class DisariAktarimTesti(unittest.TestCase):
    def test_ics_utc_ve_blok_sayisi(self):
        plan = {"tarih": "2026-10-12", "bloklar": [
            {"bas": "09:00", "bit": "10:30", "tur": "odak", "gorev_id": "a", "baslik": "Ödev, bölüm 1"},
            {"bas": "10:30", "bit": "12:00", "tur": "sabit", "baslik": "Ders"},
        ]}
        ics = p.ics_uret(plan)
        self.assertEqual(ics.count("BEGIN:VEVENT"), 1)
        self.assertIn("DTSTART:20261012T060000Z", ics)
        self.assertIn("SUMMARY:Odak: Ödev\\, bölüm 1", ics)
        self.assertEqual(p.ics_uret(plan, sadece_odak=False).count("BEGIN:VEVENT"), 2)

    def test_artifactdata_dizinini_okur(self):
        with tempfile.TemporaryDirectory() as d:
            (Path(d) / "gorevler").mkdir()
            (Path(d) / "ayarlar").mkdir()
            (Path(d) / "gorevler" / "x1.json").write_text(json.dumps(
                {"id": "x1", "version": 3, "data": {"baslik": "Sarılı belge", "durum": "aktif"}}))
            (Path(d) / "gorevler" / "x2.json").write_text(json.dumps({"baslik": "Düz belge", "durum": "aktif"}))
            (Path(d) / "ayarlar" / "profil.json").write_text(json.dumps({"blok_dk": 50}))
            gorevler, profil = p.yukle(d)
        self.assertEqual({g["id"] for g in gorevler}, {"x1", "x2"})
        self.assertEqual(profil["blok_dk"], 50)
        self.assertEqual(profil["mola_dk"], 10)


if __name__ == "__main__":
    unittest.main()
