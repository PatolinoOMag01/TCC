import os
import tempfile
import unittest
from unittest.mock import AsyncMock, patch

_tmp = tempfile.TemporaryDirectory()
os.environ['DATABASE_URL'] = 'sqlite:///' + _tmp.name + '/test.db'
os.environ['JWT_SECRET_KEY'] = 'chave-exclusiva-dos-testes-interway'
from fastapi.testclient import TestClient
from app.main import app
from app.services.currency_service import detectar_moedas

class FluxosTest(unittest.TestCase):
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
            self.assertEqual(c.get('/usuarios/me',headers=h).json()['nome'],dados['nome'])
            resposta_comunidade=c.post('/comunidade/mensagens',headers=h,json={'mensagem':'Olá, comunidade!'} )
            self.assertEqual(resposta_comunidade.status_code,201)
            self.assertEqual((resposta_comunidade.json()['nome'],resposta_comunidade.json()['mensagem']),(dados['nome'],'Olá, comunidade!'))
            self.assertEqual(c.post('/comunidade/mensagens',headers=h,json={'mensagem':'   '}).status_code,422)
            self.assertEqual(c.post('/comunidade/mensagens',headers=h,json={'mensagem':'x'*1001}).status_code,422)
            self.assertEqual(c.get('/passport/me',headers=h).json()['progresso'],0)
            self.assertEqual(c.put('/passport/me',headers=h,json={'pais':'Canadá','cidade':'Toronto','objetivo':'Estudo','orcamento':50000}).status_code,200)
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
