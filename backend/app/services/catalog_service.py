BOLSAS = [{'nome': 'Bolsa InterWay Canadá', 'pais': 'Canadá', 'percentual': 'Até 40%', 'area': 'Geral', 'dataFim': '2026-06-30'}, {'nome': 'Bolsa Europa Acadêmica', 'pais': 'Europa', 'percentual': 'Até 50%', 'area': 'Acadêmico', 'dataFim': '2026-07-31'}, {'nome': 'Bolsa Global de Tecnologia', 'pais': 'Vários', 'percentual': 'Até 60%', 'area': 'Tecnologia', 'dataFim': '2026-08-31'}, {'nome': 'Bolsa Novos Horizontes', 'pais': 'Internacional', 'percentual': 'Até 35%', 'area': 'Primeira viagem', 'dataFim': '2026-09-30'}, {'nome': 'Bolsa Excelência Acadêmica', 'pais': 'Vários', 'percentual': 'Até 70%', 'area': 'Excelência', 'dataFim': '2026-10-31'}, {'nome': 'Bolsa Idiomas no Exterior', 'pais': 'Irlanda / Reino Unido', 'percentual': 'Até 45%', 'area': 'Idiomas', 'dataFim': '2026-12-15'}]

VAGAS = [{'titulo': 'Atendente de Cafeteria', 'empresa': 'Maple Coffee House', 'area': 'Atendimento', 'pais': 'Canadá', 'cidade': 'Toronto', 'tipo': 'Meio período', 'salario': 'CAD 18 / hora', 'idioma': 'Inglês intermediário', 'dataLimite': '2026-12-20'}, {'titulo': 'Estágio em Marketing Digital', 'empresa': 'Global Connect', 'area': 'Marketing', 'pais': 'Canadá', 'cidade': 'Vancouver', 'tipo': 'Estágio', 'salario': 'CAD 20 / hora', 'idioma': 'Inglês intermediário', 'dataLimite': '2027-01-15'}, {'titulo': 'Auxiliar Administrativo', 'empresa': 'London Business Center', 'area': 'Administração', 'pais': 'Inglaterra', 'cidade': 'Londres', 'tipo': 'Tempo integral', 'salario': '£13 / hora', 'idioma': 'Inglês avançado', 'dataLimite': '2026-11-30'}, {'titulo': 'Recepcionista de Hotel', 'empresa': 'Royal Stay Hotel', 'area': 'Hotelaria e Turismo', 'pais': 'Irlanda', 'cidade': 'Dublin', 'tipo': 'Tempo integral', 'salario': '€15 / hora', 'idioma': 'Inglês avançado', 'dataLimite': '2027-02-10'}, {'titulo': 'Desenvolvedor Web Júnior', 'empresa': 'Tech World', 'area': 'Tecnologia', 'pais': 'Austrália', 'cidade': 'Sydney', 'tipo': 'Tempo integral', 'salario': 'AUD 30 / hora', 'idioma': 'Inglês intermediário', 'dataLimite': '2027-01-30'}, {'titulo': 'Assistente de Vendas', 'empresa': 'Paris Fashion Store', 'area': 'Vendas', 'pais': 'França', 'cidade': 'Paris', 'tipo': 'Meio período', 'salario': '€14 / hora', 'idioma': 'Francês', 'dataLimite': '2026-12-15'}]

def contexto_catalogos(mensagem: str) -> str:
    texto = mensagem.lower()
    partes = []
    if any(x in texto for x in ["bolsa", "bolsas", "auxilio", "auxílio"]):
        partes.append("CATALOGO INTERNO DE BOLSAS (dados demonstrativos do InterWay; nao trate como oportunidades oficiais atuais):")
        for b in BOLSAS:
            partes.append(f"- {b.get('nome')} | {b.get('pais')} | {b.get('percentual')} | area {b.get('area')} | prazo {b.get('dataFim')}")
    if any(x in texto for x in ["vaga", "vagas", "emprego", "trabalho", "estagio", "estágio"]):
        partes.append("CATALOGO INTERNO DE VAGAS (dados demonstrativos do InterWay; nao trate como vagas oficiais atuais):")
        for v in VAGAS:
            partes.append(f"- {v.get('titulo')} - {v.get('empresa')} | {v.get('cidade')}, {v.get('pais')} | {v.get('tipo')} | {v.get('salario')} | {v.get('idioma')} | prazo {v.get('dataLimite')}")
    return "\n".join(partes)
