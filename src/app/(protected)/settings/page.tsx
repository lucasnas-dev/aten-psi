"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Calendar, Clock, Settings, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  AppointmentSettings,
  NotificationSettings,
  ProfileSettings,
  WorkingHoursConfig,
} from "./_components";

const settingsSchema = z.object({
  // Configurações do perfil
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  crp: z.string().optional(),
  specialization: z.string().optional(),

  // Configurações de consulta
  defaultDuration: z.number().min(15).max(240),
  bufferTime: z.number().min(0).max(60),
  maxAdvanceBooking: z.number().min(1).max(365),
  allowSameDayBooking: z.boolean(),

  // Configurações de notificação
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  reminderTime: z.number().min(15).max(1440), // em minutos
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("working-hours");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      crp: "",
      specialization: "",
      defaultDuration: 50,
      bufferTime: 10,
      maxAdvanceBooking: 30,
      allowSameDayBooking: false,
      emailNotifications: true,
      smsNotifications: false,
      reminderTime: 60,
    },
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    try {
      // Aqui você salvaria as configurações no banco
      console.log("Salvando configurações:", data);
      // await saveSettings(data);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-3xl font-bold text-transparent">
                Configurações
              </h1>
              <p className="text-muted-foreground">
                Personalize suas preferências e horários de trabalho
              </p>
            </div>
          </div>
        </div>

        {/* Tabs with enhanced design */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <div className="rounded-2xl border border-gray-100 bg-white p-2 shadow-lg">
            <TabsList className="grid w-full grid-cols-4 rounded-xl bg-gray-50 p-1">
              <TabsTrigger
                value="working-hours"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Horários</span>
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Consultas</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notificações</span>
              </TabsTrigger>
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Perfil</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mx-auto max-w-6xl">
                {/* Conteúdo principal */}
                <div className="min-h-[600px] rounded-2xl border border-gray-100 bg-white shadow-lg">
                  <TabsContent
                    value="working-hours"
                    className="m-0 space-y-6 p-6"
                  >
                    <div className="mb-6 border-b pb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Horários de Trabalho
                      </h2>
                      <p className="text-muted-foreground">
                        Configure seus dias e horários disponíveis
                      </p>
                    </div>
                    <WorkingHoursConfig />
                  </TabsContent>

                  <TabsContent
                    value="appointments"
                    className="m-0 space-y-6 p-6"
                  >
                    <div className="mb-6 border-b pb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Configurações de Consulta
                      </h2>
                      <p className="text-muted-foreground">
                        Defina as regras para agendamentos
                      </p>
                    </div>
                    <AppointmentSettings form={form} />
                  </TabsContent>

                  <TabsContent
                    value="notifications"
                    className="m-0 space-y-6 p-6"
                  >
                    <div className="mb-6 border-b pb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Notificações
                      </h2>
                      <p className="text-muted-foreground">
                        Configure como receber lembretes
                      </p>
                    </div>
                    <NotificationSettings form={form} />
                  </TabsContent>

                  <TabsContent value="profile" className="m-0 space-y-6 p-6">
                    <div className="mb-6 border-b pb-4">
                      <h2 className="text-xl font-semibold text-gray-800">
                        Perfil Profissional
                      </h2>
                      <p className="text-muted-foreground">
                        Suas informações pessoais e credenciais
                      </p>
                    </div>
                    <ProfileSettings form={form} />
                  </TabsContent>
                </div>

                {/* Seção de botões no final */}
                <div className="mt-6 flex justify-end space-x-4">
                  <Button type="button" variant="outline">
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {isLoading ? "Salvando..." : "Salvar Configurações"}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </Tabs>
      </div>
    </div>
  );
}
