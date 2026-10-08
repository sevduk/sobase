# AKGVISION — Dijital Çözümler & Bilişim Stüdyosu

## Original Problem Statement
Modern, editoryal ve minimalist bir stüdyo portfolyosu olarak başlayan ürün, son istekle AKGVISION markasına dönüştürüldü: dijital çözümler ve bilişim odağı, kompakt hero, 5 hizmet, 5 amblem vitrini, yüksek çözünürlüklü proje kartları, Behance bağlantıları ve iletişim formu. Tek sans-serif aile (Plus Jakarta Sans), italik yok, terracotta/cobalt vurgular ve responsive akış zorunlu.

## User Personas
- Marka sahibi / kurucu: Stüdyonun uzmanlığını hızlıca anlamak ve proje başlatmak istiyor.
- Kurumsal satın alma yetkilisi: Hizmet kapsamını, güven veren işleri ve iletişim kolaylığını tarıyor.
- Tasarım/teknoloji meraklısı: Amblem sistemi, tipografi ve proje sunumundaki zanaatı inceliyor.

## Architecture Decisions
- React tek sayfa; bölüm içi kaydırma Lenis ile yumuşatıldı, scroll-reveal ve mikro etkileşimler framer-motion ile yönetiliyor.
- Portfolyo ve amblem içeriği frontend veri dizilerinde; proje görselleri tasarım kılavuzundaki küratöryel Unsplash varlıklarından geliyor.
- İletişim formu FastAPI `/api/contact` endpoint'ine gider ve MongoDB `contact_inquiries` koleksiyonuna kaydedilir.
- API modeli Pydantic ile e-posta, boş metin ve uzunluk doğrulaması yapar; hatalı istekler 422 döner.
- Favicon ve header/footer markası aynı özgün SVG AKGVISION işaretini kullanır.

## Core Requirements (Static)
- Türkçe, tek sans-serif aile, italik tipografi yok.
- Terracotta (#c65b3f) ve cobalt (#2447f5) vurgular; sıcak kâğıt zemini ve kömür siyahı kontrast.
- Kompakt ama premium hero; masked line-by-line açılış anı ve hafif parallax/3D hissi.
- 5 hizmet maddesi, 5 amblem kutusu, 4 proje kartı, Behance CTA, iletişim formu, footer.
- Tüm etkileşimli ve kritik bilgi öğelerinde benzersiz `data-testid`.

## Implemented
- 2026-07: İlk portfolyo iskeleti, responsive header, asimetrik proje grid'i, iletişim formu ve MongoDB kaydı tamamlandı.
- 2026-07: Kompakt hero, Plus Jakarta Sans geçişi, terracotta vurgu, 5 amblem vitrini ve 5 hizmet listesi eklendi.
- 2026-07: Mobil grid dengesi, yatay taşma kontrolleri ve backend Pydantic doğrulaması güçlendirildi.
- Bu oturum: AKGVISION rebrand doğrulandı; arayüz ödül odaklı "technical editorial" yöne yükseltildi. Kinetik hero açılışı, intro veil, yavaş editoryal marquee, özgün SVG logo/favicon, spotlight'lı ve clip-path'li proje kartları, hizmet hover mikro etkileşimleri, Lenis momentum scroll ve framer-motion section reveal eklendi.
- Bu oturum: Mobil hero'daki CTA çakışması düzeltildi; 375/768/1366 genişliklerde yatay taşma olmadığı tekrar kontrol edildi.

## Verification Notes
- Backend: `GET /api/` 200; `POST /api/contact` geçerli veriyle 200/success; boş isim + kısa mesajla 422 doğrulandı.
- Frontend/e2e: preview açıldı, hero görünür, mobil yatay taşma false, iletişim formu doldurulup gönderildi ve başarı mesajı görüldü.
- Not: Proje görselleri küratöryel örneklerdir; Behance bağlantıları gerçek profil verilene kadar genel behance.net adresine gider.

## Prioritized Backlog
- P0: Yok.
- P1: Gerçek Behance profil/projeleri ve stüdyo iletişim bilgilerini placeholder'lardan canlı değerlere çevir.
- P2: Proje detay/vaka sayfaları ve portfolyo içerik yönetimi için hafif CMS akışı.
- P2: İletişim formu gönderimlerinde e-posta bildirimi.

## Next Tasks
- Gerçek Behance URL'lerini ve proje vaka metinlerini al.
- Form bildirimi için e-posta entegrasyonunu planla.
- TR/EN dil geçişi için içerik modelini genişlet.
