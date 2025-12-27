"use client";

import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Edit2,
  Plus,
  Save,
  Trash2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getMonthSettings } from "@/actions/get-month-settings";
import { saveMonthSettings } from "@/actions/save-month-settings";
import { saveSettings } from "@/actions/save-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { DayOffCalendar } from "./day-off-calendar";

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

const monthNames = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function WorkingHoursSimple({
  settings,
  onUpdate,
}: WorkingHoursSimpleProps) {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  ); // 1-12
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [tempTimeSlots, setTempTimeSlots] = useState<TimeSlot[]>([]);
  const [tempWorkingHours, setTempWorkingHours] = useState<WorkingHour[]>([]);
  const [monthConfig, setMonthConfig] = useState<"default" | "custom" | "off">(
    "default"
  );
  const [isLoadingMonth, setIsLoadingMonth] = useState(false);

  // Garantir que temos horários para todos os dias da semana (horários padrão)
  const defaultWorkingHours = Array.from({ length: 7 }, (_, index) => {
    const existing = settings?.workingHours.find(
      (wh) => wh.dayOfWeek === index
    );
    return (
      existing || {
        dayOfWeek: index,
        enabled: false,
        timeSlots: [],
      }
    );
  });

  // Garantir que temos horários para exibição
  const [currentMonthHours, setCurrentMonthHours] =
    useState<WorkingHour[]>(defaultWorkingHours);

  // Detectar mudanças de mês e carregar configurações específicas
  useEffect(() => {
    async function loadMonthSettings() {
      setIsLoadingMonth(true);
      try {
        const result = await getMonthSettings({
          month: selectedMonth,
          year: selectedYear,
        });

        if (result?.data?.data && result.data.data.length > 0) {
          // Tem configurações personalizadas para este mês
          const { data } = result.data;
          const monthHours: WorkingHour[] = Array.from(
            { length: 7 },
            (_, index) => {
              const existing = data.find((wh) => wh.dayOfWeek === index);
              if (existing) {
                return {
                  dayOfWeek: existing.dayOfWeek,
                  enabled: existing.enabled ?? false,
                  timeSlots: Array.isArray(existing.timeSlots)
                    ? (existing.timeSlots as TimeSlot[])
                    : [],
                };
              }
              return {
                dayOfWeek: index,
                enabled: false,
                timeSlots: [],
              };
            }
          );
          setCurrentMonthHours(monthHours);
          setMonthConfig("custom");
        } else {
          // Sem configurações específicas, usar padrão
          setCurrentMonthHours(defaultWorkingHours);
          setMonthConfig("default");
        }

        // Atualizar tempWorkingHours se estiver editando
        if (isEditing) {
          setIsEditing(false);
          setEditingDay(null);
          setTempTimeSlots([]);
        }
      } catch (error) {
        console.error("Erro ao carregar configurações do mês:", error);
        toast.error("Erro ao carregar configurações do mês");
        setCurrentMonthHours(defaultWorkingHours);
        setMonthConfig("default");
      } finally {
        setIsLoadingMonth(false);
      }
    }

    loadMonthSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  if (!settings) return null;

  const displayWorkingHours = isEditing ? tempWorkingHours : currentMonthHours;

  const handleStartEdit = () => {
    setTempWorkingHours(JSON.parse(JSON.stringify(currentMonthHours)));
    setIsEditing(true);
  };

  const handleMonthConfigChange = (config: "default" | "custom" | "off") => {
    setMonthConfig(config);

    if (!isEditing) {
      // Iniciar edição automaticamente
      setIsEditing(true);
    }

    // Se selecionar personalizado, começar com todos os dias desabilitados
    if (config === "custom") {
      const allDisabled = Array.from({ length: 7 }, (_, index) => ({
        dayOfWeek: index,
        enabled: false,
        timeSlots: [],
      }));
      setTempWorkingHours(allDisabled);
    }

    // Se selecionar sem atendimento, desabilitar todos os dias
    if (config === "off") {
      const allDisabled = Array.from({ length: 7 }, (_, index) => ({
        dayOfWeek: index,
        enabled: false,
        timeSlots: [],
      }));
      setTempWorkingHours(allDisabled);
    }

    // Se selecionar padrão, restaurar horários padrão
    if (config === "default") {
      setTempWorkingHours(JSON.parse(JSON.stringify(defaultWorkingHours)));
    }
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
      if (monthConfig === "default") {
        // Salvar como configuração padrão (sem month/year)
        const updatedData = {
          ...settings,
          workingHours: tempWorkingHours,
        };

        const result = await saveSettings(updatedData);

        if (result?.data?.success) {
          onUpdate({ workingHours: tempWorkingHours });
          setCurrentMonthHours(tempWorkingHours);
          setIsEditing(false);
          setEditingDay(null);
          setTempTimeSlots([]);
          setTempWorkingHours([]);
          toast.success("Horários padrão atualizados com sucesso!");
        } else {
          throw new Error("Falha ao salvar horários");
        }
      } else {
        // Salvar como configuração específica do mês
        const result = await saveMonthSettings({
          month: selectedMonth,
          year: selectedYear,
          workingHours: tempWorkingHours,
        });

        if (result?.data?.success) {
          setCurrentMonthHours(tempWorkingHours);
          setIsEditing(false);
          setEditingDay(null);
          setTempTimeSlots([]);
          setTempWorkingHours([]);
          toast.success(
            `Horários de ${monthNames[selectedMonth - 1]} salvos com sucesso!`
          );
        } else {
          throw new Error("Falha ao salvar horários do mês");
        }
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Coluna esquerda: Horários de trabalho */}
        <div>
          {/* Seletor de Mês */}
          <div className="mb-6 rounded-lg border p-4">
            <div className="mb-4 flex items-center justify-between">
              <Label className="text-sm font-medium">
                Configurar horários para:
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (selectedMonth === 1) {
                      setSelectedMonth(12);
                      setSelectedYear(selectedYear - 1);
                    } else {
                      setSelectedMonth(selectedMonth - 1);
                    }
                  }}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="min-w-[150px] text-center text-sm font-medium">
                  {monthNames[selectedMonth - 1]} {selectedYear}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (selectedMonth === 12) {
                      setSelectedMonth(1);
                      setSelectedYear(selectedYear + 1);
                    } else {
                      setSelectedMonth(selectedMonth + 1);
                    }
                  }}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Opções de Configuração do Mês */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Button
                variant={monthConfig === "default" ? "default" : "outline"}
                size="sm"
                onClick={() => handleMonthConfigChange("default")}
                className="flex h-auto flex-col py-3"
                disabled={isLoadingMonth || isSaving}
              >
                <Clock className="mb-1 h-4 w-4" />
                <span className="text-xs">Padrão</span>
                <span className="text-[10px] opacity-70">
                  Mesmos horários sempre
                </span>
              </Button>
              <Button
                variant={monthConfig === "custom" ? "default" : "outline"}
                size="sm"
                onClick={() => handleMonthConfigChange("custom")}
                className="flex h-auto flex-col py-3"
                disabled={isLoadingMonth || isSaving}
              >
                <Copy className="mb-1 h-4 w-4" />
                <span className="text-xs">Personalizado</span>
                <span className="text-[10px] opacity-70">
                  Horários específicos
                </span>
              </Button>
              <Button
                variant={monthConfig === "off" ? "destructive" : "outline"}
                size="sm"
                onClick={() => handleMonthConfigChange("off")}
                className="flex h-auto flex-col py-3"
                disabled={isLoadingMonth || isSaving}
              >
                <XCircle className="mb-1 h-4 w-4" />
                <span className="text-xs">Sem Atendimento</span>
                <span className="text-[10px] opacity-70">Férias/Recesso</span>
              </Button>
            </div>

            {monthConfig === "custom" && (
              <div className="mt-3 border-t pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2"
                  disabled={!isEditing}
                  onClick={async () => {
                    try {
                      let prevMonth = selectedMonth - 1;
                      let prevYear = selectedYear;

                      if (prevMonth === 0) {
                        prevMonth = 12;
                        prevYear = selectedYear - 1;
                      }

                      const result = await getMonthSettings({
                        month: prevMonth,
                        year: prevYear,
                      });

                      if (result?.data?.data && result.data.data.length > 0) {
                        const { data } = result.data;
                        const prevHours: WorkingHour[] = Array.from(
                          { length: 7 },
                          (_, index) => {
                            const existing = data.find(
                              (wh) => wh.dayOfWeek === index
                            );
                            if (existing) {
                              return {
                                dayOfWeek: existing.dayOfWeek,
                                enabled: existing.enabled ?? false,
                                timeSlots: Array.isArray(existing.timeSlots)
                                  ? (existing.timeSlots as TimeSlot[])
                                  : [],
                              };
                            }
                            return {
                              dayOfWeek: index,
                              enabled: false,
                              timeSlots: [],
                            };
                          }
                        );
                        setTempWorkingHours(prevHours);
                        toast.success(
                          `Horários de ${monthNames[prevMonth - 1]} copiados!`
                        );
                      } else {
                        toast.info(
                          "Mês anterior não tem configurações personalizadas"
                        );
                      }
                    } catch (error) {
                      console.error("Erro ao copiar:", error);
                      toast.error("Erro ao copiar horários do mês anterior");
                    }
                  }}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copiar configuração do mês anterior
                </Button>
              </div>
            )}
          </div>

          {/* Botões de ação */}
          <div className="mb-3 flex justify-start">
            {isEditing ? (
              <Button
                onClick={handleSaveAll}
                disabled={isSaving || isLoadingMonth}
                size="sm"
              >
                <Save className="mr-1.5 h-3.5 w-3.5" />
                {isSaving ? "Salvando..." : "Salvar"}
              </Button>
            ) : (
              <Button
                onClick={handleStartEdit}
                variant="outline"
                size="sm"
                disabled={isLoadingMonth}
              >
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
                                handleTimeSlotChange(
                                  index,
                                  "end",
                                  e.target.value
                                )
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

          <div className="mt-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
              <h4 className="mb-2 text-sm font-semibold text-blue-800 dark:text-blue-200">
                Dicas para configurar horários
              </h4>
              <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                <li>
                  • Você pode adicionar múltiplos períodos para o mesmo dia
                </li>
                <li>
                  • Configure intervalos de almoço criando períodos separados
                </li>
                <li>
                  • Os horários configurados serão usados para validar
                  agendamentos
                </li>
                <li>
                  • Use o calendário ao lado para marcar feriados e folgas
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Coluna direita: Calendário de dias sem expediente */}
        <div>
          <DayOffCalendar
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>
      </div>
    </div>
  );
}
