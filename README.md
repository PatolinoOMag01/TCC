# InterWay

## Match salvo na conta

Ao concluir o teste, use **Salvar meu Match**. O resultado mais recente fica disponível em **Perfil → Meu Match**, com o ranking, a compatibilidade e as respostas do momento do salvamento. Um novo resultado substitui o anterior somente após clicar em salvar. A consulta não exige Plus.

Se não estiver autenticado, **Entrar para salvar** leva ao login e retorna ao resultado preenchido. Clique em salvar após entrar. A API calcula o ranking com o catálogo atual e guarda o resultado na tabela `matches_salvos`, criada automaticamente na inicialização. As rotas autenticadas `GET /match/me` e `PUT /match/me` usam exclusivamente o usuário da sessão; os resultados ficam disponíveis entre dispositivos e reinicializações, desde que o banco seja persistente.

## Painel de administração

Acesse `/admin` após entrar com uma conta administrativa. O link **Administração** aparece na página inicial e no perfil dessas contas.

1. Cadastre sua conta normalmente no site.
2. No ambiente do **backend**, configure `ADMIN_EMAILS` com o e-mail dessa conta. Para mais de um administrador, separe os e-mails por vírgula. Exemplo: `ADMIN_EMAILS=seu-email@exemplo.com`.
3. Reinicie a API e entre novamente. Na Railway, configure a variável no serviço Backend e faça o redeploy.

Não há senha administrativa padrão. Somente contas previamente cadastradas e autorizadas no servidor devem ser adicionadas a `ADMIN_EMAILS`. As rotas `/admin/*` verificam a sessão e a autorização no backend; o cadastro público não permite escolher o papel de administrador.

O painel oferece busca e paginação de usuários, edição de nome/e-mail, bloqueio e desbloqueio de acesso, consulta e exclusão de mensagens de qualquer autor e criação, edição e exclusão de destinos. Exclusões exigem confirmação no painel e são permanentes. Contas bloqueadas perdem acesso autenticado inclusive com tokens já emitidos. O e-mail e o bloqueio de administradores são protegidos; remova a autorização no servidor para revogar seu papel.

Ao iniciar a API, o SQLAlchemy cria `usuarios_acesso` e `destinos_catalogo`, sem alterar as colunas das tabelas existentes. O catálogo original é importado de `backend/app/data/destinos.json` uma única vez. As alterações ficam no banco, e destinos excluídos não são recriados na próxima inicialização. Mantenha o banco persistente na hospedagem.

Destinos, detalhes, página inicial, perfil e Match usam o catálogo da API. Sem conexão com a API, o site pode exibir o catálogo local original; a página Destinos sinaliza esse modo offline. O painel sempre exige conexão com a API para ler ou alterar dados.

Validação: em `frontend`, execute `npm ci`, `npm run lint` e `npm run build`. Em `backend`, com as dependências instaladas, execute `python -m unittest discover -s tests -v`. Os testes usam um banco SQLite temporário e verificam permissões, bloqueios, moderação e alterações no catálogo público, além dos fluxos existentes.

Site publicado:https://tcc-production-e593.up.railway.app/

## Organização

- `frontend/`: aplicação React + Vite. Destinos, vagas e bolsas usam catálogos locais; a comunidade consome a API.
- `backend/`: API FastAPI. Cadastro, login, usuário, passaporte e mensagens da comunidade usam o banco configurado.
- Bolsas e vagas são dados demonstrativos. Para publicar na comunidade é necessário entrar na conta; a leitura é pública.
- `database/interway.sql`: **único SQL do projeto**, com o banco `banco_interway`, tabelas do protótipo e tabelas `usuarios` e `passports` da API.
- `legacy/img/` e `legacy/js/`: arquivos do protótipo anterior; não fazem parte da compilação do React.

## Abrir localmente no Windows

1. Instale Git, Node.js, Python e MySQL/MariaDB. No MySQL, importe `database/interway.sql` em uma instalação de desenvolvimento limpa (pelo phpMyAdmin ou `mysql -u root -p < database/interway.sql`). Não importe o antigo `mysql.sql`: ele era uma cópia do banco **interno** do servidor MySQL.
2. Copie `backend/.env.example` para `backend/.env`, preencha usuário e senha do MySQL. Gere a chave JWT no terminal com `python -c "import secrets; print(secrets.token_urlsafe(48))"`, copie o resultado para `JWT_SECRET_KEY` e configure `CORS_ORIGINS` com as origens do frontend. O `.env` não deve ser enviado ao Git. A API não inicia se a chave JWT estiver ausente ou curta.
3. Em um terminal, execute:

   ```bat
   cd backend
   py -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   python -m uvicorn app.main:app --reload
   ```

4. Em outro terminal, execute:

   ```bat
   cd frontend
   npm ci
   npm run dev
   ```

Abra `http://127.0.0.1:8000/docs` para testar a API e o endereço exibido pelo Vite para o site. Por padrão, o front procura a API em `http://127.0.0.1:8000`.

## Publicação

