"use client";

import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  CalendarCheck,
  CalendarX,
  Clock,
  Edit2,
  Save,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { saveSettings } from "@/actions/save-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
  workingHours: Array<{
    dayOfWeek: number;
    enabled: boolean;
    timeSlots: Array<{
      start: string;
      end: string;
    }>;
  }>;
}

interface AppointmentSettingsSimpleProps {
  settings: SettingsData | null;
  onUpdate: (settings: Partial<SettingsData>) => void;
}

export function AppointmentSettingsSimple({
  settings,
  onUpdate,
}: AppointmentSettingsSimpleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editValues, setEditValues] = useState<Partial<SettingsData>>({});

  if (!settings) return null;

  const handleInputChange = (
    field: keyof SettingsData,
    value: string | number | boolean
  ) => {
    setEditValues({ ...editValues, [field]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedData = {
        ...settings,
        ...editValues,
      };

      const result = await saveSettings(updatedData);

      if (result?.data?.success) {
        onUpdate(editValues);
        setIsEditing(false);
        setEditValues({});
        toast.success("Configuração atualizada com sucesso!");
      } else {
        throw new Error("Falha ao salvar configuração");
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      toast.error("Erro ao salvar. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const NumberFieldRow = ({
    label,
    field,
    value,
    icon: Icon,
    unit,
    min,
    max,
  }: {
    label: string;
    field: keyof SettingsData;
    value: number;
    icon: LucideIcon;
    unit: string;
    min: number;
    max: number;
  }) => (
    <div className="flex items-center gap-3 py-2">
      <Icon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <Label className="text-muted-foreground text-xs">{label}</Label>
        <div className="mt-1 flex items-center gap-2">
          <Input
            type="number"
            value={
              typeof editValues[field] === "number" ? editValues[field] : value
            }
            onChange={(e) => handleInputChange(field, Number(e.target.value))}
            className="h-8 w-24 text-sm"
            min={min}
            max={max}
            disabled={isSaving}
          />
          <span className="text-muted-foreground text-xs">{unit}</span>
        </div>
      </div>
    </div>
  );

  const SwitchRow = ({
    label,
    field,
    value,
    icon: Icon,
    description,
  }: {
    label: string;
    field: keyof SettingsData;
    value: boolean;
    icon: LucideIcon;
    description: string;
  }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Icon className="text-muted-foreground h-4 w-4" />
        <div>
          <Label className="text-sm">{label}</Label>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
      </div>

      <Switch
        checked={value}
        onCheckedChange={(checked) => handleInputChange(field, checked)}
        disabled={isSaving}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Configurações de Consulta */}
      <div className="max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Calendar className="h-4 w-4" />
            Configurações de Consulta
          </h3>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <Button onClick={handleSave} disabled={isSaving} size="sm">
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Salvar
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <Edit2 className="mr-1.5 h-3.5 w-3.5" />
              Editar
            </Button>
          )}
        </div>

        <div className="space-y-1 border-t pt-3">
          <NumberFieldRow
            label="Duração padrão"
            field="defaultDuration"
            value={settings.defaultDuration}
            icon={Clock}
            unit="minutos"
            min={15}
            max={240}
          />

          <NumberFieldRow
            label="Tempo de intervalo"
            field="bufferTime"
            value={settings.bufferTime}
            icon={Clock}
            unit="minutos"
            min={0}
            max={60}
          />

          <NumberFieldRow
            label="Antecedência máxima"
            field="maxAdvanceBooking"
            value={settings.maxAdvanceBooking}
            icon={Calendar}
            unit="dias"
            min={1}
            max={365}
          />
        </div>
      </div>

      {/* Preferências de Agendamento */}
      <div className="space-y-3">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <CalendarCheck className="h-4 w-4" />
            Preferências de Agendamento
          </h3>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Configure as regras de agendamento
          </p>
        </div>

        <div>
          <SwitchRow
            label="Permitir agendamento no mesmo dia"
            field="allowSameDayBooking"
            value={settings.allowSameDayBooking}
            icon={CalendarX}
            description="Permite que pacientes agendem consultas para o mesmo dia"
          />
        </div>
      </div>
    </div>
  );
}
