import { useState } from "react";
import "@/App.css";
import axios from "axios";
import { ArrowUpRight, Menu, X, MoveDown, Instagram } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const projects = [
  { number: "01", name: "AURA", type: "Brand Identity", disciplines: "Logo, Kurumsal Kimlik, Kartvizit", image: "https://images.unsplash.com/photo-1760804876161-ba0337e998fe?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400", className: "project-tall" },
  { number: "02", name: "NORTH / 01", type: "Visual Language", disciplines: "Art Direction, Packaging, Digital", image: "https://images.unsplash.com/photo-1775510984733-8748e90a985e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400", className: "project-offset" },
  { number: "03", name: "NOIRÉ", type: "Brand Identity", disciplines: "Logo, Print, Direction", image: "https://images.unsplash.com/photo-1782857690704-c4341b240487?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400", className: "project-offset" },
  { number: "04", name: "FORMA", type: "Editorial System", disciplines: "Typography, Editorial, Digital", image: "https://images.unsplash.com/photo-1790345835845-bda0548978b2?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400", className: "project-tall" },
];
const logoMarks = [
  { name: "NOVA", symbol: "◐", tone: "light" },
  { name: "MORI", symbol: "∿", tone: "dark" },
  { name: "VECTA", symbol: "✦", tone: "sand" },
  { name: "ORBIT", symbol: "△", tone: "dark" },
  { name: "LUMA", symbol: "◎", tone: "light" },
];
const services = [
  "Marka Stratejisi & Konumlandırma",
  "Amblem & Logo Tasarımı",
  "Kurumsal Kimlik & Baskı Materyalleri",
  "Sosyal Medya Tasarımı & Şablon Sistemleri",
  "Ambalaj & Konu Odaklı Özel Tasarımlar",
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", project_type: "", message: "" });
  const [status, setStatus] = useState("");
  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  const submitForm = async (event) => {
    event.preventDefault(); setStatus("sending");
    try { await axios.post(`${BACKEND_URL}/api/contact`, form); setStatus("success"); setForm({ name: "", email: "", project_type: "", message: "" }); }
    catch { setStatus("error"); }
  };
  return <main className="site-shell">
    <header className="site-header" data-testid="site-header">
      <button className="wordmark" onClick={() => scrollTo("top")} data-testid="wordmark-button"><span>ATELIER</span><small>DESIGN & BRAND STUDIO</small></button>
      <nav className={menuOpen ? "nav-links open" : "nav-links"} data-testid="main-navigation">
        <button onClick={() => scrollTo("projects")} data-testid="projects-nav-link">Projeler</button>
        <button onClick={() => scrollTo("about")} data-testid="about-nav-link">Hakkımızda</button>
        <a href="https://www.behance.net" target="_blank" rel="noreferrer" data-testid="behance-nav-link">Behance <ArrowUpRight size={14}/></a>
        <button onClick={() => scrollTo("contact")} data-testid="contact-nav-link">İletişim</button>
      </nav>
      <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menüyü aç" data-testid="mobile-menu-button">{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <section className="hero" id="top" data-testid="hero-section">
      <div className="hero-kicker"><span className="eyebrow">Bağımsız tasarım stüdyosu</span><span className="hero-index">01 / 05</span></div>
      <h1>Dönüştüren marka<br/><span className="accent-word">kimlikleri</span> tasarlıyoruz.</h1>
      <div className="hero-bottom"><p>Markanızın özünü; zamansız kurumsal kimlikler, logo, kartvizit ve sosyal medya vizyonuyla geleceğe taşıyoruz.</p><button onClick={() => scrollTo("projects")} className="circle-arrow" aria-label="Projeleri keşfet" data-testid="hero-projects-button"><MoveDown size={19}/></button></div>
    </section>

    <section className="logo-showcase" id="logos" data-testid="logo-showcase-section"><div className="section-heading"><span className="eyebrow">Seçili amblem & logolar</span><span>( 01 )</span></div><div className="logo-grid">{logoMarks.map((logo, index) => <div className={`logo-tile ${logo.tone}`} key={logo.name} data-testid={`logo-tile-${index + 1}`}><span className={`logo-symbol logo-symbol-${index + 1}`}>{logo.symbol}</span><span className="logo-name">{logo.name}</span><span className="logo-index">0{index + 1}</span></div>)}</div></section>

    <section className="projects-section" id="projects" data-testid="projects-section"><div className="section-heading"><span className="eyebrow">Seçilmiş işler</span><span>( 2021 — 2024 )</span></div><div className="project-grid">{projects.map((project) => <article className={`project-card ${project.className}`} key={project.number} data-testid={`project-card-${project.number}`}><a className="project-image-wrap" href="https://www.behance.net" target="_blank" rel="noreferrer" data-testid={`project-image-link-${project.number}`}><img src={project.image} alt={`${project.name} ${project.type} çalışması`} /><span className="view-project">İncele <ArrowUpRight size={18}/></span></a><div className="project-meta"><div><span className="project-number">{project.number}</span><h2>{project.name} <small>— {project.type}</small></h2><div className="project-tags" data-testid={`project-tags-${project.number}`}>{project.disciplines.split(", ").map((discipline) => <span key={discipline}>{discipline}</span>)}</div></div><a href="https://www.behance.net" target="_blank" rel="noreferrer" className="behance-link" data-testid={`project-behance-link-${project.number}`}>Behance&apos;te incele <ArrowUpRight size={15}/></a></div></article>)}</div></section>

    <section className="behance-ribbon" data-testid="behance-ribbon"><div className="ribbon-mark">A<span>+</span></div><div><span className="eyebrow">Daha fazlasını keşfedin</span><h2>Tüm vaka çalışmalarımız ve süreçlerimiz<br/><span className="accent-word">Behance üzerinde</span> detaylandırılmıştır.</h2></div><a href="https://www.behance.net" target="_blank" rel="noreferrer" className="dark-button" data-testid="behance-profile-button">Profilimizi ziyaret edin <ArrowUpRight size={16}/></a></section>

    <section className="about-section" id="about" data-testid="about-section"><div className="section-heading"><span className="eyebrow">Stüdyo hakkında</span><span>( 03 )</span></div><div className="about-layout"><h2>İyi tasarım,<br/><span className="accent-word">gürültüyü azaltır.</span></h2><div className="about-copy"><p>ATELIER; strateji, kimlik ve dijital deneyimi tek bir düşüncede buluşturan bağımsız bir marka stüdyosudur.</p><p>Her projeye merakla yaklaşır, markaların kendilerine özgü sesini bulmasına yardımcı oluruz. Çünkü bizim için tasarım, güzel görünmekten fazlasıdır.</p><div className="discipline-list" data-testid="services-list">{services.map((service, index) => <div className="service-item" key={service} data-testid={`service-item-${index + 1}`}><span><b>0{index + 1}</b> — {service}</span><ArrowUpRight size={16}/></div>)}</div></div></div></section>

    <section className="contact-section" id="contact" data-testid="contact-section"><div className="section-heading"><span className="eyebrow">Birlikte çalışalım</span><span>( 04 )</span></div><div className="contact-layout"><div><h2>Bir sonraki büyük<br/><span className="accent-word">projenizi konuşalım.</span></h2><a href="mailto:hello@atelier.studio" className="email-link" data-testid="email-link">hello@atelier.studio <ArrowUpRight size={16}/></a></div><form onSubmit={submitForm} className="contact-form" data-testid="contact-form"><label>Adınız <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Ad Soyad" data-testid="contact-name-input"/></label><label>E-posta <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="ornek@email.com" data-testid="contact-email-input"/></label><label>Proje türü <select required value={form.project_type} onChange={(e) => setForm({...form, project_type: e.target.value})} data-testid="contact-project-type-select"><option value="">Seçiniz</option><option>Kurumsal Kimlik</option><option>Logo Tasarımı</option><option>Sosyal Medya Seti</option><option>Diğer</option></select></label><label>Mesajınız <textarea required value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} placeholder="Projenizden biraz bahsedin..." data-testid="contact-message-input"/></label><button type="submit" className="submit-button" disabled={status === "sending"} data-testid="contact-submit-button">{status === "sending" ? "Gönderiliyor..." : "Mesajı gönder"}<ArrowUpRight size={17}/></button>{status === "success" && <p className="form-status success" data-testid="contact-success-message">Mesajınız için teşekkürler. En kısa sürede size döneceğiz.</p>}{status === "error" && <p className="form-status error" data-testid="contact-error-message">Bir sorun oluştu. Lütfen tekrar deneyin.</p>}</form></div></section>

    <footer className="site-footer" data-testid="site-footer"><div className="footer-brand">ATELIER<small>DESIGN & BRAND STUDIO</small></div><div className="footer-contact"><span>İstanbul, Türkiye</span><a href="mailto:hello@atelier.studio" data-testid="footer-email-link">hello@atelier.studio</a></div><div className="footer-social"><a href="https://www.behance.net" target="_blank" rel="noreferrer" data-testid="footer-behance-link">Behance <ArrowUpRight size={14}/></a><a href="https://instagram.com" target="_blank" rel="noreferrer" data-testid="footer-instagram-link">Instagram <Instagram size={14}/></a></div><span className="copyright">© 2024 ATELIER</span></footer>
  </main>;
}

export default App;
