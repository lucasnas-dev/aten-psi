"use client";

import { Clock, Edit2, Plus, Save, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { saveSettings } from "@/actions/save-settings";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface TimeSlot {
  start: string;
  end: string;
}

interface WorkingHour {
  dayOfWeek: number;
  enabled: boolean;
  timeSlots: TimeSlot[];
}

interface SettingsData {
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
  workingHours: WorkingHour[];
}

interface WorkingHoursSimpleProps {
  settings: SettingsData | null;
  onUpdate: (settings: Partial<SettingsData>) => void;
}

const dayNames = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

export function WorkingHoursSimple({
  settings,
  onUpdate,
}: WorkingHoursSimpleProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [tempTimeSlots, setTempTimeSlots] = useState<TimeSlot[]>([]);

  if (!settings) return null;

  // Garantir que temos horários para todos os dias da semana
  const workingHours = Array.from({ length: 7 }, (_, index) => {
    const existing = settings.workingHours.find((wh) => wh.dayOfWeek === index);
    return (
      existing || {
        dayOfWeek: index,
        enabled: false,
        timeSlots: [],
      }
    );
  });

  const handleDayToggle = async (dayOfWeek: number, enabled: boolean) => {
    setIsSaving(true);
    try {
      const updatedWorkingHours = workingHours.map((wh) =>
        wh.dayOfWeek === dayOfWeek
          ? { ...wh, enabled, timeSlots: enabled ? wh.timeSlots : [] }
          : wh
      );

      const updatedData = {
        ...settings,
        workingHours: updatedWorkingHours,
      };

      const result = await saveSettings(updatedData);

      if (result?.data?.success) {
        onUpdate({ workingHours: updatedWorkingHours });
        toast.success("Horários atualizados com sucesso!");
      } else {
        throw new Error("Falha ao salvar horários");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditTimeSlots = (dayOfWeek: number) => {
    const dayWorkingHours = workingHours.find(
      (wh) => wh.dayOfWeek === dayOfWeek
    );
    setEditingDay(dayOfWeek);
    setTempTimeSlots(
      dayWorkingHours?.timeSlots || [{ start: "09:00", end: "18:00" }]
    );
  };

  const handleAddTimeSlot = () => {
    setTempTimeSlots([...tempTimeSlots, { start: "09:00", end: "18:00" }]);
  };

  const handleRemoveTimeSlot = (index: number) => {
    setTempTimeSlots(tempTimeSlots.filter((_, i) => i !== index));
  };

  const handleTimeSlotChange = (
    index: number,
    field: "start" | "end",
    value: string
  ) => {
    const updated = tempTimeSlots.map((slot, i) =>
      i === index ? { ...slot, [field]: value } : slot
    );
    setTempTimeSlots(updated);
  };

  const handleSaveTimeSlots = async () => {
    if (editingDay === null) return;

    setIsSaving(true);
    try {
      const updatedWorkingHours = workingHours.map((wh) =>
        wh.dayOfWeek === editingDay ? { ...wh, timeSlots: tempTimeSlots } : wh
      );

      const updatedData = {
        ...settings,
        workingHours: updatedWorkingHours,
      };

      const result = await saveSettings(updatedData);

      if (result?.data?.success) {
        onUpdate({ workingHours: updatedWorkingHours });
        setEditingDay(null);
        setTempTimeSlots([]);
        toast.success("Horários atualizados com sucesso!");
      } else {
        throw new Error("Falha ao salvar horários");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingDay(null);
    setTempTimeSlots([]);
  };

  return (
    <div className="space-y-6">
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
        <CardContent className="space-y-4">
          {workingHours.map((workingHour) => (
            <div key={workingHour.dayOfWeek} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Label className="text-base font-medium">
                    {dayNames[workingHour.dayOfWeek]}
                  </Label>
                  <Switch
                    checked={workingHour.enabled}
                    onCheckedChange={(enabled) =>
                      handleDayToggle(workingHour.dayOfWeek, enabled)
                    }
                    disabled={isSaving}
                  />
                </div>

                {workingHour.enabled && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditTimeSlots(workingHour.dayOfWeek)}
                    disabled={editingDay !== null}
                  >
                    <Edit2 className="h-4 w-4" />
                    Editar horários
                  </Button>
                )}
              </div>

              {workingHour.enabled && (
                <div className="ml-6 space-y-2">
                  {editingDay === workingHour.dayOfWeek ? (
                    <div className="space-y-3">
                      {tempTimeSlots.map((slot, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input
                            type="time"
                            value={slot.start}
                            onChange={(e) =>
                              handleTimeSlotChange(
                                index,
                                "start",
                                e.target.value
                              )
                            }
                            className="w-32"
                          />
                          <span className="text-muted-foreground">às</span>
                          <Input
                            type="time"
                            value={slot.end}
                            onChange={(e) =>
                              handleTimeSlotChange(index, "end", e.target.value)
                            }
                            className="w-32"
                          />
                          {tempTimeSlots.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveTimeSlot(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}

                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleAddTimeSlot}
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Adicionar horário
                        </Button>

                        <Button
                          size="sm"
                          onClick={handleSaveTimeSlots}
                          disabled={isSaving}
                        >
                          <Save className="mr-1 h-4 w-4" />
                          Salvar
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          disabled={isSaving}
                        >
                          <X className="mr-1 h-4 w-4" />
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {workingHour.timeSlots.length > 0 ? (
                        workingHour.timeSlots.map((slot, index) => (
                          <p
                            key={index}
                            className="text-muted-foreground text-sm"
                          >
                            {slot.start} às {slot.end}
                          </p>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-sm italic">
                          Nenhum horário configurado
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">
            Dicas para configurar horários
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
            <li>• Você pode adicionar múltiplos períodos para o mesmo dia</li>
            <li>• Configure intervalos de almoço criando períodos separados</li>
            <li>
              • Os horários configurados serão usados para validar agendamentos
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
