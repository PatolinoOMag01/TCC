import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { api } from "../services/api";

export default function PerfilIntercambio() {
  const [form, setForm] = useState({ destino_pais:"", destino_cidade:"", duracao_meses:"", data_prevista:"", tipo_programa:"", area_interesse:"", instituicao:"", observacoes:"" });
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let ativo = true;
    api.meuPerfilIntercambio()
      .then((d) => {
        if (ativo) setForm({
          destino_pais:d.destino_pais||"", destino_cidade:d.destino_cidade||"", duracao_meses:d.duracao_meses||"", data_prevista:d.data_prevista||"", tipo_programa:d.tipo_programa||"", area_interesse:d.area_interesse||"", instituicao:d.instituicao||"", observacoes:d.observacoes||""
        });
      })
      .catch((e) => { if (ativo) setStatus(e.message); });
    return () => { ativo = false; };
  }, []);
  const change = e => setForm(v => ({...v,[e.target.name]:e.target.value}));
  async function save(e){
    e.preventDefault();
    setStatus("");
    setSaving(true);
    try {
      await api.atualizarPerfilIntercambio({...form, duracao_meses: form.duracao_meses ? Number(form.duracao_meses) : null});
      setStatus("Perfil de intercâmbio salvo!");
    } catch(err){ setStatus(err.message); }
    finally { setSaving(false); }
  }
  return <main style={{maxWidth:900,margin:"40px auto",padding:24}}>
    <Link to="/perfil"><ArrowLeft size={18}/> Voltar</Link>
    <h1>Meu perfil de intercâmbio</h1><p>Esses dados ajudam a InterWay IA a personalizar seu plano.</p>
    <form className="exchange-profile-form" onSubmit={save} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
      <label>País desejado<input name="destino_pais" value={form.destino_pais} onChange={change} /></label>
      <label>Cidade desejada<input name="destino_cidade" value={form.destino_cidade} onChange={change} /></label>
      <label>Duração em meses<input name="duracao_meses" type="number" min="1" max="120" value={form.duracao_meses} onChange={change} /></label>
      <label>Data prevista<input name="data_prevista" type="month" value={form.data_prevista} onChange={change} /></label>
      <label>Tipo de programa<input name="tipo_programa" value={form.tipo_programa} onChange={change} /></label>
      <label>Área de interesse<input name="area_interesse" value={form.area_interesse} onChange={change} /></label>
      <label>Instituição desejada<input name="instituicao" value={form.instituicao} onChange={change} /></label>
      <label style={{gridColumn:"1/-1"}}>Observações<textarea name="observacoes" value={form.observacoes} onChange={change} rows={4} maxLength={2000} /></label>
      <button type="submit" disabled={saving}><Save size={18}/> {saving ? "Salvando..." : "Salvar perfil"}</button>
    </form>{status && <p role="status" aria-live="polite">{status}</p>}
  </main>;
}
