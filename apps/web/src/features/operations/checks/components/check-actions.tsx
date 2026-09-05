import { useState } from "react";
import type { Check } from "../types/check.types";
import { useCompensateCheck, useDeleteCheck, useReturnCheck } from "../checks.mutations";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { CircleCheck, MoreHorizontal, Pen, Trash2, Undo2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditCheckForm } from "./edit-check-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface CheckActionsProps {
  check: Check;
  variant?: "default" | "table";
}

export type CheckAction =
  | { type: "edit"; check: Check }
  | { type: "compensate"; check: Check }
  | { type: "delete"; check: Check }
  | { type: "return"; check: Check };

export function CheckActions({
  check,
  variant = "default",
}: CheckActionsProps) {
  const [checkAction, setCheckAction] = useState<CheckAction | null>(null);
  const [returnReason, setReturnReason] = useState("");

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
    <>
      {variant === "table" ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="hover:cursor-pointer"
              />
            }
          >
            <MoreHorizontal />
            <span className="sr-only">Ações do cheque</span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-fit">
            <DropdownMenuItem
              onClick={() => setCheckAction({
                type: "edit",
                check,
              })}
            >
              <Pen />
              Editar
            </DropdownMenuItem>

            <DropdownMenuItem
              variant="destructive"
              onClick={() => setCheckAction({
                type: "delete",
                check,
              })}
            >
              <Trash2 />
              Excluir
            </DropdownMenuItem>

            {(check.status === "PENDING" || check.status === "RETURNED") && (
              <>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() =>
                    setCheckAction({
                      type: "compensate",
                      check,
                    })
                  }
                >
                  <CircleCheck />
                  {check.status === "PENDING" ? "Compensar" : "Compensar cheque devolvido"}
                </DropdownMenuItem>

                {check.status === "PENDING" && (
                  <DropdownMenuItem
                    onClick={() =>
                      setCheckAction({
                        type: "return",
                        check,
                      })
                    }
                  >
                    <Undo2 />
                    Devolver
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex gap-2 mx-6 mb-4">
          {(check.status === "PENDING" || check.status === "RETURNED") && (
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
          )}

          {check.status === "PENDING" && (
            <Button
              className="bg-warning flex-1"
              onClick={() =>
                setCheckAction({
                  type: "return",
                  check,
                })
              }
            >
              <Undo2 className="size-4 shrink-0 text-warning-foreground" />
            </Button>
          )}

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
      )}

      <Dialog
        open={checkAction?.type === "edit"}
        onOpenChange={(open) => {
          if (!open) {
            setCheckAction(null);
          }
        }}
      >
        <DialogContent className="max-xl:w-2xl max-md:w-[calc(100%-2rem)]">
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
            setCheckAction(null);
            setReturnReason("");
          }
        }}
      >
        <AlertDialogContent>
          {checkAction?.type === "compensate" && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {checkAction.check.status === "RETURNED"
                    ? "Compensar cheque devolvido?"
                    : "Compensar cheque?"}
                </AlertDialogTitle>

                <AlertDialogDescription>
                  O cheque de{" "}
                  <strong>{checkAction.check.issuer.name}</strong>{" "}
                  será marcado como compensado.

                  {checkAction.check.status === "RETURNED" &&
                    " O motivo da devolução será mantido no histórico do cheque."
                  }
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
                    setReturnReason(event.target.value);
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
    </>
  );
}