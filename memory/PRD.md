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
- Bu oturum: İstenen yapısal sadeleştirme uygulandı; marquee/ticker kaldırıldı, hero'daki dairesel gradyan söndürüldü, ekstra vitrin katmanı temizlendi ve ana akış amblem grid'i + kapak fotoğraflı projeler + hizmetler + iletişim olarak netleştirildi.
- Bu oturum: Palet siyah/beyaz eksene alındı; zemin #FAFAFA, metin #111111, vurgular #4089bc mavi ve #c8d440 zest olarak güncellendi. Hero başlığı tek renk, dik ve outline hilesi olmadan bırakıldı.
- Bu oturum: Görsel hiyerarşi sıkılaştırıldı; hero başlığı ~%50 küçültüldü (1366px'te 65.6px), hero yüksekliği 448px'e indirildi ve ilk ekranda amblem vitrini görünür hale getirildi.
- Bu oturum: Amblem grid'i PNG-uyumlu, daha küçük ve hafif çerçeveli 5'li kompakt yapıya çevrildi; projeler tek satırda 3 kart ve asimetrik oranlarla yeniden kuruldu, footer alanı lowercase "akgvision" ile daraltıldı.
- Bu oturum: Behance bandı ve iletişim bölümü koyu temadan çıkarılıp #F5F5F7 açık zemine alındı; metinler #111111 yapıldı, form alt çizgileri #E5E5E5'e çekildi, form başlığı "akgvision" lowercase olacak şekilde güncellendi.
- Bu oturum: Tüm site Inter, sans-serif standardına geçirildi; Plus Jakarta kalıntıları temizlendi, italik stil yok, hiyerarşi Inter ağırlıklarıyla korunuyor. Mavi #4089bc ve zest #c8d440 üst-alt bölümler arasında dengelendi; Behance vurgusu zest highlight, iletişimdeki "akgvision" mavi, etiketler mavi/zest dönüşümlü, servis numaraları küçük zest/mavi rozetler halinde düzeltildi.
- Bu oturum: Kullanıcının yüklediği gerçek amblem dosyaları "AKGVISION Seçili Amblemler" alanına yerleştirildi; placeholder SVG semboller kaldırıldı, AKA CLINIC ve HESAPEVİ logoları kutular içinde ortalı, marka adları altlarında olacak şekilde sergileniyor.
- Bu oturum: Hero rozeti "DİJİTAL ÇÖZÜMLER • TASARIM • BİLİŞİM" yapıldı; hizmet listesi 6 maddeye çıkarılıp 04 olarak E-Ticaret Danışmanlığı & Operasyon Yönetimi eklendi, iletişim dropdown'ına "E-Ticaret Danışmanlığı" işlendi. Sayfa akışı Hero -> Hizmetler -> Projeler -> Seçili Amblemler -> Behance -> İletişim olarak yeniden sıralandı; amblem kartları #E5E7EB çerçeveli ve hover'da mavi/zest vurgulu kompakt düzene alındı.
- Bu oturum: Bölüm indeksleri ve yeşil numara kutuları kaldırıldı; Hizmetlerimiz tam genişlik başlık + 3x2 kart gridine dönüştürüldü, "SEÇİLİ LOGOLAR" başlığıyla logo vitrini 4'lü sığabilecek kompakt karta (182x135px) indirildi.
- Bu oturum: Projelerdeki tüm harici Behance bağlantıları kaldırıldı; kartlar artık site içi case-study modalı açıyor. Modal backdrop-blur/yarı saydam koyu zemin, X/backdrop/Escape ile kapanma, künye (kategori/yıl/müşteri), alt alta galeri ve vaka özeti içeriyor. Header/footer/ribbon Behance yönlendirmeleri de temizlendi; ribbon içeriği site içi "Projelere dön" aksiyonuna çevrildi.
- Bu oturum: Hizmetlerimiz alanı sadeleştirildi; dev ikinci başlık kaldırıldı, giriş "HİZMETLERİMİZ — DİJİTAL VE STRATEJİK UZMANLIKLAR" üst etiketine indi. Kartlardaki numaralar silindi ve 6 hizmet asimetrik bento-grid düzenine geçti: Dijital Çözümler ile E-Ticaret 2 birim genişliğinde, diğerleri kompakt kartlar; hover'da mavi/zest mikro vurgu korunuyor.
- Bu oturum: Hero konumu ANKARA / 2026 yapıldı ve sağ tarafa saf SVG/CSS tabanlı, mavi-zest degradeli, glow'lu, floating + fare paralakslı interaktif dijital küre maskotu eklendi. "Vaka yaklaşımı" geçiş şeridi tamamen kaldırıldı. Proje kartları ultra-minimale indi: indeksler ve pill etiketler silindi, sadece görsel + "AD —" + kategori + "PROJEYİ İNCELE" kaldı. Hizmet kartlarına %4-5 opaklıkta dot-matrix dokusu işlendi.
- Bu oturum: Hizmet kartı zemini statik noktalardan soyut akışkan dalga/topo çizgilerine çevrildi; her kartta farklı açı/background-position, hover'da yumuşak kayma ve ışıma var. İletişim başlığı 42px'e küçültüldü, "akgvision" zest oldu, input focus alt çizgisi zest, e-posta hover oku/alt çizgisi zest ve PROJEYİ İNCELE bağlantıları mavi/zest dönüşümlü hale getirildi.
- Bu oturum: Gizli `/admin` rotası eklendi; parola/PIN ile JWT tabanlı yönetici girişi, brute-force kilidi, MongoDB `projects` koleksiyonu ve admin CRUD endpoint'leri kuruldu. Ana sayfa projeleri artık `GET /api/projects` üzerinden yayınlanan kayıtlardan besleniyor; panelden ekleme/düzenleme/silme ve yayında toggle ana grid ile detay modalına yansıyor.

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
