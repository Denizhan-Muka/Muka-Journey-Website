# Muka Journey — Deneyimin ve Yaratıcılığın Buluşma Noktası

> Gastronomi, sanat ve yaratıcı fikirleri bir araya getiren; sıradanlıktan uzaklaşarak anıları zenginleştiren özgün deneyim tasarım platformu.

---

## 🌟 Proje Hakkında

Muka Journey web sitesi, klasik etkinlik platformu şablonlarının ötesinde, editoryal ve organik bir tasarım diliyle inşa edilmiştir.

### 🎨 Tasarım ve Teknoloji
- **Editoryal Renk Sistemi:** Sıcak ekru (`#FAF7F2`), derin antrasit (`#151312`) ve imza terracotta bordo (`#8E2020`).
- **Tipografi:** Başlıklarda `Cormorant Garamond`, gövdede `Plus Jakarta Sans`, etiketlerde `Space Grotesk`.
- **Duyarlı ve Akıcı:** `clamp()` responsive tipografi, mobil çekmece menü, smooth scroll ve IntersectionObserver animasyonları.
- **İnteraktif Deneyim:** 4 ana kategoride akordeon genişleme mekanizması, dinamik yaklaşan etkinlik motoru, veritabanına bağlı bilgi talebi ve bülten kayıtları.

---

## 📁 Proje Yapısı

```text
├── index.html                  # Semantik HTML5 ve SEO optimize ana sayfa
├── bilgi-al.html               # Bilgi ve deneyim talebi sayfası
├── admin.html                  # Korumalı kayıt görüntüleme ekranı
├── local-server.js             # Yerel statik sunucu, API ve SQLite veri katmanı
├── assets/
│   ├── css/
│   │   └── style.css           # Editoryal tasarım sistemi & stiller
│   ├── js/
│   │   └── main.js             # İnteraktif scriptler, akordeon ve form yönetimi
│   ├── img/                    # Yüksek çözünürlüklü Muka fotoğraf arşivi
│   └── icons/                  # SVG marka logoları ve favicon
└── README.md
```

---

## 🚀 Yerel Geliştirme

Projeyi yerel bilgisayarınızda çalıştırmak için:

```bash
# PowerShell: güçlü bir yönetim anahtarı belirleyin
$env:ADMIN_TOKEN="buraya-guclu-bir-anahtar-yazin"
npm run dev
```

Tarayıcınızda açın: `http://localhost:8080`

Kayıt yönetimi: `http://localhost:8080/admin`

Bilgi talepleri ve “Haberdar Ol” kayıtları `data/muka.sqlite` dosyasında saklanır. Canlı yayında verilerin korunması için kalıcı disk kullanan bir sunucu gerekir.

---

## 📍 İletişim & Konum
- **Konum:** Muka, İstanbul
- **E-posta:** info@mukajourney.com
- **Instagram:** [@mukajourney](https://www.instagram.com/mukajourney/)
- **LinkedIn:** [Muka Journey](https://www.linkedin.com/company/mukaj/)