O workflow de GitHub Pages usa `frontend/`. **Na Vercel, atualize o Root Directory do projeto de `frontend-v2` para `frontend` antes do próximo deploy.** Configure `VITE_API_URL` com o endereço público da API. No backend, configure `JWT_SECRET_KEY` e `CORS_ORIGINS` com o domínio exato do site publicado; publique o backend e o MySQL em serviços próprios. O front hospedado não consegue usar o backend em `127.0.0.1` de outro computador.

### Railway (monorepo)

O repositório contém dois serviços independentes. Crie um serviço Railway para cada componente, ambos apontando para este repositório e branch. Como os Dockerfiles usam o contexto da raiz do repositório, mantenha Root Directory como `/` nos dois serviços:

| Serviço | Root Directory | Dockerfile |
| --- | --- | --- |
| Frontend | `/` | `/frontend/Dockerfile` |
| Backend | `/` | `/backend/Dockerfile` |

Na Railway, deixe o Root Directory na raiz (`/`) em cada serviço. Em **Settings → Build**, selecione **Dockerfile** e informe o caminho indicado na tabela. O container do frontend serve os arquivos do Vite com Nginx e encaminha rotas do React para `index.html`; os dois containers escutam a porta dinâmica `PORT` da Railway. O arquivo `start-interway.bat` é apenas para Windows local.

No serviço frontend, configure `VITE_API_URL` com a URL pública HTTPS do backend (por exemplo, `https://${{Backend.RAILWAY_PUBLIC_DOMAIN}}`) e faça o deploy para incorporar o valor no bundle. Essa variável é pública e não deve conter segredos. No serviço backend, configure `DATABASE_URL` ou `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER` e `DB_PASSWORD`, além de `JWT_SECRET_KEY`, `CORS_ORIGINS` (com a origem pública do frontend), `FRONTEND_URL` e, se usar pagamentos, as variáveis do Mercado Pago. Disponibilize também um banco MySQL persistente e configure a conexão correspondente. Não envie `backend/.env` ao Git.

Para executar localmente, a partir da raiz do repositório, use `docker build -f frontend/Dockerfile -t interway-frontend .` e `docker build -f backend/Dockerfile -t interway-backend .`. No frontend, informe a URL da API no build com `--build-arg VITE_API_URL=http://localhost:8000`; no backend, passe as variáveis de ambiente e publique uma porta. Os containers não incluem banco de dados nem credenciais.

Importar o SQL não liga automaticamente as páginas com dados locais ao banco. Essa integração ainda exige rotas no backend e chamadas no frontend. A tabela antiga `usuário` não é usada no login atual e não deve ser migrada diretamente: ela contém um campo de senha incompatível com o hash de `usuarios`.

A comunidade ativa usa a tabela `mensagens_comunidade`, criada pelo SQLAlchemy quando a API inicia. A tabela antiga `mensagens_chat` pertence ao protótipo e referencia `usuarios_chat`; ela não é usada pela comunidade atual. Em produção, o frontend deve apontar `VITE_API_URL` para uma API acessível pela internet e essa API deve usar um banco persistente compartilhado.

## InterWay Plus e Mercado Pago

O checkout cria assinaturas mensais de R$ 29,90 pela API de Assinaturas do Mercado Pago e redireciona o comprador ao checkout hospedado pelo provedor; o InterWay não recebe nem armazena dados de cartão. O backend cria a tabela `assinaturas_plus` automaticamente ao iniciar. IA, Passport e Planejador conferem no backend se a conta tem uma assinatura `authorized`.

Configure somente no ambiente do backend, nunca no frontend:

- `MERCADOPAGO_ACCESS_TOKEN`: credencial de acesso da aplicação Mercado Pago (use credenciais de teste no desenvolvimento).
- `MERCADOPAGO_WEBHOOK_SECRET`: chave secreta de assinatura dos webhooks.
- `FRONTEND_URL`: origem pública do frontend, usada para retornar após o checkout. Padrão local: `http://localhost:5173`.
- `BACKEND_PUBLIC_URL`: origem HTTPS pública da API, para o Mercado Pago enviar notificações. Configure-a em produção para sincronizar mudanças de status.

Sem `MERCADOPAGO_ACCESS_TOKEN`, a API mantém o checkout desabilitado e não simula pagamentos. Para receber notificações reais, publique a API com HTTPS e use o `BACKEND_PUBLIC_URL` correspondente.

## IA com multiplos provedores (branch feat/multi-ai-providers)

O chat tenta OpenRouter, depois Gemini e depois Groq. Configure pelo menos uma chave **somente no backend** (Railway > Backend > Variables): `OPENROUTER_API_KEY`, `GEMINI_API_KEY` ou `GROQ_API_KEY`. Modelos opcionais: `OPENROUTER_MODEL` (padrao `openrouter/free`), `GEMINI_MODEL` (padrao `gemini-2.5-flash`) e `GROQ_MODEL` (padrao `llama-3.3-70b-versatile`). Verifique disponibilidade, cotas e custos de cada provedor. Nao configure chaves no frontend ou em commits.

O contexto de clima e cambio existente continua sendo coletado antes da consulta a IA. A implantacao exige revisar o PR, fazer merge e redeploy do backend. Para Railway monorepo, use Root Directory `/` e Dockerfile `/backend/Dockerfile`.
