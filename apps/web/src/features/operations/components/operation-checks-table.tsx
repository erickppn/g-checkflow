import { DataTable } from "@/components/common/data-table";
import type { Check } from "../checks/types/check.types";
import { getOperationCheckColumns } from "./operation-check-columns";
import { CheckListItem } from "../checks/components/check-list-item";
import { CheckActions } from "../checks/components/check-actions";

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
  const columns = getOperationCheckColumns(selectedRowId);

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

      <div className="overflow-auto lg:hidden">
        {checks.map((check) => (
          <div key={check.id}>
            <CheckListItem
              check={check}
              isSelected={selectedRowId === check.id}
            />

             <CheckActions check={check}/>
          </div>
        ))}
      </div>
    </section>
  )
}