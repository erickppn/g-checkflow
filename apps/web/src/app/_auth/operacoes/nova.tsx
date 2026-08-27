import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { Clock3, Percent } from "lucide-react"

import { PageTitle } from "@/components/common/page-title"
import { PageContainer } from "@/components/layout/page-container"
import { SummaryCard } from "@/components/common/summary-card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { ProviderAvatar } from "@/features/providers/components/provider-avatar"
import { providersQueries, useProviders } from "@/features/providers/providers.queries"
import type { ProviderWithOperationsCount } from "@/features/providers/types/provider.types"

import { useCreateOperation } from "@/features/operations/operations.mutations"

import { ChecksTable } from "@/features/operations/components/checks-table"
import type { CalculatedCheck } from "@/features/operations/types/check.types"
import { toast } from "react-toastify"

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
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(providersQueries.all())
  },

  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const { data: providers } = useProviders();

  const createOperation = useCreateOperation();

  const [selectedProvider, setSelectedProvider] = useState<ProviderWithOperationsCount | null>(null);

  const providerItems = providers.map((provider) => ({
    label: provider.name,
    value: String(provider.id),
  }));

  const [checks, setChecks] = useState<CalculatedCheck[]>([]);

  function handleAddCheck(check: CalculatedCheck) {
    setChecks((prev) => [...prev, check]);
  }

  function handleRemoveCheck(checkId: string) {
    setChecks((prev) => prev.filter((check) => check.id !== checkId))
  }

  function handleUpdateCheck(updatedCheck: CalculatedCheck) {
    setChecks((prev) =>
      prev.map((check) =>
        check.id === updatedCheck.id
          ? updatedCheck
          : check
      )
    )
  }

  function handleCreateOperation() {
    if (!selectedProvider) {
      return toast.error("Necessário selecionar um prestador");
    }

    if (checks.length === 0) {
      return toast.error("Não é possível criar operação sem cheques");
    }

    const payload = {
      providerId: selectedProvider.id,
      checks: checks.map((check) => ({
        issuerName: check.issuerName,
        bankCode: check.bankCode,
        checkNumber: check.checkNumber,
        amount: check.amount,
        interestRate: check.interestRate,
        issueDate: check.issueDate.toISOString(),
        dueDate: check.dueDate.toISOString(),
        additionalDays: check.additionalDays,
      })),
    }

    createOperation.mutate(payload, {
      onSuccess: (operation) => {
        navigate({
          to: "/operacoes/$id",
          params: {
            id: String(operation.operation.id),
          },
        });

        toast.success("Operação salva com sucesso");
      },

      onError: () => {
        toast("Algo deu errado");
      },
    })
  }

  return (
    <div className="flex flex-1 overflow-hidden flex-col min-w-0">
      <section className="
        flex flex-col border-b border-border bg-card/80 px-8 
        max-md:px-4
      ">
        <div className="
          w-full grid grid-cols-[minmax(0,1fr)_100px_100px] gap-4 items-start max-w-440 mx-auto py-3 
          max-lg:grid-ols-2
        ">
          <Field className="flex flex-col gap-1.5 max-lg:co-span-2">
            <FieldLabel className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Prestador
            </FieldLabel>

            <Select
              items={providerItems}
              value={selectedProvider ? String(selectedProvider.id) : ""}
              onValueChange={(value) => {
                const provider = providers.find(
                  provider => String(provider.id) === value
                )

                setSelectedProvider(provider ?? null)
              }}
            >
              <SelectTrigger className="py-4.5 text-foreground">
                {selectedProvider && <ProviderAvatar className="size-6 text-[10px]" name={selectedProvider.name} />}

                <SelectValue placeholder="Selecione um prestador" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {providerItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Taxa padrão
            </span>
            <div className="flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm">
              <Percent className="size-4 text-muted-foreground" />

              <span className="text-muted-foreground">
                {selectedProvider?.defaultInterestRate}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Comp. padrão
            </span>
            <div className="flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm">
              <Clock3 className="size-4 text-muted-foreground" />

              <span className="text-muted-foreground">
                {selectedProvider?.defaultCompensationDays ?? 0} {selectedProvider?.defaultCompensationDays != 1 ? "dias" : "dia"}
              </span>
            </div>
          </div>
        </div>

        <span className="
          text-xs text-left w-full text-muted-foreground max-w-440 mx-auto mb-2 
          max-md:hidden
        ">
          Taxa e dias de compensação são sugeridos pelo prestador e podem ser ajustados em cada cheque.
        </span>
      </section>

      <PageContainer>
        <div className="flex min-h-0 flex-col gap-6 max-w-440 flex-1 mx-auto w-full relative">
          <PageTitle title="Nova Operação" subtitle="Preencha os dados da operação e adicione os cheques recebidos." />

          <div className="
            flex gap-5 min-h-0 flex-1 
            max-xl:flex-col
          "> 
            <ChecksTable
              checks={checks}
              onAddCheck={handleAddCheck}
              currentProvider={selectedProvider}
              onRemoveCheck={handleRemoveCheck}
              onUpdateCheck={handleUpdateCheck}
            />

            <SummaryCard
              checks={checks}
              onSubmitOperation={handleCreateOperation}
              isSaving={createOperation.isPending}
            />
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
