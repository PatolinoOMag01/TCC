# InterWay

Site publicado:

## Organização

- `frontend/`: aplicação React + Vite. As páginas de destinos, vagas, bolsas e chat ainda usam dados locais em `frontend/src/data/`.
- `backend/`: API FastAPI. Cadastro, login, usuário e passaporte usam MySQL.
- Bolsas e vagas são dados demonstrativos; a comunidade salva mensagens somente no navegador. O assistente IA exige login.
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

Importar o SQL não liga automaticamente as páginas com dados locais ao banco. Essa integração ainda exige rotas no backend e chamadas no frontend. A tabela antiga `usuário` não é usada no login atual e não deve ser migrada diretamente: ela contém um campo de senha incompatível com o hash de `usuarios`.
