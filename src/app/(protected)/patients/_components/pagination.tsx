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
    <div className="bg-card border-border flex items-center justify-between rounded-xl border px-6 py-6 shadow-lg backdrop-blur-sm transition-all duration-300">
      {/* ✅ INFORMAÇÕES DA PAGINAÇÃO */}
      <div className="text-muted-foreground flex items-center gap-8 text-base">
        <div className="font-semibold">
          Mostrando <strong className="text-primary text-lg">{inicio}</strong> a{" "}
          <strong className="text-primary text-lg">{fim}</strong> de{" "}
          <strong className="text-secondary text-lg">{totalItens}</strong>{" "}
          paciente(s)
        </div>

        {/* ✅ SELETOR DE ITENS POR PÁGINA */}
        <div className="flex items-center gap-3">
          <span className="font-medium">Itens por página:</span>
          <Select
            value={itensPorPagina.toString()}
            onValueChange={(value) => alterarItensPorPagina(Number(value))}
          >
            <SelectTrigger className="border-border focus:border-primary focus:ring-primary/30 bg-card h-10 w-[80px] text-base font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-border bg-card shadow-lg">
              <SelectItem value="5" className="text-base">
                5
              </SelectItem>
              <SelectItem value="8" className="text-base">
                8
              </SelectItem>
              <SelectItem value="10" className="text-base">
                10
              </SelectItem>
              <SelectItem value="15" className="text-base">
                15
              </SelectItem>
              <SelectItem value="20" className="text-base">
                20
              </SelectItem>
              <SelectItem value="25" className="text-base">
                25
              </SelectItem>
              <SelectItem value="50" className="text-base">
                50
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ✅ CONTROLES DE NAVEGAÇÃO */}
      <div className="flex items-center gap-3">
        {/* Primeira página */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => irParaPagina(1)}
          disabled={!temAnterior}
          className="border-border hover:bg-primary/15 hover:border-primary hover:text-primary h-10 w-10 p-0 transition-all duration-300 disabled:opacity-50"
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
          className="border-border hover:bg-primary/15 hover:border-primary hover:text-primary h-10 w-10 p-0 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Página anterior</span>
        </Button>

        {/* Indicador de página atual */}
        <div className="mx-4 flex items-center gap-3 text-base font-semibold">
          <span className="text-muted-foreground">Página</span>
          <span className="from-primary to-secondary text-primary-foreground rounded-xl bg-gradient-to-r px-4 py-2 text-lg font-bold shadow-md">
            {paginaAtual}
          </span>
          <span className="text-muted-foreground">de</span>
          <span className="text-secondary text-lg font-bold">
            {totalPaginas}
          </span>
        </div>

        {/* Próxima página */}
        <Button
          variant="outline"
          size="sm"
          onClick={proximaPagina}
          disabled={!temProxima}
          className="border-border hover:bg-primary/15 hover:border-primary hover:text-primary h-10 w-10 p-0 transition-all duration-300 disabled:opacity-50"
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
          className="border-border hover:bg-primary/15 hover:border-primary hover:text-primary h-10 w-10 p-0 transition-all duration-300 disabled:opacity-50"
        >
          <ChevronsRight className="h-5 w-5" />
          <span className="sr-only">Última página</span>
        </Button>
      </div>
    </div>
  );
}
