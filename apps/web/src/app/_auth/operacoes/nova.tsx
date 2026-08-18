import { useMemo, useRef, useState } from "react"
import { PageTitle } from "@/components/common/page-title"
import { PageContainer } from "@/components/layout/page-container"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProviderAvatar } from "@/features/providers/components/provider-avatar"
import { createFileRoute } from "@tanstack/react-router"
import { Clock3, CornerDownLeft, Percent } from "lucide-react"

import { calculateCheck } from "@g-checkflow/shared/calculate-check"

import { format, parse } from "date-fns"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { ItemGroup } from "@/components/ui/item"
import type { CalculatedCheck, DraftCheck } from "@/features/operations/types/check.types"
import { Kbd } from "@/components/ui/kbd"
import { Button } from "@/components/ui/button"
import { currencyFormatter } from "@/utils"
import { SummaryCard } from "@/components/common/summary-card"

const prestadores = [
  { label: "amanda", value: "amanda", defaultInterestRate: 4.5, defaultCompensationDays: 1 },
  { label: "bryan", value: "bryan", },
  { label: "gabriel", value: "gabriel", },
  { label: "isabela", value: "isabela", },
  { label: "juliana", value: "juliana", },
]

// const mockChecks = [
//   {
//     id: "1",
//     issuerName: "Maria Souza",
//     bankCode: "001",
//     checkNumber: "002244",
//     amount: 1200,
//     interestRate: 4.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 7, 31),
//     additionalDays: 1,
//     days: 13,
//     totalDays: 14,
//     interest: 27,
//     netAmount: 1173,
//   },
//   {
//     id: "2",
//     issuerName: "João da Silva",
//     bankCode: "212",
//     checkNumber: "213243",
//     amount: 1200.6,
//     interestRate: 3.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 30),
//     additionalDays: 1,
//     days: 44,
//     totalDays: 45,
//     interest: 63.03,
//     netAmount: 1137.57,
//   },
//   {
//     id: "3",
//     issuerName: "Carlos Oliveira",
//     bankCode: "033",
//     checkNumber: "845721",
//     amount: 3500,
//     interestRate: 5.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 9, 15),
//     additionalDays: 2,
//     days: 59,
//     totalDays: 61,
//     interest: 392.33,
//     netAmount: 3107.67,
//   },
//   {
//     id: "4",
//     issuerName: "Fernanda Lima",
//     bankCode: "104",
//     checkNumber: "551902",
//     amount: 875.5,
//     interestRate: 4,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 5),
//     additionalDays: 1,
//     days: 19,
//     totalDays: 20,
//     interest: 23.35,
//     netAmount: 852.15,
//   },
//   {
//     id: "5",
//     issuerName: "Ricardo Mendes",
//     bankCode: "237",
//     checkNumber: "778431",
//     amount: 2500,
//     interestRate: 4.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 10, 10),
//     additionalDays: 2,
//     days: 85,
//     totalDays: 87,
//     interest: 326.25,
//     netAmount: 2173.75,
//   },
//   {
//     id: "6",
//     issuerName: "Amanda Ribeiro",
//     bankCode: "341",
//     checkNumber: "119823",
//     amount: 650,
//     interestRate: 3,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 20),
//     additionalDays: 1,
//     days: 34,
//     totalDays: 35,
//     interest: 22.75,
//     netAmount: 627.25,
//   },
//   {
//     id: "7",
//     issuerName: "Bruno Ferreira",
//     bankCode: "077",
//     checkNumber: "334821",
//     amount: 4800.75,
//     interestRate: 5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 11, 15),
//     additionalDays: 3,
//     days: 120,
//     totalDays: 123,
//     interest: 984.15,
//     netAmount: 3816.6,
//   },
//   {
//     id: "8",
//     issuerName: "Juliana Costa",
//     bankCode: "260",
//     checkNumber: "902177",
//     amount: 1500.25,
//     interestRate: 4.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 9, 1),
//     additionalDays: 1,
//     days: 45,
//     totalDays: 46,
//     interest: 103.56,
//     netAmount: 1396.69,
//   },
//   {
//     id: "9",
//     issuerName: "Gustavo Almeida",
//     bankCode: "033",
//     checkNumber: "450019",
//     amount: 3200,
//     interestRate: 5.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 25),
//     additionalDays: 1,
//     days: 39,
//     totalDays: 40,
//     interest: 234.67,
//     netAmount: 2965.33,
//   },
//   {
//     id: "10",
//     issuerName: "Patrícia Santos",
//     bankCode: "748",
//     checkNumber: "671204",
//     amount: 925.9,
//     interestRate: 3.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 12),
//     additionalDays: 1,
//     days: 26,
//     totalDays: 27,
//     interest: 29.12,
//     netAmount: 896.78,
//   },
//   {
//     id: "1",
//     issuerName: "Maria Souza",
//     bankCode: "001",
//     checkNumber: "002244",
//     amount: 1200,
//     interestRate: 4.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 7, 31),
//     additionalDays: 1,
//     days: 13,
//     totalDays: 14,
//     interest: 27,
//     netAmount: 1173,
//   },
//   {
//     id: "2",
//     issuerName: "João da Silva",
//     bankCode: "212",
//     checkNumber: "213243",
//     amount: 1200.6,
//     interestRate: 3.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 30),
//     additionalDays: 1,
//     days: 44,
//     totalDays: 45,
//     interest: 63.03,
//     netAmount: 1137.57,
//   },
//   {
//     id: "3",
//     issuerName: "Carlos Oliveira",
//     bankCode: "033",
//     checkNumber: "845721",
//     amount: 3500,
//     interestRate: 5.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 9, 15),
//     additionalDays: 2,
//     days: 59,
//     totalDays: 61,
//     interest: 392.33,
//     netAmount: 3107.67,
//   },
//   {
//     id: "4",
//     issuerName: "Fernanda Lima",
//     bankCode: "104",
//     checkNumber: "551902",
//     amount: 875.5,
//     interestRate: 4,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 5),
//     additionalDays: 1,
//     days: 19,
//     totalDays: 20,
//     interest: 23.35,
//     netAmount: 852.15,
//   },
//   {
//     id: "5",
//     issuerName: "Ricardo Mendes",
//     bankCode: "237",
//     checkNumber: "778431",
//     amount: 2500,
//     interestRate: 4.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 10, 10),
//     additionalDays: 2,
//     days: 85,
//     totalDays: 87,
//     interest: 326.25,
//     netAmount: 2173.75,
//   },
//   {
//     id: "6",
//     issuerName: "Amanda Ribeiro",
//     bankCode: "341",
//     checkNumber: "119823",
//     amount: 650,
//     interestRate: 3,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 20),
//     additionalDays: 1,
//     days: 34,
//     totalDays: 35,
//     interest: 22.75,
//     netAmount: 627.25,
//   },
//   {
//     id: "7",
//     issuerName: "Bruno Ferreira",
//     bankCode: "077",
//     checkNumber: "334821",
//     amount: 4800.75,
//     interestRate: 5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 11, 15),
//     additionalDays: 3,
//     days: 120,
//     totalDays: 123,
//     interest: 984.15,
//     netAmount: 3816.6,
//   },
//   {
//     id: "8",
//     issuerName: "Juliana Costa",
//     bankCode: "260",
//     checkNumber: "902177",
//     amount: 1500.25,
//     interestRate: 4.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 9, 1),
//     additionalDays: 1,
//     days: 45,
//     totalDays: 46,
//     interest: 103.56,
//     netAmount: 1396.69,
//   },
//   {
//     id: "9",
//     issuerName: "Gustavo Almeida",
//     bankCode: "033",
//     checkNumber: "450019",
//     amount: 3200,
//     interestRate: 5.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 25),
//     additionalDays: 1,
//     days: 39,
//     totalDays: 40,
//     interest: 234.67,
//     netAmount: 2965.33,
//   },
//   {
//     id: "10",
//     issuerName: "Patrícia Santos",
//     bankCode: "748",
//     checkNumber: "671204",
//     amount: 925.9,
//     interestRate: 3.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 12),
//     additionalDays: 1,
//     days: 26,
//     totalDays: 27,
//     interest: 29.12,
//     netAmount: 896.78,
//   },
//   {
//     id: "1",
//     issuerName: "Maria Souza",
//     bankCode: "001",
//     checkNumber: "002244",
//     amount: 1200,
//     interestRate: 4.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 7, 31),
//     additionalDays: 1,
//     days: 13,
//     totalDays: 14,
//     interest: 27,
//     netAmount: 1173,
//   },
//   {
//     id: "2",
//     issuerName: "João da Silva",
//     bankCode: "212",
//     checkNumber: "213243",
//     amount: 1200.6,
//     interestRate: 3.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 30),
//     additionalDays: 1,
//     days: 44,
//     totalDays: 45,
//     interest: 63.03,
//     netAmount: 1137.57,
//   },
//   {
//     id: "3",
//     issuerName: "Carlos Oliveira",
//     bankCode: "033",
//     checkNumber: "845721",
//     amount: 3500,
//     interestRate: 5.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 9, 15),
//     additionalDays: 2,
//     days: 59,
//     totalDays: 61,
//     interest: 392.33,
//     netAmount: 3107.67,
//   },
//   {
//     id: "4",
//     issuerName: "Fernanda Lima",
//     bankCode: "104",
//     checkNumber: "551902",
//     amount: 875.5,
//     interestRate: 4,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 5),
//     additionalDays: 1,
//     days: 19,
//     totalDays: 20,
//     interest: 23.35,
//     netAmount: 852.15,
//   },
//   {
//     id: "5",
//     issuerName: "Ricardo Mendes",
//     bankCode: "237",
//     checkNumber: "778431",
//     amount: 2500,
//     interestRate: 4.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 10, 10),
//     additionalDays: 2,
//     days: 85,
//     totalDays: 87,
//     interest: 326.25,
//     netAmount: 2173.75,
//   },
//   {
//     id: "6",
//     issuerName: "Amanda Ribeiro",
//     bankCode: "341",
//     checkNumber: "119823",
//     amount: 650,
//     interestRate: 3,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 20),
//     additionalDays: 1,
//     days: 34,
//     totalDays: 35,
//     interest: 22.75,
//     netAmount: 627.25,
//   },
//   {
//     id: "7",
//     issuerName: "Bruno Ferreira",
//     bankCode: "077",
//     checkNumber: "334821",
//     amount: 4800.75,
//     interestRate: 5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 11, 15),
//     additionalDays: 3,
//     days: 120,
//     totalDays: 123,
//     interest: 984.15,
//     netAmount: 3816.6,
//   },
//   {
//     id: "8",
//     issuerName: "Juliana Costa",
//     bankCode: "260",
//     checkNumber: "902177",
//     amount: 1500.25,
//     interestRate: 4.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 9, 1),
//     additionalDays: 1,
//     days: 45,
//     totalDays: 46,
//     interest: 103.56,
//     netAmount: 1396.69,
//   },
//   {
//     id: "9",
//     issuerName: "Gustavo Almeida",
//     bankCode: "033",
//     checkNumber: "450019",
//     amount: 3200,
//     interestRate: 5.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 25),
//     additionalDays: 1,
//     days: 39,
//     totalDays: 40,
//     interest: 234.67,
//     netAmount: 2965.33,
//   },
//   {
//     id: "10",
//     issuerName: "Patrícia Santos",
//     bankCode: "748",
//     checkNumber: "671204",
//     amount: 925.9,
//     interestRate: 3.5,
//     issueDate: new Date(2026, 7, 17),
//     dueDate: new Date(2026, 8, 12),
//     additionalDays: 1,
//     days: 26,
//     totalDays: 27,
//     interest: 29.12,
//     netAmount: 896.78,
//   },
// ]

