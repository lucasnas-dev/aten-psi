"use client";

import { Bell, Calendar, Clock, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getSettings } from "@/actions/get-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  AppointmentSettingsSimple,
  NotificationSettingsSimple,
  ProfileSettingsSimple,
  WorkingHoursSimple,
} from "./_components";

interface SettingsData {
  // Configurações do perfil
  name: string;
  email: string;
  phone?: string;
  crp?: string;
  specialization?: string;

  // Configurações de consulta
  defaultDuration: number;
  bufferTime: number;
  maxAdvanceBooking: number;
  allowSameDayBooking: boolean;

  // Configurações de notificação
  emailNotifications: boolean;
  smsNotifications: boolean;
  reminderTime: number;

  // Horários de trabalho
  workingHours: Array<{
    dayOfWeek: number;
    enabled: boolean;
    timeSlots: Array<{
      start: string;
      end: string;
    }>;
  }>;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SettingsData | null>(null);

  // Carregar configurações existentes
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await getSettings();
        if (result?.data?.success && result.data.data.settings) {
          const settingsData = result.data.data.settings;
          const workingHoursData = result.data.data.workingHours;

          setSettings({
            name: settingsData.name || "",
            email: settingsData.email || "",
            phone: settingsData.phone || "",
            crp: settingsData.crp || "",
            specialization: settingsData.specialization || "",
            defaultDuration: settingsData.defaultDuration || 50,
            bufferTime: settingsData.bufferTime || 10,
            maxAdvanceBooking: settingsData.maxAdvanceBooking || 30,
            allowSameDayBooking: settingsData.allowSameDayBooking || false,
            emailNotifications: settingsData.emailNotifications ?? true,
            smsNotifications: settingsData.smsNotifications || false,
            reminderTime: settingsData.reminderTime || 60,
            workingHours: workingHoursData.map((wh) => ({
              dayOfWeek: wh.dayOfWeek,
              enabled: wh.enabled ?? false,
              timeSlots:
                typeof wh.timeSlots === "string"
                  ? JSON.parse(wh.timeSlots)
                  : wh.timeSlots || [],
            })),
          });
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        toast.error("Erro ao carregar configurações existentes");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSettingsUpdate = (updatedSettings: Partial<SettingsData>) => {
    if (settings) {
      setSettings({ ...settings, ...updatedSettings });
    }
  };

  if (isLoading) {
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
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas preferências e configurações do sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Settings className="text-muted-foreground h-5 w-5" />
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
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
        </TabsList>

        <TabsContent value="profile" className="mt-0 space-y-6">
          <ProfileSettingsSimple
            settings={settings}
            onUpdate={handleSettingsUpdate}
          />
        </TabsContent>

        <TabsContent value="working-hours" className="mt-0 space-y-6">
          <WorkingHoursSimple
            settings={settings}
            onUpdate={handleSettingsUpdate}
          />
        </TabsContent>

        <TabsContent value="appointments" className="mt-0 space-y-6">
          <AppointmentSettingsSimple
            settings={settings}
            onUpdate={handleSettingsUpdate}
          />
        </TabsContent>

        <TabsContent value="notifications" className="mt-0 space-y-6">
          <NotificationSettingsSimple
            settings={settings}
            onUpdate={handleSettingsUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
