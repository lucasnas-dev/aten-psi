"use client";

import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  CalendarCheck,
  CalendarX,
  Clock,
  Edit2,
  Save,
  X,
} from "lucide-react";
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
  const [isEditing, setIsEditing] = useState<keyof SettingsData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editValues, setEditValues] = useState<Partial<SettingsData>>({});

  if (!settings) return null;

  const handleEdit = (field: keyof SettingsData) => {
    setIsEditing(field);
    setEditValues({
      [field]: settings[field],
    });
  };

  const handleCancel = () => {
    setIsEditing(null);
    setEditValues({});
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
        setIsEditing(null);
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

  const handleToggle = async (field: keyof SettingsData, value: boolean) => {
    setIsSaving(true);
    try {
      const updatedData = {
        ...settings,
        [field]: value,
      };

      const result = await saveSettings(updatedData);

      if (result?.data?.success) {
        onUpdate({ [field]: value });
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
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <Icon className="text-muted-foreground h-5 w-5" />
        <div>
          <Label className="font-medium">{label}</Label>
          {isEditing === field ? (
            <div className="mt-1 flex items-center gap-2">
              <Input
                type="number"
                value={(editValues[field] as number) || value}
                onChange={(e) =>
                  setEditValues({
                    ...editValues,
                    [field]: Number(e.target.value),
                  })
                }
                className="w-24"
                min={min}
                max={max}
                autoFocus
              />
              <span className="text-muted-foreground text-sm">{unit}</span>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {value} {unit}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isEditing === field ? (
          <>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => handleEdit(field)}>
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
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
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <Icon className="text-muted-foreground h-5 w-5" />
        <div>
          <Label className="font-medium">{label}</Label>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>

      <Switch
        checked={value}
        onCheckedChange={(checked) => handleToggle(field, checked)}
        disabled={isSaving}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Configurações de Consulta
          </CardTitle>
          <CardDescription>
            Defina os parâmetros padrão para suas consultas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            Preferências de Agendamento
          </CardTitle>
          <CardDescription>Configure as regras de agendamento</CardDescription>
        </CardHeader>
        <CardContent>
          <SwitchRow
            label="Permitir agendamento no mesmo dia"
            field="allowSameDayBooking"
            value={settings.allowSameDayBooking}
            icon={CalendarX}
            description="Permite que pacientes agendem consultas para o mesmo dia"
          />
        </CardContent>
      </Card>
    </div>
  );
}
