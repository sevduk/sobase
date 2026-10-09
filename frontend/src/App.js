import { useEffect, useRef, useState } from "react";
import "@/App.css";
import axios from "axios";
import Lenis from "lenis";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Menu, X, MoveDown, Instagram, Linkedin, Sparkles } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const FORMA_IMAGE = "https://images.unsplash.com/photo-1790345835845-bda0548978b2?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1ODR8MHwxfHNlYXJjaHw0fHxlZGl0b3JpYWwlMjBkZXNpZ24lMjBtYWdhemluZSUyMGxheW91dCUyMGFyY2hpdGVjdHVyZXxlbnwwfHx8fDE3OTE0NDc1ODd8MA&ixlib=rb-4.1.0&q=85";

const fallbackProjects = [
  {
    number: "01",
    name: "AURA",
    type: "Logo & Marka Tasarımı",
    image: "https://images.unsplash.com/photo-1760804876161-ba0337e998fe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85",
    year: "2026",
    client: "Klinik / Sağlık",
    summary: "AURA için amaç; güven veren klinik duruşunu sade bir işaret ve uygulanabilir kimlik sistemine dönüştürmekti. Logo, kartvizit ve temel basılı işler tek tipografik disiplinde toplandı; sonuç, tanınırlığı yüksek ve üretimi kolay bir marka çekirdeği oldu.",
    gallery: ["https://images.unsplash.com/photo-1760804876161-ba0337e998fe?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85", FORMA_IMAGE],
    span: "a",
  },
  {
    number: "02",
    name: "NORTH / 01",
    type: "Dijital Çözümler & Web Teknolojileri",
    image: "https://images.unsplash.com/photo-1775510984733-8748e90a985e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85",
    year: "2025",
    client: "Perakende / Yapı",
    summary: "NORTH / 01'de cephe tipografisi, ambalaj ve dijital temas noktaları aynı gridde buluştu. Çözüm; mekânsal işaretlerden web arayüzüne uzanan tutarlı bir görsel dil kurdu ve kampanya üretim hızını belirgin şekilde artırdı.",
    gallery: ["https://images.unsplash.com/photo-1775510984733-8748e90a985e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85", FORMA_IMAGE],
    span: "b",
  },
  {
    number: "03",
    name: "NOIRÉ",
    type: "E-Ticaret Danışmanlığı",
    image: "https://images.unsplash.com/photo-1782857690704-c4341b240487?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHw0fHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85",
    year: "2026",
    client: "Fintech / Operasyon",
    summary: "NOIRÉ için karanlık premium kimlik; satış operasyonu ve pazaryeri akışlarıyla birlikte ele alındı. Kartvizit, sunum ve dijital satış şablonları aynı sistemde üretilerek ekip içi kullanım hızlandı ve marka algısı tekilleştirildi.",
    gallery: ["https://images.unsplash.com/photo-1782857690704-c4341b240487?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHw0fHxtaW5pbWFsaXN0JTIwYnJhbmRpbmclMjBtb2NrdXAlMjBlZGl0b3JpYWwlMjBwb3J0Zm9saW98ZW58MHx8fHwxNzkxNDQ3NTg1fDA&ixlib=rb-4.1.0&q=85", FORMA_IMAGE],
    span: "c",
  },
];

const brandLogos = [
  { name: "AKA CLINIC", image: "https://customer-assets-wrfwihn1.emergentagent.net/job_creative-portfolio-2012/artifacts/b223f9ace7b9cd89_amblem-1.png.png" },
  { name: "HESAPEVİ", image: "https://customer-assets-wrfwihn1.emergentagent.net/job_creative-portfolio-2012/artifacts/70b02963c48005a5_amblem-2.png.webp" },
];

