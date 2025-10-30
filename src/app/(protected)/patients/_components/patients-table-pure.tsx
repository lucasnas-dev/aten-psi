"use client";

import {
  Archive,
  ArchiveRestore,
  Eye,
  FileText,
  Plus,
  Search,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDate } from "@/lib/utils";

import { NewPatientConsultation } from "./new-patient-consultation";
import { Pagination } from "./pagination";
import { Patient } from "./types";

// Função para calcular idade
function calculateAge(birthDate: string) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

// Função para formatar data
const formatDateString = (dateString: string) => {
  return formatDate(new Date(dateString));
};

// ✅ COMPONENTE WRAPPER REUTILIZÁVEL
const ActionButton = ({
  children,
  asChild,
  onClick,
  tooltip,
  disabled,
  ...props
}: {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
  tooltip: string;
  disabled?: boolean;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        asChild={asChild}
        onClick={onClick}
        disabled={disabled}
        className="h-8 w-8 p-0 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      >
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent
      side="top"
      className="bg-card border-border text-card-foreground px-2 py-1 font-medium shadow-lg"
    >
      <span className="text-sm">{tooltip}</span>
    </TooltipContent>
  </Tooltip>
);

interface PaginacaoProps {
  totalItens: number;
  totalPaginas: number;
  paginaAtual: number;
  inicio: number;
  fim: number;
  temProxima: boolean;
  temAnterior: boolean;
  itensPorPagina: number;
}

interface ControlesPaginacaoProps {
  irParaPagina: (pagina: number) => void;
  proximaPagina: () => void;
  paginaAnterior: () => void;
  alterarItensPorPagina: (qtd: number) => void;
}

interface PatientsTablePureProps {
  pacientes: Patient[];
  onArquivar: (paciente: Patient) => void;
  termoBusca: string;
  filtroStatus: string;
  paginacao: PaginacaoProps;
  controles: ControlesPaginacaoProps;
  isLoading: boolean;
  isArchiving?: boolean;
}

export function PatientsTablePure({
  pacientes,
  onArquivar,
  termoBusca,
  filtroStatus,
  paginacao,
  controles,
  isLoading,
  isArchiving = false,
}: PatientsTablePureProps) {
  return (
    <div className="bg-card rounded-md">
      <Table className="bg-card border-collapse">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="border-b">
            <TableHead className="text-muted-foreground w-[250px] px-6 py-3 text-xs font-semibold tracking-wider uppercase">
              Paciente
            </TableHead>
            <TableHead className="text-muted-foreground w-[120px] px-4 py-3 text-xs font-semibold tracking-wider uppercase">
              Idade
            </TableHead>
            <TableHead className="text-muted-foreground w-[200px] px-4 py-3 text-xs font-semibold tracking-wider uppercase">
              Email
            </TableHead>
            <TableHead className="text-muted-foreground w-[150px] px-4 py-3 text-xs font-semibold tracking-wider uppercase">
              Telefone
            </TableHead>
            <TableHead className="text-muted-foreground w-[120px] px-4 py-3 text-xs font-semibold tracking-wider uppercase">
              Cadastro
            </TableHead>
            <TableHead className="text-muted-foreground w-[80px] px-4 py-3 text-xs font-semibold tracking-wider uppercase">
              Status
            </TableHead>
            <TableHead className="text-muted-foreground w-[120px] px-4 py-3 text-center text-xs font-semibold tracking-wider uppercase">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-card">
          {isLoading ? (
            // Skeleton loader
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="h-13.5 border-b">
                <TableCell className="px-6">
                  <Skeleton className="h-5 w-32" />
                </TableCell>
                <TableCell className="px-4">
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell className="px-4">
                  <Skeleton className="h-5 w-40" />
                </TableCell>
                <TableCell className="px-4">
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell className="px-4">
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell className="px-4">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell className="px-4">
                  <div className="flex items-center justify-center gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : pacientes.length === 0 ? (
            <TableRow className="bg-card">
              <TableCell colSpan={7} className="bg-card py-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  {termoBusca || filtroStatus !== "all" ? (
                    <div className="text-muted-foreground">
                      <Search className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p className="text-lg font-medium">
                        Nenhum paciente encontrado
                      </p>
                      <p className="text-sm">
                        Tente ajustar os filtros ou termos de busca
                      </p>
                    </div>
                  ) : (
                    <div className="text-muted-foreground">
                      <Plus className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p className="text-lg font-medium">
                        Nenhum paciente cadastrado
                      </p>
                      <p className="text-sm">
                        Comece cadastrando seu primeiro paciente
                      </p>
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <>
              {pacientes.map((paciente) => (
                <TableRow
                  key={paciente.id}
                  className="group border-border/50 hover:from-primary/8 hover:to-secondary/8 hover:border-primary/30 bg-card h-13.5 border-b transition-all duration-300 hover:bg-gradient-to-r"
                >
                  <TableCell className="px-6 py-3">
                    <div
                      className="text-foreground group-hover:text-primary font-medium transition-colors"
                      style={{ fontSize: "0.9375rem" }}
                    >
                      {paciente.name}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <span
                      className="text-muted-foreground font-normal"
                      style={{ fontSize: "0.9375rem" }}
                    >
                      {calculateAge(paciente.birthDate)} anos
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div
                      className="text-muted-foreground max-w-[180px] truncate font-normal"
                      style={{ fontSize: "0.9375rem" }}
                    >
                      {paciente.email || "—"}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div
                      className="text-muted-foreground font-normal"
                      style={{ fontSize: "0.9375rem" }}
                    >
                      {paciente.phone || "—"}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-3">
                    <div
                      className="text-muted-foreground font-normal"
                      style={{ fontSize: "0.9375rem" }}
                    >
                      {formatDateString(paciente.createdAt)}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-2">
                    <Badge
                      variant="outline"
                      className={
                        paciente.status === "active"
                          ? "border-green-600 text-green-600"
                          : "border-orange-500 text-orange-500"
                      }
                    >
                      {paciente.status === "active" ? "Ativo" : "Arquivado"}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-2">
                    <TooltipProvider>
                      <div className="flex items-center justify-center gap-2">
                        <ActionButton asChild tooltip="Ver detalhes">
                          <Link href={`/patients/${paciente.id}`}>
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Link>
                        </ActionButton>

                        <ActionButton asChild tooltip="Prontuário">
                          <Link
                            href={`/patients/${paciente.id}/psychological-record`}
                          >
                            <FileText className="h-4 w-4 text-green-600" />
                          </Link>
                        </ActionButton>

                        <ActionButton
                          onClick={() => onArquivar(paciente)}
                          disabled={isArchiving}
                          tooltip={
                            isArchiving
                              ? "Processando..."
                              : paciente.status === "active"
                                ? "Arquivar"
                                : "Reativar"
                          }
                        >
                          {isArchiving ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                          ) : paciente.status === "active" ? (
                            <Archive className="h-4 w-4 text-red-600" />
                          ) : (
                            <ArchiveRestore className="h-4 w-4 text-orange-600" />
                          )}
                        </ActionButton>

                        {/* Botão Nova Consulta */}
                        <NewPatientConsultation patient={paciente} />
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
              {/* Linha em branco fixa removida */}
              {/* Paginação fora da tabela */}
            </>
          )}
        </TableBody>
      </Table>
      {/* Linha separadora consistente */}
      <div className="border-border/30 mt-0 mb-4 border-t"></div>
      {/* Paginação fora da tabela */}
      <Pagination paginacao={paginacao} controles={controles} />
    </div>
  );
}
