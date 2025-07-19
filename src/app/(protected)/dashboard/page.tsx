import {
  AlertCircle,
  CalendarIcon,
  Clock,
  FileText,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Painel</h1>
          <p className="text-muted-foreground">
            Visão geral da sua prática psicológica
          </p>
        </div>
        <Button>
          <CalendarIcon className="mr-2 h-4 w-4" />
          Nova Consulta
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium">Total de Pacientes</h3>
            <Users className="text-muted-foreground h-4 w-4" />
          </div>
          <div>
            <div className="text-2xl font-bold">42</div>
            <p className="text-muted-foreground text-xs">
              +2 desde o mês passado
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium">Consultas Agendadas</h3>
            <CalendarIcon className="text-muted-foreground h-4 w-4" />
          </div>
          <div>
            <div className="text-2xl font-bold">12</div>
            <p className="text-muted-foreground text-xs">Próximos 7 dias</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium">Horas de Sessão</h3>
            <Clock className="text-muted-foreground h-4 w-4" />
          </div>
          <div>
            <div className="text-2xl font-bold">24,5</div>
            <p className="text-muted-foreground text-xs">Este mês</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-row items-center justify-between">
            <h3 className="text-sm font-medium">Anotações Pendentes</h3>
            <FileText className="text-muted-foreground h-4 w-4" />
          </div>
          <div>
            <div className="text-2xl font-bold">3</div>
            <p className="text-muted-foreground text-xs">
              Precisam ser concluídas
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="proximas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="proximas">Próximas Consultas</TabsTrigger>
          <TabsTrigger value="pacientes">Pacientes Recentes</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="proximas" className="space-y-4">
          <div>
            <h3 className="mb-2 text-xl font-semibold">Próximas Consultas</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Suas consultas agendadas para os próximos dias
            </p>
            <div>
              <p className="text-muted-foreground text-sm">
                Nenhuma consulta agendada no momento.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pacientes" className="space-y-4">
          <div>
            <h3 className="mb-2 text-xl font-semibold">Pacientes Recentes</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Últimos pacientes atendidos
            </p>
            <div>
              <p className="text-muted-foreground text-sm">
                Nenhum paciente recente.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <div>
            <h3 className="mb-2 text-xl font-semibold">Alertas e Lembretes</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Notificações importantes que requerem sua atenção
            </p>
            <div>
              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-md border p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Anotações de sessão pendentes</p>
                    <p className="text-muted-foreground text-sm">
                      3 anotações de sessão da semana passada precisam ser
                      concluídas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-md border p-4">
                  <AlertCircle className="mt-0.5 h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Acompanhamento de paciente</p>
                    <p className="text-muted-foreground text-sm">
                      Maria Silva não agendou uma consulta de acompanhamento
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
