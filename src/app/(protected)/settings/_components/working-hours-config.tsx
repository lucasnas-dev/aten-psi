"use client";

import { Clock, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface TimeSlot {
  start: string;
  end: string;
}

interface WorkingHoursData {
  dayOfWeek: number;
  enabled: boolean;
  timeSlots: TimeSlot[];
}

interface WorkingHoursConfigProps {
  form: UseFormReturn<{
    workingHours: WorkingHoursData[];
    name: string;
    email: string;
    phone?: string;
    crp?: string;
    specialization?: string;
    defaultDuration: number;
    bufferTime: number;
    maxAdvanceBooking: number;
    allowSameDayBooking: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    reminderTime: number;
  }>;
}

const DAYS_OF_WEEK = [
  { label: "Segunda-feira", dayOfWeek: 1 },
  { label: "Terça-feira", dayOfWeek: 2 },
  { label: "Quarta-feira", dayOfWeek: 3 },
  { label: "Quinta-feira", dayOfWeek: 4 },
  { label: "Sexta-feira", dayOfWeek: 5 },
  { label: "Sábado", dayOfWeek: 6 },
  { label: "Domingo", dayOfWeek: 0 },
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const time = `${hour.toString().padStart(2, "0")}:${minute}`;
  return { value: time, label: time };
});

export function WorkingHoursConfig({ form }: WorkingHoursConfigProps) {
  const [workingHours, setWorkingHours] = useState<WorkingHoursData[]>(
    DAYS_OF_WEEK.map(day => ({
      dayOfWeek: day.dayOfWeek,
      enabled: day.dayOfWeek >= 1 && day.dayOfWeek <= 5, // Segunda a sexta habilitados por padrão
      timeSlots: day.dayOfWeek >= 1 && day.dayOfWeek <= 5 
        ? [{ start: "08:00", end: "17:00" }] 
        : [],
    }))
  );

  // Atualizar o formulário sempre que workingHours mudar
  useEffect(() => {
    form.setValue("workingHours", workingHours);
  }, [workingHours, form]);

  const toggleDay = (dayOfWeek: number) => {
    setWorkingHours(prev => 
      prev.map(day => 
        day.dayOfWeek === dayOfWeek 
          ? {
              ...day,
              enabled: !day.enabled,
              timeSlots: !day.enabled && day.timeSlots.length === 0
                ? [{ start: "08:00", end: "17:00" }]
                : day.timeSlots,
            }
          : day
      )
    );
  };

  const addTimeSlot = (dayOfWeek: number) => {
    setWorkingHours(prev => 
      prev.map(day => 
        day.dayOfWeek === dayOfWeek 
          ? {
              ...day,
              timeSlots: [...day.timeSlots, { start: "13:00", end: "18:00" }],
            }
          : day
      )
    );
  };

  const removeTimeSlot = (dayOfWeek: number, slotIndex: number) => {
    setWorkingHours(prev => 
      prev.map(day => 
        day.dayOfWeek === dayOfWeek 
          ? {
              ...day,
              timeSlots: day.timeSlots.filter((_, index) => index !== slotIndex),
            }
          : day
      )
    );
  };

  const updateTimeSlot = (
    dayOfWeek: number,
    slotIndex: number,
    field: "start" | "end",
    value: string
  ) => {
    setWorkingHours(prev => 
      prev.map(day => 
        day.dayOfWeek === dayOfWeek 
          ? {
              ...day,
              timeSlots: day.timeSlots.map((slot, index) =>
                index === slotIndex ? { ...slot, [field]: value } : slot
              ),
            }
          : day
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Horários de Trabalho
        </CardTitle>
        <CardDescription>
          Configure seus horários de atendimento para cada dia da semana
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {DAYS_OF_WEEK.map((day) => {
          const dayData = workingHours.find(wh => wh.dayOfWeek === day.dayOfWeek);
          if (!dayData) return null;

          return (
            <div key={day.dayOfWeek} className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">{day.label}</Label>
                <Switch
                  checked={dayData.enabled}
                  onCheckedChange={() => toggleDay(day.dayOfWeek)}
                />
              </div>

              {dayData.enabled && (
                <div className="space-y-2 pl-4">
                  {dayData.timeSlots.map((slot, slotIndex) => (
                    <div key={slotIndex} className="flex items-center gap-2">
                      <Select
                        value={slot.start}
                        onValueChange={(value) =>
                          updateTimeSlot(day.dayOfWeek, slotIndex, "start", value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span className="text-sm text-muted-foreground">até</span>

                      <Select
                        value={slot.end}
                        onValueChange={(value) =>
                          updateTimeSlot(day.dayOfWeek, slotIndex, "end", value)
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time.value} value={time.value}>
                              {time.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTimeSlot(day.dayOfWeek, slotIndex)}
                        disabled={dayData.timeSlots.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addTimeSlot(day.dayOfWeek)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar horário
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
