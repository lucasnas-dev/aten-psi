"use client";

import { Bell, Calendar, Clock, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getSettings } from "@/actions/get-settings";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

const createDefaultWorkingHours = () =>
  Array.from({ length: 7 }, (_, dayOfWeek) => ({
    dayOfWeek,
    enabled: false,
    timeSlots: [],
  }));

const DEFAULT_SETTINGS: SettingsData = {
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
  workingHours: createDefaultWorkingHours(),
};

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "profile");
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [isFirstSetup, setIsFirstSetup] = useState(true);

  // Atualizar aba quando o parâmetro mudar
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  // Carregar configurações existentes
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await getSettings();
        if (result?.data?.success) {
          const settingsData = result.data.data.settings;
          const workingHoursData = result.data.data.workingHours;

          if (settingsData) {
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
              workingHours:
                workingHoursData.length > 0
                  ? workingHoursData.map((wh) => ({
                      dayOfWeek: wh.dayOfWeek,
                      enabled: wh.enabled ?? false,
                      timeSlots:
                        typeof wh.timeSlots === "string"
                          ? JSON.parse(wh.timeSlots)
                          : wh.timeSlots || [],
                    }))
                  : createDefaultWorkingHours(),
            });
            setIsFirstSetup(false);
          } else {
            setSettings({
              ...DEFAULT_SETTINGS,
              workingHours:
                workingHoursData.length > 0
                  ? workingHoursData.map((wh) => ({
                      dayOfWeek: wh.dayOfWeek,
                      enabled: wh.enabled ?? false,
                      timeSlots:
                        typeof wh.timeSlots === "string"
                          ? JSON.parse(wh.timeSlots)
                          : wh.timeSlots || [],
                    }))
                  : createDefaultWorkingHours(),
            });
            setIsFirstSetup(true);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        toast.error("Erro ao carregar configurações existentes");
        setSettings(DEFAULT_SETTINGS);
        setIsFirstSetup(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSettingsUpdate = (updatedSettings: Partial<SettingsData>) => {
    setSettings((current) => ({ ...current, ...updatedSettings }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
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
    <div className="space-y-4">
      {isFirstSetup && (
        <Alert className="border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          <AlertTitle>Cadastro inicial pendente</AlertTitle>
          <AlertDescription>
            Preencha suas informações pessoais, horários e preferências para
            habilitar os recursos que dependem dessas configurações.
          </AlertDescription>
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid h-10 w-full grid-cols-4">
          <TabsTrigger
            value="profile"
            className="flex items-center gap-2 text-sm"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger
            value="working-hours"
            className="flex items-center gap-2 text-sm"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Horários</span>
          </TabsTrigger>
          <TabsTrigger
            value="appointments"
            className="flex items-center gap-2 text-sm"
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Consultas</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2 text-sm"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-0 space-y-4">
          <ProfileSettingsSimple
            settings={settings}
            isFirstSetup={isFirstSetup}
            onUpdate={handleSettingsUpdate}
            onSaved={() => setActiveTab("working-hours")}
          />
        </TabsContent>

        <TabsContent value="working-hours" className="mt-0 space-y-4">
          <WorkingHoursSimple
            settings={settings}
            isFirstSetup={isFirstSetup}
            onUpdate={handleSettingsUpdate}
            onSaved={() => setActiveTab("appointments")}
          />
        </TabsContent>

        <TabsContent value="appointments" className="mt-0 space-y-4">
          <AppointmentSettingsSimple
            settings={settings}
            isFirstSetup={isFirstSetup}
            onUpdate={handleSettingsUpdate}
            onSaved={() => {
              setIsFirstSetup(false);
              setActiveTab("notifications");
            }}
          />
        </TabsContent>

        <TabsContent value="notifications" className="mt-0 space-y-4">
          <NotificationSettingsSimple
            settings={settings}
            isFirstSetup={isFirstSetup}
            onUpdate={handleSettingsUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
