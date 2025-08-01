"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Archive,
  Calendar,
  Download,
  Eye,
  FileText,
  FolderOpen,
  Hash,
  Loader2,
  Search,
  SortAsc,
  SortDesc,
  User,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getPsychologicalRecords,
  PsychologicalRecord,
} from "../../../actions/get-records";
import {
  ArchiveStatistics,
  CodingSystemInfo,
  RecordLocator,
} from "./_components";

// Status mapping for UI display (Portuguese interface)
const statusDisplayMapping = {
  active: "ativo",
  completed: "concluido",
  suspended: "suspenso",
  archived: "arquivado",
} as const;

// Reverse mapping for API calls (English logic)
const statusApiMapping = {
  todos: "all",
  ativo: "active",
  concluido: "completed",
  suspenso: "suspended",
  arquivado: "archived",
} as const;

// Order by mapping for API calls (English logic)
const orderByApiMapping = {
  codigo: "code",
  nome: "patient_name",
  data: "start_date",
  status: "status",
} as const;

export default function RecordsPage() {
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"codigo" | "nome" | "data" | "status">(
    "codigo"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterSector, setFilterSector] = useState<string>("todos");

  // Data state
  const [records, setRecords] = useState<PsychologicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch psychological records from database
  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getPsychologicalRecords({
        search: searchTerm || undefined,
        status:
          statusApiMapping[filterStatus as keyof typeof statusApiMapping] ||
          "all",
        sector: filterSector === "todos" ? undefined : filterSector,
        orderBy: orderByApiMapping[sortBy],
        orderDirection: sortOrder,
        page: 1,
        limit: 100, // Get all records for now
      });

      if (result?.data?.records) {
        setRecords(result.data.records);
      }
    } catch (err) {
      console.error("Error fetching records:", err);
      setError("Erro ao carregar prontuários");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterStatus, filterSector, sortBy, sortOrder]);

  // Load data on component mount and when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRecords();
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [fetchRecords]);

  // Convert records for UI display
  const displayRecords = useMemo(() => {
    return records.map((record) => ({
      id: record.id,
      archivalCode: record.archivalCode,
      patientId: record.patientId,
      patientName: record.patientName,
      patientCpf: record.patientCpf,
      startDate: record.startDate,
      lastConsultationDate: record.lastConsultationDate,
      status:
        statusDisplayMapping[
          record.status as keyof typeof statusDisplayMapping
        ],
      recordNumber: record.recordNumber,
      sector: record.sector,
      shelf: record.shelf,
      position: record.position,
      notes: record.notes,
      totalConsultations: record.totalConsultations,
      psychologist: record.psychologist,
      psychologistCrp: record.psychologistCrp,
    }));
  }, [records]);

  // Filter records locally for immediate UI response
  const filteredRecords = useMemo(() => {
    if (loading) return [];

    return displayRecords.filter((record) => {
      const matchesSearch =
        record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.archivalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.recordNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.patientCpf.includes(searchTerm);

      const matchesStatus =
        filterStatus === "todos" || record.status === filterStatus;
      const matchesSector =
        filterSector === "todos" || record.sector === filterSector;

      return matchesSearch && matchesStatus && matchesSector;
    });
  }, [displayRecords, searchTerm, filterStatus, filterSector, loading]);

  // Convert for statistics component (maintains backward compatibility)
  const statisticsData = useMemo(() => {
    return displayRecords.map((record) => ({
      id: record.id,
      status: record.status,
      sector: record.sector,
      startDate: record.startDate,
      totalConsultations: record.totalConsultations,
      psychologist: record.psychologist,
    }));
  }, [displayRecords]);

  const getStatusBadge = (status: string) => {
    const variants = {
      ativo: "default",
      concluido: "secondary",
      suspenso: "outline",
      arquivado: "destructive",
    } as const;

    const labels = {
      ativo: "Ativo",
      concluido: "Concluído",
      suspenso: "Suspenso",
      arquivado: "Arquivado",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Arquivo de Prontuários
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Sistema de organização e localização de prontuários psicológicos
          </p>
        </div>
        <div className="flex gap-2">
          <CodingSystemInfo />
          <ArchiveStatistics records={statisticsData} />
          <Button variant="outline" size="sm">
            <Archive className="mr-2 h-4 w-4" />
            Arquivar Prontuário
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Relatório de Arquivo
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Busca e Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Search field */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <Input
                placeholder="Nome, código, CPF ou nº prontuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Status filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="suspenso">Suspenso</SelectItem>
                  <SelectItem value="arquivado">Arquivado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sector filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Setor</label>
              <Select value={filterSector} onValueChange={setFilterSector}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Setores</SelectItem>
                  <SelectItem value="A">Setor A</SelectItem>
                  <SelectItem value="B">Setor B</SelectItem>
                  <SelectItem value="C">Setor C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ordenar por</label>
              <div className="flex gap-2">
                <Select
                  value={sortBy}
                  onValueChange={(
                    value: "codigo" | "nome" | "data" | "status"
                  ) => setSortBy(value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="codigo">Código</SelectItem>
                    <SelectItem value="nome">Nome</SelectItem>
                    <SelectItem value="data">Data</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="h-4 w-4" />
                  ) : (
                    <SortDesc className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{displayRecords.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total de Prontuários
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <User className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {displayRecords.filter((r) => r.status === "ativo").length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Ativos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Archive className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">
                  {
                    displayRecords.filter((r) => r.status === "concluido")
                      .length
                  }
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Concluídos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {new Set(displayRecords.map((r) => r.sector)).size}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Setores
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Records List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Prontuários Arquivados ({filteredRecords.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Carregando prontuários...</span>
              </div>
            ) : error ? (
              <div className="py-8 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-red-400" />
                <h3 className="mb-2 text-lg font-medium text-red-900 dark:text-red-100">
                  Erro ao carregar prontuários
                </h3>
                <p className="text-red-600 dark:text-red-400">{error}</p>
                <Button
                  onClick={fetchRecords}
                  variant="outline"
                  className="mt-4"
                >
                  Tentar novamente
                </Button>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="py-8 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                  Nenhum prontuário encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm ||
                  filterStatus !== "todos" ||
                  filterSector !== "todos"
                    ? "Tente ajustar os filtros ou termos de busca."
                    : "Não há prontuários cadastrados ainda."}
                </p>
              </div>
            ) : (
              filteredRecords.map((record) => (
                <Card key={record.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                      {/* Main information */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-gray-500" />
                          <span className="font-mono text-sm font-medium">
                            {record.archivalCode}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold">
                          {record.patientName}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          CPF: {record.patientCpf || "Não informado"}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Prontuário: {record.recordNumber}
                        </p>
                      </div>

                      {/* Physical location */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Localização Física
                        </h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Setor:</span>
                            <span className="ml-1 font-medium">
                              {record.sector}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Prateleira:</span>
                            <span className="ml-1 font-medium">
                              {record.shelf}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Posição:</span>
                            <span className="ml-1 font-medium">
                              {record.position}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Psicólogo: {record.psychologist} (
                          {record.psychologistCrp})
                        </p>
                      </div>

                      {/* Status and actions */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(record.status)}
                          <span className="text-sm text-gray-500">
                            {record.totalConsultations} consultas
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Início:{" "}
                            {format(record.startDate, "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Última:{" "}
                            {format(record.lastConsultationDate, "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link
                            href={`/patients/${record.patientId}/psychological-record`}
                          >
                            <Button variant="outline" size="sm">
                              <Eye className="mr-1 h-4 w-4" />
                              Visualizar
                            </Button>
                          </Link>
                          <RecordLocator archivalCode={record.archivalCode} />
                          <Button variant="outline" size="sm">
                            <Download className="mr-1 h-4 w-4" />
                            Exportar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
