# InterWay 3.0 - pacote integrado

## Adicionado
- Historico persistente da InterWay IA no MySQL para usuarios logados.
- Endpoint `GET/DELETE /ia/historico`.
- Perfil de intercambio persistente (`/perfil-intercambio/me`) com destino, duracao, data prevista, programa, area, instituicao e observacoes.
- Tela `/perfil-intercambio` no frontend.
- A IA recebe automaticamente Perfil + Passport + Planejador do usuario autenticado.
- Plano InterWay consolidado em `GET /planejador/plano-interway`, com progresso geral e proximos passos.
- Botao para limpar o historico da conversa da IA.
- Mantidos clima/previsao, cambio, catalogos de bolsas/vagas, cache e fallback do OpenRouter.

## Banco
Ao iniciar o backend, `Base.metadata.create_all()` cria as tabelas novas:
- `perfis_intercambio`
- `mensagens_ia`

Nenhuma tabela existente e apagada.

## Teste
1. Ative `backend/venv` e rode `python -m compileall -q app`.
2. Rode `python -m uvicorn app.main:app --reload`.
3. No frontend rode `npm install` (se necessario) e `npm run dev`.
4. Entre em uma conta e abra `/perfil-intercambio`; salve destino e programa.
5. Converse com `/assistente`, recarregue a pagina e confirme que o historico volta.
6. Pergunte: `O que voce sabe sobre meu intercambio?`, `O que falta no meu Passport?`, `Quanto falta para minha meta?`.
7. Consulte `GET /planejador/plano-interway` no Swagger para ver o resumo consolidado.

## Seguranca
O `.env`, `venv`, `node_modules`, `dist`, caches e `.git` foram removidos deste pacote. Copie seu `.env` local existente para o backend; nao envie nem versione esse arquivo.
