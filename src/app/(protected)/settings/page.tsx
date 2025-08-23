"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bell, Calendar, Clock, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { getSettings } from "@/actions/get-settings";
import { saveSettings } from "@/actions/save-settings";
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

  // Horários de trabalho
  workingHours: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      enabled: z.boolean(),
      timeSlots: z.array(
        z.object({
          start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
          end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        })
      ),
    })
  ),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("working-hours");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

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
      workingHours: [],
    },
  });

  // Carregar configurações existentes
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await getSettings();
        if (result?.data?.success && result.data.data.settings) {
          const settings = result.data.data.settings;
          const workingHoursData = result.data.data.workingHours;

          // Resetar formulário com dados carregados
          form.reset({
            name: settings.name || "",
            email: settings.email || "",
            phone: settings.phone || "",
            crp: settings.crp || "",
            specialization: settings.specialization || "",
            defaultDuration: settings.defaultDuration || 50,
            bufferTime: settings.bufferTime || 10,
            maxAdvanceBooking: settings.maxAdvanceBooking || 30,
            allowSameDayBooking: settings.allowSameDayBooking || false,
            emailNotifications: settings.emailNotifications ?? true,
            smsNotifications: settings.smsNotifications || false,
            reminderTime: settings.reminderTime || 60,
            workingHours: workingHoursData.map((wh) => ({
              dayOfWeek: wh.dayOfWeek,
              enabled: wh.enabled ?? false,
              timeSlots:
                typeof wh.timeSlots === "string"
                  ? JSON.parse(wh.timeSlots)
                  : wh.timeSlots || [],
            })) as SettingsFormData["workingHours"],
          });
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        toast.error("Erro ao carregar configurações existentes");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadSettings();
  }, [form]);

  const onSubmit = async (data: SettingsFormData) => {
    setIsLoading(true);
    try {
      const result = await saveSettings(data);

      if (result?.data?.success) {
        toast.success(
          result.data.message || "Configurações salvas com sucesso!"
        );
      } else {
        throw new Error("Falha ao salvar configurações");
      }
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
      toast.error("Erro ao salvar configurações. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground mt-2 text-sm">
            Carregando configurações...
          </p>
        </div>
      </div>
    );
  }

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
              <WorkingHoursConfig form={form} />
            </TabsContent>

            <TabsContent value="appointments" className="mt-0 space-y-6">
              {/* @ts-expect-error - Type mismatch due to workingHours field */}
              <AppointmentSettings form={form} />
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 space-y-6">
              {/* @ts-expect-error - Type mismatch due to workingHours field */}
              <NotificationSettings form={form} />
            </TabsContent>

            <TabsContent value="profile" className="mt-0 space-y-6">
              {/* @ts-expect-error - Type mismatch due to workingHours field */}
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
