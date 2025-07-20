"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useState } from "react";

import { getPatients } from "@/actions/get-patients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Pagination } from "./_components/pagination";
import { PatientsTablePure } from "./_components/patients-table-pure";
import { Patient } from "./_components/types";

export default function PatientsPage() {
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Usar useAction para buscar pacientes
  const {
    execute: buscarPacientes,
    result,
    isExecuting,
  } = useAction(getPatients);

  // Buscar pacientes quando os filtros mudarem
  useEffect(() => {
    buscarPacientes({
      search: termoBusca || undefined,
      status: filtroStatus,
      page: paginaAtual,
      limit: itensPorPagina,
    });
  }, [termoBusca, filtroStatus, paginaAtual, buscarPacientes]);

  // Dados dos pacientes e paginação vindos da action
  const pacientesData = result?.data?.patients || [];
  const paginacaoData = result?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
    limit: itensPorPagina,
  };

  // Mapear dados para o formato esperado pela tabela
  const pacientes: Patient[] = pacientesData.map((p) => ({
    id: p.id,
    name: p.name,
    email: p.email || "",
    phone: p.phone || "",
    birthDate: p.birth_date,
    gender: p.gender || "",
    address: [p.address, p.house_number, p.neighborhood, p.city, p.state]
      .filter(Boolean)
      .join(", "),
    notes: p.notes || "",
    status: p.status as "active" | "inactive",
    lastConsultation: "", // TODO: Implementar quando houver consultas
    createdAt: p.created_at?.toISOString() || "",
    updatedAt: p.updated_at?.toISOString() || "",
  }));

  // Controles de paginação
  const controles = {
    irParaPagina: setPaginaAtual,
    proximaPagina: () => {
      if (paginacaoData.hasNext) {
        setPaginaAtual(paginacaoData.currentPage + 1);
      }
    },
    paginaAnterior: () => {
      if (paginacaoData.hasPrev) {
        setPaginaAtual(paginacaoData.currentPage - 1);
      }
    },
    alterarItensPorPagina: () => {
      setPaginaAtual(1);
    },
  };

  // Paginação ajustada para o formato esperado
  const paginacao = {
    totalItens: paginacaoData.totalCount,
    totalPaginas: paginacaoData.totalPages,
    paginaAtual: paginacaoData.currentPage,
    inicio: (paginacaoData.currentPage - 1) * paginacaoData.limit + 1,
    fim: Math.min(
      paginacaoData.currentPage * paginacaoData.limit,
      paginacaoData.totalCount,
    ),
    temProxima: paginacaoData.hasNext,
    temAnterior: paginacaoData.hasPrev,
    itensPorPagina: paginacaoData.limit,
  };

  const handleArquivar = (paciente: Patient) => {
    console.log("Arquivar/Reativar paciente:", paciente);
    // TODO: Implementar lógica de arquivar/reativar usando Server Actions
  };

  // Estado de loading
  if (isExecuting) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex items-center justify-center py-20">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
          <span className="text-muted-foreground ml-2">
            Carregando pacientes...
          </span>
        </div>
      </div>
    );
  }

  // Estado de erro
  if (result?.serverError) {
    return (
      <div className="space-y-8 p-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-20">
          <p className="text-red-600">Erro ao carregar pacientes</p>
          <Button
            onClick={() =>
              buscarPacientes({
                search: termoBusca || undefined,
                status: filtroStatus,
                page: paginaAtual,
                limit: itensPorPagina,
              })
            }
            variant="outline"
          >
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Filtros com botão Novo Paciente */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="text-primary/70 absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={termoBusca}
            onChange={(e) => setTermoBusca(e.target.value)}
            className="border-border focus:border-primary focus:ring-primary/30 bg-card/80 py-3 pl-12 text-base font-medium shadow-sm backdrop-blur-sm transition-all duration-300"
          />
        </div>
        <Select
          value={filtroStatus}
          onValueChange={(value: "all" | "active" | "inactive") =>
            setFiltroStatus(value)
          }
        >
          <SelectTrigger className="border-border focus:border-primary focus:ring-primary/30 bg-card/80 w-full py-3 text-base font-medium shadow-sm backdrop-blur-sm sm:w-[220px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent className="border-border bg-card shadow-lg">
            <SelectItem value="all" className="py-3 text-base font-medium">
              Todos os pacientes
            </SelectItem>
            <SelectItem
              value="active"
              className="text-primary py-3 text-base font-medium"
            >
              📋 Apenas ativos
            </SelectItem>
            <SelectItem
              value="inactive"
              className="text-muted-foreground py-3 text-base font-medium"
            >
              📁 Apenas inativos
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          asChild
          variant="outline"
          className="px-6 py-3 text-base font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <Link href="/patients/new" className="flex items-center gap-3">
            <Plus className="h-5 w-5" />
            Novo Paciente
          </Link>
        </Button>
      </div>

      {/* Tabela sem card */}
      <PatientsTablePure
        pacientes={pacientes}
        onArquivar={handleArquivar}
        termoBusca={termoBusca}
        filtroStatus={filtroStatus}
      />

      {/* Paginação com espaçamento */}
      <div className="flex justify-center pt-4">
        <Pagination paginacao={paginacao} controles={controles} />
      </div>
    </div>
  );
}
