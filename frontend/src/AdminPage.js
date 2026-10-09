import { useEffect, useState } from "react";
import axios from "axios";
import "@/App.css";

const API = process.env.REACT_APP_BACKEND_URL;
const emptyProject = { name: "", category: "", image: "", galleryText: "", summary: "", year: "2026", client: "", order: 0, published: true };
const emptyLogo = { name: "", image: "", order: 0 };

function formatError(error) {
  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg).join(" ");
  return error.message;
}

function readFiles(files) {
  return Promise.all(Array.from(files).map((file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  })));
}

function DropZone({ label, multiple, onFiles, testid }) {
  return (
    <label className="drop-zone" data-testid={testid} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); onFiles(event.dataTransfer.files); }}>
      {label}
      <input type="file" accept="image/png,image/jpeg,image/webp" multiple={multiple} onChange={(event) => onFiles(event.target.files)} hidden />
    </label>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem("akg_admin_token") || "");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [logos, setLogos] = useState([]);
  const [settings, setSettings] = useState({ hero_title: "", hero_copy: "", hero_cta_text: "Projeleri keşfet", hero_cta_target: "projects", location: "", email: "", phone: "", address: "", brand_name: "AKGVISION", brand_tagline: "DİJİTAL ÇÖZÜMLER & BİLİŞİM STÜDYOSU", logo_image: "", instagram: "", linkedin: "", behance: "", copyright: "" });
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [logoForm, setLogoForm] = useState(emptyLogo);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  const loadAll = async () => {
    const [projectData, serviceData, logoData, settingsData] = await Promise.all([
      axios.get(`${API}/api/admin/projects`, { headers }),
      axios.get(`${API}/api/services`),
      axios.get(`${API}/api/admin/logos`, { headers }),
      axios.get(`${API}/api/settings`),
    ]);
    setProjects(projectData.data);
    setServices(serviceData.data);
    setLogos(logoData.data);
    setSettings(settingsData.data);
  };

  useEffect(() => {
    if (token) loadAll().catch((error) => setMessage(formatError(error)));
  }, [token]);

  const login = async (event) => {
    event.preventDefault();
    setMessage("");
    try {
      const { data } = await axios.post(`${API}/api/admin/login`, { password });
      sessionStorage.setItem("akg_admin_token", data.access_token);
      setToken(data.access_token);
      setPassword("");
    } catch (error) {
      setMessage(formatError(error));
    }
  };

  const saveProject = async (event) => {
    event.preventDefault();
    setMessage("");
    const payload = {
      name: projectForm.name,
      category: projectForm.category,
      image: projectForm.image,
      gallery: projectForm.galleryText.split("\n").map((item) => item.trim()).filter(Boolean),
      summary: projectForm.summary,
      year: projectForm.year,
      client: projectForm.client,
      order: Number(projectForm.order) || 0,
      published: projectForm.published,
    };
    try {
      if (editingId) await axios.put(`${API}/api/admin/projects/${editingId}`, payload, { headers });
      else await axios.post(`${API}/api/admin/projects`, payload, { headers });
      setProjectForm(emptyProject);
      setEditingId("");
      setMessage("Proje kaydedildi");
      await loadAll();
    } catch (error) {
      setMessage(formatError(error));
    }
  };

  const saveServices = async () => {
    await axios.put(`${API}/api/admin/services`, { services }, { headers });
    setMessage("Hizmetler kaydedildi");
  };

  const saveLogo = async (event) => {
    event.preventDefault();
    await axios.post(`${API}/api/admin/logos`, { ...logoForm, order: Number(logoForm.order) || 0 }, { headers });
    setLogoForm(emptyLogo);
    setMessage("Logo eklendi");
    await loadAll();
  };

  const saveSettings = async () => {
    await axios.put(`${API}/api/admin/settings`, settings, { headers });
    setMessage("Genel ayarlar kaydedildi");
  };

  const logout = () => {
    sessionStorage.removeItem("akg_admin_token");
    setToken("");
  };

  if (!token) {
    return (
      <main className="admin-shell" data-testid="admin-login-screen">
        <form className="admin-login" onSubmit={login}>
          <span className="admin-kicker">AKGVISION / GİZLİ PANEL</span>
          <h1>Yönetici Girişi</h1>
          <label>Admin Parolası / PIN
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} data-testid="admin-password-input" required />
          </label>
          <button type="submit" data-testid="admin-login-button">Panele gir</button>
          {message && <p className="admin-error" data-testid="admin-login-error">{message}</p>}
        </form>
      </main>
    );
  }

  return (
    <main className="admin-shell" data-testid="admin-panel">
      <header className="admin-top">
        <div><span className="admin-kicker">AKGVISION</span><h1>Yönetim Merkezi</h1></div>
        <button onClick={logout} data-testid="admin-logout-button">Çıkış</button>
      </header>

      <nav className="admin-tabs" data-testid="admin-tabs">
        {[["projects", "Projeler"], ["services", "Hizmetler"], ["logos", "Logolar Vitrini"], ["settings", "Genel & Hero Ayarları"]].map(([key, label]) => (
          <button key={key} className={tab === key ? "active" : ""} onClick={() => setTab(key)} data-testid={`tab-${key}`}>{label}</button>
        ))}
      </nav>
      {message && <p className="admin-note" data-testid="admin-message">{message}</p>}

      {tab === "projects" && (
        <>
          <form className="admin-form" onSubmit={saveProject} data-testid="project-form">
            <h2>{editingId ? "Projeyi Düzenle" : "Yeni Proje Ekle"}</h2>
            <div className="admin-grid">
              <label>Proje Adı<input value={projectForm.name} onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })} data-testid="project-name-input" required /></label>
              <label>Hizmet Kategorisi<input value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} data-testid="project-category-input" required /></label>
              <label>Müşteri / Sektör (opsiyonel)<input value={projectForm.client} onChange={(e) => setProjectForm({ ...projectForm, client: e.target.value })} data-testid="project-client-input" /></label>
              <label>Yıl<input value={projectForm.year} onChange={(e) => setProjectForm({ ...projectForm, year: e.target.value })} data-testid="project-year-input" required /></label>
              <label>Sıralama<input type="number" value={projectForm.order} onChange={(e) => setProjectForm({ ...projectForm, order: e.target.value })} data-testid="project-order-input" /></label>
              <label className="admin-toggle"><input type="checkbox" checked={projectForm.published} onChange={(e) => setProjectForm({ ...projectForm, published: e.target.checked })} data-testid="project-published-toggle" /> Yayında</label>
            </div>
            <DropZone label="Bilgisayardan kapak görseli seç veya buraya bırak" onFiles={async (files) => { const [image] = await readFiles(files); setProjectForm({ ...projectForm, image }); }} testid="cover-drop-zone" />
            <label>Kapak Görseli URL (alternatif)<input value={projectForm.image} onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })} data-testid="project-image-input" /></label>
            {projectForm.image && <img className="thumb-preview" src={projectForm.image} alt="Kapak önizleme" data-testid="cover-preview" />}
            <DropZone label="Galeri görselleri seç / bırak (çoklu)" multiple onFiles={async (files) => { const images = await readFiles(files); setProjectForm({ ...projectForm, galleryText: [...projectForm.galleryText.split("\n").filter(Boolean), ...images].join("\n") }); }} testid="gallery-drop-zone" />
            <label>Galeri / Vaka Görselleri URL'leri (her satıra bir adet)<textarea value={projectForm.galleryText} onChange={(e) => setProjectForm({ ...projectForm, galleryText: e.target.value })} data-testid="project-gallery-input" /></label>
            {projectForm.galleryText && <div className="thumb-row" data-testid="gallery-previews">{projectForm.galleryText.split("\n").filter(Boolean).map((image, index) => <span className="thumb-item" key={index}><img src={image} alt={`Galeri ${index + 1}`} /><button type="button" aria-label="Görseli kaldır" onClick={() => setProjectForm({ ...projectForm, galleryText: projectForm.galleryText.split("\n").filter(Boolean).filter((_, i) => i !== index).join("\n") })}>×</button></span>)}</div>}
            <label>Vaka Açıklaması<textarea value={projectForm.summary} onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })} data-testid="project-summary-input" required /></label>
            <div className="admin-actions">
              <button type="submit" data-testid="project-save-button">{editingId ? "Güncelle" : "Ekle"}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(""); setProjectForm(emptyProject); }} data-testid="project-cancel-button">Vazgeç</button>}
            </div>
          </form>
          <section className="admin-list" data-testid="admin-project-list">
            {projects.map((project) => (
              <article key={project.id} className="admin-row" data-testid={`admin-project-${project.id}`}>
                <img src={project.image} alt="" />
                <div><b>{project.name}</b><span>{project.category} • {project.year}{project.client ? ` • ${project.client}` : ""} • {project.published ? "Yayında" : "Taslak"}</span></div>
                <button onClick={() => { setEditingId(project.id); setProjectForm({ ...project, galleryText: project.gallery.join("\n") }); window.scrollTo({ top: 0, behavior: "smooth" }); }} data-testid={`edit-${project.id}`}>Düzenle</button>
                <button className="danger" onClick={async () => { if (window.confirm(`${project.name} silinsin mi?`)) { await axios.delete(`${API}/api/admin/projects/${project.id}`, { headers }); await loadAll(); } }} data-testid={`delete-${project.id}`}>Sil</button>
              </article>
            ))}
          </section>
        </>
      )}

      {tab === "services" && (
        <section className="admin-form" data-testid="services-tab">
          <h2>Hizmet Kartları</h2>
          {services.map((service, index) => (
            <div className="admin-grid two" key={index} data-testid={`service-row-${index + 1}`}>
              <label>Başlık<input value={service.title} onChange={(e) => setServices(services.map((item, i) => i === index ? { ...item, title: e.target.value } : item))} /></label>
              <label>Kısa Açıklama<input value={service.note} onChange={(e) => setServices(services.map((item, i) => i === index ? { ...item, note: e.target.value } : item))} /></label>
            </div>
          ))}
          <button onClick={saveServices} data-testid="services-save-button">Hizmetleri Kaydet</button>
        </section>
      )}

      {tab === "logos" && (
        <section data-testid="logos-tab">
          <form className="admin-form" onSubmit={saveLogo}>
            <h2>Logo Ekle</h2>
            <div className="admin-grid two">
              <label>Marka Adı<input value={logoForm.name} onChange={(e) => setLogoForm({ ...logoForm, name: e.target.value })} data-testid="logo-name-input" required /></label>
              <label>Sıralama<input type="number" value={logoForm.order} onChange={(e) => setLogoForm({ ...logoForm, order: e.target.value })} data-testid="logo-order-input" /></label>
            </div>
            <DropZone label="Logo dosyası seç veya bırak" onFiles={async (files) => { const [image] = await readFiles(files); setLogoForm({ ...logoForm, image }); }} testid="logo-drop-zone" />
            <label>Logo URL (alternatif)<input value={logoForm.image} onChange={(e) => setLogoForm({ ...logoForm, image: e.target.value })} data-testid="logo-url-input" /></label>
            {logoForm.image && <img className="thumb-preview logo" src={logoForm.image} alt="Logo önizleme" data-testid="logo-preview" />}
            <button type="submit" data-testid="logo-save-button">Logoyu Ekle</button>
          </form>
          <section className="admin-list">
            {logos.map((logo) => (
              <article key={logo.id} className="admin-row" data-testid={`admin-logo-${logo.id}`}>
                <img src={logo.image} alt="" />
                <div><b>{logo.name}</b><span>Sıra: {logo.order}</span></div>
                <span />
                <button className="danger" onClick={async () => { await axios.delete(`${API}/api/admin/logos/${logo.id}`, { headers }); await loadAll(); }} data-testid={`delete-logo-${logo.id}`}>Sil</button>
              </article>
            ))}
          </section>
        </section>
      )}

      {tab === "settings" && (
        <section className="admin-form" data-testid="settings-tab">
          <h2>Genel & Hero Ayarları</h2>
          <DropZone label="Marka logosu seç veya bırak" onFiles={async (files) => { const [image] = await readFiles(files); setSettings({ ...settings, logo_image: image }); }} testid="brand-logo-drop-zone" />
          {settings.logo_image && <img className="thumb-preview logo" src={settings.logo_image} alt="Marka logosu önizleme" data-testid="brand-logo-preview" />}
          <div className="admin-grid two">
            <label>Marka Adı<input value={settings.brand_name} onChange={(e) => setSettings({ ...settings, brand_name: e.target.value })} data-testid="settings-brand-name" /></label>
            <label>Alt Slogan<input value={settings.brand_tagline} onChange={(e) => setSettings({ ...settings, brand_tagline: e.target.value })} data-testid="settings-brand-tagline" /></label>
          </div>
          <label>Hero Büyük Başlığı (her satır yeni satır)<textarea value={settings.hero_title} onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })} data-testid="settings-hero-title" /></label>
          <label>Hero Alt Açıklama<textarea value={settings.hero_copy} onChange={(e) => setSettings({ ...settings, hero_copy: e.target.value })} data-testid="settings-hero-copy" /></label>
          <div className="admin-grid two">
            <label>CTA Buton Metni<input value={settings.hero_cta_text} onChange={(e) => setSettings({ ...settings, hero_cta_text: e.target.value })} data-testid="settings-cta-text" /></label>
            <label>CTA Hedef ID<input value={settings.hero_cta_target} onChange={(e) => setSettings({ ...settings, hero_cta_target: e.target.value })} data-testid="settings-cta-target" /></label>
          </div>
          <div className="admin-grid two">
            <label>Konum / Yıl<input value={settings.location} onChange={(e) => setSettings({ ...settings, location: e.target.value })} data-testid="settings-location" /></label>
            <label>İletişim E-postası<input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} data-testid="settings-email" /></label>
          </div>
          <div className="admin-grid two">
            <label>Telefon<input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} data-testid="settings-phone" /></label>
            <label>Adres<input value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} data-testid="settings-address" /></label>
          </div>
          <div className="admin-grid two">
            <label>Instagram URL<input value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} data-testid="settings-instagram" /></label>
            <label>LinkedIn URL<input value={settings.linkedin} onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })} data-testid="settings-linkedin" /></label>
          </div>
          <div className="admin-grid two">
            <label>Behance URL<input value={settings.behance} onChange={(e) => setSettings({ ...settings, behance: e.target.value })} data-testid="settings-behance" /></label>
            <label>Telif Metni<input value={settings.copyright} onChange={(e) => setSettings({ ...settings, copyright: e.target.value })} data-testid="settings-copyright" /></label>
          </div>
          <button type="button" onClick={saveSettings} data-testid="settings-save-button">Ayarları Kaydet</button>
        </section>
      )}
    </main>
  );
}
