"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useEffect, useMemo, useState } from "react";

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

import { PatientsTablePure } from "./_components/patients-table-pure";
import { Patient } from "./_components/types"; // FIX: Importação do tipo Patient

export default function PatientsPage() {
  const [termoBusca, setTermoBusca] = useState("");
  const [debouncedTermoBusca, setDebouncedTermoBusca] = useState(""); // OPTIMIZATION: Estado para o termo de busca com debounce
  const [filtroStatus, setFiltroStatus] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [paginaAtual, setPaginaAtual] = useState(1);

  // Usar useAction para buscar pacientes
  const {
    execute: buscarPacientes,
    result,
    isExecuting,
  } = useAction(getPatients);

  // OPTIMIZATION: Aplicar debounce ao termo de busca para evitar chamadas excessivas à API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTermoBusca(termoBusca);
      setPaginaAtual(1); // UX: Resetar página ao buscar
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [termoBusca]);

  // UX: Resetar a página ao mudar o filtro de status
  const handleFiltroStatusChange = (value: "all" | "active" | "inactive") => {
    setFiltroStatus(value);
    setPaginaAtual(1);
  };

  // Buscar pacientes quando os filtros ou a página mudarem
  useEffect(() => {
    buscarPacientes({
      search: debouncedTermoBusca || undefined,
      status: filtroStatus,
      page: paginaAtual,
      limit: itensPorPagina,
    });
  }, [debouncedTermoBusca, filtroStatus, paginaAtual, buscarPacientes]);

  const paginacaoData = result?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNext: false,
    hasPrev: false,
    limit: itensPorPagina,
  };

  // OPTIMIZATION: Mapear dados usando useMemo para evitar recálculos desnecessários
  const pacientes: Patient[] = useMemo(() => {
    const pacientesData = result?.data?.patients || [];
    return pacientesData.map((p) => ({
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
  }, [result?.data?.patients]);

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
    alterarItensPorPagina: (qtd: number) => {
      setItensPorPagina(qtd);
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
  if (isExecuting && !result.data) {
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
                search: debouncedTermoBusca || undefined,
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
        <Select value={filtroStatus} onValueChange={handleFiltroStatusChange}>
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
        termoBusca={debouncedTermoBusca}
        filtroStatus={filtroStatus}
        paginacao={paginacao}
        controles={controles}
        isLoading={isExecuting}
      />
    </div>
  );
}
