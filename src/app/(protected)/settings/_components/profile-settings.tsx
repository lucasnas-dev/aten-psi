"use client";

import { Mail, Phone, User, UserCheck } from "lucide-react";
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
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

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

interface ProfileSettingsProps {
  form: UseFormReturn<SettingsFormData>;
}

export function ProfileSettings({ form }: ProfileSettingsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Informações Pessoais */}
      <Card className="border-0 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-cyan-600" />
            Informações Pessoais
          </CardTitle>
          <CardDescription className="text-sm">
            Seus dados básicos de contato
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Nome completo
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Seu nome completo"
                    className="bg-white"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4 text-cyan-600" />
                  E-mail
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    className="bg-white"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4 text-cyan-600" />
                  Telefone
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="(11) 99999-9999"
                    className="bg-white"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Credenciais Profissionais */}
      <Card className="border-0 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCheck className="h-5 w-5 text-emerald-600" />
            Credenciais Profissionais
          </CardTitle>
          <CardDescription className="text-sm">
            Suas qualificações e registro profissional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="crp"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  CRP (Conselho Regional de Psicologia)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="CRP XX/XXXXX"
                    className="bg-white"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">
                  Especialização
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Psicologia Clínica, Psicoterapia Cognitivo-Comportamental"
                    className="bg-white"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-100 p-4">
            <div className="flex items-start gap-3">
              <UserCheck className="mt-0.5 h-5 w-5 text-emerald-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-emerald-800">
                  Verificação Profissional
                </p>
                <p className="text-xs text-emerald-700">
                  Mantenha seus dados atualizados para garantir a confiabilidade
                  do seu perfil profissional.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
