import { useEffect, useMemo, useState } from "react"
import type { Check, DraftCheck } from "../types/check.types"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { useIssuers } from "@/features/issuers/issuers.queries"
import { useCreateIssuer } from "@/features/issuers/issuers.mutations"
import { toast } from "react-toastify"
import { ItemGroup } from "@/components/ui/item"
import { banks } from "@/app/_auth/operacoes/nova"
import { Input } from "@/components/ui/input"
import { calculateCheck } from "@g-checkflow/shared/calculate-check"
import { useUpdateCheck } from "../checks.mutations"
import { parseDecimal } from "@/utils"

interface EditCheckFormProps {
  check: Check
  onCancel: () => void
}
export function EditCheckForm({ check, onCancel }: EditCheckFormProps) {
  function createDraftFromCheck(check: Check): DraftCheck {
    return {
      issuer: check.issuer,
      bankCode: check.bankCode,
      checkNumber: check.checkNumber,
      amount: String(check.amount),
      interestRate: String(check.interestRate),
      issueDate: format(check.issueDate, "yyyy-MM-dd"),
      dueDate: format(check.dueDate, "yyyy-MM-dd"),
      additionalDays: String(check.additionalDays),
    }
  }

  const [draft, setDraft] = useState<DraftCheck>(createDraftFromCheck(check));

  const [issuerComboboxOpen, setIssuerComboboxOpen] = useState(false);
  const [issuerSearch, setIssuerSearch] = useState("");
  const { data: issuers = [] } = useIssuers(issuerSearch);

  function updateDraft<K extends keyof DraftCheck>(
    field: K,
    value: DraftCheck[K],
  ) {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  useEffect(() => {
    setDraft(createDraftFromCheck(check))
  }, [check]);

  const createIssuer = useCreateIssuer();

  async function handleCreateIssuer() {
    if (!issuerSearch.trim()) return;

    try {
      const issuer = await createIssuer.mutateAsync({
        name: issuerSearch.trim(),
      })

      updateDraft("issuer", issuer)
      setIssuerComboboxOpen(false)

      toast.success("Emitente criado com sucesso")
    } catch {
      toast.error("Não foi possível criar o emitente")
    }
  }

  const updateCheck = useUpdateCheck();

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.issuer) return;

    try {
      await updateCheck.mutateAsync({
        id: check.id,

        data: {
          issuerId: draft.issuer.id,
          bankCode: draft.bankCode,
          checkNumber: draft.checkNumber,
          amount: parseDecimal(draft.amount),
          interestRate: parseDecimal(draft.interestRate),
          issueDate: new Date(draft.issueDate).toISOString(),
          dueDate: new Date(draft.dueDate).toISOString(),
          additionalDays: Number(draft.additionalDays),
        },
      });

      toast.success("Cheque atualizado com sucesso");

      onCancel();
    } catch {
      toast.error("Não foi possível atualizar o cheque");
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <div className="grid grid-cols-12 gap-4 max-md:grid-cols-3">

        {/* Emitente */}
        <div className="col-span-7 flex flex-col gap-1.5 max-md:col-span-3">
          <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Emitente
          </label>

          <Combobox
            items={issuers}
            value={draft.issuer}
            onValueChange={(issuer) => {
              updateDraft("issuer", issuer)
            }}
            onInputValueChange={(value) => {
              setIssuerSearch(value)
            }}
            itemToStringLabel={(issuer) => issuer.name}
            open={issuerComboboxOpen}
            onOpenChange={setIssuerComboboxOpen}
            required
          >
            <ComboboxInput
              placeholder="Emitente"
              showTrigger={false}
            />

            <ComboboxContent className="w-max max-w-80">
              <ComboboxEmpty>
                <div className="flex flex-col">
                  <span className="block text-xs text-muted-foreground">
                    Nenhum emitente encontrado.
                  </span>

                  {issuerSearch && (
                    <Button
                      type="button"
                      size="sm"
                      className=" mt-2 w-full text-center"
                      onClick={handleCreateIssuer}
                    >
                      + Criar "{issuerSearch}"
                    </Button>
                  )}
                </div>
              </ComboboxEmpty>

              <ComboboxList>
                {(issuer) => (
                  <ComboboxItem
                    key={issuer.id}
                    value={issuer}
                    className="cursor-pointer"
                  >
                    <span className="text-muted-foreground">
                      {issuer.name}
                    </span>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>

        {/* Banco */}
        <div className="col-span-5 flex flex-col gap-1.5 max-md:col-span-2">
          <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Banco
          </label>

          <Combobox
            items={banks}
            itemToStringValue={(bank: (typeof banks)[number]) =>
              `${bank.code} ${bank.name}`
            }
            itemToStringLabel={(bank) => `${bank.code} ${bank.name}`}
            onValueChange={(bank) => {
              updateDraft("bankCode", bank?.code ?? "")
            }}
            value={banks.find(
              (bank) => bank.code === draft.bankCode
            ) ?? null}
            required
          >
            <ComboboxInput placeholder="Banco" />

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
        </div>

        {/* Nº do cheque */}
        <div className="col-span-3 flex flex-col gap-1.5 max-md:col-span-1">
          <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Nº do cheque
          </label>

          <Input
            maxLength={6}
            placeholder="Nº"
            value={draft.checkNumber}
            onChange={(e) =>
              updateDraft("checkNumber", e.target.value)
            }
            required
          />
        </div>

        {/* Valor */}
        <div className="col-span-3 flex flex-col gap-1.5 max-md:col-span-3">
          <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Valor
          </label>

          <Input
            placeholder="0,00"
            value={draft.amount}
            onChange={(e) =>
              updateDraft("amount", e.target.value)
            }
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        {/* Data de registro */}
        <div className="col-span-3 flex flex-col gap-1.5 max-md:col-span-3">
          <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Data de registro
          </label>

          <Input
            type="date"
            value={draft.issueDate}
            onChange={(e) =>
              updateDraft("issueDate", e.target.value)
            }
          />
        </div>

        {/* Data de vencimento */}
        <div className="col-span-3 flex flex-col gap-1.5 max-md:col-span-3">
          <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Vencimento
          </label>

          <Input
            type="date"
            value={draft.dueDate}
            onChange={(e) =>
              updateDraft("dueDate", e.target.value)
            }
          />
        </div>

        {/* Taxa */}
        <div className="col-span-2 flex flex-col gap-1.5 max-md:col-span-1">
          <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Taxa
          </label>

          <Input
            type="number"
            inputMode="decimal"
            min="0"
            max="100"
            step="0.01"
            required
            value={draft.interestRate}
            onChange={(e) =>
              updateDraft("interestRate", e.target.value)
            }
            className="
          text-center
          [appearance:textfield]
          [&::-webkit-outer-spin-button]:appearance-none
          [&::-webkit-inner-spin-button]:appearance-none
        "
          />
        </div>

        {/* Dias de compensação */}
        <div className="col-span-2 flex flex-col gap-1.5 max-md:col-span-1">
          <label className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Compensação
          </label>

          <Input
            value={draft.additionalDays}
            onChange={(e) =>
              updateDraft("additionalDays", e.target.value)
            }
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            required
            className="
              text-center
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            "
          />
        </div>

        {/* Dias totais */}
        <div className="col-span-2 flex flex-col gap-1.5 max-md:col-span-1">
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Dias
          </span>

          <div className="flex h-9 items-center rounded-md border bg-muted/40 px-3 text-sm font-medium">
            {preview?.totalDays ?? "—"}
          </div>
        </div>

        {/* Juros */}
        <div className="col-span-2 flex flex-col gap-1.5 max-md:col-span-1">
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Juros
          </span>

          <div className="flex h-9 items-center justify-end rounded-md border bg-red-50/50 px-3 text-sm font-semibold text-red-600">
            {preview
              ? `R$ ${preview.interest}`
              : "—"
            }
          </div>
        </div>

        {/* Líquido */}
        <div className="col-span-4 flex flex-col gap-1.5 max-md:col-span-2">
          <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
            Valor líquido
          </span>

          <div className="flex h-9 items-center justify-end rounded-md border bg-emerald-50/50 px-3 text-sm font-semibold text-emerald-700">
            {preview
              ? `R$ ${preview.netAmount}`
              : "—"
            }
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>

        <Button type="submit">
          Salvar
        </Button>
      </div>
    </form>
  )
}