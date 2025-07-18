import { DashboardHeader } from "@/app/_components/dashboard-header";
import { DashboardShell } from "@/app/_components/dashboard-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProntuarioLoading() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Prontuário Psicológico"
        text="Carregando dados do prontuário..."
      >
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </DashboardHeader>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-64" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="identificacao" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="identificacao" disabled>
            Identificação
          </TabsTrigger>
          <TabsTrigger value="avaliacao" disabled>
            Avaliação Inicial
          </TabsTrigger>
          <TabsTrigger value="plano" disabled>
            Plano Terapêutico
          </TabsTrigger>
          <TabsTrigger value="evolucao" disabled>
            Evolução
          </TabsTrigger>
          <TabsTrigger value="sessoes" disabled>
            Registro de Sessões
          </TabsTrigger>
          <TabsTrigger value="encaminhamentos" disabled>
            Encaminhamentos
          </TabsTrigger>
          <TabsTrigger value="documentos" disabled>
            Documentos
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </DashboardShell>
  );
}
