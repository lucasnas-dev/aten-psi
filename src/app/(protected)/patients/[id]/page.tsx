"use client";

import {
  Archive,
  ArrowLeft,
  Calendar,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Tipagem do paciente
type Patient = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  birthDate: string;
  gender?: string;
  address?: string;
  status: "active" | "inactive";
  notes?: string;
  createdAt: string;
  lastConsultation?: string;
};

export default function PatientDetailsPage() {
  const params = useParams();
  const patientId = params.id as string;

  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Dados mockados - substituir pela chamada da API
    const mockPatient: Patient = {
      id: Number(patientId),
      name: "Maria Silva",
      email: "maria@email.com",
      phone: "(92) 99999-9999",
      birthDate: "1985-03-15",
      gender: "female",
      address: "Rua das Flores, 123 - São Paulo, SP",
      status: "active",
      notes:
        "Paciente com histórico de ansiedade. Responde bem ao tratamento cognitivo-comportamental.",
      createdAt: "2024-01-15",
      lastConsultation: "2025-01-10",
    };

    // Simular carregamento
    const loadPatient = async () => {
      try {
        setIsLoading(true);
        // Aqui você faria a chamada real para a API
        // const response = await fetch(`/api/patients/${patientId}`);
        // const data = await response.json();

        // Simulando delay da API
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPatient(mockPatient);
      } catch (err) {
        console.error("Erro ao carregar paciente:", err);
        setError("Erro ao carregar dados do paciente");
      } finally {
        setIsLoading(false);
      }
    };

    loadPatient();
  }, [patientId]);

  const handleArchivePatient = async () => {
    // Implementar lógica de arquivar/ativar paciente
    console.log("Archive patient:", patient);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatGender = (gender?: string) => {
    const genderMap = {
      male: "Masculino",
      female: "Feminino",
      other: "Outro",
      not_informed: "Não informado",
    };
    return gender
      ? genderMap[gender as keyof typeof genderMap] || "Não informado"
      : "Não informado";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/patients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
        <div className="flex h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            <p className="text-muted-foreground mt-2 text-sm">
              Carregando dados do paciente...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/patients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        </div>
        <div className="flex h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">
              {error || "Paciente não encontrado"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/patients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {patient.name}
            </h1>
            <p className="text-muted-foreground">
              Cadastrado em{" "}
              {new Date(patient.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={patient.status === "active" ? "default" : "secondary"}
          >
            {patient.status === "active" ? "Ativo" : "Inativo"}
          </Badge>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/patients/${patient.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleArchivePatient}>
            <Archive className="mr-2 h-4 w-4" />
            {patient.status === "active" ? "Arquivar" : "Ativar"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="text-muted-foreground h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Data de Nascimento</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(patient.birthDate).toLocaleDateString("pt-BR")}(
                    {calculateAge(patient.birthDate)} anos)
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-medium">Gênero</p>
                <p className="text-muted-foreground text-sm">
                  {formatGender(patient.gender)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Contato */}
        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {patient.email && (
                <div className="flex items-center gap-3">
                  <Mail className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-muted-foreground text-sm">
                      {patient.email}
                    </p>
                  </div>
                </div>
              )}

              {patient.phone && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <Phone className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Telefone</p>
                      <p className="text-muted-foreground text-sm">
                        {patient.phone}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {patient.address && (
                <>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <MapPin className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">Endereço</p>
                      <p className="text-muted-foreground text-sm">
                        {patient.address}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        {patient.notes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                {patient.notes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Informações de Atendimento */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Histórico de Atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patient.lastConsultation ? (
                <div>
                  <p className="text-sm font-medium">Última Consulta</p>
                  <p className="text-muted-foreground text-sm">
                    {new Date(patient.lastConsultation).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Nenhuma consulta registrada ainda.
                </p>
              )}

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Ver Consultas
                </Button>
                <Button variant="outline" size="sm">
                  Nova Consulta
                </Button>
                <Button variant="outline" size="sm">
                  Ver Prontuário
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
