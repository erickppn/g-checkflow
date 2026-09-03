"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { ptBR } from "react-day-picker/locale";
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerWithRangeProps {
  from?: string;
  to?: string;
  onChange: (range: DateRange | undefined) => void;
  label: string,
  className?: string
}

export function DatePickerWithRange({
  from,
  to,
  onChange,
  label,
  className
}: DatePickerWithRangeProps) {
  const date: DateRange | undefined = {
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  };

  return (
    <Field className={cn("w-fit", className)}>
      <FieldLabel htmlFor="date-picker-range">
        {label}
      </FieldLabel>

      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              id="date-picker-range"
              className="justify-start px-2.5 font-normal"
            >
              <CalendarIcon data-icon="inline-start" />

              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd/MM/yyyy")} -{" "}
                    {format(date.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  format(date.from, "dd/MM/yyyy")
                )
              ) : (
                <span>Selecionar período</span>
              )}
            </Button>
          }
        />

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={onChange}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
