"use client";

import { Bell, Clock, Mail, MessageSquare } from "lucide-react";
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
  weekStartsOn: "0" | "1";
  timeFormat: "12" | "24";
  timezone: string;
}

interface NotificationSettingsProps {
  form: UseFormReturn<SettingsFormData>;
}

export function NotificationSettings({ form }: NotificationSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificações
          </CardTitle>
          <CardDescription>
            Configure como e quando você quer receber notificações sobre sua
            agenda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="flex items-center gap-2 text-base">
                    <Mail className="h-4 w-4" />
                    Notificações por Email
                  </FormLabel>
                  <FormDescription>
                    Receba lembretes e atualizações por email.
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
                  <FormLabel className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-4 w-4" />
                    Notificações por SMS
                  </FormLabel>
                  <FormDescription>
                    Receba lembretes urgentes via SMS.
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Lembretes de Consulta
          </CardTitle>
          <CardDescription>
            Configure quando enviar lembretes automáticos para pacientes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  Tempo de antecedência para envio automático de lembretes.
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <h4 className="text-sm font-medium">
              Tipos de notificação para pacientes:
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
                className="bg-muted/20 flex items-center justify-between rounded-lg px-3 py-2"
              >
                <span className="text-sm">{notification.label}</span>
                <Switch defaultChecked={notification.defaultEnabled} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
