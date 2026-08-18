# G-CheckFlow

Sistema web para gestão de operações com cheques.

O projeto nasceu a partir de um levantamento de requisitos realizado para um cliente real. O software evoluiu de um caso de estudo para uma plataforma web com foco em arquitetura de software, backend, frontend e infraestrutura.

---

## Objetivo

O G-CheckFlow tem como objetivo substituir processos realizados em planilhas por uma aplicação web centralizada, permitindo o cadastro e gerenciamento de operações envolvendo cheques, cálculo automático de valores negociados (juros, dias de compensação, valor líquido) e emissão de relatórios.

📚 A documentação completa do projeto está disponível na pasta [./docs](./docs).

---

## Funcionalidades

### Usuários

- Autenticação
- Controle de acesso
- Cadastro de usuários

### Prestadores

- Cadastro
- Consulta
- Alteração

### Operações

- Criação de operações
- Associação de prestadores
- Inserção de múltiplos cheques
- Cálculo automático
- Resumo financeiro
- Relatórios em PDF

### Cheques

- Cadastro
- Controle de status
- Registro de devoluções
- Dias até compensação

### Dashboard

- Operações abertas
- Cheques aguardando compensação
- Cheques devolvidos
- Últimas operações
- Indicadores gerais

---

## Tecnologias

#### Frontend

![TS](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=React&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-9135FF.svg?style=for-the-badge&logo=Vite&logoColor=white) ![- Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=for-the-badge&logo=Tailwind-CSS&logoColor=white) ![- shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000.svg?style=for-the-badge&logo=shadcn/ui&logoColor=white) ![Tanstack](https://img.shields.io/badge/TanStack-000000.svg?style=for-the-badge&logo=TanStack&logoColor=white) 


#### Backend

![TS](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white) ![- NestJS](https://img.shields.io/badge/NestJS-E0234E.svg?style=for-the-badge&logo=NestJS&logoColor=white) ![- Prisma ORM](https://img.shields.io/badge/Prisma-2D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white) ![- PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=PostgreSQL&logoColor=white) ![- Swagger](https://img.shields.io/badge/Swagger-85EA2D.svg?style=for-the-badge&logo=Swagger&logoColor=black) ![Jest](https://img.shields.io/badge/Jest-C21325.svg?style=for-the-badge&logo=Jest&logoColor=white)

#### Infraestrutura

![- Docker](https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=Docker&logoColor=white) ![- Turborepo](https://img.shields.io/badge/Turborepo-FF1E56.svg?style=for-the-badge&logo=Turborepo&logoColor=white) 

---

## Estrutura

```text
apps/
├── web/     # Frontend SPA robusto com React + Vite + TanStack
└── api/     # Backend RESTful com NestJS + Prisma ORM

packages/
└── shared/  # Regras de negócio e motores de cálculo compartilhados

docs/        # Documentações de requisitos originais do cliente
```

## Como executar

1. Instalar as dependências

```bash
npm install
```

2. Iniciar o banco

```bash
docker compose up -d
```

3. Rodar as migrações do banco de dados
```bash
npx prisma migrate dev
```

4. Gerar o Prisma Client

```bash
npx prisma generate
```

6. Compilar o pacote compartilhado

```bash
npm run build --workspace=@g-checkflow/shared
```

7. Popular o banco (opcional)

```bash
npx prisma db seed
```

8. Iniciar a aplicação

```bash
npm run dev
```

---

## 🎯 Origem e Evolução

O G-CheckFlow nasceu da necessidade real de otimizar e centralizar operações financeiras complexas que antes dependiam de controles manuais e planilhas. O projeto evoluiu de um mapeamento estratégico de requisitos para um sistema focado em entregar automação matemática confiável, auditoria de dados e uma experiência de uso fluida para o gerenciamento de recebíveis.

---

## Status

🚧 Em desenvolvimento.