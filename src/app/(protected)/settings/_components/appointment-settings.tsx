"use client";

import { Calendar, Clock } from "lucide-react";
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

interface AppointmentSettingsProps {
  form: UseFormReturn<SettingsFormData>;
}

export function AppointmentSettings({ form }: AppointmentSettingsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Configurações de Duração */}
      <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-blue-600" />
            Tempo das Consultas
          </CardTitle>
          <CardDescription className="text-sm">
            Configure a duração padrão e intervalos entre consultas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="defaultDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Duração padrão (minutos)
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione a duração" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="45">45 minutos</SelectItem>
                    <SelectItem value="50">50 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                    <SelectItem value="90">90 minutos</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">
                  Tempo padrão para novas consultas
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bufferTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Intervalo entre consultas (minutos)
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione o intervalo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Sem intervalo</SelectItem>
                    <SelectItem value="5">5 minutos</SelectItem>
                    <SelectItem value="10">10 minutos</SelectItem>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="20">20 minutos</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">
                  Tempo livre entre consultas consecutivas
                </FormDescription>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Regras de Agendamento */}
      <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-green-600" />
            Regras de Agendamento
          </CardTitle>
          <CardDescription className="text-sm">
            Defina as políticas para novos agendamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="maxAdvanceBooking"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Agendamento antecipado (dias)
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="7">1 semana</SelectItem>
                    <SelectItem value="15">15 dias</SelectItem>
                    <SelectItem value="30">1 mês</SelectItem>
                    <SelectItem value="60">2 meses</SelectItem>
                    <SelectItem value="90">3 meses</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">
                  Quantos dias no futuro é possível agendar
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowSameDayBooking"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border border-green-200 bg-white p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-medium">
                    Agendamento no mesmo dia
                  </FormLabel>
                  <FormDescription className="text-xs">
                    Permitir agendar consultas para o dia atual
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
    </div>
  );
}
