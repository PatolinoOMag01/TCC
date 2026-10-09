# Correções InterWay

Corrigidos: comando indevido em api.js que impedia a compilação; carregamento dos contextos e Passport; erros de validação da API exibidos no frontend; favoritos com armazenamento inválido; limite de histórico da IA e limpeza durante envio; senha UTF-8 acima do limite bcrypt; falhas HTTP dos serviços externos; configuração de banco com senha contendo caracteres especiais; conversões de moedas respeitando a ordem da pergunta e dólar canadense; inicializador com caminho relativo à pasta do projeto.

Nenhuma página, rota ou funcionalidade foi removida. Os catálogos locais e chat demonstrativo permanecem como no original.

Validação: npm run lint e npm run build. Testes de API usam SQLite temporário e IA simulada; não certificam o MySQL da sua máquina nem chamadas reais de OpenRouter, clima ou câmbio.

## Uso no Windows
Extraia esta versão em uma pasta nova. Configure backend/.env seguindo .env.example. Preserve seu banco existente; não reimporte SQL sobre dados existentes. Crie backend/venv e instale requirements.txt conforme README. Na pasta frontend execute npm ci. Depois execute start-interway.bat. Necessário Node.js 22.12+ ou 24 e Python 3.11+. A IA requer OPENROUTER_API_KEY.

O pacote exclui node_modules, venv, .git e caches: são arquivos locais que devem ser recriados. Os fontes, imagens e SQL foram preservados.

Testes: na raiz execute python -m unittest discover -s backend/tests com PYTHONPATH apontando para backend.
