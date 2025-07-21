"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
  paginacao: {
    totalItens: number;
    totalPaginas: number;
    paginaAtual: number;
    inicio: number;
    fim: number;
    temProxima: boolean;
    temAnterior: boolean;
    itensPorPagina: number;
  };
  controles: {
    irParaPagina: (pagina: number) => void;
    proximaPagina: () => void;
    paginaAnterior: () => void;
    alterarItensPorPagina: (qtd: number) => void;
  };
}

export function Pagination({ paginacao, controles }: PaginationProps) {
  const {
    totalItens,
    totalPaginas,
    paginaAtual,
    inicio,
    fim,
    temProxima,
    temAnterior,
    itensPorPagina,
  } = paginacao;

  const { irParaPagina, proximaPagina, paginaAnterior, alterarItensPorPagina } =
    controles;

  // ✅ NÃO MOSTRAR SE TIVER POUCOS ITENS
  if (totalItens <= 5) {
    return null;
  }

  return (
    <div className="bg-card flex items-center justify-between rounded-xl px-3 py-2 shadow-md backdrop-blur-sm transition-all duration-300 text-sm gap-2">
      {/* ✅ INFORMAÇÕES DA PAGINAÇÃO */}
      <div className="text-muted-foreground flex items-center gap-4 text-xs">
        <div className="font-semibold text-xs">
          Total de <span className="text-primary font-medium text-sm align-middle">{totalItens}</span> paciente(s)
        </div>

        {/* ✅ SELETOR DE ITENS POR PÁGINA */}
        <div className="flex items-center gap-2">
          <span className="font-medium">Itens por página:</span>
          <Select
            value={itensPorPagina.toString()}
            onValueChange={(value) => alterarItensPorPagina(Number(value))}
          >
            <SelectTrigger className="border-border focus:border-primary focus:ring-primary/30 bg-card h-7 w-[72px] px-2 text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-border bg-card shadow-md text-xs min-w-[72px]">
              <SelectItem value="5" className="text-xs">5</SelectItem>
              <SelectItem value="8" className="text-xs">8</SelectItem>
              <SelectItem value="10" className="text-xs">10</SelectItem>
              <SelectItem value="15" className="text-xs">15</SelectItem>
              <SelectItem value="20" className="text-xs">20</SelectItem>
              <SelectItem value="25" className="text-xs">25</SelectItem>
              <SelectItem value="50" className="text-xs">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ✅ CONTROLES DE NAVEGAÇÃO */}
      <div className="flex items-center gap-2">
        {/* Primeira página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => irParaPagina(1)}
          disabled={!temAnterior}
          className="border-border hover:bg-primary/15 hover:border-primary hover:text-primary h-7 w-7 p-0 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronsLeft className="h-5 w-5" />
          <span className="sr-only">Primeira página</span>
        </Button>

        {/* Página anterior */}
        <Button
          variant="outline"
          size="sm"
          onClick={paginaAnterior}
          disabled={!temAnterior}
          className="border-border hover:bg-primary/15 hover:border-primary hover:text-primary h-7 w-7 p-0 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Página anterior</span>
        </Button>

        {/* Indicador de página atual */}
        <div className="mx-2 flex items-center gap-2 text-xs font-semibold">
          <span className="text-muted-foreground">Página</span>
          <span className="from-primary to-secondary text-primary-foreground rounded-xl bg-gradient-to-r px-2 py-1 text-xs font-bold shadow-md">
            {paginaAtual}
          </span>
          <span className="text-muted-foreground">de</span>
          <span className="text-secondary text-xs font-bold">
            {totalPaginas}
          </span>
        </div>

        {/* Próxima página */}
        <Button
          variant="outline"
          size="sm"
          onClick={proximaPagina}
          disabled={!temProxima}
          className="border-border hover:bg-primary/15 hover:border-primary hover:text-primary h-7 w-7 p-0 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Próxima página</span>
        </Button>

        {/* Última página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => irParaPagina(totalPaginas)}
          disabled={!temProxima}
          className="border-border hover:bg-primary/15 hover:border-primary hover:text-primary h-7 w-7 p-0 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronsRight className="h-5 w-5" />
          <span className="sr-only">Última página</span>
        </Button>
      </div>
    </div>
  );
}
