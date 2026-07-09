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

### Operações
- Criar uma nova operação.
- Selecionar o prestador responsável.
- Definir a taxa aplicada à operação.
- Inserir um ou mais cheques.
- Calcular automaticamente juros e valor líquido.
- Gerar relatório em PDF.
- Registrar a data de fechamento da operação.
- Visualização do resumo da operação.

### Cheques
- Cadastro dos dados do cheque.
- Controle de status (A compensar, Compensado e Devolvido).
- Registro do motivo da devolução.
- Visualização dos dias até a compensação.

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
- Um prestador pode possuir diversas operações (ao passar dos meses).
- Uma operação pode conter diversos cheques.
- Cada cheque pertence a apenas uma operação.
- A taxa é definida pelo usuário no momento da operação.
- O cálculo dos valores seguirá as regras atualmente utilizadas pela empresa e validadas durante o desenvolvimento.
- Os cálculos apresentados pelo sistema serão baseados nas informações cadastradas no momento da operação (ou edição)
- O relatório é gerado com os valores bruto, juros e líquido.
- Após criada, a operação permanece disponível para consulta.
- Cheques podem ser baixados como compensados ou devolvidos.
- Cheques devolvidos devem possuir o motivo da devolução.