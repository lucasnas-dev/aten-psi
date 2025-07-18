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
import { calcularIdade, formatarData } from "@/lib/utils";
import { Paciente } from "@/types/paciente";

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
        variant="default"
        size="sm"
        asChild={asChild}
        onClick={onClick}
        className="[&]:!bg-primary [&]:!text-primary-foreground hover:[&]:!bg-primary/90 h-8 w-8 p-0 transition-all duration-200 hover:scale-105"
        {...props}
      >
        {children}
      </Button>
    </TooltipTrigger>
    <TooltipContent side="top" className="font-medium">
      <p>{tooltip}</p>
    </TooltipContent>
  </Tooltip>
);

interface PacientesTablePuraProps {
  pacientes: Paciente[];
  onArquivar: (paciente: Paciente) => void;
  termoBusca: string;
  filtroStatus: string;
}

export function PacientesTablePura({
  pacientes,
  onArquivar,
  termoBusca,
  filtroStatus,
}: PacientesTablePuraProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 z-10">
          <TableRow className="bg-muted/50">
            <TableHead className="w-[250px]">Paciente</TableHead>
            <TableHead className="w-[120px]">Idade</TableHead>
            <TableHead className="w-[200px]">Email</TableHead>
            <TableHead className="w-[150px]">Telefone</TableHead>
            <TableHead className="w-[120px]">Cadastro</TableHead>
            <TableHead className="w-[80px]">Status</TableHead>
            <TableHead className="w-[120px] text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pacientes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-12 text-center">
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
            pacientes.map((paciente) => (
              <TableRow
                key={paciente.id}
                className="group border-border/50 hover:bg-muted/30 h-12 border-b transition-colors"
              >
                <TableCell className="py-2">
                  <div className="font-medium">{paciente.nome}</div>
                </TableCell>

                <TableCell className="py-2">
                  {calcularIdade(paciente.dataNascimento)} anos
                </TableCell>

                <TableCell className="py-2">
                  <div className="text-muted-foreground max-w-[180px] truncate text-sm">
                    {paciente.email || "—"}
                  </div>
                </TableCell>

                <TableCell className="py-2">
                  <div className="text-muted-foreground text-sm">
                    {paciente.telefone || "—"}
                  </div>
                </TableCell>

                <TableCell className="py-2">
                  <div className="text-muted-foreground text-sm">
                    {formatarData(paciente.createdAt)}
                  </div>
                </TableCell>

                <TableCell className="py-2">
                  <Badge
                    variant={paciente.ativo ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {paciente.ativo ? "Ativo" : "Arquivado"}
                  </Badge>
                </TableCell>

                <TableCell className="py-2">
                  <TooltipProvider>
                    <div className="flex items-center justify-center gap-1">
                      <ActionButton
                        asChild
                        tooltip="Visualizar detalhes do paciente"
                      >
                        <Link href={`/pacientes/${paciente.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </ActionButton>

                      <ActionButton
                        asChild
                        tooltip="Acessar prontuário psicológico"
                      >
                        <Link href={`/pacientes/${paciente.id}/prontuario`}>
                          <FileText className="h-4 w-4" />
                        </Link>
                      </ActionButton>

                      <ActionButton
                        onClick={() => onArquivar(paciente)}
                        tooltip={
                          paciente.ativo
                            ? "Arquivar paciente"
                            : "Reativar paciente"
                        }
                      >
                        {paciente.ativo ? (
                          <Archive className="h-4 w-4" />
                        ) : (
                          <ArchiveRestore className="h-4 w-4" />
                        )}
                      </ActionButton>
                    </div>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
