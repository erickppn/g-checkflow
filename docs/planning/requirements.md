# Requisitos Funcionais

Esta proposta foi construída a partir do levantamento de requisitos realizado com o cliente,
incluindo análise do processo atual, entrevistas e validação das regras de negócio.

## Funcionalidades

### Usuários
- Autenticação por usuário e senha.
- Cadastro de usuários.
- Administrador.
- Usuários com permissões restritas, conforme definição do administrador.

### Prestadores
> Responsável por trazer os cheques.
- Cadastro.
- Consulta.
- Alteração.
- Cadastro de taxa padrão.
- Dias padrão de compensação.

### Operações
- Criar uma nova operação.
- Selecionar o prestador responsável.
- Carregar automaticamente
  - taxa padrão
  - dias de compensação padrão
- Inserir um ou mais cheques.
- Calcular automaticamente juros e valor líquido.
- Gerar relatório em PDF.
- Registrar a data de fechamento da operação.
- Visualização do resumo da operação.

Permitir alterar a data da operação.

### Cheques
- Cadastro dos dados do cheque.
- Controle de status (A compensar, Compensado e Devolvido).
- Registro do motivo da devolução.
- Visualização dos dias até a compensação.
- Definição da taxa individual.

### Consultas
> O que poderá ser pesquisado
- Consulta por período.
- Consulta por status dos cheques.
- Consulta por cheque.
- Consulta por prestador.

### Tela Inicial
- Operações em aberto.
- Cheques aguardando compensação.
- Cheques devolvidos.
- Valor total das operações em aberto.
- Últimas operações realizadas.

## Regras de negócio

- Uma operação pertence a um único prestador.
- Um prestador pode possuir diversas operações.
- Cada prestador possui uma taxa padrão.
- Cada prestador possui uma quantidade padrão de dias de compensação.
- Uma operação deve conter pelo menos um cheque.
- Não é permitido criar operações sem cheques.
- Ao iniciar uma operação, essas informações são carregadas automaticamente.
- A data da operação é preenchida com o dia atual, podendo ser alterada pelo usuário.
- Cada cheque pertence a apenas uma operação.
- Cada cheque possui sua própria taxa.
- O cálculo dos valores seguirá as regras atualmente utilizadas pela empresa.
- Os cálculos serão baseados nos dados cadastrados no momento da consulta.
- O relatório é gerado sob demanda e não é armazenado.
- Uma operação permanece aberta enquanto existir ao menos um cheque pendente.
- Uma operação é considerada fechada quando todos os cheques estiverem compensados ou devolvidos.
- Cheques podem ser baixados como compensados ou devolvidos.
- Cheques devolvidos devem possuir um motivo da devolução.
