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

interface ArchiveStatisticsProps {
  records: Array<{
    id: string;
    status: string;
    sector: string;
    startDate: Date;
    totalConsultations: number;
    psychologist: string;
  }>;
}

export function ArchiveStatistics({ records }: ArchiveStatisticsProps) {
  // Calculate statistics
  const stats = {
    totalRecords: records.length,
    activeRecords: records.filter((r) => r.status === "active").length,
    completedRecords: records.filter((r) => r.status === "completed").length,
    suspendedRecords: records.filter((r) => r.status === "suspended").length,
    archivedRecords: records.filter((r) => r.status === "archived").length,

    // Statistics by sector
    bySector: records.reduce(
      (acc, r) => {
        acc[r.sector] = (acc[r.sector] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),

    // Statistics by psychologist
    byPsychologist: records.reduce(
      (acc, r) => {
        acc[r.psychologist] = (acc[r.psychologist] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),

    // Records by month (last 6 months)
    byMonth: (() => {
      const today = new Date();
      const months = [];

      for (let i = 5; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const recordsInMonth = records.filter((r) => {
          const startMonth = new Date(
            r.startDate.getFullYear(),
            r.startDate.getMonth()
          );
          return startMonth.getTime() === date.getTime();
        }).length;

        months.push({
          month: date.toLocaleString("pt-BR", {
            month: "short",
            year: "numeric",
          }),
          count: recordsInMonth,
        });
      }

      return months;
    })(),

    // Average consultations per record
    averageConsultations:
      Math.round(
        (records.reduce((sum, r) => sum + r.totalConsultations, 0) /
          records.length) *
          10
      ) / 10,

    // Sector occupancy rates (simulated - in a real system this would come from the database)
    sectorOccupancy: {
      A: { occupied: 45, total: 60, percentage: 75 },
      B: { occupied: 32, total: 50, percentage: 64 },
      C: { occupied: 78, total: 100, percentage: 78 },
      D: { occupied: 23, total: 40, percentage: 58 },
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
          {/* General Summary */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                <div className="text-2xl font-bold">{stats.totalRecords}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Users className="mx-auto mb-2 h-8 w-8 text-green-500" />
                <div className="text-2xl font-bold">{stats.activeRecords}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Ativos
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="mx-auto mb-2 h-8 w-8 text-purple-500" />
                <div className="text-2xl font-bold">
                  {stats.averageConsultations}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Média Consultas
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="mx-auto mb-2 h-8 w-8 text-orange-500" />
                <div className="text-2xl font-bold">
                  {Math.round((stats.activeRecords / stats.totalRecords) * 100)}
                  %
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Taxa Atividade
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Ativos</Badge>
                    <span className="text-sm">
                      {stats.activeRecords} prontuários
                    </span>
                  </div>
                  <div className="mx-4 h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{
                        width: `${(stats.activeRecords / stats.totalRecords) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(
                      (stats.activeRecords / stats.totalRecords) * 100
                    )}
                    %
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Concluídos</Badge>
                    <span className="text-sm">
                      {stats.completedRecords} prontuários
                    </span>
                  </div>
                  <div className="mx-4 h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{
                        width: `${(stats.completedRecords / stats.totalRecords) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(
                      (stats.completedRecords / stats.totalRecords) * 100
                    )}
                    %
                  </span>
                </div>

                {stats.suspendedRecords > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Suspensos</Badge>
                      <span className="text-sm">
                        {stats.suspendedRecords} prontuários
                      </span>
                    </div>
                    <div className="mx-4 h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-yellow-500"
                        style={{
                          width: `${(stats.suspendedRecords / stats.totalRecords) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {Math.round(
                        (stats.suspendedRecords / stats.totalRecords) * 100
                      )}
                      %
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sector Occupancy */}
          <Card>
            <CardHeader>
              <CardTitle>Ocupação por Setor</CardTitle>
              <CardDescription>
                Capacidade utilizada em cada setor do arquivo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {Object.entries(stats.sectorOccupancy).map(([sector, info]) => (
                  <div key={sector} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Setor {sector}</span>
                      <span className="text-sm text-gray-600">
                        {info.occupied}/{info.total}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${info.percentage}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      {info.percentage}% ocupado
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Records by Month */}
          <Card>
            <CardHeader>
              <CardTitle>Novos Prontuários (Últimos 6 Meses)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.byMonth.map((month, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-16 text-sm font-medium">
                      {month.month}
                    </div>
                    <div className="flex-1">
                      <div className="h-6 rounded bg-gray-200 dark:bg-gray-700">
                        <div
                          className="h-6 rounded bg-blue-500"
                          style={{
                            width: `${(month.count / Math.max(...stats.byMonth.map((m) => m.count))) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="w-8 text-sm font-medium">{month.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Distribution by Psychologist */}
          <Card>
            <CardHeader>
              <CardTitle>Prontuários por Psicólogo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(stats.byPsychologist)
                  .sort(([, a], [, b]) => b - a)
                  .map(([psychologist, count]) => (
                    <div
                      key={psychologist}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
                    >
                      <span className="font-medium">{psychologist}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts and Recommendations */}
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">
                ⚠️ Alertas e Recomendações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {stats.sectorOccupancy.A.percentage >= 80 && (
                  <div className="text-yellow-700 dark:text-yellow-300">
                    • Setor A está com {stats.sectorOccupancy.A.percentage}% de
                    ocupação - considere expansão
                  </div>
                )}
                {stats.sectorOccupancy.C.percentage >= 80 && (
                  <div className="text-yellow-700 dark:text-yellow-300">
                    • Setor C (concluídos) está com{" "}
                    {stats.sectorOccupancy.C.percentage}% de ocupação -
                    considere arquivamento
                  </div>
                )}
                {stats.suspendedRecords > 0 && (
                  <div className="text-yellow-700 dark:text-yellow-300">
                    • Existem {stats.suspendedRecords} prontuários suspensos que
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
