-- Esquema único do InterWay. Importe apenas em uma instância local de desenvolvimento.
-- O aplicativo FastAPI usa usuarios e passports; as demais tabelas são do protótipo anterior.
-- O frontend ainda contém catálogos locais em src/data e não consulta essas tabelas.
-- Faça backup antes de importar em uma instalação que já contenha dados.
CREATE DATABASE IF NOT EXISTS `banco_interway` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `banco_interway`;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 09/09/2026 às 22:41
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `banco_interway`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `avaliação`
--

CREATE TABLE `avaliação` (
  `id_avaliacao` int(11) NOT NULL,
  `num_estrelas` varchar(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `bolsa_estudo`
--

CREATE TABLE `bolsa_estudo` (
  `id_bolsa` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `descricao` varchar(500) DEFAULT NULL,
  `percentual_desconto` decimal(5,2) DEFAULT NULL,
  `data_inicio` date DEFAULT NULL,
  `data_fim` date DEFAULT NULL,
  `id_curso` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `bolsa_estudo`
--

INSERT INTO `bolsa_estudo` (`id_bolsa`, `nome`, `descricao`, `percentual_desconto`, `data_inicio`, `data_fim`, `id_curso`) VALUES
(1, 'Bolsa InterWay Canadá', 'Bolsa destinada a estudantes interessados em estudar no Canadá.', 25.00, '2026-01-01', '2026-06-30', NULL),
(2, 'Bolsa Europa Acadêmica', 'Auxílio financeiro para estudantes que desejam realizar intercâmbio na Europa.', 50.00, '2026-02-01', '2026-07-31', NULL),
(3, 'Bolsa Global de Tecnologia', 'Bolsa para estudantes da área de tecnologia e computação.', 30.00, '2026-03-01', '2026-08-31', NULL),
(4, 'Bolsa Novos Horizontes', 'Programa de apoio para estudantes que realizarão intercâmbio internacional.', 40.00, '2026-04-01', '2026-09-30', NULL),
(5, 'Bolsa Excelência Acadêmica', 'Bolsa destinada a estudantes com excelente desempenho acadêmico.', 20.00, '2026-05-01', '2026-10-31', NULL);

-- --------------------------------------------------------

--
-- Estrutura para tabela `chat`
--

CREATE TABLE `chat` (
  `id_chat` int(11) NOT NULL,
  `assunto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `chat`
--

INSERT INTO `chat` (`id_chat`, `assunto`) VALUES
(1, 'Dúvidas sobre intercâmbio'),
(2, 'Bolsas de estudo'),
(3, 'Documentação necessária'),
(4, 'Escolha de país'),
(5, 'Informações sobre cursos');

-- --------------------------------------------------------

--
-- Estrutura para tabela `comentário`
--

CREATE TABLE `comentário` (
  `id_chat` int(11) NOT NULL,
  `assunto` varchar(255) DEFAULT NULL,
  `id_postagem` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `contatos`
--

CREATE TABLE `contatos` (
  `id` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `mensagem` text NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `contatos`
--

INSERT INTO `contatos` (`id`, `nome`, `email`, `mensagem`, `criado_em`) VALUES
(1, 'João Silva', 'joao@email.com', 'Gostaria de saber mais sobre as oportunidades de intercâmbio.', '2026-09-09 17:58:26'),
(2, 'Maria Oliveira', 'maria@email.com', 'Olá! Tenho interesse nas bolsas disponíveis para o Canadá.', '2026-09-09 17:58:26'),
(3, 'Carlos Santos', 'carlos@email.com', 'Gostaria de receber informações sobre as vagas de trabalho.', '2026-09-09 17:58:26'),
(4, 'Ana Souza', 'ana@email.com', 'Quais são os requisitos para participar do programa?', '2026-09-09 17:58:26'),
(5, 'Lucas Pereira', 'lucas@email.com', 'Tenho interesse em estudar e trabalhar no exterior.', '2026-09-09 17:58:26');

-- --------------------------------------------------------

--
-- Estrutura para tabela `curso`
--

CREATE TABLE `curso` (
  `id_curso` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `instituicao` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `curso`
--

INSERT INTO `curso` (`id_curso`, `titulo`, `instituicao`) VALUES
(1, 'Engenharia de Software', 'Universidade de Toronto'),
(2, 'Administração', 'Universidade de Lisboa'),
(3, 'Ciência da Computação', 'Universidade de Melbourne'),
(4, 'Relações Internacionais', 'Universidade de Barcelona'),
(5, 'Arquitetura', 'Universidade de Roma');

-- --------------------------------------------------------

--
-- Estrutura para tabela `escolhe`
--

CREATE TABLE `escolhe` (
  `id_pais` int(11) DEFAULT NULL,
  `id_inscricao` int(11) DEFAULT NULL,
  `id_tipo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `escreve`
--

CREATE TABLE `escreve` (
  `id_chat` int(11) DEFAULT NULL,
  `senha` varchar(10) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `faz`
--

CREATE TABLE `faz` (
  `id_inscricao` int(11) DEFAULT NULL,
  `id_tipo` int(11) DEFAULT NULL,
  `senha` varchar(10) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `inscrição`
--

CREATE TABLE `inscrição` (
  `id_inscricao` int(11) NOT NULL,
  `data_inscricao` date DEFAULT NULL,
  `id_tipo` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `inscrição`
--

INSERT INTO `inscrição` (`id_inscricao`, `data_inscricao`, `id_tipo`, `nome`) VALUES
(1, '2026-01-15', 1, 'Intercâmbio acadêmico'),
(2, '2026-02-10', 2, 'Graduação no exterior'),
(3, '2026-03-05', 1, 'Intercâmbio acadêmico'),
(4, '2026-04-20', 3, 'Curso de idiomas'),
(5, '2026-05-12', 2, 'Graduação no exterior');

-- --------------------------------------------------------

--
-- Estrutura para tabela `mensagens_chat`
--

CREATE TABLE `mensagens_chat` (
  `id_mensagem` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `mensagem` text NOT NULL,
  `data_envio` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `mensagens_chat`
--

INSERT INTO `mensagens_chat` (`id_mensagem`, `id_usuario`, `mensagem`, `data_envio`) VALUES
(1, 1, 'Oi pessoal! Alguém aqui fez intercâmbio recentemente?', '2026-09-09 16:34:56'),
(2, 2, 'Sim! Fiz em Londres, foi incrível!', '2026-09-09 16:34:56');

-- --------------------------------------------------------

--
-- Estrutura para tabela `país`
--

CREATE TABLE `país` (
  `id_pais` int(11) NOT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `continente` varchar(255) DEFAULT NULL,
  `id_curso` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `postagem_blog`
--

CREATE TABLE `postagem_blog` (
  `id_postagem` int(11) NOT NULL,
  `tipo_postagem` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `recebe`
--

CREATE TABLE `recebe` (
  `id_inscricao` int(11) NOT NULL,
  `id_tipo` int(11) NOT NULL,
  `id_bolsa` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios_chat`
--

CREATE TABLE `usuarios_chat` (
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `pais_origem` varchar(60) NOT NULL,
  `pais_intercambio` varchar(60) NOT NULL,
  `data_cadastro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Despejando dados para a tabela `usuarios_chat`
--

INSERT INTO `usuarios_chat` (`id_usuario`, `nome`, `pais_origem`, `pais_intercambio`, `data_cadastro`) VALUES
(1, 'Lucas', 'Brasil', 'Canadá', '2026-09-09 16:34:56'),
(2, 'Amanda', 'Brasil', 'Inglaterra', '2026-09-09 16:34:56'),
(3, 'Você', 'Brasil', 'Austrália', '2026-09-09 16:34:56');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuário`
--

CREATE TABLE `usuário` (
  `senha` varchar(10) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nome` varchar(255) DEFAULT NULL,
  `telefone` varchar(255) DEFAULT NULL,
  `id_avaliacao` int(11) DEFAULT NULL,
  `id_chat` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `vagas`
--

CREATE TABLE `vagas` (
  `id` int(11) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `empresa` varchar(200) NOT NULL,
  `area` varchar(100) NOT NULL,
  `pais` varchar(100) NOT NULL,
  `cidade` varchar(100) NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `salario` varchar(100) DEFAULT NULL,
  `descricao` text NOT NULL,
  `requisitos` text DEFAULT NULL,
  `idioma` varchar(100) DEFAULT NULL,
  `data_limite` date DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `telefone` varchar(30) DEFAULT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `vagas`
--

INSERT INTO `vagas` (`id`, `titulo`, `empresa`, `area`, `pais`, `cidade`, `tipo`, `salario`, `descricao`, `requisitos`, `idioma`, `data_limite`, `email`, `telefone`, `criado_em`) VALUES
(1, 'Atendente de Cafeteria', 'Maple Coffee House', 'Atendimento', 'Canadá', 'Toronto', 'Meio período', 'CAD 18 por hora', 'Atendimento aos clientes, organização do ambiente, preparação de pedidos e auxílio no caixa.', 'Boa comunicação, responsabilidade e disponibilidade para trabalhar aos finais de semana.', 'Inglês intermediário', '2026-12-20', 'rh@maplecoffee.com', '+1 416 555 1020', '2026-09-09 18:50:53'),
(2, 'Estágio em Marketing Digital', 'Global Connect', 'Marketing', 'Canadá', 'Vancouver', 'Estágio', 'CAD 20 por hora', 'Auxiliar na criação de conteúdos para redes sociais, campanhas digitais e produção de materiais promocionais.', 'Conhecimento básico em redes sociais, criatividade e interesse por marketing digital.', 'Inglês intermediário', '2027-01-15', 'vagas@globalconnect.com', '+1 604 555 2040', '2026-09-09 18:50:53'),
(3, 'Auxiliar Administrativo', 'London Business Center', 'Administração', 'Inglaterra', 'Londres', 'Tempo integral', '£13 por hora', 'Organização de documentos, atendimento telefônico, controle de arquivos e suporte à equipe administrativa.', 'Organização, conhecimento básico de informática e boa comunicação.', 'Inglês avançado', '2026-11-30', 'rh@londonbusiness.com', '+44 20 5555 3010', '2026-09-09 18:50:53'),
(4, 'Recepcionista de Hotel', 'Royal Stay Hotel', 'Hotelaria e Turismo', 'Irlanda', 'Dublin', 'Tempo integral', '€15 por hora', 'Recepcionar hóspedes, realizar check-in e check-out e fornecer informações sobre os serviços do hotel.', 'Experiência com atendimento ao público será um diferencial.', 'Inglês avançado', '2027-02-10', 'careers@royalstay.com', '+353 1 555 4020', '2026-09-09 18:50:53'),
(5, 'Desenvolvedor Web Júnior', 'Tech World', 'Tecnologia', 'Austrália', 'Sydney', 'Tempo integral', 'AUD 30 por hora', 'Desenvolvimento e manutenção de páginas web e auxílio na criação de novas funcionalidades.', 'Conhecimento básico de HTML, CSS, JavaScript e Git.', 'Inglês intermediário', '2027-01-30', 'jobs@techworld.com', '+61 2 5550 5030', '2026-09-09 18:50:53'),
(6, 'Assistente de Vendas', 'Paris Fashion Store', 'Vendas', 'França', 'Paris', 'Meio período', '€14 por hora', 'Atendimento aos clientes, organização dos produtos e auxílio nas vendas da loja.', 'Boa comunicação, simpatia e interesse por atendimento ao cliente.', 'Francês', '2026-12-15', 'recrutamento@parisfashion.com', '+33 1 5555 6040', '2026-09-09 18:50:53'),
(7, 'Professor Assistente', 'International School', 'Educação', 'Espanha', 'Madrid', 'Temporário', '€16 por hora', 'Auxílio aos professores em atividades educacionais e acompanhamento dos estudantes.', 'Interesse pela área de educação e facilidade para trabalhar em equipe.', 'Espanhol intermediário', '2027-03-01', 'jobs@internationalschool.com', '+34 91 555 7050', '2026-09-09 18:50:53'),
(8, 'Assistente de Comunicação', 'World Media', 'Comunicação', 'Portugal', 'Lisboa', 'Freelance', '€18 por hora', 'Auxílio na produção de conteúdos, revisão de textos e gerenciamento de comunicação digital.', 'Boa escrita, criatividade e conhecimento básico de redes sociais.', 'Inglês intermediário', '2027-02-28', 'contato@worldmedia.com', '+351 21 555 8060', '2026-09-09 18:50:53');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `avaliação`
--
ALTER TABLE `avaliação`
  ADD PRIMARY KEY (`id_avaliacao`);

--
-- Índices de tabela `bolsa_estudo`
--
ALTER TABLE `bolsa_estudo`
  ADD PRIMARY KEY (`id_bolsa`),
  ADD KEY `id_curso` (`id_curso`);

--
-- Índices de tabela `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id_chat`);

--
-- Índices de tabela `comentário`
--
ALTER TABLE `comentário`
  ADD PRIMARY KEY (`id_chat`),
  ADD KEY `id_postagem` (`id_postagem`);

--
-- Índices de tabela `contatos`
--
ALTER TABLE `contatos`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`id_curso`);

--
-- Índices de tabela `escolhe`
--
ALTER TABLE `escolhe`
  ADD KEY `id_pais` (`id_pais`),
  ADD KEY `id_inscricao` (`id_inscricao`,`id_tipo`);

--
-- Índices de tabela `escreve`
--
ALTER TABLE `escreve`
  ADD KEY `id_chat` (`id_chat`),
  ADD KEY `senha` (`senha`,`id_usuario`);

--
-- Índices de tabela `faz`
--
ALTER TABLE `faz`
  ADD KEY `id_inscricao` (`id_inscricao`,`id_tipo`),
  ADD KEY `senha` (`senha`,`id_usuario`);

--
-- Índices de tabela `inscrição`
--
ALTER TABLE `inscrição`
  ADD PRIMARY KEY (`id_inscricao`,`id_tipo`);

--
-- Índices de tabela `mensagens_chat`
--
ALTER TABLE `mensagens_chat`
  ADD PRIMARY KEY (`id_mensagem`),
  ADD KEY `fk_mensagem_usuario` (`id_usuario`);

--
-- Índices de tabela `país`
--
ALTER TABLE `país`
  ADD PRIMARY KEY (`id_pais`),
  ADD KEY `id_curso` (`id_curso`);

--
-- Índices de tabela `postagem_blog`
--
ALTER TABLE `postagem_blog`
  ADD PRIMARY KEY (`id_postagem`);

--
-- Índices de tabela `recebe`
--
ALTER TABLE `recebe`
  ADD PRIMARY KEY (`id_inscricao`,`id_tipo`,`id_bolsa`),
  ADD KEY `id_bolsa` (`id_bolsa`);

--
-- Índices de tabela `usuarios_chat`
--
ALTER TABLE `usuarios_chat`
  ADD PRIMARY KEY (`id_usuario`);

--
-- Índices de tabela `usuário`
--
ALTER TABLE `usuário`
  ADD PRIMARY KEY (`senha`,`id_usuario`),
  ADD KEY `id_avaliacao` (`id_avaliacao`),
  ADD KEY `id_chat` (`id_chat`);

--
-- Índices de tabela `vagas`
--
ALTER TABLE `vagas`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `contatos`
--
ALTER TABLE `contatos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `mensagens_chat`
--
ALTER TABLE `mensagens_chat`
  MODIFY `id_mensagem` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `usuarios_chat`
--
ALTER TABLE `usuarios_chat`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `vagas`
--
ALTER TABLE `vagas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `bolsa_estudo`
--
ALTER TABLE `bolsa_estudo`
  ADD CONSTRAINT `bolsa_estudo_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`);

--
-- Restrições para tabelas `comentário`
--
ALTER TABLE `comentário`
  ADD CONSTRAINT `comentário_ibfk_1` FOREIGN KEY (`id_postagem`) REFERENCES `postagem_blog` (`id_postagem`);

--
-- Restrições para tabelas `escolhe`
--
ALTER TABLE `escolhe`
  ADD CONSTRAINT `escolhe_ibfk_1` FOREIGN KEY (`id_pais`) REFERENCES `país` (`id_pais`),
  ADD CONSTRAINT `escolhe_ibfk_2` FOREIGN KEY (`id_inscricao`,`id_tipo`) REFERENCES `inscrição` (`id_inscricao`, `id_tipo`);

--
-- Restrições para tabelas `escreve`
--
ALTER TABLE `escreve`
  ADD CONSTRAINT `escreve_ibfk_1` FOREIGN KEY (`id_chat`) REFERENCES `chat` (`id_chat`),
  ADD CONSTRAINT `escreve_ibfk_2` FOREIGN KEY (`senha`,`id_usuario`) REFERENCES `usuário` (`senha`, `id_usuario`);

--
-- Restrições para tabelas `faz`
--
ALTER TABLE `faz`
  ADD CONSTRAINT `faz_ibfk_1` FOREIGN KEY (`id_inscricao`,`id_tipo`) REFERENCES `inscrição` (`id_inscricao`, `id_tipo`),
  ADD CONSTRAINT `faz_ibfk_2` FOREIGN KEY (`senha`,`id_usuario`) REFERENCES `usuário` (`senha`, `id_usuario`);

--
-- Restrições para tabelas `mensagens_chat`
--
ALTER TABLE `mensagens_chat`
  ADD CONSTRAINT `fk_mensagem_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios_chat` (`id_usuario`) ON DELETE CASCADE;

--
-- Restrições para tabelas `país`
--
ALTER TABLE `país`
  ADD CONSTRAINT `país_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`);

--
-- Restrições para tabelas `recebe`
--
ALTER TABLE `recebe`
  ADD CONSTRAINT `recebe_ibfk_1` FOREIGN KEY (`id_inscricao`,`id_tipo`) REFERENCES `inscrição` (`id_inscricao`, `id_tipo`),
  ADD CONSTRAINT `recebe_ibfk_2` FOREIGN KEY (`id_bolsa`) REFERENCES `bolsa_estudo` (`id_bolsa`);

--
-- Restrições para tabelas `usuário`
--
ALTER TABLE `usuário`
  ADD CONSTRAINT `usuário_ibfk_1` FOREIGN KEY (`id_avaliacao`) REFERENCES `avaliação` (`id_avaliacao`),
  ADD CONSTRAINT `usuário_ibfk_2` FOREIGN KEY (`id_chat`) REFERENCES `chat` (`id_chat`);
-- Tabelas usadas pela API FastAPI (backend/app/models).
-- Não migre senhas da tabela antiga `usuário`: ela tem formato incompatível.
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) NOT NULL,
  `email` varchar(180) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `criado_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuarios_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `passports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `objetivo` varchar(150) DEFAULT NULL,
  `nivel_idioma` varchar(80) DEFAULT NULL,
  `orcamento` int DEFAULT NULL,
  `checklist` text NOT NULL,
  `criado_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_passports_usuario_id` (`usuario_id`),
  CONSTRAINT `fk_passports_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
