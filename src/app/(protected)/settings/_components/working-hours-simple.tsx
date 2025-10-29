"use client";

import { Clock, Edit2, Plus, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { saveSettings } from "@/actions/save-settings";
import { Button } from "@/components/ui/button";
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
  const [isEditing, setIsEditing] = useState(false);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [tempTimeSlots, setTempTimeSlots] = useState<TimeSlot[]>([]);
  const [tempWorkingHours, setTempWorkingHours] = useState<WorkingHour[]>([]);

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

  const displayWorkingHours = isEditing ? tempWorkingHours : workingHours;

  const handleStartEdit = () => {
    setTempWorkingHours(JSON.parse(JSON.stringify(workingHours)));
    setIsEditing(true);
  };

  const handleDayToggle = (dayOfWeek: number, enabled: boolean) => {
    if (!isEditing) return;

    const updated = tempWorkingHours.map((wh) =>
      wh.dayOfWeek === dayOfWeek
        ? { ...wh, enabled, timeSlots: enabled ? wh.timeSlots : [] }
        : wh
    );
    setTempWorkingHours(updated);
  };

  const handleEditTimeSlots = (dayOfWeek: number) => {
    if (!isEditing) return;

    const dayWorkingHours = tempWorkingHours.find(
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

  const handleSaveTimeSlots = () => {
    if (editingDay === null) return;

    const updated = tempWorkingHours.map((wh) =>
      wh.dayOfWeek === editingDay ? { ...wh, timeSlots: tempTimeSlots } : wh
    );
    setTempWorkingHours(updated);
    setEditingDay(null);
    setTempTimeSlots([]);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const updatedData = {
        ...settings,
        workingHours: tempWorkingHours,
      };

      const result = await saveSettings(updatedData);

      if (result?.data?.success) {
        onUpdate({ workingHours: tempWorkingHours });
        setIsEditing(false);
        setEditingDay(null);
        setTempTimeSlots([]);
        setTempWorkingHours([]);
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

  return (
    <div className="space-y-6">
      <div className="max-w-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="h-4 w-4" />
            Horários de Trabalho
          </h3>
          {isEditing ? (
            <Button onClick={handleSaveAll} disabled={isSaving} size="sm">
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Salvar
            </Button>
          ) : (
            <Button onClick={handleStartEdit} variant="outline" size="sm">
              <Edit2 className="mr-1.5 h-3.5 w-3.5" />
              Editar
            </Button>
          )}
        </div>

        <div className="space-y-3 border-t pt-3">
          {displayWorkingHours.map((workingHour) => (
            <div
              key={workingHour.dayOfWeek}
              className="border-b py-3 last:border-0"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={workingHour.enabled}
                    onCheckedChange={(enabled) =>
                      handleDayToggle(workingHour.dayOfWeek, enabled)
                    }
                    disabled={isSaving}
                  />
                  <Label className="text-sm font-medium">
                    {dayNames[workingHour.dayOfWeek]}
                  </Label>
                </div>

                {workingHour.enabled && isEditing && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEditTimeSlots(workingHour.dayOfWeek)}
                    disabled={
                      editingDay !== null &&
                      editingDay !== workingHour.dayOfWeek
                    }
                    className="h-7 text-xs"
                  >
                    <Edit2 className="mr-1 h-3 w-3" />
                    {editingDay === workingHour.dayOfWeek
                      ? "Editando..."
                      : "Horários"}
                  </Button>
                )}
              </div>

              {workingHour.enabled && (
                <div className="ml-11 space-y-2">
                  {editingDay === workingHour.dayOfWeek ? (
                    <div className="space-y-2">
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
                            className="h-8 w-28 text-sm"
                          />
                          <span className="text-muted-foreground text-xs">
                            às
                          </span>
                          <Input
                            type="time"
                            value={slot.end}
                            onChange={(e) =>
                              handleTimeSlotChange(index, "end", e.target.value)
                            }
                            className="h-8 w-28 text-sm"
                          />
                          {tempTimeSlots.length > 1 && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveTimeSlot(index)}
                              className="h-7 w-7 p-0"
                            >
                              <Trash2 className="h-3 w-3 text-red-600" />
                            </Button>
                          )}
                        </div>
                      ))}

                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleAddTimeSlot}
                          className="h-7 text-xs"
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          Adicionar
                        </Button>

                        <Button
                          size="sm"
                          onClick={handleSaveTimeSlots}
                          className="h-7 text-xs"
                        >
                          <Save className="mr-1 h-3 w-3" />
                          OK
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {workingHour.timeSlots.length > 0 ? (
                        workingHour.timeSlots.map((slot, index) => (
                          <p
                            key={index}
                            className="text-muted-foreground text-xs"
                          >
                            {slot.start} às {slot.end}
                          </p>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-xs italic">
                          Nenhum horário configurado
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
          <h4 className="mb-2 text-sm font-semibold text-blue-800 dark:text-blue-200">
            Dicas para configurar horários
          </h4>
          <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
            <li>• Você pode adicionar múltiplos períodos para o mesmo dia</li>
            <li>• Configure intervalos de almoço criando períodos separados</li>
            <li>
              • Os horários configurados serão usados para validar agendamentos
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
