"use client";

import { Calendar, Clock, Filter } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { StatusConsulta, TipoConsulta, ViewMode } from "./types";

interface FiltersProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  statusFilter: StatusConsulta | "all";
  onStatusFilterChange: (status: StatusConsulta | "all") => void;
  tipoFilter: TipoConsulta | "all";
  onTipoFilterChange: (tipo: TipoConsulta | "all") => void;
}

export function Filters({
  viewMode,
  onViewModeChange,
  statusFilter,
  onStatusFilterChange,
  tipoFilter,
  onTipoFilterChange,
}: FiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
        {/* Filtros de Visualização */}
        <div className="flex items-center gap-2">
          <Calendar className="text-primary h-5 w-5" />
          <Select value={viewMode} onValueChange={onViewModeChange}>
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">📅 Mês</SelectItem>
              <SelectItem value="week">📊 Semana</SelectItem>
              <SelectItem value="day">🗓️ Dia</SelectItem>
              <SelectItem value="list">📋 Lista</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Status */}
        <div className="flex items-center gap-2">
          <Filter className="text-muted-foreground h-4 w-4" />
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="agendada">🕐 Agendada</SelectItem>
              <SelectItem value="confirmada">✅ Confirmada</SelectItem>
              <SelectItem value="realizada">✨ Realizada</SelectItem>
              <SelectItem value="cancelada">❌ Cancelada</SelectItem>
              <SelectItem value="faltou">⏰ Faltou</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtro por Tipo */}
        <Select value={tipoFilter} onValueChange={onTipoFilterChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tipo de Consulta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Tipos</SelectItem>
            <SelectItem value="triage">🩺 Triagem</SelectItem>
            <SelectItem value="initial_assessment">
              🔍 Avaliação Inicial
            </SelectItem>
            <SelectItem value="appointment">Ψ Atendimento</SelectItem>
            <SelectItem value="psychological_evaluation">
              📝 Avaliação Psicológica
            </SelectItem>
            <SelectItem value="feedback">💬 Devolutiva</SelectItem>
            <SelectItem value="in_person">🏢 Presencial</SelectItem>
            <SelectItem value="online">💻 Online</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
