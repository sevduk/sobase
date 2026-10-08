import { useEffect, useState } from "react";
import axios from "axios";
import "@/App.css";

const API = process.env.REACT_APP_BACKEND_URL;
const emptyForm = { name: "", category: "", image: "", galleryText: "", summary: "", year: "2026", client: "", order: 0, published: true };

function formatError(error) {
  const detail = error.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((item) => item.msg).join(" ");
  return error.message;
}

export default function AdminPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem("akg_admin_token") || "");
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");

  const headers = { Authorization: `Bearer ${token}` };

  const loadProjects = async () => {
    const { data } = await axios.get(`${API}/api/admin/projects`, { headers });
    setProjects(data);
  };

  useEffect(() => {
    if (token) loadProjects().catch(() => setMessage("Oturum doğrulanamadı"));
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

  const submit = async (event) => {
    event.preventDefault();
    setMessage("");
    const payload = {
      name: form.name,
      category: form.category,
      image: form.image,
      gallery: form.galleryText.split("\n").map((item) => item.trim()).filter(Boolean),
      summary: form.summary,
      year: form.year,
      client: form.client,
      order: Number(form.order) || 0,
      published: form.published,
    };
    try {
      if (editingId) await axios.put(`${API}/api/admin/projects/${editingId}`, payload, { headers });
      else await axios.post(`${API}/api/admin/projects`, payload, { headers });
      setForm(emptyForm);
      setEditingId("");
      setMessage("Kaydedildi");
      await loadProjects();
    } catch (error) {
      setMessage(formatError(error));
    }
  };

  const edit = (project) => {
    setEditingId(project.id);
    setForm({ ...project, galleryText: project.gallery.join("\n") });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (project) => {
    if (!window.confirm(`${project.name} silinsin mi?`)) return;
    await axios.delete(`${API}/api/admin/projects/${project.id}`, { headers });
    await loadProjects();
  };

  const logout = () => {
    sessionStorage.removeItem("akg_admin_token");
    setToken("");
    setProjects([]);
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
        <div><span className="admin-kicker">AKGVISION</span><h1>Proje Yönetimi</h1></div>
        <button onClick={logout} data-testid="admin-logout-button">Çıkış</button>
      </header>

      <form className="admin-form" onSubmit={submit} data-testid="project-form">
        <h2>{editingId ? "Projeyi Düzenle" : "Yeni Proje Ekle"}</h2>
        <div className="admin-grid">
          <label>Proje Adı<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} data-testid="project-name-input" required /></label>
          <label>Hizmet Kategorisi<input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} data-testid="project-category-input" required /></label>
          <label>Kapak Görseli URL<input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} data-testid="project-image-input" required /></label>
          <label>Yıl<input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} data-testid="project-year-input" required /></label>
          <label>Müşteri / Sektör<input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} data-testid="project-client-input" required /></label>
          <label>Sıralama<input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} data-testid="project-order-input" /></label>
        </div>
        <label>Galeri / Vaka Görselleri (her satıra bir URL)<textarea value={form.galleryText} onChange={(e) => setForm({ ...form, galleryText: e.target.value })} data-testid="project-gallery-input" /></label>
        <label>Vaka Açıklaması<textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} data-testid="project-summary-input" required /></label>
        <label className="admin-toggle"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} data-testid="project-published-toggle" /> Yayında</label>
        <div className="admin-actions">
          <button type="submit" data-testid="project-save-button">{editingId ? "Güncelle" : "Ekle"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(""); setForm(emptyForm); }} data-testid="project-cancel-button">Vazgeç</button>}
        </div>
        {message && <p className="admin-note" data-testid="admin-form-message">{message}</p>}
      </form>

      <section className="admin-list" data-testid="admin-project-list">
        {projects.map((project) => (
          <article key={project.id} className="admin-row" data-testid={`admin-project-${project.id}`}>
            <img src={project.image} alt="" />
            <div><b>{project.name}</b><span>{project.category} • {project.year} • {project.published ? "Yayında" : "Taslak"}</span></div>
            <button onClick={() => edit(project)} data-testid={`edit-${project.id}`}>Düzenle</button>
            <button className="danger" onClick={() => remove(project)} data-testid={`delete-${project.id}`}>Sil</button>
          </article>
        ))}
      </section>
    </main>
  );
}
