"use client";

import { ptBR } from "date-fns/locale";
import { CalendarDays, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getDaysOff, toggleDayOff } from "@/actions/manage-days-off";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getBrazilianHolidays, isHoliday } from "@/lib/brazilian-holidays";

interface DayOffCalendarProps {
  selectedMonth: number;
  selectedYear: number;
}

interface DayOff {
  id: string;
  date: string;
  reason: string | null;
}

export function DayOffCalendar({
  selectedMonth,
  selectedYear,
}: DayOffCalendarProps) {
  const [daysOff, setDaysOff] = useState<DayOff[]>([]);
  const [holidays, setHolidays] = useState<
    Array<{ date: string; name: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [reason, setReason] = useState("");

  // Carregar dias sem expediente do mês
  useEffect(() => {
    loadDaysOff();
    loadHolidays();
  }, [selectedMonth, selectedYear]);

  const loadHolidays = () => {
    const monthHolidays = getBrazilianHolidays(selectedMonth, selectedYear);
    setHolidays(monthHolidays);
  };

  const loadDaysOff = async () => {
    setIsLoading(true);
    try {
      const result = await getDaysOff({
        month: selectedMonth,
        year: selectedYear,
      });
      if (result?.data?.data) {
        setDaysOff(result.data.data);
      }
    } catch (error) {
      console.error("Erro ao carregar dias sem expediente:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayClick = (date: Date) => {
    const dateStr = formatDate(date);
    const existingDayOff = daysOff.find((d) => d.date === dateStr);
    const holidayName = isHoliday(date);

    if (existingDayOff) {
      // Remover
      handleToggleDayOff(dateStr);
    } else {
      // Adicionar com motivo (sugerir nome do feriado se for)
      setSelectedDate(date);
      setReason(holidayName || "");
      setDialogOpen(true);
    }
  };

  const handleToggleDayOff = async (dateStr: string, reasonText?: string) => {
    try {
      const result = await toggleDayOff({
        date: dateStr,
        reason: reasonText,
      });

      if (result?.data?.success) {
        await loadDaysOff();
        toast.success(result.data.message);
      }
    } catch (error) {
      console.error("Erro ao alternar dia sem expediente:", error);
      toast.error("Erro ao atualizar dia");
    }
  };

  const handleSaveReason = () => {
    if (!selectedDate) return;

    const dateStr = formatDate(selectedDate);
    handleToggleDayOff(dateStr, reason);
    setDialogOpen(false);
    setSelectedDate(null);
    setReason("");
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const daysOffDates = daysOff.map((d) => new Date(d.date + "T00:00:00"));
  const holidayDates = holidays.map((h) => new Date(h.date + "T00:00:00"));

  // Função para adicionar todos os feriados do mês
  const handleAddAllHolidays = async () => {
    setIsLoading(true);
    try {
      for (const holiday of holidays) {
        const alreadyMarked = daysOff.find((d) => d.date === holiday.date);
        if (!alreadyMarked) {
          await toggleDayOff({
            date: holiday.date,
            reason: holiday.name,
          });
        }
      }
      await loadDaysOff();
      toast.success("Feriados adicionados com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar feriados:", error);
      toast.error("Erro ao adicionar feriados");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium">
            Dias sem expediente (clique para marcar/desmarcar)
          </Label>
          {holidays.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddAllHolidays}
              disabled={isLoading}
              className="h-7 gap-2 text-xs"
            >
              <CalendarDays className="h-3 w-3" />
              Adicionar feriados
            </Button>
          )}
        </div>
        <Calendar
          mode="multiple"
          selected={daysOffDates}
          onDayClick={handleDayClick}
          month={new Date(selectedYear, selectedMonth - 1)}
          locale={ptBR}
          disabled={isLoading}
          className="rounded-md border"
          modifiers={{
            dayOff: daysOffDates,
            holiday: holidayDates,
          }}
          modifiersClassNames={{
            dayOff:
              "bg-red-100 text-red-900 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 font-semibold",
            holiday:
              "bg-orange-50 text-orange-900 hover:bg-orange-100 dark:bg-orange-950 dark:text-orange-100 border border-orange-300 dark:border-orange-700",
          }}
        />
      </div>

      {/* Lista de feriados sugeridos (não marcados ainda) */}
      {holidays.length > 0 && (
        <div className="rounded-lg border bg-orange-50 p-4 dark:bg-orange-950">
          <Label className="mb-2 block text-sm font-medium text-orange-900 dark:text-orange-100">
            Feriados nacionais deste mês
          </Label>
          <div className="space-y-2">
            {holidays.map((holiday, index) => {
              const alreadyMarked = daysOff.find(
                (d) => d.date === holiday.date
              );
              const date = new Date(holiday.date + "T00:00:00");
              const formatted = date.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
              });

              return (
                <div
                  key={index}
                  className="flex items-center justify-between rounded bg-white p-2 text-sm dark:bg-gray-900"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{formatted}</span>
                    <span className="text-muted-foreground">
                      - {holiday.name}
                    </span>
                  </div>
                  {alreadyMarked ? (
                    <Badge variant="secondary" className="text-xs">
                      Marcado
                    </Badge>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() =>
                        handleToggleDayOff(holiday.date, holiday.name)
                      }
                    >
                      Adicionar
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {daysOff.length > 0 && (
        <div className="rounded-lg border p-4">
          <Label className="mb-2 block text-sm font-medium">
            Dias marcados como sem expediente
          </Label>
          <div className="max-h-40 space-y-2 overflow-y-auto">
            {daysOff.map((dayOff) => {
              const date = new Date(dayOff.date + "T00:00:00");
              const formatted = date.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
              });

              return (
                <div
                  key={dayOff.id}
                  className="bg-muted flex items-center justify-between rounded p-2 text-sm"
                >
                  <div>
                    <span className="font-medium">{formatted}</span>
                    {dayOff.reason && (
                      <span className="text-muted-foreground ml-2">
                        - {dayOff.reason}
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleToggleDayOff(dayOff.date)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legenda */}
      <div className="bg-muted/50 rounded-lg border p-3">
        <Label className="mb-2 block text-xs font-medium">Legenda:</Label>
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded border border-orange-300 bg-orange-100 dark:border-orange-700 dark:bg-orange-950"></div>
            <span className="text-muted-foreground">
              Feriado nacional (sugestão)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-red-100 dark:bg-red-900"></div>
            <span className="text-muted-foreground">
              Dia marcado sem expediente
            </span>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar dia sem expediente</DialogTitle>
            <DialogDescription>
              {selectedDate &&
                selectedDate.toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo (opcional)</Label>
              <Input
                id="reason"
                placeholder="Ex: Feriado, Folga, etc"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveReason}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
