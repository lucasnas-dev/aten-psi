"use client";

import { Calendar, Clock, Users } from "lucide-react";
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
import { Input } from "@/components/ui/input";
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

interface AppointmentSettingsProps {
  form: UseFormReturn<SettingsFormData>;
}

export function AppointmentSettings({ form }: AppointmentSettingsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configurações de Consulta
          </CardTitle>
          <CardDescription>
            Defina as regras padrão para agendamento de consultas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="defaultDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duração padrão (minutos)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a duração" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                      <SelectItem value="50">50 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="90">1h 30min</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Duração padrão aplicada a novas consultas.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="bufferTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Intervalo entre consultas (minutos)</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o intervalo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">Sem intervalo</SelectItem>
                      <SelectItem value="5">5 minutos</SelectItem>
                      <SelectItem value="10">10 minutos</SelectItem>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Tempo livre entre uma consulta e outra.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Regras de Agendamento
          </CardTitle>
          <CardDescription>
            Configure as regras para agendamento de consultas pelos pacientes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="maxAdvanceBooking"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Antecedência máxima para agendamento (dias)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Quantos dias no futuro os pacientes podem agendar consultas.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowSameDayBooking"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Permitir agendamento no mesmo dia
                  </FormLabel>
                  <FormDescription>
                    Pacientes podem agendar consultas para o mesmo dia.
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
            <Users className="h-5 w-5" />
            Tipos de Consulta
          </CardTitle>
          <CardDescription>
            Configure os tipos de consulta disponíveis e suas durações
            específicas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-sm font-medium">
              <div>Tipo de Consulta</div>
              <div>Duração (min)</div>
              <div>Ativo</div>
            </div>

            {[
              { key: "triagem", label: "Triagem", defaultDuration: 30 },
              {
                key: "avaliacao_inicial",
                label: "Avaliação Inicial",
                defaultDuration: 60,
              },
              { key: "atendimento", label: "Atendimento", defaultDuration: 50 },
              {
                key: "avaliacao_psicologica",
                label: "Avaliação Psicológica",
                defaultDuration: 90,
              },
              { key: "devolutiva", label: "Devolutiva", defaultDuration: 60 },
            ].map((type) => (
              <div
                key={type.key}
                className="grid grid-cols-3 items-center gap-4 border-b py-2"
              >
                <div className="font-medium">{type.label}</div>
                <Input
                  type="number"
                  defaultValue={type.defaultDuration}
                  className="w-20"
                />
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
