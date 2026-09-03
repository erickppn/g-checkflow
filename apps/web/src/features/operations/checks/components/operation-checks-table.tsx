import { DataTable } from "@/components/common/data-table";
import type { Check } from "../types/check.types";
import { getOperationCheckColumns } from "../components/operation-check-columns";
import { useState } from "react";
import { EditCheckForm } from "../components/edit-check-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCompensateCheck, useDeleteCheck, useReturnCheck } from "../checks.mutations";
import { toast } from "react-toastify";
import { CheckListItem } from "./check-list-item";
import { Button } from "@/components/ui/button";
import { CircleCheck, Pen, Trash2, Undo2 } from "lucide-react";

interface OperationChecksTableProps {
  checks: Check[];
  selectedRowId?: string
}

export type CheckAction =
  | { type: "edit"; check: Check }
  | { type: "compensate"; check: Check }
  | { type: "delete"; check: Check }
  | { type: "return"; check: Check };

export function OperationChecksTable({ checks, selectedRowId }: OperationChecksTableProps) {
  const [checkAction, setCheckAction] = useState<CheckAction | null>(null);
  const [returnReason, setReturnReason] = useState("");

  const columns = getOperationCheckColumns(setCheckAction, selectedRowId);

  const compensateCheck = useCompensateCheck();
  const returnCheck = useReturnCheck();
  const deleteCheck = useDeleteCheck();

  async function handleCompensate() {
    if (checkAction?.type !== "compensate") return;

    try {
      await compensateCheck.mutateAsync(checkAction.check.id);

      toast.success("Cheque compensado com sucesso");

      setCheckAction(null);
    } catch {
      toast.error("Não foi possível compensar o cheque");
    }
  }

  async function handleReturn() {
    if (checkAction?.type !== "return") return;

    const reason = returnReason.trim();

    if (!reason) return;

    try {
      await returnCheck.mutateAsync({
        id: checkAction.check.id,
        data: {
          returnReason: reason,
        },
      });

      toast.success("Cheque devolvido com sucesso");

      setCheckAction(null);
      setReturnReason("");
    } catch {
      toast.error("Não foi possível devolver o cheque");
    }
  }

  async function handleDelete() {
    if (checkAction?.type !== "delete") return;

    try {
      await deleteCheck.mutateAsync(checkAction.check.id);

      toast.success("Cheque excluído com sucesso");

      setCheckAction(null);
    } catch {
      toast.error("Não foi possível excluir o cheque");
    }
  }

  return (
    <section className="
      flex flex-1 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm

    ">
      <div className="
        flex items-center justify-between gap-3
        px-5 py-4
      ">
        <h2 className="text-sm font-semibold text-foreground">
          Cheques da operação
        </h2>
      </div>

      <DataTable
        columns={columns}
        data={checks}
        label="cheque(s)"
        classname="max-lg:hidden"
      />

      <div className="divide-y overflow-auto lg:hidden">
        {checks.map((check) => (
          <div key={check.id}>
            <CheckListItem
              check={check}
              isSelected={selectedRowId === check.id}
            />

            <div className="flex gap-2 mx-6 mb-4">
              <Button
                className="flex-1"
                onClick={() =>
                  setCheckAction({
                    type: "compensate",
                    check,
                  })
                }
              >
                <CircleCheck className="size-4 shrink-0" />
              </Button>

              <Button
                className="flex-1 bg-warning"
                onClick={() =>
                  setCheckAction({
                    type: "return",
                    check,
                  })
                }
              >
                <Undo2 className="size-4 shrink-0 text-warning-foreground" />
              </Button>

              <Button
                className="flex-1"
                variant="outline"
                onClick={() =>
                  setCheckAction({
                    type: "edit",
                    check,
                  })
                }
              >
                <Pen className="size-4 shrink-0 text-muted-foreground" />
              </Button>

              <Button
                className="flex-1"
                variant="destructive"
                onClick={() =>
                  setCheckAction({
                    type: "delete",
                    check,
                  })
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Editar Cheque */}
      <Dialog
        open={checkAction?.type === "edit"}
        onOpenChange={(open) => {
          if (!open) {
            setCheckAction(null)
          }
        }}
      >
        <DialogContent
          className="max-xl:w-2xl max-md:w-[calc(100%-2rem)]"
        >
          <DialogHeader>
            <DialogTitle>Editar cheque</DialogTitle>
            <DialogDescription>
              Altere as informações do cheque.
            </DialogDescription>
          </DialogHeader>

          {checkAction?.type === "edit" && (
            <EditCheckForm
              check={checkAction.check}
              onCancel={() => setCheckAction(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={
          checkAction?.type === "compensate" ||
          checkAction?.type === "delete" ||
          checkAction?.type === "return"
        }
        onOpenChange={(open) => {
          if (!open) {
            setCheckAction(null)
            setReturnReason("")
          }
        }}
      >
        <AlertDialogContent>
          {checkAction?.type === "compensate" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Compensar cheque?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  O cheque de{" "}
                  <strong>{checkAction.check.issuer.name}</strong>{" "}
                  será marcado como compensado.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancelar
                </AlertDialogCancel>

                <AlertDialogAction onClick={handleCompensate}>
                  Compensar
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {checkAction?.type === "delete" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Excluir cheque?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  O cheque de{" "}
                  <strong>{checkAction.check.issuer.name}</strong>{" "}
                  será excluído permanentemente.
                  Essa ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancelar
                </AlertDialogCancel>

                <AlertDialogAction
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}

          {checkAction?.type === "return" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Devolver cheque?
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Informe o motivo da devolução do cheque de{" "}
                  <strong>{checkAction.check.issuer.name}</strong>.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <div className="flex flex-col gap-2">
                <Label htmlFor="return-reason">
                  Motivo da devolução
                </Label>

                <Textarea
                  id="return-reason"
                  placeholder="Ex.: Cheque sem fundos..."
                  value={returnReason}
                  onChange={(event) => {
                    setReturnReason(event.target.value)
                  }}
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancelar
                </AlertDialogCancel>

                <AlertDialogAction
                  variant="destructive"
                  disabled={!returnReason.trim()}
                  onClick={handleReturn}
                >
                  Devolver cheque
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </section>
  )
}