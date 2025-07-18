"use client";

import { Plus, Search, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Tipagem do paciente
type Patient = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  lastConsultation: string;
};

// Dados mockados para demonstração
const patientsMock: Patient[] = [
  {
    id: 1,
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "(11) 99999-9999",
    status: "active",
    lastConsultation: "2025-01-10",
  },
  {
    id: 2,
    name: "João Santos",
    email: "joao@email.com",
    phone: "(11) 88888-8888",
    status: "active",
    lastConsultation: "2025-01-08",
  },
  {
    id: 3,
    name: "Ana Costa",
    email: "ana@email.com",
    phone: "(11) 77777-7777",
    status: "inactive",
    lastConsultation: "2024-12-15",
  },
];

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filtrar pacientes
  const filteredPatients = patientsMock.filter((patient) => {
    const matchSearch =
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === "all" || patient.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPatients = patientsMock.length;

  const handleArchivePatient = async (patient: Patient) => {
    console.log("Archive patient:", patient);
    // Implementar lógica de arquivar/ativar paciente
  };

  return (
    <div className="space-y-8">
      {/* ✅ APENAS BOTÃO NOVO PACIENTE - MELHORADO */}
      <div className="flex justify-end">
        <Button asChild className="shadow-sm">
          <Link href="/patients/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Novo Paciente
          </Link>
        </Button>
      </div>

      {/* ✅ FILTROS COM MENU DE SELEÇÃO - MELHORADOS */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 pl-10 focus-visible:ring-blue-500"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 w-full md:w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Apenas ativos</SelectItem>
                <SelectItem value="inactive">Apenas inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ✅ TABELA - MELHORADA */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">
            Lista de Pacientes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-muted/50">
                  <TableHead className="text-muted-foreground h-12 px-6 text-xs font-medium tracking-wider uppercase">
                    Nome
                  </TableHead>
                  <TableHead className="text-muted-foreground h-12 px-6 text-xs font-medium tracking-wider uppercase">
                    Email
                  </TableHead>
                  <TableHead className="text-muted-foreground h-12 px-6 text-xs font-medium tracking-wider uppercase">
                    Telefone
                  </TableHead>
                  <TableHead className="text-muted-foreground h-12 px-6 text-xs font-medium tracking-wider uppercase">
                    Status
                  </TableHead>
                  <TableHead className="text-muted-foreground h-12 px-6 text-xs font-medium tracking-wider uppercase">
                    Última Consulta
                  </TableHead>
                  <TableHead className="text-muted-foreground h-12 px-6 text-right text-xs font-medium tracking-wider uppercase">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
                          <Users className="text-muted-foreground h-5 w-5" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-sm font-medium">
                            {searchTerm || statusFilter !== "all"
                              ? "Nenhum paciente encontrado"
                              : "Nenhum paciente cadastrado"}
                          </h3>
                          <p className="text-muted-foreground text-xs">
                            {searchTerm || statusFilter !== "all"
                              ? "Tente ajustar os filtros de busca"
                              : "Comece adicionando seu primeiro paciente"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPatients.map((patient) => (
                    <TableRow
                      key={patient.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-600">
                            {patient.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{patient.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground px-6 py-4">
                        {patient.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground px-6 py-4">
                        {patient.phone}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge
                          variant={
                            patient.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className={`font-medium ${
                            patient.status === "active"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {patient.status === "active" ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground px-6 py-4">
                        {new Date(patient.lastConsultation).toLocaleDateString(
                          "pt-BR",
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="hover:bg-muted h-8 px-3"
                          >
                            <Link href={`/patients/${patient.id}`}>Ver</Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="hover:bg-muted h-8 px-3"
                          >
                            <Link href={`/patients/${patient.id}/edit`}>
                              Editar
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleArchivePatient(patient)}
                            className="hover:bg-muted h-8 px-3"
                          >
                            {patient.status === "active"
                              ? "Arquivar"
                              : "Ativar"}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ✅ PAGINAÇÃO - MELHORADA */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="text-muted-foreground text-sm">
          Mostrando{" "}
          <span className="font-medium">{filteredPatients.length}</span> de{" "}
          <span className="font-medium">{totalPatients}</span> pacientes
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled className="h-9 px-4">
            Anterior
          </Button>
          <Button variant="outline" size="sm" disabled className="h-9 px-4">
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
