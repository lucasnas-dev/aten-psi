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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Canais de Notificação */}
      <Card className="border-0 bg-gradient-to-br from-purple-50 to-pink-50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-purple-600" />
            Canais de Notificação
          </CardTitle>
          <CardDescription className="text-sm">
            Configure como você quer receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-purple-200 bg-white p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-purple-600" />
                    <FormLabel className="text-sm font-medium">
                      Notificações por E-mail
                    </FormLabel>
                  </div>
                  <FormDescription className="text-xs">
                    Receber lembretes e confirmações por e-mail
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
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-purple-200 bg-white p-4">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <FormLabel className="text-sm font-medium">
                      Notificações por SMS
                    </FormLabel>
                  </div>
                  <FormDescription className="text-xs">
                    Receber lembretes por mensagem de texto
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
        </CardContent>
      </Card>

      {/* Configurações de Lembrete */}
      <Card className="border-0 bg-gradient-to-br from-orange-50 to-red-50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-orange-600" />
            Tempo de Lembrete
          </CardTitle>
          <CardDescription className="text-sm">
            Quando enviar lembretes antes das consultas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="reminderTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Lembrete antecipado (minutos)
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
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
                <FormDescription className="text-xs">
                  Tempo para enviar lembretes automáticos
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="rounded-lg border border-orange-200 bg-orange-100 p-4">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-orange-800">
                Tipos de Notificação:
              </h4>
              {[
                {
                  key: "confirmacao",
                  label: "Confirmação de agendamento",
                  defaultEnabled: true,
                },
                {
                  key: "lembrete",
                  label: "Lembrete de consulta",
                  defaultEnabled: true,
                },
                {
                  key: "cancelamento",
                  label: "Cancelamento de consulta",
                  defaultEnabled: true,
                },
                {
                  key: "reagendamento",
                  label: "Reagendamento de consulta",
                  defaultEnabled: true,
                },
              ].map((notification) => (
                <div
                  key={notification.key}
                  className="flex items-center justify-between"
                >
                  <label className="text-sm text-orange-700">
                    {notification.label}
                  </label>
                  <Switch defaultChecked={notification.defaultEnabled} />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
