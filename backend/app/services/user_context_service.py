import json
from sqlalchemy.orm import Session
from app.models.passport import Passport, CHECKLIST_PADRAO
from app.models.planner import Planner
from app.models.user import User
from app.models.profile import ExchangeProfile

def criar_contexto_usuario(db: Session, usuario: User | None) -> str:
    if usuario is None:
        return "Usuario nao autenticado. Nao afirme que consultou Passport ou Planejador pessoal."
    partes = [f"USUARIO AUTENTICADO: nome={usuario.nome}."]
    passport = db.query(Passport).filter(Passport.usuario_id == usuario.id).first()
    if passport:
        try: checklist = json.loads(passport.checklist)
        except (TypeError, json.JSONDecodeError): checklist = CHECKLIST_PADRAO
        pendentes = [i.get('titulo') for i in checklist if not i.get('concluido')]
        concluidos = sum(1 for i in checklist if i.get('concluido'))
        total = len(checklist)
        partes.append(
            "PASSPORT REAL DO USUARIO: "
            f"pais={passport.pais or 'nao informado'}; cidade={passport.cidade or 'nao informada'}; "
            f"objetivo={passport.objetivo or 'nao informado'}; nivel_idioma={passport.nivel_idioma or 'nao informado'}; "
            f"orcamento={passport.orcamento if passport.orcamento is not None else 'nao informado'} BRL; "
            f"checklist={concluidos}/{total}; pendentes={', '.join(pendentes) if pendentes else 'nenhum'}."
        )
    else:
        partes.append("PASSPORT: ainda nao existe registro para este usuario.")
    planner = db.query(Planner).filter(Planner.usuario_id == usuario.id).first()
    if planner:
        meta, guardado, mensal = planner.meta or 0, planner.guardado or 0, planner.mensal or 0
        falta = max(meta - guardado, 0)
        progresso = min(round((guardado/meta)*100),100) if meta else 0
        meses = ((falta + mensal - 1)//mensal) if falta and mensal else 0
        partes.append(
            "PLANEJADOR REAL DO USUARIO: "
            f"destino={planner.destino or 'nao informado'}; meta={meta} BRL; guardado={guardado} BRL; "
            f"mensal={mensal} BRL; falta={falta} BRL; progresso={progresso}%; meses_estimados={meses}."
        )
    else:
        partes.append("PLANEJADOR: ainda nao existe planejamento salvo no servidor.")
    perfil = db.query(ExchangeProfile).filter(ExchangeProfile.usuario_id == usuario.id).first()
    if perfil:
        partes.append(
            "PERFIL DE INTERCAMBIO REAL: "
            f"destino={perfil.destino_cidade or 'nao informado'}, {perfil.destino_pais or 'nao informado'}; "
            f"duracao_meses={perfil.duracao_meses or 'nao informada'}; data_prevista={perfil.data_prevista or 'nao informada'}; "
            f"tipo_programa={perfil.tipo_programa or 'nao informado'}; area={perfil.area_interesse or 'nao informada'}; "
            f"instituicao={perfil.instituicao or 'nao informada'}; observacoes={perfil.observacoes or 'nenhuma'}."
        )
    return "\n".join(partes)
