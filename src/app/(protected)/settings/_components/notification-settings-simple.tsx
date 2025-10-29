"use client";

import type { LucideIcon } from "lucide-react";
import { Bell, Clock, Edit2, Mail, MessageSquare, Save } from "lucide-react";
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

interface NotificationSettingsSimpleProps {
  settings: SettingsData | null;
  onUpdate: (settings: Partial<SettingsData>) => void;
}

export function NotificationSettingsSimple({
  settings,
  onUpdate,
}: NotificationSettingsSimpleProps) {
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

  const TimeFieldRow = () => (
    <div className="flex items-center gap-3 py-2">
      <Clock className="text-muted-foreground h-4 w-4 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <Label className="text-muted-foreground text-xs">
          Tempo de lembrete
        </Label>
        <div className="mt-1 flex items-center gap-2">
          <Input
            type="number"
            value={
              editValues.reminderTime !== undefined
                ? editValues.reminderTime
                : settings.reminderTime
            }
            onChange={(e) =>
              handleInputChange("reminderTime", Number(e.target.value))
            }
            className="h-8 w-24 text-sm"
            min={15}
            max={1440}
            disabled={isSaving}
          />
          <span className="text-muted-foreground text-xs">minutos antes</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Bell className="h-4 w-4" />
            Preferências de Notificação
          </h3>
          {isEditing ? (
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              <Save className="mr-1.5 h-3.5 w-3.5" />
              Salvar
            </Button>
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
          <SwitchRow
            label="Notificações por E-mail"
            field="emailNotifications"
            value={
              editValues.emailNotifications !== undefined
                ? editValues.emailNotifications
                : settings.emailNotifications
            }
            icon={Mail}
            description="Receba lembretes e atualizações por e-mail"
          />

          <SwitchRow
            label="Notificações por SMS"
            field="smsNotifications"
            value={
              editValues.smsNotifications !== undefined
                ? editValues.smsNotifications
                : settings.smsNotifications
            }
            icon={MessageSquare}
            description="Receba lembretes urgentes por SMS (quando disponível)"
          />

          <TimeFieldRow />
        </div>
      </div>

      <div className="max-w-2xl">
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
          <h4 className="mb-2 text-sm font-semibold text-amber-800 dark:text-amber-200">
            Informação importante
          </h4>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            As notificações por SMS estão em desenvolvimento e serão
            disponibilizadas em breve. Atualmente, apenas notificações por
            e-mail estão funcionais.
          </p>
        </div>
      </div>
    </div>
  );
}
