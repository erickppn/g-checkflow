import { useState } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { parseDecimal } from '@/utils';
import { createFileRoute, Link } from '@tanstack/react-router'
import { PageTitle } from '@/components/common/page-title';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock3, Percent, UserRoundPlus } from 'lucide-react';
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { InputGroup, InputGroupAddon } from '@/components/ui/input-group';
import { Textarea } from '@/components/ui/textarea';
import { providersQueries, useProvider } from '@/features/providers/providers.queries';
import { useUpdateProvider } from '@/features/providers/providers.mutations';
import { toast } from 'react-toastify';

export const Route = createFileRoute('/_auth/clientes/$id/editar')({
  loader: ({ context: { queryClient }, params }) => {
    return queryClient.ensureQueryData(providersQueries.findById(params.id))
  },

  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams();

  const { data: provider } = useProvider(id);

  const [form, setForm] = useState({
    name: provider.name,
    phone: provider.phone || "",
    defaultInterestRate: String(provider.defaultInterestRate),
    defaultCompensationDays: String(provider.defaultCompensationDays),
    notes: provider.notes || "",
  });

  const updateField = <K extends keyof typeof form>(
    field: K,
    value: (typeof form)[K]
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateProvider = useUpdateProvider();

  function handleCreateProvider(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      defaultInterestRate: parseDecimal(form.defaultInterestRate) || 0,
      defaultCompensationDays: Number(form.defaultCompensationDays) || 0,
      notes: form.notes.trim(),
    };

    updateProvider.mutate({ id, data: payload }, {
      onSuccess: () => {
        toast.success("Cliente atualizado com sucesso");
      },

      onError: () => {
        toast.error("Não foi possível atualizar o cliente");
      },
    });
  }

  return (
    <PageContainer className="max-w-360">
      <header className="flex flex-col gap-3 max-md:mb-3">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/clientes">Clientes</Link>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Editar Cliente</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex justify-between items-center">
          <PageTitle title="Editar Prestador" subtitle="Edite as Informações do prestador" />

          <Button
            variant="outline"
            className="py-5"
            render={<Link to="/clientes" />}
            nativeButton={false}
          >
            <ArrowLeft />
            <span className="max-md:hidden">Voltar para Clientes</span>
          </Button>
        </div>
      </header>

      <section className="h-full">
        <form
          onSubmit={handleCreateProvider}
          className="
            flex-1 max-w-200 rounded-md shadow-md bg-card p-5 border
            max-sm:h-full max-sm:flex max-sm:flex-col max-sm:justify-between"
        >
          <FieldSet>
            <FieldLegend className="flex items-center gap-2">
              <UserRoundPlus className="text-blue-500 size-5" />
              <span className="text-sm font-semibold">Dados do Cliente</span>
            </FieldLegend>

            <FieldGroup className="mt-5">
              <Field>
                <FieldLabel htmlFor="name" className="text-black/70">
                  Nome <span className="text-red-600">*</span>
                </FieldLabel>

                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="Digite o nome do prestador"
                  required
                  className="px-4 py-5"
                />
              </Field>

              <div className="
                grid grid-cols-2 gap-6
                md:grid-cols-[minmax(0,1fr)_180px_180px]
              ">
                <Field className="max-md:col-span-2 md:col-span-1">
                  <FieldLabel htmlFor="phone" className="text-black/70">
                    Telefone
                  </FieldLabel>

                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="(11) 99999-9999"
                    className="px-4 py-5"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="interest-rate" className="text-black/70">
                    Taxa de juros padrão
                  </FieldLabel>

                  <InputGroup className="overflow-hidden">
                    <Input
                      id="interest-rate"
                      value={form.defaultInterestRate}
                      onChange={(e) =>
                        updateField("defaultInterestRate", e.target.value)
                      }
                      className="border-none rounded-none px-4 py-5"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      max="100"
                      step="0.01"
                    />

                    <InputGroupAddon
                      align="inline-end"
                      className="bg-gray-500/15 h-full px-2"
                    >
                      <Percent className="size-4 text-muted-foreground" />
                    </InputGroupAddon>

                  </InputGroup>
                </Field>

                <Field>
                  <FieldLabel htmlFor="compensation-days" className="text-black/70">
                    Compensação padrão
                  </FieldLabel>

                  <InputGroup className="overflow-hidden">
                    <Input
                      id="compensation-days"
                      type="number"
                      value={form.defaultCompensationDays}
                      onChange={(e) =>
                        updateField("defaultCompensationDays", e.target.value)
                      }
                      inputMode="numeric"
                      min="0"
                      step="1"
                      className="border-none rounded-none px-4 py-5"
                    />

                    <InputGroupAddon
                      align="inline-end"
                      className="bg-gray-500/15 h-full px-2"
                    >
                      <Clock3 className="size-4 text-muted-foreground" />
                    </InputGroupAddon>
                  </InputGroup>

                </Field>
              </div>

              <Field className="max-sm:h-full">
                <FieldLabel htmlFor="notes" className="text-black/70">
                  Observações
                </FieldLabel>

                <div className="flex flex-col">
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Informações adicionais sobre o cliente"
                    maxLength={300}
                    className="min-h-24 max-sm:h-full"
                  />

                  <span className="text-end text-muted-foreground text-xs">
                    {form.notes.length}/300
                  </span>
                </div>
              </Field>
            </FieldGroup>
          </FieldSet>

          <div className="
            flex justify-end gap-3 mt-4 
            max-sm:justify-between
          ">
            <Button
              variant="outline"
              type="button"
              className="py-5 px-4 max-sm:flex-1"
              nativeButton={false}
              render={<Link to="/clientes" />}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="py-5 px-4 max-sm:flex-1"
              disabled={updateProvider.isPending}
            >
              {updateProvider.isPending
                ? "Salvando..."
                : "Salvar Cliente"
              }
            </Button>
          </div>
        </form>
      </section>
    </PageContainer>
  )
}