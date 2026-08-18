export const providerSortOptions = [
  {
    id: "name-asc",
    label: "Nome (A-Z)",
    sorting: [{ id: "name", desc: false }],
  },
  {
    id: "name-desc",
    label: "Nome (Z-A)",
    sorting: [{ id: "name", desc: true }],
  },
  {
    id: "operations-desc",
    label: "Mais operações",
    sorting: [{ id: "operationsCount", desc: true }],
  },
  {
    id: "operations-asc",
    label: "Menos operações",
    sorting: [{ id: "operationsCount", desc: false }],
  },
  {
    id: "interest-desc",
    label: "Maior taxa",
    sorting: [{ id: "defaultInterestRate", desc: true }],
  },
  {
    id: "interest-asc",
    label: "Menor taxa",
    sorting: [{ id: "defaultInterestRate", desc: false }],
  },
]

export type ProviderSortId = typeof providerSortOptions[number]["id"];