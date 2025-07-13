import {
  AlertCircle,
  CalendarIcon,
  Clock,
  FileText,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pacientes
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-muted-foreground text-xs">
              +2 desde o mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consultas Agendadas
            </CardTitle>
            <CalendarIcon className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-muted-foreground text-xs">Próximos 7 dias</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Horas de Sessão
            </CardTitle>
            <Clock className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,5</div>
            <p className="text-muted-foreground text-xs">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Anotações Pendentes
            </CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-muted-foreground text-xs">
              Precisam ser concluídas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="proximas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="proximas">Próximas Consultas</TabsTrigger>
          <TabsTrigger value="pacientes">Pacientes Recentes</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="proximas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Próximas Consultas</CardTitle>
              <CardDescription>
                Suas consultas agendadas para os próximos dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Nenhuma consulta agendada no momento.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pacientes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pacientes Recentes</CardTitle>
              <CardDescription>Últimos pacientes atendidos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Nenhum paciente recente.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas e Lembretes</CardTitle>
              <CardDescription>
                Notificações importantes que requerem sua atenção
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
