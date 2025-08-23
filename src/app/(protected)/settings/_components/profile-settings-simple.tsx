"use client";

import type { LucideIcon } from "lucide-react";
import { Edit2, Mail, Phone, Save, User, UserCheck, X } from "lucide-react";
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
  const [isEditing, setIsEditing] = useState<keyof SettingsData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editValues, setEditValues] = useState<Partial<SettingsData>>({});

  if (!settings) return null;

  const handleEdit = (field: keyof SettingsData) => {
    setIsEditing(field);
    setEditValues({
      [field]: settings[field] || "",
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

  const handleInputChange = (field: keyof SettingsData, value: string) => {
    setEditValues({ ...editValues, [field]: value });
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
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <Icon className="text-muted-foreground h-5 w-5" />
        <div>
          <Label className="font-medium">{label}</Label>
          {isEditing === field ? (
            <Input
              type={type}
              value={(editValues[field] as string) || ""}
              onChange={(e) => handleInputChange(field, e.target.value)}
              placeholder={placeholder}
              className="mt-1 w-64"
              autoFocus
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              {value || "Não informado"}
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>
            Gerencie seus dados pessoais e profissionais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Informações Profissionais
          </CardTitle>
          <CardDescription>
            Dados relacionados à sua prática profissional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
