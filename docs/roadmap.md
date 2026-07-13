# Roadmap

Este roadmap representa a evolução planejada do G-CheckFlow. Cada fase
possui um objetivo e uma entrega funcional.

## Status Geral

-   [x] Fase 1 --- Setup
-   [x] Fase 2 --- Infraestrutura
-   [x] Fase 3 --- Prestadores
-   [ ] Fase 4 --- Operações
-   [ ] Fase 5 --- Cheques
-   [ ] Fase 6 --- Autenticação
-   [ ] Fase 7 --- Dashboard
-   [ ] Fase 8 --- Consultas
-   [ ] Fase 9 --- Relatórios
-   [ ] Fase 10 --- Finalização

------------------------------------------------------------------------

# Fase 1 --- Setup

**Objetivo:** Preparar toda a estrutura do projeto para o
desenvolvimento.

### Atividades

-   [x] Criar repositório
-   [x] Configurar monorepo
-   [x] Configurar Next.js
-   [x] Configurar NestJS
-   [x] Criar estrutura de documentação
-   [x] Criar README

**Resultado esperado:** Projeto pronto para iniciar o desenvolvimento.

------------------------------------------------------------------------

# Fase 2 --- Infraestrutura

**Objetivo:** Preparar o ambiente de desenvolvimento.

### Atividades

-   [x] Configurar Docker
-   [x] Criar docker-compose
-   [x] Subir PostgreSQL
-   [x] Configurar Prisma
-   [x] Modelar domínio inicial
-   [x] Criar a primeira migration

**Resultado esperado:** Banco de dados funcionando e conectado à API.

------------------------------------------------------------------------

# Fase 3 --- Prestadores

**Objetivo:** Gerenciar os prestadores responsáveis pelas operações.

### Atividades

-   [x] CRUD de prestadores
-   [x] Validação dos DTOs
-   [x] Tratamento de exceções
-   [x] Documentação Swagger
-   [x] Testes unitários

**Resultado esperado:** Prestadores cadastrados e pesquisáveis.

------------------------------------------------------------------------

# Fase 4 --- Operações

**Objetivo:** Permitir o gerenciamento completo das operações.

### Atividades

-   [ ] Criar operação
-   [ ] Selecionar prestador
-   [ ] Definir taxa
-   [ ] Fechar operação
-   [ ] Exibir resumo da operação

**Resultado esperado:** Operações funcionando de ponta a ponta.

------------------------------------------------------------------------

# Fase 5 --- Cheques

**Objetivo:** Gerenciar os cheques pertencentes às operações.

### Atividades

-   [ ] Cadastro de cheques
-   [ ] Associação à operação
-   [ ] Controle de status
-   [ ] Registro de devoluções
-   [ ] Motivo da devolução

**Resultado esperado:** Fluxo completo dos cheques implementado.

------------------------------------------------------------------------

# Fase 6 --- Autenticação

**Objetivo:** Implementar o acesso seguro ao sistema.

### Atividades

-   [ ] Model User
-   [ ] Hash de senhas
-   [ ] JWT
-   [ ] Login
-   [ ] Controle de permissões
-   [ ] Seed do administrador

**Resultado esperado:** Sistema protegido por autenticação.

------------------------------------------------------------------------

# Fase 7 --- Dashboard

**Objetivo:** Criar a tela inicial do sistema.

### Atividades

-   [ ] Indicadores
-   [ ] Totais das operações
-   [ ] Últimas operações
-   [ ] Cheques aguardando compensação
-   [ ] Cheques devolvidos

**Resultado esperado:** Dashboard funcional com visão geral do sistema.

------------------------------------------------------------------------

# Fase 8 --- Consultas

**Objetivo:** Facilitar a localização das informações.

### Atividades

-   [ ] Consulta por período
-   [ ] Consulta por prestador
-   [ ] Consulta por cheque
-   [ ] Consulta por status
-   [ ] Paginação, filtros, etc

**Resultado esperado:** Sistema com filtros e consultas completas.

------------------------------------------------------------------------

# Fase 9 --- Relatórios

**Objetivo:** Gerar documentos para impressão e compartilhamento.

### Atividades

-   [ ] Exportação em PDF
-   [ ] Layout do relatório
-   [ ] Resumo financeiro

**Resultado esperado:** Relatórios prontos para uso.

------------------------------------------------------------------------

# Fase 10 --- Finalização

**Objetivo:** Preparar a primeira versão pública do projeto.

### Atividades

-   [ ] Testes
-   [ ] Correções
-   [ ] Deploy
-   [ ] Revisão da documentação
-   [ ] Release v1.0

**Resultado esperado:** Versão 1.0 publicada.
