"use client";

import type { LucideIcon } from "lucide-react";
import { Edit2, Mail, Phone, Save, User, UserCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { saveSettings } from "@/actions/save-settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface ProfileSettingsSimpleProps {
  settings: SettingsData | null;
  onUpdate: (settings: Partial<SettingsData>) => void;
}

export function ProfileSettingsSimple({
  settings,
  onUpdate,
}: ProfileSettingsSimpleProps) {
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

  const FieldRow = ({
    label,
    field,
    value,
    icon: Icon,
    placeholder,
    type = "text",
  }: {
    label: string;
    field: keyof SettingsData;
    value: string;
    icon: LucideIcon;
    placeholder: string;
    type?: string;
  }) => (
    <div className="flex items-center gap-3 py-2">
      <Icon className="text-muted-foreground h-4 w-4 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <Label className="text-muted-foreground text-xs">{label}</Label>
        {isEditing ? (
          <Input
            type={type}
            value={(editValues[field] as string) || ""}
            onChange={(e) => handleInputChange(field, e.target.value)}
            placeholder={placeholder}
            className="mt-1 h-8 text-sm"
            disabled={isSaving}
          />
        ) : (
          <p className="mt-1 text-sm">{value || "Não informado"}</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Informações Pessoais */}
      <div className="max-w-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <User className="h-4 w-4" />
            Informações Pessoais
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
          <FieldRow
            label="Nome completo"
            field="name"
            value={settings.name}
            icon={User}
            placeholder="Seu nome completo"
          />

          <FieldRow
            label="E-mail"
            field="email"
            value={settings.email}
            icon={Mail}
            placeholder="seu.email@exemplo.com"
            type="email"
          />

          <FieldRow
            label="Telefone"
            field="phone"
            value={settings.phone || ""}
            icon={Phone}
            placeholder="(11) 99999-9999"
          />
        </div>
      </div>

      {/* Informações Profissionais */}
      <div className="max-w-2xl">
        <div className="mb-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <UserCheck className="h-4 w-4" />
            Informações Profissionais
          </h3>
        </div>

        <div className="space-y-1 border-t pt-3">
          <FieldRow
            label="CRP"
            field="crp"
            value={settings.crp || ""}
            icon={UserCheck}
            placeholder="CRP 01/12345"
          />

          <FieldRow
            label="Especialização"
            field="specialization"
            value={settings.specialization || ""}
            icon={UserCheck}
            placeholder="Sua área de especialização"
          />
        </div>
      </div>
    </div>
  );
}
