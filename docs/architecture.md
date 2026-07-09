# Arquitetura

## Visão Geral

O G-CheckFlow é um sistema web desenvolvido utilizando uma arquitetura cliente-servidor.

A aplicação é organizada como um monorepo, separando frontend, backend, documentação e código compartilhado. Essa organização facilita a manutenção do projeto, a reutilização de código quando necessário e a evolução independente de cada aplicação.

## Arquitetura Geral

```
  Usuário
  ↓
  Frontend (Next.js)
  |
  | HTTP/REST
  ↓
  API (NestJS)
  ↓
  Prisma ORM
  ↓
  PostgreSQL
```

Toda comunicação entre o frontend e o banco de dados acontece exclusivamente através da API.

O frontend não acessa o banco diretamente, mantendo a separação entre interface, regras de negócio e persistência de dados.

## Estrutura do projeto

```text
├── apps/
│   ├── web/
│   └── api/
│
├── packages/
│   └── shared/
│
├── docs/
│   ├── diagrams/
│   ├── architecture.md
│   ├── requirements.md
│   └── roadmap.md
```

### Frontend - apps/web
Responsável pela interface do usuário.


- Renderização das telas
- Validação inicial dos formulários
- Comunicação com a API
- Exibição dos dados

>**Next.js**
>Framework utilizado para desenvolvimento da interface do usuário.

### Backend - apps/api

Responsável por:

- Autenticação
- Regras de negócio
- Cálculos
- Geração de PDF
- Comunicação com o banco

>**NestJS**
>Framework utilizado para implementação da API.

### packages/shared

Pacote destinado ao compartilhamento de código entre frontend e backend.

Exemplos:

- Tipos
- Schemas
- Constantes
- Utilitários

### Infraestrutura

#### PostgreSQL

PostgreSQL será utilizado para armazenar todas as informações da aplicação.

>**PostgreSQL**
>Banco relacional utilizado para persistência das informações.

#### Docker

Utilizado para criar um ambiente de desenvolvimento reproduzível.

---


## Diagramas

Os principais fluxos e representações visuais do projeto encontram-se na pasta `docs/diagrams`.

- Fluxo principal do sistema: [diagrams/operation-flow](./diagrams/operation-flow.png)