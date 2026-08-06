import { PageTitle } from "@/components/common/page-title"
import { PageContainer } from "@/components/layout/page-container"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ProviderAvatar } from "@/features/providers/components/provider-avatar"
import { createFileRoute } from "@tanstack/react-router"
import { Clock3, Percent } from "lucide-react"
import { useState } from "react"

const prestadores = [
  { label: "amanda", value: "amanda", },
  { label: "bryan", value: "bryan", },
  { label: "gabriel", value: "gabriel", },
  { label: "isabela farofa", value: "isabela farofa", },
  { label: "juliana", value: "juliana", },
]

export const Route = createFileRoute("/_auth/operacoes/nova")({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>()

  return (
    <div className="flex h-ful flex-1 flex-col min-w-0 overflow-hidden">
      <section className="border-b border-border bg-card/80">
        <div className="grid grid-cols-[1.8fr_220px_220px] gap-4 items-start max-w-360 mx-auto py-3">
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
        <div className="flex flex-col gap-6 max-w-360 flex-1 mx-auto w-full">
          <PageTitle title="Nova Operação" subtitle="Preencha os dados da operação e adicione os cheques recebidos." />

          <section className="flex-1 min-h-0 overflow-auto rounded-md border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Cheques da operação</h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Digite na última linha e pressione Enter para adicionar o próximo.
                </p>
              </div>
            </div>

            <div className="relative w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/90 uppercase text-[11px] font-bold tracking-wider">
                    <TableHead className="w-10 text-center">#</TableHead>
                    <TableHead className="min-w-32.5">Emitente</TableHead>
                    <TableHead className="min-w-37.5">Banco</TableHead>
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
              </Table>
              </div>
          </section>
        </div>
      </PageContainer>
    </div>
  )
}
