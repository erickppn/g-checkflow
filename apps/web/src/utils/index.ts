export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function parseDecimal(value: string) {
  return Number(value.replace(",", "."))
}