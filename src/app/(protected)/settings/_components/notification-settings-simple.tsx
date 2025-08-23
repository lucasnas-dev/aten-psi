"use client";

import type { LucideIcon } from "lucide-react";
import { Bell, Clock, Edit2, Mail, MessageSquare, Save, X } from "lucide-react";
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

interface NotificationSettingsSimpleProps {
  settings: SettingsData | null;
  onUpdate: (settings: Partial<SettingsData>) => void;
}

export function NotificationSettingsSimple({
  settings,
  onUpdate,
}: NotificationSettingsSimpleProps) {
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

  const TimeFieldRow = () => (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <Clock className="text-muted-foreground h-5 w-5" />
        <div>
          <Label className="font-medium">Tempo de lembrete</Label>
          {isEditing === "reminderTime" ? (
            <div className="mt-1 flex items-center gap-2">
              <Input
                type="number"
                value={editValues.reminderTime || settings.reminderTime}
                onChange={(e) =>
                  setEditValues({
                    ...editValues,
                    reminderTime: Number(e.target.value),
                  })
                }
                className="w-24"
                min={15}
                max={1440}
                autoFocus
              />
              <span className="text-muted-foreground text-sm">
                minutos antes
              </span>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {settings.reminderTime < 60
                ? `${settings.reminderTime} minutos antes`
                : `${Math.floor(settings.reminderTime / 60)} hora(s) antes`}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isEditing === "reminderTime" ? (
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
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEdit("reminderTime")}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Tipos de Notificação
          </CardTitle>
          <CardDescription>
            Configure como você deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SwitchRow
            label="Notificações por E-mail"
            field="emailNotifications"
            value={settings.emailNotifications}
            icon={Mail}
            description="Receba lembretes e atualizações por e-mail"
          />

          <SwitchRow
            label="Notificações por SMS"
            field="smsNotifications"
            value={settings.smsNotifications}
            icon={MessageSquare}
            description="Receba lembretes urgentes por SMS (quando disponível)"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configurações de Lembrete
          </CardTitle>
          <CardDescription>
            Defina quando receber lembretes de consultas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimeFieldRow />
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
        <CardHeader>
          <CardTitle className="text-amber-800 dark:text-amber-200">
            Informação importante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            As notificações por SMS estão em desenvolvimento e serão
            disponibilizadas em breve. Atualmente, apenas notificações por
            e-mail estão funcionais.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
