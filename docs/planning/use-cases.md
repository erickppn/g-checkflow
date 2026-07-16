# Behaviors

Este documento descreve os comportamentos esperados do sistema.
Cada comportamento deverá possuir um ou mais testes automatizados.

---

# Providers

## Cadastro

- Deve cadastrar um novo prestador.
- Não deve permitir dados inválidos.
- Deve possuir valores para taxa padrão e dias de compensação (mesmo que os valores sejam 0)

## Consulta

- Deve listar todos os prestadores.
- Deve retornar um prestador pelo ID.
- Deve retornar erro ao consultar um prestador inexistente.

## Atualização

- Deve atualizar um prestador existente.
- Não deve atualizar um prestador inexistente.

## Exclusão

- Deve excluir um prestador existente.
- Não deve excluir um prestador inexistente.

---

# Operations

## Criação

- Deve criar uma operação contendo pelo menos um cheque.
- Deve associar a operação a um prestador.
- Deve carregar os valores padrão vindos do prestador

## Cálculos

- Deve calcular os valores individuais dos cheques.
- Deve calcular o resumo financeiro da operação.

## Fechamento

- Deve permanecer aberta enquanto houver cheques pendentes.
- Deve ser fechada automaticamente quando todos os cheques forem finalizados.

## PDF

- Deve gerar um relatório utilizando os dados atuais da operação.