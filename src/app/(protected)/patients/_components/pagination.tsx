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
    <div className="flex items-center justify-between px-2">
      {/* ✅ INFORMAÇÕES DA PAGINAÇÃO */}
      <div className="text-muted-foreground flex items-center gap-6 text-sm">
        <div>
          Mostrando <strong>{inicio}</strong> a <strong>{fim}</strong> de{" "}
          <strong>{totalItens}</strong> paciente(s)
        </div>

        {/* ✅ SELETOR DE ITENS POR PÁGINA */}
        <div className="flex items-center gap-2">
          <span>Itens por página:</span>
          <Select
            value={itensPorPagina.toString()}
            onValueChange={(value) => alterarItensPorPagina(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="8">8</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
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
          className="h-8 w-8 p-0"
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">Primeira página</span>
        </Button>

        {/* Página anterior */}
        <Button
          variant="outline"
          size="sm"
          onClick={paginaAnterior}
          disabled={!temAnterior}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Página anterior</span>
        </Button>

        {/* Indicador de página atual */}
        <div className="flex items-center gap-1 text-sm font-medium">
          <span>Página</span>
          <span className="bg-primary text-primary-foreground rounded px-2 py-1">
            {paginaAtual}
          </span>
          <span>de {totalPaginas}</span>
        </div>

        {/* Próxima página */}
        <Button
          variant="outline"
          size="sm"
          onClick={proximaPagina}
          disabled={!temProxima}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Próxima página</span>
        </Button>

        {/* Última página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => irParaPagina(totalPaginas)}
          disabled={!temProxima}
          className="h-8 w-8 p-0"
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Última página</span>
        </Button>
      </div>
    </div>
  );
}
