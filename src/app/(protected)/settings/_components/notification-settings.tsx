"use client";

import { Bell, Mail, MessageSquare } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface SettingsFormData {
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
}

interface NotificationSettingsProps {
  form: UseFormReturn<SettingsFormData>;
}

export function NotificationSettings({ form }: NotificationSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Configurações de Notificação
        </CardTitle>
        <CardDescription>
          Configure como você deseja receber lembretes de consultas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preferências de Notificação */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Canais de Notificação</h4>

          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Notificações por E-mail
                  </FormLabel>
                  <FormDescription>
                    Receber lembretes e confirmações por email
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="smsNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Notificações por SMS
                  </FormLabel>
                  <FormDescription>
                    Receber lembretes via mensagem de texto
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Timing de Lembretes */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Timing dos Lembretes</h4>

          <FormField
            control={form.control}
            name="reminderTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enviar lembrete antes da consulta</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tempo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="15">15 minutos antes</SelectItem>
                    <SelectItem value="30">30 minutos antes</SelectItem>
                    <SelectItem value="60">1 hora antes</SelectItem>
                    <SelectItem value="120">2 horas antes</SelectItem>
                    <SelectItem value="1440">1 dia antes</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Tempo de antecedência para envio do lembrete
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
