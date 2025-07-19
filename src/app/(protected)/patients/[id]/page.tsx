"use client";

import {
  Archive,
  Calendar,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <div className="space-y-6 p-6">
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
      <div className="space-y-6 p-6">
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
    <div className="space-y-6 p-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{patient.name}</h1>
          <p className="text-muted-foreground">
            Cadastrado em{" "}
            {new Date(patient.createdAt).toLocaleDateString("pt-BR")}
          </p>
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
          <Button variant="outline" size="sm" asChild>
            <Link href={`/patients/${patient.id}/psychological-record`}>
              <FileText className="mr-2 h-4 w-4" />
              Prontuário
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleArchivePatient}>
            <Archive className="mr-2 h-4 w-4" />
            {patient.status === "active" ? "Arquivar" : "Ativar"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Informações Pessoais e Contato */}
        <div>
          <h2 className="mb-3 text-xl font-semibold">
            Informações Pessoais e Contato
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Coluna 1 - Informações Pessoais */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Calendar className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">Data de Nascimento</p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(patient.birthDate).toLocaleDateString("pt-BR")}{" "}
                      ({calculateAge(patient.birthDate)} anos)
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <User className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">Gênero</p>
                    <p className="text-muted-foreground text-sm">
                      {formatGender(patient.gender)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Coluna 2 - Informações de Contato */}
              <div className="space-y-2">
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
                    {patient.email && <Separator />}
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
              </div>
            </div>

            {/* Endereço - Largura completa */}
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

            {/* Observações */}
            {patient.notes && (
              <>
                <Separator />
                <div className="flex items-start gap-3">
                  <FileText className="text-muted-foreground mt-0.5 h-4 w-4" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Observações</p>
                    <p className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">
                      {patient.notes}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Informações de Atendimento */}
        <div>
          <h2 className="mb-3 text-xl font-semibold">
            Histórico de Atendimento
          </h2>
          <div className="space-y-2">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