const emitentes = [
  {
    id: 1,
    name: "João da Silva",
  },
  {
    id: 2,
    name: "Maria Souza",
  },
  {
    id: 3,
    name: "Carlos Oliveira",
  },
  {
    id: 4,
    name: "Amanda Ribeiro",
  },
]

export const banks = [
  {
    code: "001",
    name: "Banco do Brasil",
  },
  {
    code: "033",
    name: "Santander",
  },
  {
    code: "104",
    name: "Caixa Econômica",
  },
  {
    code: "237",
    name: "Bradesco",
  },
  {
    code: "260",
    name: "Nubank",
  },
  {
    code: "341",
    name: "Itaú",
  },
  {
    code: "077",
    name: "Inter",
  },
  {
    code: "212",
    name: "Banco Original",
  },
  {
    code: "336",
    name: "C6 Bank",
  },
  {
    code: "290",
    name: "PagBank",
  },
  {
    code: "756",
    name: "Sicoob",
  },
  {
    code: "748",
    name: "Sicredi",
  },
  {
    code: "422",
    name: "Safra",
  },
  {
    code: "041",
    name: "Banrisul",
  },
  {
    code: "070",
    name: "BRB",
  },
]

export const Route = createFileRoute("/_auth/operacoes/nova")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>();

  const [draft, setDraft] = useState<DraftCheck>(createEmptyDraft());

  const [checks, setChecks] = useState<CalculatedCheck[]>([]);
  const [errors, setErrors] = useState<Partial<Record<keyof DraftCheck, boolean>>>({});

  const issuerInputRef = useRef<HTMLInputElement>(null);

  function updateDraft<K extends keyof DraftCheck>(
    field: K,
    value: DraftCheck[K],
  ) {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  }

  function createEmptyDraft(): DraftCheck {
    return {
      issuerName: "",
      bankCode: "",
      checkNumber: "",
      amount: "",
      interestRate: "5.5",
      issueDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: "",
      additionalDays: "1",
    }
  }

  function parseDecimal(value: string) {
    return Number(value.replace(",", "."))
  }

  function handleAddCheck() {
    const newErrors: Partial<Record<keyof DraftCheck, boolean>> = {}

    if (!draft.issuerName) {
      newErrors.issuerName = true
    }

    if (!draft.bankCode) {
      newErrors.bankCode = true
    }

    if (!draft.checkNumber) {
      newErrors.checkNumber = true
    }

    if (!draft.amount) {
      newErrors.amount = true
    }

    if (!draft.dueDate) {
      newErrors.dueDate = true
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (!preview) return

    const cheque: CalculatedCheck = {
      id: crypto.randomUUID(),

      issuerName: draft.issuerName,
      bankCode: draft.bankCode,
      checkNumber: draft.checkNumber,

      amount: parseDecimal(draft.amount),
      interestRate: parseDecimal(draft.interestRate),

      issueDate: parse(draft.issueDate, "yyyy-MM-dd", new Date()),
      dueDate: parse(draft.dueDate, "yyyy-MM-dd", new Date()),

      additionalDays: Number(draft.additionalDays),

      days: preview.days,
      totalDays: preview.totalDays,
      interest: preview.interest,
      netAmount: preview.netAmount,
    }

    setChecks((prev) => [...prev, cheque])

    setDraft(createEmptyDraft());

    issuerInputRef.current?.focus();
  }

  function handleDraftKeyDown(
    event: React.KeyboardEvent
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddCheck();
    }
  }

  const preview = useMemo(() => {
    const amount = Number(draft.amount.replace(",", "."));
    const interestRate = Number(draft.interestRate.replace(",", "."));
    const additionalDays = Number(draft.additionalDays);

    if (
      !amount ||
      !draft.issueDate ||
      !draft.dueDate ||
      !interestRate
    ) {
      return null
    }

    return calculateCheck({
      amount,
      interestRate,
      issueDate: new Date(draft.issueDate),
      dueDate: new Date(draft.dueDate),
      additionalDays,
    })
  }, [draft]);

  return (
    <div className="flex flex-1 overflow-hidden flex-col min-w-0">
      <section className="border-b border-border bg-card/80">
        <div className="grid grid-cols-[1.8fr_220px_220px] gap-4 items-start max-w-440 mx-auto py-3">
          <Field className="flex flex-col gap-1.5">
            <FieldLabel className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Prestador
            </FieldLabel>

            <Select
              items={prestadores}
              value={selectedProvider}
              onValueChange={setSelectedProvider}
            >
              <SelectTrigger className="py-4.5 text-foreground">
                {selectedProvider && <ProviderAvatar className="size-6 text-[10px]" name={selectedProvider} />}

                <SelectValue placeholder="Selecione um prestador" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {prestadores.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <FieldDescription className="mt-2.5 text-xs text-muted-foreground">
              Taxa e dias de compensação são sugeridos pelo prestador e podem ser ajustados em cada cheque.
            </FieldDescription>

          </Field>

          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Taxa padrão
            </span>
            <div className="flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm">
              <Percent className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">5,5</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Comp. padrão
            </span>
            <div className="flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm">
              <Clock3 className="size-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {2} dias
              </span>
            </div>
          </div>
        </div>
      </section>

      <PageContainer>
        <div className="flex min-h-0 flex-col gap-6 max-w-440 flex-1 mx-auto w-full">
          <PageTitle title="Nova Operação" subtitle="Preencha os dados da operação e adicione os cheques recebidos." />

          <div className="flex gap-5 min-h-0 flex-1">
            <section className="flex flex-1 flex-col overflow-hidden rounded-md border border-borde bg-card shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Cheques da operação</h2>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Digite na última linha e pressione Enter para adicionar o próximo.
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
                    <Kbd className="inline-flex items-center gap-1 font-sans text-xs font-medium">
                      <CornerDownLeft className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                      <span>Enter</span>
                    </Kbd>
                    <span>adiciona</span>
                  </div>

                  <span className="text-slate-300 dark:text-slate-600">•</span>

                  <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
                    <Kbd className="font-sans text-xs font-medium">↹ Tab</Kbd>
                    <span>navega</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 overflow-auto">
                <Table>
                  <TableHeader className="sticky top-0 z-10">
                    <TableRow className="bg-muted hover:bg-muted/90 uppercase text-[11px] font-bold tracking-wider">
                      <TableHead className="w-10 text-center">#</TableHead>
                      <TableHead className="min-w-32.5">Emitente</TableHead>
                      <TableHead className="min-w">Banco</TableHead>
                      <TableHead className="w-24">Nº Cheque</TableHead>
                      <TableHead className="w-28">Valor</TableHead>
                      <TableHead className="w-28">Data de registro</TableHead>
                      <TableHead className="w-28">Vencimento</TableHead>
                      <TableHead className="w-20 text-right">Taxa</TableHead>
                      <TableHead className="w-16 text-right">Comp</TableHead>
                      <TableHead className="w-16 text-right">Dias</TableHead>
                      <TableHead className="w-24 text-right">Juros</TableHead>
                      <TableHead className="w-28 text-right">Líquido</TableHead>
                      <TableHead className="w-10"><span className="sr-only">Ações</span></TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {checks.map((check, i) => (
                      <TableRow
                        key={check.id}
                      >
                        <TableCell className="text-center text-muted-foreground">
                          {i + 1}
                        </TableCell>

                        <TableCell>
                          {check.issuerName}
                        </TableCell>

                        <TableCell>
                          {banks.find((bank) => bank.code === check.bankCode)?.name}
                        </TableCell>

                        <TableCell>
                          {check.checkNumber}
                        </TableCell>

                        <TableCell>
                          R$ {check.amount}
                        </TableCell>

                        <TableCell>
                          {format(check.issueDate, "dd/MM/yyyy")}
                        </TableCell>

                        <TableCell>
                          {format(check.dueDate, "dd/MM/yyyy")}
                        </TableCell>

                        <TableCell>
                          {check.interestRate}%
                        </TableCell>

                        <TableCell>
                          {check.additionalDays}
                        </TableCell>

                        <TableCell>
                          {check.totalDays}
                        </TableCell>

                        <TableCell className="text-right text-red-600">
                          {currencyFormatter.format(check.interest)}
                        </TableCell>

                        <TableCell className="text-right text-green-700">
                          {currencyFormatter.format(check.netAmount)}
                        </TableCell>

                        <TableCell>
                          
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                  <TableFooter className="sticky bottom-0 z-10 bg-card">
                    {/* active input row */}
                    <TableRow onKeyDown={handleDraftKeyDown}>
                      <TableCell className="text-center">{checks.length + 1}</TableCell>

                      {/* Emitente */}
                      <TableCell>
                        <Combobox
                          items={emitentes}
                          value={draft.issuerName}
                          onInputValueChange={(e) => updateDraft("issuerName", e)}
                          required
                        >
                          <ComboboxInput
                            placeholder="Emitente"
                            showTrigger={false}
                            aria-invalid={errors.issuerName}
                            ref={issuerInputRef}
                          />

                          <ComboboxContent className="w-max max-w-80">
                            <ComboboxEmpty className="text-xs w-50">Nenhum emitente encontrado.</ComboboxEmpty>

                            <ComboboxList>
                              {(issuer) => (
                                <ComboboxItem
                                  key={issuer.id}
                                  value={issuer.name}
                                >
                                  <span className="text-muted-foreground">
                                    {issuer.name}
                                  </span>
                                </ComboboxItem>
                              )}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      </TableCell>

                      {/* Banco */}
                      <TableCell>
                        <Combobox
                          items={banks}
                          itemToStringValue={(bank: (typeof banks)[number]) => `${bank.code} ${bank.name}`}
                          itemToStringLabel={(bank) => `${bank.code} ${bank.name}`}
                          onValueChange={(bank) => {
                            updateDraft("bankCode", bank?.code ?? "")
                          }}
                          value={banks.find((bank) => bank.code === draft.bankCode) ?? null}
                          required
                        >
                          <ComboboxInput
                            placeholder="Banco"
                            aria-invalid={errors.bankCode}
                          />

                          <ComboboxContent className="w-max max-w-80">
                            <ComboboxEmpty className="text-xs w-50">Nenhum banco encontrado.</ComboboxEmpty>

                            <ComboboxList>
                              {(bank) => (
                                <ComboboxItem
                                  key={bank.code}
                                  value={bank}
                                >
                                  <ItemGroup className="flex-row items-center text-muted-foreground">
                                    <span className="font-mono text-xs ">
                                      {bank.code}
                                    </span>

                                    <span>
                                      {bank.name}
                                    </span>
                                  </ItemGroup>
                                </ComboboxItem>
                              )}
                            </ComboboxList>
                          </ComboboxContent>
                        </Combobox>
                      </TableCell>

                      {/* Numero do Cheque */}
                      <TableCell>
                        <Input
                          maxLength={6}
                          minLength={6}
                          placeholder="Nº"
                          value={draft.checkNumber}
                          onChange={(e) => updateDraft("checkNumber", e.target.value)}
                          aria-invalid={errors.checkNumber}
                          required
                        />
                      </TableCell>

                      {/* Valor do Cheque */}
                      <TableCell>
                        <Input
                          placeholder="0,00"
                          value={draft.amount}
                          onChange={(e) => updateDraft("amount", e.target.value)}
                          aria-invalid={errors.amount}
                          type="number"
                          inputMode="decimal"
                          min="0.01"
                          step="0.01"
                          required
                        />
                      </TableCell>

                      {/* Data de Registro */}
                      <TableCell>
                        <Input
                          type="date"
                          value={draft.issueDate}
                          onChange={(e) => updateDraft("issueDate", e.target.value)}
                        />
                      </TableCell>

                      {/* Data de Vencimento */}
                      <TableCell>
                        <Input
                          type="date"
                          value={draft.dueDate}
                          onChange={(e) => updateDraft("dueDate", e.target.value)}
                          aria-invalid={errors.dueDate}
                        />
                      </TableCell>

                      {/* Taxa */}
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          max="100"
                          step="0.01"
                          required
                          value={draft.interestRate}
                          onChange={(e) => updateDraft("interestRate", e.target.value)}
                          aria-invalid={!!errors.interestRate}
                        />
                      </TableCell>

                      {/* Dias de Compensação */}
                      <TableCell className="text-right">
                        <Input
                          value={draft.additionalDays}
                          onChange={(e) => updateDraft("additionalDays", e.target.value)}
                          type="number"
                          inputMode="numeric"
                          min="0"
                          step="1"
                          required
                        />
                      </TableCell>

                      {/* Dias Totais da Operação */}
                      <TableCell className="text-right">
                        {preview?.totalDays ?? "—"}
                      </TableCell>

                      {/* Total de Juros */}
                      <TableCell className="text-right text-red-600">
                        R$ {preview?.interest ?? "—"}
                      </TableCell>

                      {/* Total Líquido */}
                      <TableCell className="text-right text-green-950">
                        R$ {preview?.netAmount ?? "—"}
                      </TableCell>

                      <TableCell>
                        <Button
                          type="button"
                          size="sm"
                          className="h-8 gap-1.5 px-2.5 text-xs font-medium"
                          onClick={handleAddCheck}
                        >
                          Adicionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </section>

            <SummaryCard checks={checks}/>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
