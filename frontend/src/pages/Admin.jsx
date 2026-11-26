import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, Globe2, LayoutDashboard, MessageSquare, Pencil, Plus, Search, ShieldCheck, Trash2, Users, X } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useDestinations } from "../context/DestinationsContext";
import logo from "../assets/logo.png";
import "../styles/Admin.css";

const sections = [{ id: "usuarios", label: "Usuários", icon: Users, text: "Gerencie as contas e o acesso à plataforma." }, { id: "comunidade", label: "Comunidade", icon: MessageSquare, text: "Cuide das conversas e mantenha a comunidade acolhedora." }, { id: "destinos", label: "Destinos", icon: Globe2, text: "Organize os lugares que inspiram a próxima viagem." }];
const blank = { slug: "", pais: "", cidade: "", cidades: [], bandeira: "", continente: "Europa", idioma: "", moeda: "", destaque: "", imagem: "", descricao: "", texto: "", beneficios: [], match: { objetivos: ["idioma", "experiencia"], idiomas: [], orcamento: 2, duracoes: ["3-meses", "6-meses"], clima: ["moderado"], trabalho: false } };
const date = value => new Date(value).toLocaleDateString("pt-BR");

function Editor({ editor, busy, error, onClose, onSave }) {
  const [form, setForm] = useState(editor.data);
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close(); }, []);
  const field = (key, label, { type = "text", required = true, maxLength = 120, disabled = false } = {}) => <label key={key}>{label}<input name={key} value={form[key] || ""} type={type} required={required} maxLength={maxLength} disabled={disabled} onChange={e => setForm({ ...form, [key]: e.target.value })} /></label>;
  const list = (key, label) => <label key={key}>{label}<input value={form[key].join(", ")} onChange={e => setForm({ ...form, [key]: e.target.value.split(",").map(v => v.trim()) })} /></label>;
  return <dialog ref={ref} className="admin-dialog" onCancel={e => { e.preventDefault(); if (!busy) onClose(); }}>
    <form onSubmit={e => { e.preventDefault(); onSave(form); }}>
      <div className="admin-dialog-title"><div><span className="admin-eyebrow">INTERWAY ADMIN</span><h2>{editor.kind === "usuario" ? "Editar usuário" : editor.existing ? "Editar destino" : "Novo destino"}</h2></div><button type="button" className="admin-icon" aria-label="Fechar formulário" disabled={busy} onClick={onClose}><X size={20} /></button></div>
      <fieldset disabled={busy} className="admin-fields">
        {editor.kind === "usuario" ? <>{field("nome", "Nome", { maxLength: 120 })}{field("email", "E-mail", { type: "email", maxLength: 180, disabled: form.is_admin })}<label className="admin-checkbox"><input type="checkbox" checked={form.bloqueado} disabled={form.is_admin} onChange={e => setForm({ ...form, bloqueado: e.target.checked })} />Bloquear acesso à conta</label><p className="admin-hint">O bloqueio impede novos logins e invalida o acesso das sessões existentes. Contas administrativas são configuradas no servidor.</p></> : <>
          <div className="admin-form-grid">{field("pais", "País")}{field("cidade", "Cidade principal")}{field("slug", "Identificador (ex.: nova-zelandia)", { disabled: editor.existing, maxLength: 100 })}{field("continente", "Continente")}{field("idioma", "Idioma")}{field("moeda", "Moeda")}{field("bandeira", "Bandeira (emoji)", { required: false, maxLength: 20 })}{field("destaque", "Destaque", { required: false })}</div>
          {field("imagem", "URL da imagem", { type: "url", maxLength: 2000 })}
          {list("cidades", "Cidades (separadas por vírgula)")}
          <label>Descrição curta<textarea required minLength={10} maxLength={2000} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} /></label>
          <label>Sobre o destino<textarea required minLength={10} maxLength={10000} rows={4} value={form.texto} onChange={e => setForm({ ...form, texto: e.target.value })} /></label>
          {list("beneficios", "Benefícios (separados por vírgula)")}
          <div className="admin-form-grid"><label>Idiomas no Match (ex.: ingles, frances)<input value={form.match.idiomas.join(", ")} onChange={e => setForm({ ...form, match: { ...form.match, idiomas: e.target.value.split(",").map(v => v.trim()).filter(Boolean) } })} /></label><label>Faixa de orçamento<select value={form.match.orcamento} onChange={e => setForm({ ...form, match: { ...form.match, orcamento: Number(e.target.value) } })}><option value={1}>Até R$ 10 mil</option><option value={2}>R$ 10 mil a R$ 20 mil</option><option value={3}>R$ 20 mil a R$ 40 mil</option><option value={4}>Acima de R$ 40 mil</option></select></label></div>
        </>}
      </fieldset>
      {error && <p role="alert" className="admin-error">{error}</p>}
      <div className="admin-dialog-actions"><button type="button" disabled={busy} onClick={onClose}>Cancelar</button><button type="submit" className="admin-primary" disabled={busy}>{busy ? "Salvando..." : "Salvar alterações"}</button></div>
    </form>
  </dialog>;
}

