export const checkSortOptions = [
  {
    id: "dueDate-asc",
    label: "Vencimento (mais próximo)",
    sortBy: "dueDate",
    sortOrder: "asc",
  },
  {
    id: "dueDate-desc",
    label: "Vencimento (mais distante)",
    sortBy: "dueDate",
    sortOrder: "desc",
  },
  {
    id: "amount-desc",
    label: "Maior valor",
    sortBy: "amount",
    sortOrder: "desc",
  },
  {
    id: "amount-asc",
    label: "Menor valor",
    sortBy: "amount",
    sortOrder: "asc",
  }
] as const;

export type CheckSortId =
  typeof checkSortOptions[number]["id"];