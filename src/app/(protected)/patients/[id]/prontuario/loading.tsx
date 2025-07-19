import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProntuarioLoading() {
  return (
    <div className="space-y-8 p-6">
      {/* Header da página */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              disabled
              className="border-border hover:bg-muted/80 bg-card/80 shadow-sm backdrop-blur-sm transition-all duration-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Paciente
            </Button>
            <div className="flex items-center gap-3">
              <FileText className="text-primary h-8 w-8" />
              <h1 className="text-primary text-3xl font-bold tracking-tight">
                Prontuário Psicológico
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            Carregando dados do prontuário...
          </p>
        </div>

        <div className="flex space-x-2">
          <div className="bg-muted h-10 w-32 animate-pulse rounded-md"></div>
          <div className="bg-muted h-10 w-24 animate-pulse rounded-md"></div>
          <div className="bg-muted h-10 w-32 animate-pulse rounded-md"></div>
        </div>
      </div>

      {/* Cabeçalho do Prontuário */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <div className="bg-muted h-24 w-24 animate-pulse rounded-full"></div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-muted h-8 w-48 animate-pulse rounded-md"></div>
                <div className="bg-muted h-6 w-24 animate-pulse rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
                  <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
                  <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
                </div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
                  <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
                  <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="bg-muted h-9 w-48 animate-pulse rounded-md"></div>
              <div className="bg-muted h-8 w-40 animate-pulse rounded-md"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abas do Prontuário */}
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
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <div className="bg-muted h-6 w-48 animate-pulse rounded-md"></div>
              <div className="bg-muted h-4 w-full max-w-md animate-pulse rounded-md"></div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-24 animate-pulse rounded-md"></div>
                  <div className="bg-muted h-10 w-full animate-pulse rounded-md"></div>
                </div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-16 animate-pulse rounded-md"></div>
                  <div className="bg-muted h-10 w-full animate-pulse rounded-md"></div>
                </div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-32 animate-pulse rounded-md"></div>
                  <div className="bg-muted h-10 w-full animate-pulse rounded-md"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-20 animate-pulse rounded-md"></div>
                  <div className="bg-muted h-10 w-full animate-pulse rounded-md"></div>
                </div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-24 animate-pulse rounded-md"></div>
                  <div className="bg-muted h-10 w-full animate-pulse rounded-md"></div>
                </div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-18 animate-pulse rounded-md"></div>
                  <div className="bg-muted h-10 w-full animate-pulse rounded-md"></div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="bg-muted mb-4 h-6 w-40 animate-pulse rounded-md"></div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-12 animate-pulse rounded-md"></div>
                  <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
                </div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-20 animate-pulse rounded-md"></div>
                  <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
                </div>
                <div className="space-y-2">
                  <div className="bg-muted h-4 w-16 animate-pulse rounded-md"></div>
                  <div className="bg-muted h-4 w-full animate-pulse rounded-md"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
