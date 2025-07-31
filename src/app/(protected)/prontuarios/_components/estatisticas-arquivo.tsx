"use client";

import { BarChart3, Calendar, FileText, TrendingUp, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EstatisticasArquivoProps {
  prontuarios: Array<{
    id: string;
    statusAtendimento: string;
    setor: string;
    dataInicioAtendimento: Date;
    totalConsultas: number;
    psicologo: string;
  }>;
}

export function EstatisticasArquivo({ prontuarios }: EstatisticasArquivoProps) {
  // Calcular estatísticas
  const stats = {
    totalProntuarios: prontuarios.length,
    ativos: prontuarios.filter((p) => p.statusAtendimento === "ativo").length,
    concluidos: prontuarios.filter((p) => p.statusAtendimento === "concluido")
      .length,
    suspensos: prontuarios.filter((p) => p.statusAtendimento === "suspenso")
      .length,
    arquivados: prontuarios.filter((p) => p.statusAtendimento === "arquivado")
      .length,

    // Estatísticas por setor
    porSetor: prontuarios.reduce(
      (acc, p) => {
        acc[p.setor] = (acc[p.setor] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),

    // Estatísticas por psicólogo
    porPsicologo: prontuarios.reduce(
      (acc, p) => {
        acc[p.psicologo] = (acc[p.psicologo] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),

    // Prontuários por mês (últimos 6 meses)
    porMes: (() => {
      const hoje = new Date();
      const meses = [];

      for (let i = 5; i >= 0; i--) {
        const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
        const prontuariosMes = prontuarios.filter((p) => {
          const inicioMes = new Date(
            p.dataInicioAtendimento.getFullYear(),
            p.dataInicioAtendimento.getMonth()
          );
          return inicioMes.getTime() === data.getTime();
        }).length;

        meses.push({
          mes: data.toLocaleString("pt-BR", {
            month: "short",
            year: "numeric",
          }),
          quantidade: prontuariosMes,
        });
      }

      return meses;
    })(),

    // Média de consultas por prontuário
    mediaConsultas:
      Math.round(
        (prontuarios.reduce((sum, p) => sum + p.totalConsultas, 0) /
          prontuarios.length) *
          10
      ) / 10,

    // Taxa de ocupação por setor (simulada - em um sistema real viria do banco)
    ocupacaoSetores: {
      A: { ocupadas: 45, total: 60, percentual: 75 },
      B: { ocupadas: 32, total: 50, percentual: 64 },
      C: { ocupadas: 78, total: 100, percentual: 78 },
      D: { ocupadas: 23, total: 40, percentual: 58 },
    },
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BarChart3 className="mr-2 h-4 w-4" />
          Estatísticas
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Estatísticas do Arquivo
          </DialogTitle>
          <DialogDescription>
            Análise completa da organização e utilização do arquivo de
            prontuários
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo Geral */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                <div className="text-2xl font-bold">
                  {stats.totalProntuarios}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Users className="mx-auto mb-2 h-8 w-8 text-green-500" />
                <div className="text-2xl font-bold">{stats.ativos}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Ativos
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="mx-auto mb-2 h-8 w-8 text-purple-500" />
                <div className="text-2xl font-bold">{stats.mediaConsultas}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Média Consultas
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="mx-auto mb-2 h-8 w-8 text-orange-500" />
                <div className="text-2xl font-bold">
                  {Math.round((stats.ativos / stats.totalProntuarios) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Taxa Atividade
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Distribuição por Status */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Ativos</Badge>
                    <span className="text-sm">{stats.ativos} prontuários</span>
                  </div>
                  <div className="mx-4 h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${(stats.ativos / stats.totalProntuarios) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round((stats.ativos / stats.totalProntuarios) * 100)}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Concluídos</Badge>
                    <span className="text-sm">
                      {stats.concluidos} prontuários
                    </span>
                  </div>
                  <div className="mx-4 h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{
                        width: `${(stats.concluidos / stats.totalProntuarios) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(
                      (stats.concluidos / stats.totalProntuarios) * 100
                    )}
                    %
                  </span>
                </div>

                {stats.suspensos > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Suspensos</Badge>
                      <span className="text-sm">
                        {stats.suspensos} prontuários
                      </span>
                    </div>
                    <div className="mx-4 h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-yellow-500"
                        style={{
                          width: `${(stats.suspensos / stats.totalProntuarios) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round(
                        (stats.suspensos / stats.totalProntuarios) * 100
                      )}
                      %
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Ocupação por Setor */}
          <Card>
            <CardHeader>
              <CardTitle>Ocupação por Setor</CardTitle>
              <CardDescription>
                Capacidade utilizada em cada setor do arquivo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Object.entries(stats.ocupacaoSetores).map(([setor, info]) => (
                  <div key={setor} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Setor {setor}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {info.ocupadas}/{info.total}
                      </span>
                    </div>
                    <div className="h-3 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className={`h-3 rounded-full ${
                          info.percentual >= 80
                            ? "bg-red-500"
                            : info.percentual >= 60
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${info.percentual}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span
                        className={
                          info.percentual >= 80
                            ? "text-red-600"
                            : info.percentual >= 60
                              ? "text-yellow-600"
                              : "text-green-600"
                        }
                      >
                        {info.percentual}% ocupado
                      </span>
                      <span className="text-gray-500">
                        {info.total - info.ocupadas} disponíveis
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Prontuários por Mês */}
          <Card>
            <CardHeader>
              <CardTitle>Novos Prontuários (Últimos 6 Meses)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.porMes.map((mes, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium">{mes.mes}</div>
                    <div className="relative h-6 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="flex h-6 items-center justify-end rounded-full bg-blue-500 pr-2"
                        style={{
                          width: `${Math.max((mes.quantidade / Math.max(...stats.porMes.map((m) => m.quantidade))) * 100, 10)}%`,
                        }}
                      >
                        <span className="text-xs font-medium text-white">
                          {mes.quantidade}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Distribuição por Psicólogo */}
          <Card>
            <CardHeader>
              <CardTitle>Prontuários por Psicólogo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(stats.porPsicologo)
                  .sort(([, a], [, b]) => b - a)
                  .map(([psicologo, quantidade]) => (
                    <div
                      key={psicologo}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
                    >
                      <span className="font-medium">{psicologo}</span>
                      <Badge variant="outline">{quantidade} prontuários</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Alertas e Recomendações */}
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">
                ⚠️ Alertas e Recomendações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {stats.ocupacaoSetores.A.percentual >= 80 && (
                  <div className="text-yellow-700 dark:text-yellow-300">
                    • Setor A está com {stats.ocupacaoSetores.A.percentual}% de
                    ocupação - considere expansão
                  </div>
                )}
                {stats.ocupacaoSetores.C.percentual >= 80 && (
                  <div className="text-yellow-700 dark:text-yellow-300">
                    • Setor C (concluídos) está com{" "}
                    {stats.ocupacaoSetores.C.percentual}% de ocupação -
                    considere arquivamento
                  </div>
                )}
                {stats.suspensos > 0 && (
                  <div className="text-yellow-700 dark:text-yellow-300">
                    • Existem {stats.suspensos} prontuários suspensos que
                    precisam de acompanhamento
                  </div>
                )}
                <div className="text-yellow-700 dark:text-yellow-300">
                  • Recomenda-se revisão mensal da organização do arquivo
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
