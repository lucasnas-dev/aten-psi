"use client";

import { format, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MiniCalendarProps {
  currentDate: Date;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  eventDates?: Date[]; // Datas que têm eventos
}

export function MiniCalendar({
  currentDate,
  selectedDate,
  onDateSelect,
  onMonthChange,
  eventDates = [],
}: MiniCalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Primeiro dia do mês e quantos dias tem
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Dias do mês anterior para preencher a primeira semana
  const previousMonth = new Date(year, month - 1, 0);
  const daysFromPrevMonth = startingDayOfWeek;

  // Dias do próximo mês para preencher a última semana
  const totalCells = 42; // 6 semanas x 7 dias
  const daysFromNextMonth = totalCells - daysInMonth - daysFromPrevMonth;

  const hasEvent = (date: Date) => {
    return eventDates.some(
      (eventDate) =>
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
    );
  };

  const previousMonth_nav = () => {
    onMonthChange(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    onMonthChange(new Date(year, month + 1, 1));
  };

  const renderDay = (date: Date, isCurrentMonth: boolean, index: number) => {
    const isSelected = date.toDateString() === selectedDate.toDateString();
    const isTodayDate = isToday(date);
    const hasEventToday = hasEvent(date);

    return (
      <button
        key={`day-${index}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
        onClick={() => onDateSelect(date)}
        className={cn(
          "hover:bg-muted relative flex h-8 w-8 items-center justify-center rounded text-sm transition-colors",
          isCurrentMonth ? "text-foreground" : "text-muted-foreground",
          isSelected &&
            "bg-primary text-primary-foreground hover:bg-primary/90",
          isTodayDate &&
            !isSelected &&
            "bg-accent text-accent-foreground font-semibold",
          !isCurrentMonth && "opacity-50"
        )}
      >
        {date.getDate()}
        {hasEventToday && !isSelected && (
          <div className="bg-primary absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 transform rounded-full" />
        )}
      </button>
    );
  };

  const days = [];
  let dayIndex = 0;

  // Dias do mês anterior
  for (let i = daysFromPrevMonth; i > 0; i--) {
    const date = new Date(year, month - 1, previousMonth.getDate() - i + 1);
    days.push(renderDay(date, false, dayIndex++));
  }

  // Dias do mês atual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    days.push(renderDay(date, true, dayIndex++));
  }

  // Dias do próximo mês
  for (let day = 1; day <= daysFromNextMonth; day++) {
    const date = new Date(year, month + 1, day);
    days.push(renderDay(date, false, dayIndex++));
  }

  return (
    <div className="bg-card rounded-lg border p-3 shadow-sm">
      {/* Header do mini calendário */}
      <div className="mb-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={previousMonth_nav}>
          <ChevronLeft className="h-3 w-3" />
        </Button>

        <h3 className="text-sm font-medium">
          {format(currentDate, "MMMM yyyy", { locale: ptBR })}
        </h3>

        <Button variant="ghost" size="sm" onClick={nextMonth}>
          <ChevronRight className="h-3 w-3" />
        </Button>
      </div>

      {/* Dias da semana */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
          <div
            key={index}
            className="text-muted-foreground py-1 text-center text-xs font-medium"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
}
