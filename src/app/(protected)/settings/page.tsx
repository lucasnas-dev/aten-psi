"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Calendar, Clock, User } from "lucide-react";
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
    <div className="space-y-8 p-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger
            value="working-hours"
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Horários</span>
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Consultas</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="working-hours" className="mt-0 space-y-6">
              <WorkingHoursConfig />
            </TabsContent>

            <TabsContent value="appointments" className="mt-0 space-y-6">
              <AppointmentSettings form={form} />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 space-y-6">
              <NotificationSettings form={form} />
            </TabsContent>

            <TabsContent value="profile" className="mt-0 space-y-6">
              <ProfileSettings form={form} />
            </TabsContent>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar Configurações"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
}
