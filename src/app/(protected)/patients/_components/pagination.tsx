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
    <div className="bg-card flex items-center justify-between gap-2 rounded-xl px-3 py-1.5 text-sm shadow-md backdrop-blur-sm transition-all duration-300">
      {/* ✅ INFORMAÇÕES DA PAGINAÇÃO */}
      <div className="text-muted-foreground flex items-center gap-4 text-xs">
        <div className="text-xs font-semibold">
          Total de{" "}
          <span className="text-primary align-middle text-xs font-medium">
            {totalItens}
          </span>{" "}
          paciente(s)
        </div>

        {/* ✅ SELETOR DE ITENS POR PÁGINA */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Itens por página:</span>
          <Select
            value={itensPorPagina.toString()}
            onValueChange={(value) => alterarItensPorPagina(Number(value))}
          >
            <SelectTrigger className="border-border hover:bg-primary/15 hover:border-primary hover:text-primary bg-card flex h-6 w-auto min-w-[45px] items-center justify-center rounded-lg px-3 text-xs font-medium transition-all duration-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-border bg-card w-auto min-w-[45px] p-1 shadow-md">
              <SelectItem value="5" className="rounded px-2 py-1 text-xs">
                5
              </SelectItem>
              <SelectItem value="8" className="rounded px-2 py-1 text-xs">
                8
              </SelectItem>
              <SelectItem value="10" className="rounded px-2 py-1 text-xs">
                10
              </SelectItem>
              <SelectItem value="15" className="rounded px-2 py-1 text-xs">
                15
              </SelectItem>
              <SelectItem value="20" className="rounded px-2 py-1 text-xs">
                20
              </SelectItem>
              <SelectItem value="25" className="rounded px-2 py-1 text-xs">
                25
              </SelectItem>
              <SelectItem value="50" className="rounded px-2 py-1 text-xs">
                50
              </SelectItem>
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
          className="border-border hover:bg-primary/15 hover:border-primary hover:text-primary h-6 w-6 p-0 transition-all duration-300 disabled:opacity-50"
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
          className="border-border hover:bg-primary/15 hover:border-primary hover:text-primary h-6 w-6 p-0 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
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
          className="border-border hover:bg-primary/15 hover:border-primary hover:text-primary h-6 w-6 p-0 transition-all duration-300 disabled:opacity-50"
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
          className="border-border hover:bg-primary/15 hover:border-primary hover:text-primary h-6 w-6 p-0 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Última página</span>
        </Button>
      </div>
    </div>
  );
}