function Confirm({ item, busy, error, onClose, onConfirm }) {
  const ref = useRef(null);
  useEffect(() => { const dialog = ref.current; dialog.showModal(); return () => dialog.close(); }, []);
  return <dialog ref={ref} className="admin-dialog admin-confirm" onCancel={e => { e.preventDefault(); if (!busy) onClose(); }}><h2>{item.kind === "destino" ? "Excluir destino?" : "Excluir mensagem?"}</h2><p>{item.label}</p><p>Esta ação é permanente.</p>{error && <p role="alert" className="admin-error">{error}</p>}<div className="admin-dialog-actions"><button disabled={busy} onClick={onClose}>Cancelar</button><button disabled={busy} className="admin-danger" onClick={onConfirm}>{busy ? "Excluindo..." : "Confirmar exclusão"}</button></div></dialog>;
}

export default function Admin() {
  const { usuario } = useAuth();
  const { atualizarDestinos } = useDestinations();
  const [tab, setTab] = useState("usuarios");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ itens: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [revision, setRevision] = useState(0);
  const [editor, setEditor] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const section = sections.find(s => s.id === tab);
  useEffect(() => {
    let active = true;
    api.adminListar(tab, query, page).then(result => {
      if (active) { setData(tab === "destinos" ? { itens: result, total: result.length } : result); setError(""); }
    }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [tab, query, page, revision]);
  function select(id) { setTab(id); setSearch(""); setQuery(""); setPage(1); setLoading(true); setError(""); setNotice(""); }
  function reload() { setLoading(true); setRevision(v => v + 1); }
  async function mutate(action, message) {
    setBusy(true); setFormError("");
    try {
      await action();
      setEditor(null); setConfirm(null); setNotice(message);
      if (tab === "destinos") {
        try { await atualizarDestinos(); } catch { setNotice(`${message} Atualize o site para recarregar o catálogo público.`); }
      }
      if (confirm && page > 1 && data.itens.length === 1) { setPage(page - 1); setLoading(true); } else reload();
    } catch (e) { setFormError(e.message); } finally { setBusy(false); }
  }
  const rows = tab === "destinos" ? data.itens.filter(d => `${d.pais} ${d.cidade} ${d.continente}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR"))) : data.itens;
  return <main className="admin-shell">
    <aside className="admin-sidebar"><Link to="/" className="admin-brand"><img src={logo} alt="Logo InterWay" /><span>Inter<span>Way</span><small>ADMINISTRAÇÃO</small></span></Link><span className="admin-menu-label">PRINCIPAL</span><nav aria-label="Seções administrativas">{sections.map(({ id, label, icon: Icon }) => <button key={id} className={tab === id ? "active" : ""} aria-current={tab === id ? "page" : undefined} onClick={() => select(id)}><Icon size={20} />{label}<ChevronRight size={16} /></button>)}</nav><div className="admin-sidebar-bottom"><div className="admin-avatar">{usuario.nome.slice(0, 1).toUpperCase()}</div><div><strong>{usuario.nome}</strong><small>Administrador</small></div></div><Link className="admin-back" to="/"><ArrowLeft size={17} />Voltar ao site</Link></aside>
    <div className="admin-content"><header className="admin-topbar"><span><LayoutDashboard size={17} />Administração <span>/</span> <strong>{section.label}</strong></span><span className="admin-access"><ShieldCheck size={16} />Acesso administrativo</span></header>
      <div className="admin-body"><span className="admin-eyebrow">PAINEL DE CONTROLE</span><div className="admin-heading"><div><h1>{section.label}</h1><p>{section.text}</p></div>{tab === "destinos" && <button className="admin-primary" onClick={() => { setFormError(""); setEditor({ kind: "destino", data: structuredClone(blank), existing: false }); }}><Plus size={18} />Novo destino</button>}</div>
        <div className="admin-overview"><div className="admin-overview-icon"><section.icon size={25} /></div><div><span>{tab === "usuarios" ? "Contas cadastradas" : tab === "comunidade" ? "Mensagens publicadas" : "Destinos no catálogo"}</span><strong>{loading || error ? "—" : data.total}</strong></div><span className="admin-overview-caption">{query && tab !== "destinos" ? "Resultados da busca" : "Dados da plataforma"}</span></div>
        {notice && <p role="status" className="admin-notice"><Check size={18} />{notice}</p>}
        <section className="admin-panel" aria-label={`Gerenciar ${section.label.toLowerCase()}`}><div className="admin-panel-heading"><div><h2>{tab === "usuarios" ? "Todos os usuários" : tab === "comunidade" ? "Conversas da comunidade" : "Catálogo de destinos"}</h2><p>{tab === "usuarios" ? "Edite os dados e controle o acesso das contas." : tab === "comunidade" ? "Revise e remova mensagens quando necessário." : "As alterações são publicadas no catálogo do site."}</p></div><form className="admin-search" onSubmit={e => { e.preventDefault(); setQuery(search.trim()); setPage(1); setLoading(true); setRevision(v => v + 1); }}><Search size={18} /><input aria-label={`Buscar ${section.label.toLowerCase()}`} placeholder={tab === "usuarios" ? "Buscar nome ou e-mail..." : tab === "comunidade" ? "Buscar mensagem ou autor..." : "Buscar país ou cidade..."} value={search} onChange={e => setSearch(e.target.value)} /><button type="submit">Buscar</button></form></div>
          {loading ? <div className="admin-empty" role="status">Carregando {section.label.toLowerCase()}...</div> : error ? <div className="admin-empty" role="alert"><p>{error}</p><button onClick={reload}>Tentar novamente</button></div> : rows.length === 0 ? <div className="admin-empty"><Search size={30} /><h3>Nenhum resultado encontrado</h3><p>{query ? "Tente buscar por outro termo." : "Os registros aparecerão aqui quando forem cadastrados."}</p></div> : <div className="admin-table-wrap"><table><thead><tr>{(tab === "usuarios" ? ["Usuário", "Cadastro", "Acesso", "Ações"] : tab === "comunidade" ? ["Autor", "Mensagem", "Publicação", "Ações"] : ["Destino", "Continente", "Idioma", "Ações"]).map(h => <th key={h} scope="col">{h}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.id || row.slug}>{tab === "usuarios" ? <><td><div className="admin-person"><span className="admin-avatar">{row.nome.slice(0, 1).toUpperCase()}</span><div><strong>{row.nome}</strong><small>{row.email}</small></div></div></td><td>{date(row.criado_em)}</td><td><span className={`admin-badge ${row.bloqueado ? "blocked" : ""}`}>{row.is_admin ? "Administrador" : row.bloqueado ? "Bloqueado" : "Ativo"}</span></td><td><button className="admin-action" onClick={() => { setFormError(""); setEditor({ kind: "usuario", data: row }); }}><Pencil size={15} />Editar</button></td></> : tab === "comunidade" ? <><td><strong>{row.nome}</strong><small className="admin-id">Usuário #{row.usuario_id}</small></td><td className="admin-message">{row.mensagem}</td><td>{date(row.criado_em)}</td><td><button className="admin-action danger" onClick={() => { setFormError(""); setConfirm({ kind: "mensagem", id: row.id, label: `Mensagem de ${row.nome}: ${row.mensagem}` }); }}><Trash2 size={15} />Excluir</button></td></> : <><td><div className="admin-person"><span className="admin-destination-flag">{row.bandeira || "🌎"}</span><div><strong>{row.pais}</strong><small>{row.cidade}</small></div></div></td><td>{row.continente}</td><td>{row.idioma}</td><td><div className="admin-row-actions"><button className="admin-action" onClick={() => { setFormError(""); setEditor({ kind: "destino", data: structuredClone(row), existing: true }); }}><Pencil size={15} />Editar</button><button className="admin-icon danger" aria-label={`Excluir ${row.pais}`} onClick={() => { setFormError(""); setConfirm({ kind: "destino", id: row.slug, label: `${row.pais} — ${row.cidade}` }); }}><Trash2 size={16} /></button></div></td></>}</tr>)}</tbody></table></div>}
          {!loading && !error && <footer className="admin-pagination"><span>{tab === "destinos" ? `${rows.length} destinos` : `${data.total} registros · Página ${page} de ${Math.max(1, Math.ceil(data.total / 20))}`}</span>{tab !== "destinos" && <div><button aria-label="Página anterior" disabled={page === 1} onClick={() => { setPage(page - 1); setLoading(true); }}><ChevronLeft size={18} /></button><button aria-label="Próxima página" disabled={page * 20 >= data.total} onClick={() => { setPage(page + 1); setLoading(true); }}><ChevronRight size={18} /></button></div>}</footer>}
        </section><p className="admin-footnote"><ShieldCheck size={15} />InterWay · Administração da plataforma</p>
      </div>
    </div>
    {editor && <Editor editor={editor} busy={busy} error={formError} onClose={() => setEditor(null)} onSave={form => mutate(() => editor.kind === "usuario" ? api.adminSalvarUsuario(form.id, { nome: form.nome, email: form.email, bloqueado: form.bloqueado }) : api.adminSalvarDestino(form, editor.existing), "Alterações salvas com sucesso.")} />}
    {confirm && <Confirm item={confirm} busy={busy} error={formError} onClose={() => setConfirm(null)} onConfirm={() => mutate(() => confirm.kind === "destino" ? api.adminApagarDestino(confirm.id) : api.adminApagarMensagem(confirm.id), "Registro excluído com sucesso.")} />}
  </main>;
}
