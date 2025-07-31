"use client";

import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

interface TimeSlot {
  id: string;
  start: string;
  end: string;
}

interface DayConfig {
  enabled: boolean;
  timeSlots: TimeSlot[];
}

interface WorkingHours {
  [key: string]: DayConfig;
}

const DAYS_OF_WEEK = [
  { key: "monday", label: "Segunda-feira", short: "SEG" },
  { key: "tuesday", label: "Terça-feira", short: "TER" },
  { key: "wednesday", label: "Quarta-feira", short: "QUA" },
  { key: "thursday", label: "Quinta-feira", short: "QUI" },
  { key: "friday", label: "Sexta-feira", short: "SEX" },
  { key: "saturday", label: "Sábado", short: "SAB" },
  { key: "sunday", label: "Domingo", short: "DOM" },
];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  const time = `${hour.toString().padStart(2, "0")}:${minute}`;
  return { value: time, label: time };
});

export function WorkingHoursConfig() {
  const [workingHours, setWorkingHours] = useState<WorkingHours>({
    monday: {
      enabled: true,
      timeSlots: [{ id: "1", start: "08:00", end: "17:00" }],
    },
    tuesday: {
      enabled: true,
      timeSlots: [{ id: "2", start: "08:00", end: "17:00" }],
    },
    wednesday: {
      enabled: true,
      timeSlots: [{ id: "3", start: "08:00", end: "17:00" }],
    },
    thursday: {
      enabled: true,
      timeSlots: [{ id: "4", start: "08:00", end: "17:00" }],
    },
    friday: {
      enabled: true,
      timeSlots: [{ id: "5", start: "08:00", end: "17:00" }],
    },
    saturday: { enabled: false, timeSlots: [] },
    sunday: { enabled: false, timeSlots: [] },
  });

  const [defaultAppointmentDuration, setDefaultAppointmentDuration] =
    useState(50);
  const [bufferTime, setBufferTime] = useState(10);

  const toggleDay = (dayKey: string) => {
    setWorkingHours((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        enabled: !prev[dayKey].enabled,
        timeSlots:
          !prev[dayKey].enabled && prev[dayKey].timeSlots.length === 0
            ? [{ id: Date.now().toString(), start: "08:00", end: "17:00" }]
            : prev[dayKey].timeSlots,
      },
    }));
  };

  const addTimeSlot = (dayKey: string) => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      start: "13:00",
      end: "18:00",
    };

    setWorkingHours((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: [...prev[dayKey].timeSlots, newSlot],
      },
    }));
  };

  const removeTimeSlot = (dayKey: string, slotId: string) => {
    setWorkingHours((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: prev[dayKey].timeSlots.filter((slot) => slot.id !== slotId),
      },
    }));
  };

  const updateTimeSlot = (
    dayKey: string,
    slotId: string,
    field: "start" | "end",
    value: string
  ) => {
    setWorkingHours((prev) => ({
      ...prev,
      [dayKey]: {
        ...prev[dayKey],
        timeSlots: prev[dayKey].timeSlots.map((slot) =>
          slot.id === slotId ? { ...slot, [field]: value } : slot
        ),
      },
    }));
  };

  const copyToAllDays = (sourceDayKey: string) => {
    const sourceConfig = workingHours[sourceDayKey];
    if (!sourceConfig.enabled) return;

    setWorkingHours((prev) => {
      const updated = { ...prev };
      DAYS_OF_WEEK.forEach((day) => {
        if (day.key !== sourceDayKey && updated[day.key].enabled) {
          updated[day.key] = {
            ...updated[day.key],
            timeSlots: sourceConfig.timeSlots.map((slot) => ({
              ...slot,
              id: `${day.key}-${Date.now()}-${slot.id}`,
            })),
          };
        }
      });
      return updated;
    });
  };

  const getTotalHours = () => {
    let total = 0;
    Object.values(workingHours).forEach((day) => {
      if (day.enabled) {
        day.timeSlots.forEach((slot) => {
          const start = new Date(`2000-01-01T${slot.start}:00`);
          const end = new Date(`2000-01-01T${slot.end}:00`);
          total += (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        });
      }
    });
    return total;
  };

  return (
    <div className="space-y-6">
      {/* Configurações Gerais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configurações Gerais
          </CardTitle>
          <CardDescription>
            Defina a duração padrão das consultas e tempo de intervalo entre
            elas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="defaultDuration">
                Duração padrão da consulta (minutos)
              </Label>
              <Select
                value={defaultAppointmentDuration.toString()}
                onValueChange={(value) =>
                  setDefaultAppointmentDuration(Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="50">50 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="90">1h 30min</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bufferTime">
                Intervalo entre consultas (minutos)
              </Label>
              <Select
                value={bufferTime.toString()}
                onValueChange={(value) => setBufferTime(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sem intervalo</SelectItem>
                  <SelectItem value="5">5 minutos</SelectItem>
                  <SelectItem value="10">10 minutos</SelectItem>
                  <SelectItem value="15">15 minutos</SelectItem>
                  <SelectItem value="30">30 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-muted/20 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Total de horas por semana:</span>
              <span className="font-semibold">
                {getTotalHours().toFixed(1)}h
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Horários por Dia da Semana */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Horários de Trabalho
          </CardTitle>
          <CardDescription>
            Configure seus horários disponíveis para cada dia da semana. Você
            pode ter múltiplos períodos por dia.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {DAYS_OF_WEEK.map((day, index) => {
            const dayConfig = workingHours[day.key];

            return (
              <div key={day.key} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={dayConfig.enabled}
                      onCheckedChange={() => toggleDay(day.key)}
                    />
                    <div>
                      <Label className="text-base font-medium">
                        {day.label}
                      </Label>
                      <div className="text-muted-foreground text-sm">
                        {dayConfig.enabled && dayConfig.timeSlots.length > 0
                          ? `${dayConfig.timeSlots.length} período${dayConfig.timeSlots.length > 1 ? "s" : ""}`
                          : "Indisponível"}
                      </div>
                    </div>
                  </div>

                  {dayConfig.enabled && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToAllDays(day.key)}
                      >
                        Copiar para todos
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(day.key)}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Período
                      </Button>
                    </div>
                  )}
                </div>

                {dayConfig.enabled && (
                  <div className="ml-6 space-y-3">
                    {dayConfig.timeSlots.map((slot, slotIndex) => (
                      <div
                        key={slot.id}
                        className="bg-muted/20 flex items-center gap-3 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2">
                          <Label className="text-sm whitespace-nowrap">
                            Período {slotIndex + 1}:
                          </Label>
                        </div>

                        <Select
                          value={slot.start}
                          onValueChange={(value) =>
                            updateTimeSlot(day.key, slot.id, "start", value)
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

                        <span className="text-muted-foreground">às</span>

                        <Select
                          value={slot.end}
                          onValueChange={(value) =>
                            updateTimeSlot(day.key, slot.id, "end", value)
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

                        {dayConfig.timeSlots.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeSlot(day.key, slot.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {index < DAYS_OF_WEEK.length - 1 && <Separator />}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