const services = [
  { title: "Dijital Çözümler & Web Teknolojileri", note: "Hızlı, ölçeklenebilir ve ölçülebilir dijital ürünler" },
  { title: "E-Ticaret Danışmanlığı & Operasyon Yönetimi", note: "Pazaryeri entegrasyonları, satış operasyonları ve büyüme stratejileri" },
  { title: "Logo & Marka Tasarımı", note: "Akılda kalan, sade ve üretilebilir marka işaretleri" },
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

function BrandMark({ image, light = false }) {
  if (image) return <img className="logo-mark uploaded-logo" src={image} alt="Marka logosu" data-testid="brand-logo-image" />;
  return <LogoMark light={light} />;
}

function HeroMascot() {
  return (
    <div className="hero-mascot" data-testid="hero-mascot" aria-hidden="true">
      <svg viewBox="0 0 220 220" className="mascot-svg">
        <defs>
          <radialGradient id="mascotCore" cx="38%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="42%" stopColor="#4089bc" />
            <stop offset="100%" stopColor="#c8d440" />
          </radialGradient>
          <linearGradient id="mascotChrome" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity=".95" />
            <stop offset="48%" stopColor="#9fc6dd" stopOpacity=".55" />
            <stop offset="100%" stopColor="#111111" stopOpacity=".22" />
          </linearGradient>
        </defs>
        <circle cx="110" cy="110" r="74" fill="url(#mascotCore)" opacity=".92" />
        <ellipse cx="110" cy="110" rx="96" ry="34" fill="none" stroke="url(#mascotChrome)" strokeWidth="5" transform="rotate(-18 110 110)" />
        <ellipse cx="110" cy="110" rx="96" ry="34" fill="none" stroke="#111111" strokeOpacity=".12" strokeWidth="1.5" transform="rotate(24 110 110)" />
        <circle cx="82" cy="72" r="12" fill="#ffffff" opacity=".9" />
        <circle cx="150" cy="142" r="7" fill="#c8d440" />
      </svg>
    </div>
  );
}

function SectionHeading({ eyebrow, index, dark = false }) {
  return (
    <motion.div className={dark ? "section-heading dark" : "section-heading"} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} data-testid={`section-heading-${index}`}>
      <span>{eyebrow}</span>
    </motion.div>
  );
}

