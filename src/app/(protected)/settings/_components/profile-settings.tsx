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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações Pessoais
          </CardTitle>
          <CardDescription>
            Dados básicos do seu perfil profissional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input placeholder="Seu nome completo" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-mail
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu.email@exemplo.com"
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
                <FormLabel className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefone
                </FormLabel>
                <FormControl>
                  <Input placeholder="(11) 99999-9999" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      {/* Credenciais Profissionais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Credenciais Profissionais
          </CardTitle>
          <CardDescription>
            Suas qualificações e registro profissional
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="crp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CRP (Conselho Regional de Psicologia)</FormLabel>
                <FormControl>
                  <Input placeholder="CRP XX/XXXXX" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Especialização</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ex: Psicologia Clínica, Psicoterapia Cognitivo-Comportamental"
                    {...field}
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
