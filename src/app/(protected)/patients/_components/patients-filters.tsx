"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Contadores, StatusFilter } from "./types";

interface PatientsFiltersProps {
  termoBusca: string;
  onBuscaChange: (termo: string) => void;
  filtroStatus: StatusFilter;
  onFiltroChange: (filtro: StatusFilter) => void;
  contadores: Contadores;
  totalItens: number;
}

export function PatientsFilters({
  termoBusca,
  onBuscaChange,
  filtroStatus,
  onFiltroChange,
  contadores,
  totalItens,
}: PatientsFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
        {/* ✅ CAMPO DE PESQUISA */}
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={termoBusca}
            onChange={(e) => onBuscaChange(e.target.value)}
            className="w-full pl-9 sm:w-80"
          />
          {termoBusca && (
            <div className="absolute top-2.5 right-2.5">
              <div className="bg-primary text-primary-foreground flex h-4 w-4 items-center justify-center rounded-full text-xs font-medium">
                <span className="text-[10px]">{totalItens}</span>
              </div>
            </div>
          )}
        </div>

        {/* ✅ SELECT DE STATUS */}
        <Select value={filtroStatus} onValueChange={onFiltroChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">
              <div className="flex w-full items-center justify-between">
                <span>Todos</span>
                <span className="text-muted-foreground ml-2 text-xs">
                  {contadores.total}
                </span>
              </div>
            </SelectItem>
            <SelectItem value="ativo">
              <div className="flex w-full items-center justify-between">
                <span>Ativos</span>
                <span className="text-muted-foreground ml-2 text-xs">
                  {contadores.ativos}
                </span>
              </div>
            </SelectItem>
            <SelectItem value="inativo">
              <div className="flex w-full items-center justify-between">
                <span>Arquivados</span>
                <span className="text-muted-foreground ml-2 text-xs">
                  {contadores.inativos}
                </span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