function CaseModal({ project, onClose }) {
  return (
    <motion.div className="modal-backdrop" data-testid="modal-backdrop" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <motion.div className="case-modal" role="dialog" aria-modal="true" aria-label={`${project.name} proje detayı`} data-testid="project-modal" onClick={(event) => event.stopPropagation()} initial={{ opacity: 0, y: 34, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.98 }} transition={{ duration: 0.34, ease }}>
        <button className="modal-close" onClick={onClose} aria-label="Modalı kapat" data-testid="modal-close-button"><X size={18} /></button>
        <div className="modal-head">
          <span className="modal-kicker">Vaka Çalışması</span>
          <h3>{project.name}</h3>
          <div className="modal-meta" data-testid="modal-meta">
            <span>{project.type}</span>
            <span>{project.year}</span>
            {project.client && <span>{project.client}</span>}
          </div>
        </div>
        <div className="modal-gallery" data-testid="modal-gallery">
          {project.gallery.map((image, index) => <img key={`${project.number}-${index}`} src={image} alt={`${project.name} sunum görseli ${index + 1}`} />)}
        </div>
        <div className="modal-summary">
          <span>Vaka Özeti</span>
          <p>{project.summary}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [intro, setIntro] = useState(true);
  const [activeProject, setActiveProject] = useState(null);
  const [projectList, setProjectList] = useState(fallbackProjects);
  const [servicesList, setServicesList] = useState(services);
  const [logoList, setLogoList] = useState(brandLogos);
  const [siteSettings, setSiteSettings] = useState({
    hero_title: heroLines.join("\n"),
    hero_copy: "AKGVISION; bilişim altyapıları, dijital çözümler ve zamansız kurumsal kimlik vizyonunu tek merkezde buluşturarak markaları geleceğe taşır.",
    location: "ANKARA / 2026",
    email: "hello@akgvision.com",
  });

  useEffect(() => {
    Promise.all([
      axios.get(`${BACKEND_URL}/api/projects`),
      axios.get(`${BACKEND_URL}/api/services`),
      axios.get(`${BACKEND_URL}/api/logos`),
      axios.get(`${BACKEND_URL}/api/settings`),
    ]).then(([projectData, serviceData, logoData, settingsData]) => {
      if (Array.isArray(projectData.data) && projectData.data.length) {
        setProjectList(projectData.data.map((project, index) => ({
          ...project,
          type: project.category,
          number: String(project.order || index + 1).padStart(2, "0"),
          span: ["a", "b", "c"][index % 3],
        })));
      }
      if (Array.isArray(serviceData.data) && serviceData.data.length) setServicesList(serviceData.data);
      if (Array.isArray(logoData.data) && logoData.data.length) setLogoList(logoData.data);
      if (settingsData.data) setSiteSettings((current) => ({ ...current, ...settingsData.data }));
    }).catch(() => {});
  }, []);
  const [form, setForm] = useState({ name: "", email: "", project_type: "", message: "" });
  const [status, setStatus] = useState("");
  const lenisRef = useRef(null);
  const heroRef = useRef(null);
  const mascotRef = useRef(null);
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

  useEffect(() => {
    if (!activeProject) return undefined;
    const onKey = (event) => { if (event.key === "Escape") setActiveProject(null); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeProject]);

  const scrollTo = (id) => {
    setMenuOpen(false);
    const target = document.getElementById(id);
    if (!target) return;
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -76, duration: 1.1 });
    else target.scrollIntoView({ behavior: "smooth" });
  };

  const heroPointer = (event) => {
    if (reduceMotion || !mascotRef.current || !heroRef.current) return;
    const bounds = heroRef.current.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    mascotRef.current.style.setProperty("--rx", `${y * -10}deg`);
    mascotRef.current.style.setProperty("--ry", `${x * 14}deg`);
    mascotRef.current.style.setProperty("--mx", `${x * 18}px`);
    mascotRef.current.style.setProperty("--my", `${y * 14}px`);
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

  const dynamicHeroLines = siteSettings.hero_title.split("\n").map((line) => line.trim()).filter(Boolean);

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
          <BrandMark image={siteSettings.logo_image} />
          <span><b>{siteSettings.brand_name}</b><small>{siteSettings.brand_tagline}</small></span>
        </button>
        <nav className={menuOpen ? "nav-links open" : "nav-links"} data-testid="main-navigation">
          <button onClick={() => scrollTo("about")} data-testid="about-nav-link">Hizmetler</button>
          <button onClick={() => scrollTo("projects")} data-testid="projects-nav-link">Projeler</button>
          <button onClick={() => scrollTo("contact")} data-testid="contact-nav-link">İletişim</button>
        </nav>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menüyü aç" data-testid="mobile-menu-button">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <section className="hero" id="top" ref={heroRef} data-testid="hero-section" onMouseMove={heroPointer}>
        <motion.div className="hero-grid" style={{ y: gridY }} aria-hidden="true" />
        <div ref={mascotRef} className="hero-mascot-parallax"><HeroMascot /></div>
        <div className="hero-kicker" data-testid="hero-kicker">
          <span><Sparkles size={13} /> DİJİTAL ÇÖZÜMLER • TASARIM • BİLİŞİM</span>
          <span>{siteSettings.location}</span>
        </div>
        <h1 data-testid="hero-title">
          {dynamicHeroLines.map((line, index) => (
            <span className="mask-line" key={line}>
              <motion.span initial={{ y: "112%" }} animate={{ y: intro ? "112%" : "0%" }} transition={{ duration: 0.82, delay: 0.1 + index * 0.09, ease }}>
                {line}
              </motion.span>
            </span>
          ))}
        </h1>
        <div className="hero-bottom">
          <motion.p variants={reveal} initial="hidden" animate={intro ? "hidden" : "visible"} custom={4} data-testid="hero-copy">{siteSettings.hero_copy}</motion.p>
          <motion.button onClick={() => scrollTo(siteSettings.hero_cta_target || "projects")} className="circle-arrow" aria-label={siteSettings.hero_cta_text} data-testid="hero-projects-button" whileHover={{ y: 4 }} whileTap={{ scale: 0.94 }}><MoveDown size={17} /></motion.button><span className="hero-cta-text">{siteSettings.hero_cta_text}</span>
        </div>
      </section>

      <section className="about-section" id="about" data-testid="about-section">
        <SectionHeading eyebrow="HİZMETLERİMİZ — DİJİTAL VE STRATEJİK UZMANLIKLAR" index="01" />
        <div className="services-grid" data-testid="services-list">
          {servicesList.map((service, index) => (
            <motion.div className="service-card" key={service.title} data-testid={`service-item-${index + 1}`} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }} custom={index} whileHover={{ y: -4 }}>
              <h3>{service.title}</h3>
              <p>{service.note}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="projects-section" id="projects" data-testid="projects-section">
        <SectionHeading eyebrow="Projeler" index="02" />
        <div className="project-grid">
          {projectList.map((project, index) => (
            <motion.article className={`project-card project-${project.span}`} key={project.number} data-testid={`project-card-${project.number}`} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-90px" }} custom={index}>
              <button className="project-image-wrap" type="button" onClick={() => setActiveProject(project)} data-testid={`project-open-${project.number}`} onMouseMove={spotlight} aria-label={`${project.name} detaylarını aç`}>
                <img src={project.image} alt={`${project.name} ${project.type} çalışması`} />
                <span className="view-project">Detayları Gör <ArrowUpRight size={18} /></span>
              </button>
              <div className="project-meta">
                <div>
                  <h2>{project.name} —</h2>
                  <p className="project-category">{project.type}</p>
                </div>
                <button type="button" className="behance-link details-link" onClick={() => setActiveProject(project)} data-testid={`project-details-${project.number}`}>Projeyi İncele <ArrowUpRight size={15} /></button>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="logo-showcase" id="logos" data-testid="logo-showcase-section">
        <SectionHeading eyebrow="SEÇİLİ LOGOLAR" index="03" />
        <div className="logo-grid">
          {logoList.map((logo, index) => (
            <motion.div className="logo-tile" key={logo.id || logo.name} data-testid={`logo-tile-${index + 1}`} variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-60px" }} custom={index}>
              <img src={logo.image} alt={`${logo.name} logosu`} data-testid={`logo-image-${index + 1}`} />
              <span className="logo-name">{logo.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact" data-testid="contact-section">
        <SectionHeading eyebrow="Birlikte çalışalım" index="04" />
        <div className="contact-layout">
          <div>
            <motion.h2 variants={reveal} initial="hidden" whileInView="visible" viewport={{ once: true }}>Bir sonraki dijital projenizi <span>akgvision ile hayata geçirin.</span></motion.h2>
            <a href={`mailto:${siteSettings.email}`} className="email-link" data-testid="email-link">{siteSettings.email} <ArrowUpRight size={16} /></a>
          </div>
          <form onSubmit={submitForm} className="contact-form" data-testid="contact-form">
            <label>Adınız <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ad Soyad" data-testid="contact-name-input" /></label>
            <label>E-posta <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="ornek@email.com" data-testid="contact-email-input" /></label>
            <label>Hizmet türü <select required value={form.project_type} onChange={(e) => setForm({ ...form, project_type: e.target.value })} data-testid="contact-project-type-select"><option value="">Seçiniz</option><option>Dijital Çözümler & Web Teknolojileri</option><option>Bilişim Altyapısı & Sistem Çözümleri</option><option>E-Ticaret Danışmanlığı</option><option>Logo & Marka Tasarımı</option><option>Kurumsal Kimlik & Marka Rehberi</option><option>Sosyal Medya Tasarım Sistemleri</option><option>Diğer</option></select></label>
            <label>Mesajınız <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Projenizden biraz bahsedin..." data-testid="contact-message-input" /></label>
            <motion.button type="submit" className="submit-button" disabled={status === "sending"} data-testid="contact-submit-button" whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>{status === "sending" ? "Gönderiliyor..." : "Mesajı gönder"}<ArrowUpRight size={17} /></motion.button>
            {status === "success" && <p className="form-status success" data-testid="contact-success-message">Mesajınız için teşekkürler. En kısa sürede size döneceğiz.</p>}
            {status === "error" && <p className="form-status error" data-testid="contact-error-message">Bir sorun oluştu. Lütfen tekrar deneyin.</p>}
          </form>
        </div>
      </section>

      <footer className="site-footer" data-testid="site-footer">
        <div className="footer-brand footer-mini"><BrandMark image={siteSettings.logo_image} /><span>{(siteSettings.brand_name || "akgvision").toLowerCase()}</span></div>
        <div className="footer-contact"><span>{siteSettings.address}</span>{siteSettings.phone && <span>{siteSettings.phone}</span>}<a href={`mailto:${siteSettings.email}`} data-testid="footer-email-link">{siteSettings.email}</a></div>
        <div className="footer-social">{siteSettings.instagram && <a href={siteSettings.instagram} target="_blank" rel="noreferrer" data-testid="footer-instagram-link">Instagram <Instagram size={14} /></a>}{siteSettings.linkedin && <a href={siteSettings.linkedin} target="_blank" rel="noreferrer" data-testid="footer-linkedin-link">LinkedIn <Linkedin size={14} /></a>}{siteSettings.behance && <a href={siteSettings.behance} target="_blank" rel="noreferrer" data-testid="footer-behance-link">Behance <ArrowUpRight size={14} /></a>}</div>
        <span className="copyright">{siteSettings.copyright}</span>
      </footer>

      <AnimatePresence>
        {activeProject && <CaseModal project={activeProject} onClose={() => setActiveProject(null)} />}
      </AnimatePresence>
    </main>
  );
}

export default App;
