"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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

  // Configurações de agenda
  weekStartsOn: z.enum(["0", "1"]), // 0 = Domingo, 1 = Segunda
  timeFormat: z.enum(["12", "24"]),
  timezone: z.string(),
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
      weekStartsOn: "1",
      timeFormat: "24",
      timezone: "America/Sao_Paulo",
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
    <div className="container max-w-6xl space-y-6 py-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">
          Configure seus horários de trabalho, preferências da agenda e
          notificações.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="working-hours">Horários</TabsTrigger>
          <TabsTrigger value="appointments">Consultas</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <TabsContent value="working-hours" className="space-y-6">
              <WorkingHoursConfig />
            </TabsContent>

            <TabsContent value="appointments" className="space-y-6">
              <AppointmentSettings form={form} />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <NotificationSettings form={form} />
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
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
