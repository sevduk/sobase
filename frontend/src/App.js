import { useEffect, useRef, useState } from "react";
import "@/App.css";
import axios from "axios";
import Lenis from "lenis";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Menu, X, MoveDown, Instagram, Sparkles } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const projects = [
  { number: "01", name: "AURA", type: "Brand Identity", disciplines: "Logo, Kurumsal Kimlik, Kartvizit", image: "https://images.unsplash.com/photo-1760804876161-ba0337e998fe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85", span: "a" },
  { number: "02", name: "NORTH / 01", type: "Visual Language", disciplines: "Art Direction, Packaging, Digital", image: "https://images.unsplash.com/photo-1775510984733-8748e90a985e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85", span: "b" },
  { number: "03", name: "NOIRÉ", type: "Brand Identity", disciplines: "Logo, Print, Direction", image: "https://images.unsplash.com/photo-1782857690704-c4341b240487?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHw0fHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85", span: "c" },
];

const brandLogos = [
  { name: "AKA CLINIC", image: "https://customer-assets-wrfwihn1.emergentagent.net/job_creative-portfolio-2012/artifacts/b223f9ace7b9cd89_amblem-1.png.png" },
  { name: "HESAPEVİ", image: "https://customer-assets-wrfwihn1.emergentagent.net/job_creative-portfolio-2012/artifacts/70b02963c48005a5_amblem-2.png.webp" },
];

const services = [
  { title: "Dijital Çözümler & Web Teknolojileri", note: "Hızlı, ölçeklenebilir ve ölçülebilir dijital ürünler" },
  { title: "Amblem & Logo Tasarımı", note: "Akılda kalan, sade ve üretilebilir marka işaretleri" },
  { title: "Bilişim Altyapısı & Sistem Çözümleri", note: "Güvenli mimari, süreç otomasyonu ve sürdürülebilir sistemler" },
  { title: "Kurumsal Kimlik & Marka Rehberi", note: "Tipografi, renk, dil ve uygulama kurallarıyla tutarlı evren" },
  { title: "Sosyal Medya Tasarım Sistemleri & Dijital Pazarlama", note: "Kampanya ritmini koruyan modüler içerik sistemleri" },
];

const heroLines = ["Dijital dünyada", "iz bırakan", "teknolojiler kuruyoruz."];
const ease = [0.22, 1, 0.36, 1];
const reveal = {
  hidden: { opacity: 0, y: 34 },
  visible: (index = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.75, delay: index * 0.07, ease } }),
};

function LogoMark({ light = false }) {
  return (
    <svg className="logo-mark" viewBox="0 0 44 44" aria-hidden="true" data-testid="akg-logo-mark">
      <rect x="3" y="3" width="38" height="38" rx="10" fill={light ? "#fafafa" : "#111111"} />
      <path d="M14 31 22 12l8 19h-4.6l-1.6-4.1h-7.4L14.8 31H14Z" fill={light ? "#111111" : "#fafafa"} />
      <path d="M17.8 24.2h8.4l1.7 4.4h2.9" fill="none" stroke="#4089bc" strokeWidth="2.4" strokeLinecap="square" />
    </svg>
  );
}

