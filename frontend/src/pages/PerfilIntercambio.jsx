import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { api } from "../services/api";

export default function PerfilIntercambio() {
  const [form, setForm] = useState({ destino_pais:"", destino_cidade:"", duracao_meses:"", data_prevista:"", tipo_programa:"", area_interesse:"", instituicao:"", observacoes:"" });
  const [status, setStatus] = useState("");
  useEffect(() => { api.meuPerfilIntercambio().then(d => setForm({
    destino_pais:d.destino_pais||"", destino_cidade:d.destino_cidade||"", duracao_meses:d.duracao_meses||"", data_prevista:d.data_prevista||"", tipo_programa:d.tipo_programa||"", area_interesse:d.area_interesse||"", instituicao:d.instituicao||"", observacoes:d.observacoes||""
  })).catch(e => setStatus(e.message)); }, []);
  const change = e => setForm(v => ({...v,[e.target.name]:e.target.value}));
  async function save(e){ e.preventDefault(); setStatus(""); try { await api.atualizarPerfilIntercambio({...form, duracao_meses: form.duracao_meses ? Number(form.duracao_meses) : null}); setStatus("Perfil de intercâmbio salvo!"); } catch(err){ setStatus(err.message); } }
  return <main style={{maxWidth:900,margin:"40px auto",padding:24}}>
    <Link to="/perfil"><ArrowLeft size={18}/> Voltar</Link>
    <h1>Meu perfil de intercâmbio</h1><p>Esses dados ajudam a InterWay IA a personalizar seu plano.</p>
    <form onSubmit={save} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:16}}>
      <input name="destino_pais" value={form.destino_pais} onChange={change} placeholder="País desejado" />
      <input name="destino_cidade" value={form.destino_cidade} onChange={change} placeholder="Cidade desejada" />
      <input name="duracao_meses" type="number" min="1" value={form.duracao_meses} onChange={change} placeholder="Duração em meses" />
      <input name="data_prevista" value={form.data_prevista} onChange={change} placeholder="Data prevista (ex.: 2027-07)" />
      <input name="tipo_programa" value={form.tipo_programa} onChange={change} placeholder="Tipo de programa" />
      <input name="area_interesse" value={form.area_interesse} onChange={change} placeholder="Área de interesse" />
      <input name="instituicao" value={form.instituicao} onChange={change} placeholder="Instituição desejada" />
      <textarea name="observacoes" value={form.observacoes} onChange={change} placeholder="Observações" rows={4} style={{gridColumn:"1/-1"}} />
      <button type="submit"><Save size={18}/> Salvar perfil</button>
    </form>{status && <p>{status}</p>}
  </main>;
}
