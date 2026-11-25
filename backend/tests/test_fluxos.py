import os
import tempfile
import unittest
from unittest.mock import AsyncMock, patch

_tmp = tempfile.TemporaryDirectory()
os.environ['DATABASE_URL'] = 'sqlite:///' + _tmp.name + '/test.db'
os.environ['JWT_SECRET_KEY'] = 'chave-exclusiva-dos-testes-interway'
os.environ['PLUS_DEMO_MODE'] = 'true'
from fastapi.testclient import TestClient
from app.main import app
from app.services.currency_service import detectar_moedas

class FluxosTest(unittest.TestCase):
    def test_match_salvo_por_usuario(self):
        with TestClient(app) as c:
            headers = []
            for email in ('match-a@example.com', 'match-b@example.com'):
                dados = {'nome': 'Match Teste', 'email': email, 'senha': 'senha123'}
                self.assertEqual(c.post('/auth/cadastro', json=dados).status_code, 201)
                token = c.post('/auth/login', json=dados).json()['access_token']
                headers.append({'Authorization': 'Bearer ' + token})
            ha, hb = headers
            respostas = {'objetivo': 'idioma', 'idioma': 'ingles', 'orcamento': 2, 'duracao': '6-meses', 'clima': 'moderado', 'trabalho': True}
            payload = {'respostas': respostas, 'destinoPreferido': 'dublin'}
            self.assertIn(c.get('/match/me').status_code, (401, 403))
            self.assertIn(c.put('/match/me', json=payload).status_code, (401, 403))
            self.assertIsNone(c.get('/match/me', headers=ha).json())
            self.assertEqual(c.put('/match/me', headers=ha, json={'respostas': {}}).status_code, 422)
            self.assertEqual(c.put('/match/me', headers=ha, json={**payload, 'respostas': {**respostas, 'trabalho': 'false'}}).status_code, 422)
            result = c.put('/match/me', headers=ha, json=payload)
            self.assertEqual(result.status_code, 200)
            salvo = result.json()
            self.assertEqual(salvo['respostas'], respostas)
            self.assertEqual(salvo['destinoPreferido'], 'dublin')
            self.assertIn('salvo_em', salvo)
            self.assertGreater(len(salvo['ranking']), 10)
            self.assertEqual(salvo['ranking'], sorted(salvo['ranking'], key=lambda d: -d['compatibilidade']))
            irlanda = next(d for d in salvo['ranking'] if d['slug'] == 'irlanda')
            self.assertEqual(irlanda['compatibilidade'], 100)
            self.assertEqual(c.get('/match/me', headers=ha).json(), salvo)
            self.assertIsNone(c.get('/match/me', headers=hb).json())
            updated = c.put('/match/me', headers=ha, json={'respostas': {**respostas, 'idioma': 'japones'}, 'destinoPreferido': 'tóquio'}).json()
            self.assertEqual(updated['respostas']['idioma'], 'japones')
            self.assertIsNone(c.get('/match/me', headers=hb).json())
        # A new application lifespan/session reads the result from the database.
        with TestClient(app) as c:
            self.assertEqual(c.get('/match/me', headers=ha).json(), updated)

    def test_admin_permissoes_e_gestao(self):
        with patch.dict(os.environ, {"ADMIN_EMAILS": "admin-teste@example.com"}), TestClient(app) as c:
            admin = {"nome": "Admin Teste", "email": "admin-teste@example.com", "senha": "senha123"}
            normal = {"nome": "Usuário Admin Teste", "email": "membro-teste@example.com", "senha": "senha123"}
            for dados in (admin, normal):
                self.assertEqual(c.post('/auth/cadastro', json=dados).status_code, 201)
            login_admin = c.post('/auth/login', json=admin).json()
            login_normal = c.post('/auth/login', json=normal).json()
            ha = {'Authorization': 'Bearer ' + login_admin['access_token']}
            hn = {'Authorization': 'Bearer ' + login_normal['access_token']}
            self.assertTrue(login_admin['usuario']['is_admin'])
            self.assertFalse(login_normal['usuario']['is_admin'])
            for path in ('usuarios', 'comunidade', 'destinos'):
                self.assertIn(c.get('/admin/' + path).status_code, (401, 403))
                self.assertEqual(c.get('/admin/' + path, headers=hn).status_code, 403)
                self.assertEqual(c.get('/admin/' + path, headers=ha).status_code, 200)
            self.assertEqual(c.get('/admin/usuarios?pagina=0', headers=ha).status_code, 422)
            mensagem = c.post('/comunidade/mensagens', headers=hn, json={'mensagem': 'Mensagem para moderar'}).json()
            path = '/admin/comunidade/' + str(mensagem['id'])
            self.assertEqual(c.delete(path, headers=hn).status_code, 403)
            self.assertEqual(c.get('/admin/comunidade?busca=moderar', headers=ha).json()['total'], 1)
            self.assertEqual(c.delete(path, headers=ha).status_code, 204)
            self.assertEqual(c.delete(path, headers=ha).status_code, 404)
            uid = login_normal['usuario']['id']
            update = {'nome': 'Nome atualizado', 'email': normal['email'], 'bloqueado': True}
            self.assertEqual(c.patch(f'/admin/usuarios/{uid}', headers=hn, json=update).status_code, 403)
            self.assertEqual(c.patch(f'/admin/usuarios/{uid}', headers=ha, json=update).status_code, 200)
            self.assertEqual(c.get('/usuarios/me', headers=hn).status_code, 401)
            self.assertEqual(c.post('/auth/login', json=normal).status_code, 403)
            self.assertEqual(c.post('/comunidade/mensagens', headers=hn, json={'mensagem': 'Bloqueado'}).status_code, 401)
            update['bloqueado'] = False
            self.assertEqual(c.patch(f'/admin/usuarios/{uid}', headers=ha, json=update).status_code, 200)
            self.assertEqual(c.post('/auth/login', json=normal).status_code, 200)
            update['email'] = admin['email']
            self.assertEqual(c.patch(f'/admin/usuarios/{uid}', headers=ha, json=update).status_code, 409)
            aid = login_admin['usuario']['id']
            self.assertEqual(c.patch(f'/admin/usuarios/{aid}', headers=ha, json={**update, 'bloqueado': True}).status_code, 409)
            catalog = c.get('/destinos').json()
            self.assertGreater(len(catalog), 10)
            destino = {**catalog[0], 'slug': 'destino-teste', 'pais': 'País Teste'}
            self.assertEqual(c.post('/admin/destinos', headers=hn, json=destino).status_code, 403)
            self.assertEqual(c.post('/admin/destinos', headers=ha, json={**destino, 'imagem': 'javascript:alert(1)'}).status_code, 422)
            self.assertEqual(c.post('/admin/destinos', headers=ha, json=destino).status_code, 201)
            self.assertEqual(c.post('/admin/destinos', headers=ha, json=destino).status_code, 409)
            destino['descricao'] = 'Descrição atualizada pelo painel.'
            self.assertEqual(c.put('/admin/destinos/destino-teste', headers=ha, json=destino).status_code, 200)
            saved = next(d for d in c.get('/destinos').json() if d['slug'] == 'destino-teste')
            self.assertEqual(saved['descricao'], destino['descricao'])
            self.assertIn(saved['cidade'], saved['cidades'])
            self.assertEqual(c.delete('/admin/destinos/destino-teste', headers=hn).status_code, 403)
            self.assertEqual(c.delete('/admin/destinos/destino-teste', headers=ha).status_code, 204)
            self.assertFalse(any(d['slug'] == 'destino-teste' for d in c.get('/destinos').json()))
            self.assertEqual(c.delete('/admin/destinos/_catalogo_inicializado', headers=ha).status_code, 404)

    @classmethod
    def tearDownClass(cls):
        from app.database import engine
        engine.dispose()
        _tmp.cleanup()

    def test_fluxos_e_isolamento(self):
        with TestClient(app) as c:
            self.assertEqual(c.get('/health').status_code, 200)
            self.assertIn(c.get('/passport/me').status_code, (401,403))
            self.assertEqual(c.post('/ia/chat', json={'mensagem':'Olá'}).status_code, 401)
            self.assertEqual(c.get('/comunidade/mensagens').status_code, 200)
            self.assertEqual(c.get('/comunidade/mensagens').json(), [])
            self.assertEqual(c.post('/comunidade/mensagens',json={'mensagem':'Olá'}).status_code,401)
            resposta_cors = c.get('/health', headers={'Origin':'https://origem-nao-permitida.example'})
            self.assertNotIn('access-control-allow-origin', resposta_cors.headers)
            dados = {'nome':'Aluno Teste','email':'teste@example.com','senha':'senha123'}
            self.assertEqual(c.post('/auth/cadastro',json=dados).status_code,201)
            self.assertEqual(c.post('/auth/cadastro',json=dados).status_code,409)
            self.assertEqual(c.post('/auth/login',json={**dados,'senha':'errada'}).status_code,401)
            login=c.post('/auth/login',json=dados).json()
            h={'Authorization':'Bearer '+login['access_token']}
            self.assertEqual(c.post('/plus/assinatura/demo',headers=h).status_code,200)
            self.assertEqual(c.get('/usuarios/me',headers=h).json()['nome'],dados['nome'])
            resposta_comunidade=c.post('/comunidade/mensagens',headers=h,json={'mensagem':'Olá, comunidade!'} )
            self.assertEqual(resposta_comunidade.status_code,201)
            self.assertEqual((resposta_comunidade.json()['nome'],resposta_comunidade.json()['mensagem']),(dados['nome'],'Olá, comunidade!'))
            self.assertEqual(c.post('/comunidade/mensagens',headers=h,json={'mensagem':'   '}).status_code,422)
            self.assertEqual(c.post('/comunidade/mensagens',headers=h,json={'mensagem':'x'*1001}).status_code,422)
            self.assertEqual(c.get('/passport/me',headers=h).json()['progresso'],0)
            passport_salvo=c.put('/passport/me',headers=h,json={'pais':'Canadá','cidade':'Toronto','objetivo':'Estudo','orcamento':50000}).json()
            self.assertTrue(next(i for i in passport_salvo['checklist'] if i['id']=='destino')['concluido'])
            self.assertTrue(next(i for i in passport_salvo['checklist'] if i['id']=='orcamento')['concluido'])
            self.assertFalse(next(i for i in passport_salvo['checklist'] if i['id']=='perfil')['concluido'])
            passport_salvo=c.put('/passport/me',headers=h,json={'nivel_idioma':'Intermediário'}).json()
            self.assertTrue(next(i for i in passport_salvo['checklist'] if i['id']=='perfil')['concluido'])
            self.assertGreater(c.patch('/passport/checklist',headers=h,json={'id':'visto','concluido':True}).json()['progresso'],0)
            self.assertEqual(c.patch('/passport/checklist',headers=h,json={'id':'inexistente','concluido':True}).status_code,404)
            r=c.put('/planejador/me',headers=h,json={'meta':10000,'guardado':2000,'mensal':1000}).json()
            self.assertEqual((r['falta'],r['meses'],r['progresso']),(8000,8,20))
            self.assertEqual(r['meta'],10000)
            self.assertEqual(c.put('/perfil-intercambio/me',headers=h,json={'destino_pais':'Canadá','destino_cidade':'Vancouver','duracao_meses':6}).status_code,200)
            self.assertEqual(c.get('/passport/me',headers=h).json()['cidade'],'Vancouver')
            self.assertEqual(c.get('/planejador/me',headers=h).json()['destino'],'Vancouver, Canadá')
            c.put('/passport/me',headers=h,json={'pais':'Austrália','cidade':'Sydney'})
            perfil_atualizado=c.get('/perfil-intercambio/me',headers=h).json()
            self.assertEqual((perfil_atualizado['destino_pais'],perfil_atualizado['destino_cidade'],perfil_atualizado['duracao_meses']),('Austrália','Sydney',6))
            self.assertEqual(c.get('/planejador/plano-interway',headers=h).json()['destino'],'Sydney, Austrália')
            financeiro=c.get('/planejador/me',headers=h).json()
            self.assertEqual((financeiro['meta'],financeiro['guardado'],financeiro['mensal']),(10000,2000,1000))
            passport_atualizado=c.get('/passport/me',headers=h).json()
            self.assertEqual((passport_atualizado['objetivo'],passport_atualizado['orcamento']),('Estudo',50000))
            with patch('app.routes.ia.conversar_com_ia',new=AsyncMock(return_value='A'*6000)):
                for _ in range(2):
                    self.assertEqual(c.post('/ia/chat',headers=h,json={'mensagem':'Olá'}).status_code,200)
            self.assertEqual(len(c.get('/ia/historico',headers=h).json()),4)
            c.post('/auth/cadastro',json={**dados,'email':'outro@example.com'})
            h2={'Authorization':'Bearer '+c.post('/auth/login',json={**dados,'email':'outro@example.com'}).json()['access_token']}
            self.assertEqual(c.post('/plus/assinatura/demo',headers=h2).status_code,200)
            self.assertEqual(c.get('/ia/historico',headers=h2).json(),[])
            mensagens_compartilhadas=c.get('/comunidade/mensagens',headers=h2).json()
            self.assertEqual(len(mensagens_compartilhadas),1)
            self.assertEqual(mensagens_compartilhadas[0]['mensagem'],'Olá, comunidade!')
            self.assertEqual(c.get('/passport/me',headers=h2).json()['progresso'],0)
            c.put('/passport/me',headers=h2,json={'orcamento':40000})
            self.assertEqual(c.get('/planejador/me',headers=h2).json()['meta'],0)
            self.assertEqual(c.delete('/ia/historico',headers=h).status_code,200)
            self.assertEqual(c.get('/ia/historico',headers=h).json(),[])
            self.assertEqual(c.post('/auth/cadastro',json={**dados,'email':'longo@example.com','senha':'á'*40}).status_code,422)
            self.assertEqual(c.post('/auth/login',json={**dados,'senha':'á'*100}).status_code,401)

    def test_moedas(self):
        self.assertEqual(detectar_moedas('converter 100 dólares canadenses em reais'),('CAD','BRL'))
        self.assertEqual(detectar_moedas('converter 100 euros em dólares'),('EUR','USD'))

if __name__ == '__main__': unittest.main()
