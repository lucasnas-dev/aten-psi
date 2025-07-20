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

import { Patient } from "./types";
import { Pagination } from "./pagination";

// Função para calcular idade
const calculateAge = (birthDate: string) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

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
  ...props
}: {
  children: React.ReactNode;
  asChild?: boolean;
  onClick?: () => void;
  tooltip: string;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="outline"
        size="sm"
        asChild={asChild}
        onClick={onClick}
        className="h-8 w-8 p-0 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
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

interface PatientsTablePureProps {
  pacientes: Patient[];
  onArquivar: (paciente: Patient) => void;
  termoBusca: string;
  filtroStatus: string;
  paginacao: any;
  controles: any;
}

export function PatientsTablePure({
  pacientes,
  onArquivar,
  termoBusca,
  filtroStatus,
  paginacao,
  controles,
}: PatientsTablePureProps) {
  return (
    <div className="bg-card rounded-md">
      <Table className="bg-card">
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="from-primary/15 to-secondary/15 border-border hover:from-primary/20 hover:to-secondary/20 h-14 bg-gradient-to-r transition-all duration-300">
            <TableHead className="w-[250px] px-6 text-base font-extrabold text-slate-700 dark:text-slate-300">
              Paciente
            </TableHead>
            <TableHead className="w-[120px] px-4 text-base font-extrabold text-slate-700 dark:text-slate-300">
              Idade
            </TableHead>
            <TableHead className="w-[200px] px-4 text-base font-extrabold text-slate-700 dark:text-slate-300">
              Email
            </TableHead>
            <TableHead className="w-[150px] px-4 text-base font-extrabold text-slate-700 dark:text-slate-300">
              Telefone
            </TableHead>
            <TableHead className="w-[120px] px-4 text-base font-extrabold text-slate-700 dark:text-slate-300">
              Cadastro
            </TableHead>
            <TableHead className="w-[80px] px-4 text-base font-extrabold text-slate-700 dark:text-slate-300">
              Status
            </TableHead>
            <TableHead className="w-[120px] px-4 text-center text-base font-extrabold text-slate-700 dark:text-slate-300">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-card">
          {pacientes.length === 0 ? (
            <TableRow className="bg-card">
              <TableCell colSpan={7} className="bg-card py-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  {termoBusca || filtroStatus !== "todos" ? (
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
                  className="group border-border/50 hover:from-primary/8 hover:to-secondary/8 hover:border-primary/30 bg-card h-16 border-b transition-all duration-300 hover:bg-gradient-to-r"
                >
                  <TableCell className="px-6 py-4">
                    <div className="text-foreground group-hover:text-primary text-base font-semibold transition-colors">
                      {paciente.name}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <span className="text-muted-foreground text-sm font-medium">
                      {calculateAge(paciente.birthDate)} anos
                    </span>
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <div className="text-muted-foreground max-w-[180px] truncate text-sm font-medium">
                      {paciente.email || "—"}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <div className="text-muted-foreground text-sm font-medium">
                      {paciente.phone || "—"}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <div className="text-muted-foreground text-sm font-medium">
                      {formatDateString(paciente.createdAt)}
                    </div>
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <Badge
                      variant={
                        paciente.status === "active" ? "default" : "secondary"
                      }
                      className={`px-2 py-1 text-xs font-medium transition-all duration-300 ${
                        paciente.status === "active"
                          ? "from-primary to-secondary text-primary-foreground hover:from-primary/90 hover:to-secondary/90 bg-gradient-to-r shadow-sm"
                          : "bg-muted text-muted-foreground border-border hover:bg-muted/80 border"
                      }`}
                    >
                      {paciente.status === "active"
                        ? "✅ Ativo"
                        : "📁 Arquivado"}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-4 py-4">
                    <TooltipProvider>
                      <div className="flex items-center justify-center gap-2">
                        <ActionButton asChild tooltip="Ver detalhes">
                          <Link href={`/patients/${paciente.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </ActionButton>

                        <ActionButton asChild tooltip="Prontuário">
                          <Link
                            href={`/patients/${paciente.id}/psychological-record`}
                          >
                            <FileText className="h-4 w-4" />
                          </Link>
                        </ActionButton>

                        <ActionButton
                          onClick={() => onArquivar(paciente)}
                          tooltip={
                            paciente.status === "active"
                              ? "Arquivar"
                              : "Reativar"
                          }
                        >
                          {paciente.status === "active" ? (
                            <Archive className="h-4 w-4" />
                          ) : (
                            <ArchiveRestore className="h-4 w-4" />
                          )}
                        </ActionButton>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
              {/* Linha em branco fixa removida */}
              {/* Linha de paginação */}
              <TableRow className="bg-card border-b">
                <TableCell className="px-6 py-2" colSpan={7}>
                  <Pagination paginacao={paginacao} controles={controles} />
                </TableCell>
              </TableRow>
            </>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
