import { useEffect, useMemo, useRef, useState } from "react"
import { format, parse } from "date-fns"

import type { CalculatedCheck, DraftCheck } from "../types/check.types"
import type { ProviderWithOperationsCount } from "@/features/providers/types/provider.types"

import { calculateCheck } from "@g-checkflow/shared/calculate-check"
import { parseDecimal } from "@/utils"

import { Button } from "@/components/ui/button"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import { ItemGroup } from "@/components/ui/item"
import { banks } from "@/app/_auth/operacoes/nova"
import { TableCell, TableRow } from "@/components/ui/table"
import { Plus, SaveCheck, X } from "lucide-react"
import { useIssuers } from "@/features/issuers/issuers.queries"
import { useCreateIssuer } from "@/features/issuers/issuers.mutations"
import { toast } from "react-toastify"

interface CheckFormProps {
  checks: CalculatedCheck[];
  onAddCheck: (check: CalculatedCheck) => void;
  onUpdateCheck: (check: CalculatedCheck) => void;
  editingCheck: CalculatedCheck | null;
  onCancelEdit: () => void;
  currentProvider: ProviderWithOperationsCount | null;
}

export function CheckForm({
  checks,
  onAddCheck,
  currentProvider,
  editingCheck,
  onCancelEdit,
  onUpdateCheck
}: CheckFormProps) {
  const [draft, setDraft] = useState<DraftCheck>(createEmptyDraft());
  const [errors, setErrors] = useState<Partial<Record<keyof DraftCheck, boolean>>>({});

  const [issuerComboboxOpen, setIssuerComboboxOpen] = useState(false);
  const [issuerSearch, setIssuerSearch] = useState("");
  const { data: issuers = [] } = useIssuers(issuerSearch);

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

  function handleAddCheck() {
    const newErrors: Partial<Record<keyof DraftCheck, boolean>> = {}

    if (!draft.issuer) {
      newErrors.issuer = true
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

    const check: CalculatedCheck = {
      id: editingCheck?.id ?? crypto.randomUUID(),

      issuer: draft.issuer!,
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

    if (editingCheck) {
      onUpdateCheck(check);
      onCancelEdit();
    } else {
      onAddCheck(check);
    }

    setDraft(createEmptyDraft());

    issuerInputRef.current?.focus();
  }

  function createEmptyDraft(): DraftCheck {
    return {
      issuer: null,
      bankCode: "",
      checkNumber: "",
      amount: "",
      interestRate: String(currentProvider?.defaultInterestRate ?? 0),
      issueDate: format(new Date(), "yyyy-MM-dd"),
      dueDate: "",
      additionalDays: String(currentProvider?.defaultCompensationDays ?? 0),
    }
  }

  function handleDraftKeyDown(
    event: React.KeyboardEvent
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddCheck();
    }
  }

  function createDraftFromCheck(check: CalculatedCheck): DraftCheck {
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

  useEffect(() => {
    if (editingCheck) return;

    updateDraft("interestRate", String(currentProvider?.defaultInterestRate));
    updateDraft("additionalDays", String(currentProvider?.defaultCompensationDays));
  }, [currentProvider]);

  useEffect(() => {
    if (editingCheck) {
      setDraft(createDraftFromCheck(editingCheck))
      setErrors({})
      issuerInputRef.current?.focus()
    } else {
      setDraft(createEmptyDraft())
      setErrors({})
    }
  }, [editingCheck, editingCheck]);

  return (
    <TableRow onKeyDown={handleDraftKeyDown} className="bg-card">
      <TableCell className="relative">
        <div className="absolute inset-y-0 left-0 w-0.75 bg-blue-500" />

        {checks.length + 1}
      </TableCell>

      {/* Emitente */}
      <TableCell>
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
            aria-invalid={errors.issuer}
            ref={issuerInputRef}
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
      <TableCell>
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
          className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>

      {/* Dias de Compensação */}
      <TableCell>
        <Input
          value={draft.additionalDays}
          onChange={(e) => updateDraft("additionalDays", e.target.value)}
          type="number"
          inputMode="numeric"
          min="0"
          step="1"
          required
          className="text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </TableCell>

      {/* Dias Totais da Operação */}
      <TableCell className="text-center">
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

      <TableCell className="flex gap-1">
        <Button
          type="button"
          size="sm"
          className="h-8 gap-1.5 px-2.5 text-xs font-medium"
          onClick={handleAddCheck}
        >
          {editingCheck ? <SaveCheck /> : <Plus />}
        </Button>

        {editingCheck && (
          <Button
            type="button"
            variant="destructive"
            onClick={onCancelEdit}
          >
            <X />
          </Button>
        )}
      </TableCell>
    </TableRow>
  )
}