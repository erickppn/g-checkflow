# G-CheckFlow

Sistema web para gestão de operações com cheques.

O projeto nasceu a partir de um levantamento de requisitos realizado para um cliente real, sendo posteriormente transformado em um projeto de estudo e portfólio com foco em arquitetura de software, backend, frontend e infraestrutura.

---

## Objetivo

O G-CheckFlow tem como objetivo substituir processos realizados em planilhas por uma aplicação web centralizada, permitindo o cadastro e gerenciamento de operações envolvendo cheques, cálculo automático de valores negociados e emissão de relatórios.

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

![TS](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white) ![Next JS](https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white) ![- Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4.svg?style=for-the-badge&logo=Tailwind-CSS&logoColor=white) ![- shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000.svg?style=for-the-badge&logo=shadcn/ui&logoColor=white)


#### Backend

![TS](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=TypeScript&logoColor=white) ![- NestJS](https://img.shields.io/badge/NestJS-E0234E.svg?style=for-the-badge&logo=NestJS&logoColor=white) ![- Prisma ORM](https://img.shields.io/badge/Prisma-2D3748.svg?style=for-the-badge&logo=Prisma&logoColor=white) ![- PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1.svg?style=for-the-badge&logo=PostgreSQL&logoColor=white) ![- Swagger](https://img.shields.io/badge/Swagger-85EA2D.svg?style=for-the-badge&logo=Swagger&logoColor=black)

#### Infraestrutura

![- Docker](https://img.shields.io/badge/Docker-2496ED.svg?style=for-the-badge&logo=Docker&logoColor=white) ![- Turborepo](https://img.shields.io/badge/Turborepo-FF1E56.svg?style=for-the-badge&logo=Turborepo&logoColor=white) 

---

## Estrutura

```text
apps/
├── web/
└── api/

packages/
└── shared/

docs/
```

## Como executar

Instalar dependências

```bash
npm install
```

Executar ambiente de desenvolvimento

```bash
npm run dev
```

---

## Motivação

Este projeto surgiu após um levantamento completo de requisitos para um sistema de gestão de cheques. Embora a proposta comercial não tenha sido aprovada, o material produzido serviu como base para a construção de um software completo, permitindo praticar todas as etapas do desenvolvimento de um sistema real.

---

## Status

🚧 Em desenvolvimento.