function SectionHeading({ eyebrow, index, dark = false }) {
  return (
    <motion.div className={dark ? "section-heading dark" : "section-heading"} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} data-testid={`section-heading-${index}`}>
      <span>{eyebrow}</span>
      <span>( {index} )</span>
    </motion.div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [intro, setIntro] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", project_type: "", message: "" });
  const [status, setStatus] = useState("");
  const lenisRef = useRef(null);
  const heroRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const gridY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -46]);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenisRef.current = lenis;
    let rafId;
    const raf = (time) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, [reduceMotion]);

  useEffect(() => {
    const timer = setTimeout(() => setIntro(false), 850);
    return () => clearTimeout(timer);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -76, duration: 1.1 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  const spotlight = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setStatus("sending");
    try {
      await axios.post(`${BACKEND_URL}/api/contact`, form);
      setStatus("success");
      setForm({ name: "", email: "", project_type: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="site-shell" data-testid="akgvision-site">
      <AnimatePresence>
        {intro && (
          <motion.div className="intro-veil" exit={{ y: "-100%" }} transition={{ duration: 0.66, ease }} data-testid="intro-veil">
            <LogoMark />
            <span>AKGVISION</span>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="site-header" data-testid="site-header">
        <button className="wordmark" onClick={() => scrollTo("top")} data-testid="wordmark-button" aria-label="AKGVISION ana sayfa">
          <LogoMark />
          <span><b>AKGVISION</b><small>DİJİTAL ÇÖZÜMLER & BİLİŞİM STÜDYOSU</small></span>
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} data-testid="main-navigation">
          <button onClick={() => scrollTo("projects")} data-testid="projects-nav-link">Projeler</button>
          <button onClick={() => scrollTo("about")} data-testid="about-nav-link">Hizmetler</button>
          <a href="https://www.behance.net" target="_blank" rel="noreferrer" data-testid="behance-nav-link">Behance <ArrowUpRight size={14} /></a>
          <button onClick={() => scrollTo("contact")} data-testid="contact-nav-link">İletişim</button>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menüyü aç" data-testid="mobile-menu-button">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top" ref={heroRef} data-testid="hero-section">
        <motion.div className="hero-grid" style={{ y: gridY }} aria-hidden="true" />
        <div className="hero-kicker" data-testid="hero-kicker">
          <span><Sparkles size={13} /> VISION/OS — Dijital Çözüm Sistemi</span>
          <span>İstanbul / 2026</span>
        </div>
        <h1 data-testid="hero-title">
          {heroLines.map((line, index) => (
            <span className="mask-line" key={line}>
              <motion.span initial={{ y: "112%" }} animate={{ y: intro ? "112%" : "0%" }} transition={{ duration: 0.82, delay: 0.1 + index * 0.09, ease }}>
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <div className="hero-bottom">
          <motion.p variants={reveal} initial="hidden" animate={intro ? "hidden" : "visible"} custom={4} data-testid="hero-copy">AKGVISION; bilişim altyapıları, dijital çözümler ve zamansız kurumsal kimlik vizyonunu tek merkezde buluşturarak markaları geleceğe taşır.</motion.p>
          <motion.button onClick={() => scrollTo("projects")} className="circle-arrow" aria-label="Projeleri keşfet" data-testid="hero-projects-button" whileHover={{ y: 4 }} whileTap={{ scale: 0.94 }}><MoveDown size={17} /></motion.button>
        </div>
      </section>

      <section className="logo-showcase" id="logos" data-testid="logo-showcase-section">
        <SectionHeading eyebrow="AKGVISION Seçili Amblemler" index="01" />
        <div className="logo-grid">
          {brandLogos.map((logo, index) => (
            <motion.div className="logo-tile" key={logo.name} data-testid={`logo-tile-${index + 1}`} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} custom={index}>
              <img src={logo.image} alt={`${logo.name} amblemi`} data-testid={`logo-image-${index + 1}`} />
              <span className="logo-name">{logo.name}</span>
              <span className="logo-index">0{index + 1}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="projects-section" id="projects" data-testid="projects-section">
        <SectionHeading eyebrow="Projeler" index="02" />
        <div className="project-grid">
          {projects.map((project, index) => (
            <motion.article className={`project-card project-${project.span}`} key={project.number} data-testid={`project-card-${project.number}`} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-90px" }} custom={index}>
              <a className="project-image-wrap" href="https://www.behance.net" target="_blank" rel="noreferrer" data-testid={`project-image-link-${project.number}`} onMouseMove={spotlight}>
                <img src={project.image} alt={`${project.name} ${project.type} çalışması`} />
                <span className="view-project">İncele <ArrowUpRight size={18} /></span>
              </a>
              <div className="project-meta">
                <div>
                  <span className="project-number">{project.number} / AKGVISION</span>
                  <h2>{project.name} <small>— {project.type}</small></h2>
                  <div className="project-tags" data-testid={`project-tags-${project.number}`}>{project.disciplines.split(", ").map((discipline) => <span key={discipline}>{discipline}</span>)}</div>
                </div>
                <a href="https://www.behance.net" target="_blank" rel="noreferrer" className="behance-link" data-testid={`project-behance-link-${project.number}`}>Behance&apos;te incele <ArrowUpRight size={15} /></a>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="behance-ribbon" data-testid="behance-ribbon">
        <div className="ribbon-mark"><LogoMark /></div>
        <div>
          <span className="eyebrow">Daha fazlasını keşfedin</span>
          <motion.h2 variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>Tüm vaka çalışmalarımız ve süreçlerimiz <span>Behance üzerinde</span> detaylandırılmıştır.</motion.h2>
        </div>
        <motion.a href="https://www.behance.net" target="_blank" rel="noreferrer" className="dark-button" data-testid="behance-profile-button" whileHover={{ x: 4 }} whileTap={{ scale: 0.97 }}>Profilimizi ziyaret edin <ArrowUpRight size={16} /></motion.a>
      </section>

      <section className="about-section" id="about" data-testid="about-section">
        <SectionHeading eyebrow="Hizmetlerimiz" index="03" />
        <div className="about-layout">
          <motion.h2 variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }}>Dijital fikirleri, <span>etki yaratan sistemlere</span> dönüştürüyoruz.</motion.h2>
          <div className="about-copy">
            <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>AKGVISION; bilişim, dijital deneyim ve marka kimliğini aynı vizyonda buluşturan teknoloji ve tasarım stüdyosudur.</motion.p>
            <motion.p variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>İhtiyaca göre ölçeklenen altyapılar, net bir görsel dil ve ölçülebilir dijital çözümler geliştiriyoruz.</motion.p>
            <div className="discipline-list" data-testid="services-list">
              {services.map((service, index) => (
                <motion.div className="service-item" key={service.title} data-testid={`service-item-${index + 1}`} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} custom={index} whileHover={{ x: 8 }}>
                  <span><b>0{index + 1}</b> — {service.title}<small>{service.note}</small></span>
                  <ArrowUpRight size={16} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact" data-testid="contact-section">
        <SectionHeading eyebrow="Birlikte çalışalım" index="04" />
        <div className="contact-layout">
          <div>
            <motion.h2 variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>Bir sonraki dijital projenizi <span>akgvision ile hayata geçirin.</span></motion.h2>
            <a href="mailto:hello@akgvision.com" className="email-link" data-testid="email-link">hello@akgvision.com <ArrowUpRight size={16} /></a>
          </div>
          <form onSubmit={submitForm} className="contact-form" data-testid="contact-form">
            <label>Adınız <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ad Soyad" data-testid="contact-name-input" /></label>
            <label>E-posta <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ornek@email.com" data-testid="contact-email-input" /></label>
            <label>Hizmet türü <select required value={form.project_type} onChange={(e) => setForm({ ...form, project_type: e.target.value })} data-testid="contact-project-type-select"><option value="">Seçiniz</option><option>Dijital Çözümler & Web Teknolojileri</option><option>Bilişim Altyapısı & Sistem Çözümleri</option><option>Amblem & Logo Tasarımı</option><option>Kurumsal Kimlik & Marka Rehberi</option><option>Sosyal Medya Tasarım Sistemleri</option><option>Diğer</option></select></label>
            <label>Mesajınız <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Projenizden biraz bahsedin..." data-testid="contact-message-input" /></label>
            <motion.button type="submit" className="submit-button" disabled={status === "sending"} data-testid="contact-submit-button" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>{status === "sending" ? "Gönderiliyor..." : "Mesajı gönder"}<ArrowUpRight size={17} /></motion.button>
            {status === "success" && <p className="form-status success" data-testid="contact-success-message">Mesajınız için teşekkürler. En kısa sürede size döneceğiz.</p>}
            {status === "error" && <p className="form-status error" data-testid="contact-error-message">Bir sorun oluştu. Lütfen tekrar deneyin.</p>}
          </form>
        </div>
      </section>

      <footer className="site-footer" data-testid="site-footer">
        <div className="footer-brand footer-mini"><LogoMark /><span>akgvision</span></div>
        <div className="footer-contact"><span>İstanbul, Türkiye</span><a href="mailto:hello@akgvision.com" data-testid="footer-email-link">hello@akgvision.com</a></div>
        <div className="footer-social"><a href="https://www.behance.net" target="_blank" rel="noreferrer" data-testid="footer-behance-link">Behance <ArrowUpRight size={14} /></a><a href="https://instagram.com" target="_blank" rel="noreferrer" data-testid="footer-instagram-link">Instagram <Instagram size={14} /></a></div>
        <span className="copyright">akgvision © 2026</span>
      </footer>
    </main>
  );
}

export default App;
