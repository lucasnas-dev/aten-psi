"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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

// Dados mockados usando a tipagem existente
const pacientesMock: Patient[] = [
  {
    id: "1",
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(92) 99999-9999",
    birthDate: "1990-05-15",
    gender: "Feminino",
    address: "Rua das Flores, 123, Centro, São Paulo - SP",
    notes: "Paciente com histórico de ansiedade",
    status: "active",
    lastConsultation: "2025-01-10",
    createdAt: "2024-12-01",
    updatedAt: "2025-01-10",
  },
  {
    id: "2",
    name: "João Santos",
    email: "joao@email.com",
    phone: "(92) 99999-9999",
    birthDate: "1985-03-22",
    gender: "Masculino",
    address: "Av. Paulista, 456, Bela Vista, São Paulo - SP",
    notes: "Terapia cognitivo-comportamental",
    status: "active",
    lastConsultation: "2025-01-08",
    createdAt: "2024-11-15",
    updatedAt: "2025-01-08",
  },
  {
    id: "3",
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "(92) 99999-9999",
    birthDate: "1992-08-10",
    gender: "Feminino",
    address: "Rua Augusta, 789, Jardins, São Paulo - SP",
    status: "inactive",
    lastConsultation: "2024-12-15",
    createdAt: "2024-10-20",
    updatedAt: "2024-12-15",
  },
  {
    id: "4",
    name: "Pedro Oliveira",
    email: "pedro@email.com",
    phone: "(92) 99999-9999",
    birthDate: "1988-11-30",
    gender: "Masculino",
    address: "Rua dos Pinheiros, 321, Pinheiros, São Paulo - SP",
    notes: "Sessões de terapia familiar",
    status: "active",
    lastConsultation: "2025-01-12",
    createdAt: "2024-12-05",
    updatedAt: "2025-01-12",
  },
  {
    id: "5",
    name: "Carla Mendes",
    email: "carla@email.com",
    phone: "(92) 99999-9999",
    birthDate: "1995-02-18",
    gender: "Feminino",
    address: "Rua da Consolação, 654, Consolação, São Paulo - SP",
    status: "active",
    lastConsultation: "2025-01-09",
    createdAt: "2024-11-28",
    updatedAt: "2025-01-09",
  },
];

export default function PatientsPage() {
  const [termoBusca, setTermoBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Filtrar pacientes usando a lógica existente
  const pacientesFiltrados = pacientesMock.filter((paciente) => {
    const matchBusca =
      paciente.name.toLowerCase().includes(termoBusca.toLowerCase()) ||
      paciente.email.toLowerCase().includes(termoBusca.toLowerCase()) ||
      paciente.phone.includes(termoBusca);

    const matchStatus =
      filtroStatus === "todos" ||
      (filtroStatus === "ativo" && paciente.status === "active") ||
      (filtroStatus === "inativo" && paciente.status === "inactive");

    return matchBusca && matchStatus;
  });

  // Paginação usando a estrutura existente
  const totalPaginas = Math.ceil(pacientesFiltrados.length / itensPorPagina);
  const inicio = (paginaAtual - 1) * itensPorPagina + 1;
  const fim = Math.min(paginaAtual * itensPorPagina, pacientesFiltrados.length);

  const paginacao = {
    totalItens: pacientesFiltrados.length,
    totalPaginas,
    paginaAtual,
    inicio,
    fim,
    temProxima: paginaAtual < totalPaginas,
    temAnterior: paginaAtual > 1,
    itensPorPagina,
  };

  const controles = {
    irParaPagina: setPaginaAtual,
    proximaPagina: () =>
      setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas)),
    paginaAnterior: () => setPaginaAtual((prev) => Math.max(prev - 1, 1)),
    alterarItensPorPagina: () => {
      setPaginaAtual(1);
      // Implementar lógica de itens por página se necessário
    },
  };

  const pacientesPagina = pacientesFiltrados.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina,
  );

  const handleArquivar = (paciente: Patient) => {
    console.log("Arquivar/Reativar paciente:", paciente);
    // Implementar lógica de arquivar/reativar usando Server Actions
  };

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
        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
          <SelectTrigger className="border-border focus:border-primary focus:ring-primary/30 bg-card/80 w-full py-3 text-base font-medium shadow-sm backdrop-blur-sm sm:w-[220px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent className="border-border bg-card shadow-lg">
            <SelectItem value="todos" className="py-3 text-base font-medium">
              Todos os pacientes
            </SelectItem>
            <SelectItem
              value="ativo"
              className="text-primary py-3 text-base font-medium"
            >
              📋 Apenas ativos
            </SelectItem>
            <SelectItem
              value="inativo"
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
        pacientes={pacientesPagina}
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
