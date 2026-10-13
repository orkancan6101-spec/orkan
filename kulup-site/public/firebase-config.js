// Firebase konsolu → Proje ayarları → Genel → Uygulamalarınız → Web uygulaması.
// Bu değerler gizli değildir; erişimi firestore.rules dosyasındaki kurallar korur.
export const firebaseConfig = {
  apiKey: "AIzaSyChR_ToZ621vvzgGAvGYWk0lrL6Eq3ABLA",
  authDomain: "esogu-otomotiv.firebaseapp.com",
  projectId: "esogu-otomotiv",
  storageBucket: "esogu-otomotiv.firebasestorage.app",
  messagingSenderId: "480472317418",
  appId: "1:480472317418:web:987afda058e319ebee0693",
};

// Sitenin asıl adresi. Firebase → Authentication → Settings → Authorized domains
// listesinde bu adres olmalı. Vercel'in başka bir .vercel.app adresinden (örneğin
// yeniden yayınlama sonrası açılan dağıtım adresi) gelen ziyaretçi buraya yönlendirilir;
// çünkü Google ile giriş yalnızca yetkili adreste çalışır.
export const siteAdresi = "https://orkan-kulup-site.vercel.app";
