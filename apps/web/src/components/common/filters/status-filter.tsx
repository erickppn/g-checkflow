import { Field, FieldLabel } from "@/components/ui/field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

import type { CheckStatus } from "@/features/operations/checks/types/check.types";
import { cn } from "@/lib/utils";

interface StatusFilterProps {
  value?: CheckStatus;
  onChange: (value: CheckStatus | undefined) => void;
  className?: string
}

const checkStatusOptions = [
  {
    value: "PENDING",
    label: "Pendente",
  },
  {
    value: "COMPENSATED",
    label: "Compensado",
  },
  {
    value: "RETURNED",
    label: "Devolvido",
  },
] satisfies {
  value: CheckStatus;
  label: string;
}[];

export function StatusFilter({
  value,
  onChange,
  className
}: StatusFilterProps) {
  return (
    <Field className={cn("w-fit", className)}>
      <FieldLabel htmlFor="status-filter">
        Status
      </FieldLabel>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className="min-w-34 justify-between font-normal"
              id="status-filter"
            >
              {value
                ? checkStatusOptions.find(
                  (option) => option.value === value,
                )?.label
                : "Todos"}

              <ChevronDown className="size-4" />
            </Button>
          }
        />

        <DropdownMenuContent className="w-48">
          <DropdownMenuRadioGroup
            value={value ?? "ALL"}
            onValueChange={(selectedValue) => {
              onChange(
                selectedValue === "ALL"
                  ? undefined
                  : selectedValue as CheckStatus,
              );
            }}
          >
            <DropdownMenuRadioItem value="ALL">
              Todos
            </DropdownMenuRadioItem>

            {checkStatusOptions.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
              >
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </Field>
  );
}