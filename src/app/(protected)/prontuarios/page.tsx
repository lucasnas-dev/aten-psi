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
  Search,
  SortAsc,
  SortDesc,
  User,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

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
  EstatisticasArquivo,
  LocalizadorProntuario,
  SistemaCodigosInfo,
} from "./_components";

// Tipo para representar um prontuário arquivado
interface ProntuarioArquivado {
  id: string;
  codigoArquivamento: string;
  pacienteId: string;
  nomePaciente: string;
  cpfPaciente: string;
  dataInicioAtendimento: Date;
  dataUltimaConsulta: Date;
  statusAtendimento: "ativo" | "concluido" | "suspenso" | "arquivado";
  numeroProntuario: string;
  setor: string;
  prateleira: string;
  arquivo: string;
  observacoes?: string;
  totalConsultas: number;
  psicologo: string;
  crpPsicologo: string;
}

export default function ProntuariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"codigo" | "nome" | "data" | "status">(
    "codigo"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterSetor, setFilterSetor] = useState<string>("todos");

  // Dados simulados de prontuários (em um sistema real, viriam do banco de dados)
  const prontuarios: ProntuarioArquivado[] = useMemo(
    () => [
      {
        id: "1",
        codigoArquivamento: "PSI-2025-001-A1-P1-001",
        pacienteId: "1",
        nomePaciente: "João Silva",
        cpfPaciente: "123.456.789-00",
        dataInicioAtendimento: new Date("2025-01-10"),
        dataUltimaConsulta: new Date("2025-07-25"),
        statusAtendimento: "ativo",
        numeroProntuario: "001/2025",
        setor: "A",
        prateleira: "1",
        arquivo: "001",
        totalConsultas: 12,
        psicologo: "Dra. Ana Beatriz Oliveira",
        crpPsicologo: "06/12345",
      },
      {
        id: "2",
        codigoArquivamento: "PSI-2024-089-A2-P3-045",
        pacienteId: "2",
        nomePaciente: "Maria Santos",
        cpfPaciente: "987.654.321-00",
        dataInicioAtendimento: new Date("2024-11-15"),
        dataUltimaConsulta: new Date("2025-07-20"),
        statusAtendimento: "concluido",
        numeroProntuario: "089/2024",
        setor: "A",
        prateleira: "2",
        arquivo: "045",
        totalConsultas: 24,
        psicologo: "Dra. Ana Beatriz Oliveira",
        crpPsicologo: "06/12345",
      },
      {
        id: "3",
        codigoArquivamento: "PSI-2025-015-B1-P1-012",
        pacienteId: "3",
        nomePaciente: "Carlos Oliveira",
        cpfPaciente: "456.789.123-00",
        dataInicioAtendimento: new Date("2025-02-20"),
        dataUltimaConsulta: new Date("2025-07-28"),
        statusAtendimento: "ativo",
        numeroProntuario: "015/2025",
        setor: "B",
        prateleira: "1",
        arquivo: "012",
        totalConsultas: 8,
        psicologo: "Dr. Carlos Miranda",
        crpPsicologo: "06/67890",
      },
    ],
    []
  );

  // Filtrar e ordenar prontuários
  const prontuariosFiltrados = useMemo(() => {
    const resultado = prontuarios.filter((prontuario) => {
      const matchesSearch =
        prontuario.nomePaciente
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        prontuario.codigoArquivamento
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        prontuario.numeroProntuario
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        prontuario.cpfPaciente.includes(searchTerm);

      const matchesStatus =
        filterStatus === "todos" ||
        prontuario.statusAtendimento === filterStatus;
      const matchesSetor =
        filterSetor === "todos" || prontuario.setor === filterSetor;

      return matchesSearch && matchesStatus && matchesSetor;
    });

    // Ordenação
    resultado.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "codigo":
          comparison = a.codigoArquivamento.localeCompare(b.codigoArquivamento);
          break;
        case "nome":
          comparison = a.nomePaciente.localeCompare(b.nomePaciente);
          break;
        case "data":
          comparison =
            a.dataInicioAtendimento.getTime() -
            b.dataInicioAtendimento.getTime();
          break;
        case "status":
          comparison = a.statusAtendimento.localeCompare(b.statusAtendimento);
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return resultado;
  }, [prontuarios, searchTerm, sortBy, sortOrder, filterStatus, filterSetor]);

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
          <SistemaCodigosInfo />
          <EstatisticasArquivo prontuarios={prontuarios} />
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

      {/* Filtros e Busca */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Busca e Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Campo de busca */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <Input
                placeholder="Nome, código, CPF ou nº prontuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Filtro por status */}
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

            {/* Filtro por setor */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Setor</label>
              <Select value={filterSetor} onValueChange={setFilterSetor}>
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

            {/* Ordenação */}
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

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{prontuarios.length}</p>
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
                  {
                    prontuarios.filter((p) => p.statusAtendimento === "ativo")
                      .length
                  }
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
                    prontuarios.filter(
                      (p) => p.statusAtendimento === "concluido"
                    ).length
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
                  {new Set(prontuarios.map((p) => p.setor)).size}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Setores
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Prontuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Prontuários Arquivados ({prontuariosFiltrados.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {prontuariosFiltrados.map((prontuario) => (
              <Card
                key={prontuario.id}
                className="border-l-4 border-l-blue-500"
              >
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Informações principais */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-gray-500" />
                        <span className="font-mono text-sm font-medium">
                          {prontuario.codigoArquivamento}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold">
                        {prontuario.nomePaciente}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        CPF: {prontuario.cpfPaciente}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Prontuário: {prontuario.numeroProntuario}
                      </p>
                    </div>

                    {/* Localização física */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Localização Física
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Setor:</span>
                          <span className="ml-1 font-medium">
                            {prontuario.setor}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Prateleira:</span>
                          <span className="ml-1 font-medium">
                            {prontuario.prateleira}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Arquivo:</span>
                          <span className="ml-1 font-medium">
                            {prontuario.arquivo}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Psicólogo: {prontuario.psicologo} (
                        {prontuario.crpPsicologo})
                      </p>
                    </div>

                    {/* Status e ações */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getStatusBadge(prontuario.statusAtendimento)}
                        <span className="text-sm text-gray-500">
                          {prontuario.totalConsultas} consultas
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Início:{" "}
                          {format(
                            prontuario.dataInicioAtendimento,
                            "dd/MM/yyyy",
                            { locale: ptBR }
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Última:{" "}
                          {format(prontuario.dataUltimaConsulta, "dd/MM/yyyy", {
                            locale: ptBR,
                          })}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/patients/${prontuario.pacienteId}/psychological-record`}
                        >
                          <Button variant="outline" size="sm">
                            <Eye className="mr-1 h-4 w-4" />
                            Visualizar
                          </Button>
                        </Link>
                        <LocalizadorProntuario
                          codigoArquivamento={prontuario.codigoArquivamento}
                        />
                        <Button variant="outline" size="sm">
                          <Download className="mr-1 h-4 w-4" />
                          Exportar
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {prontuariosFiltrados.length === 0 && (
            <div className="py-8 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                Nenhum prontuário encontrado
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Tente ajustar os filtros ou termos de busca.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
