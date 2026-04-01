import { eq } from "drizzle-orm";
import {
  Calendar,
  Edit,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { patients, users } from "@/db/schema";
import { auth } from "@/lib/auth";

import { ArchiveButton } from "./_components/archive-button";
import { BackButton } from "./_components/back-button";

// Tipagem do paciente baseada no schema do banco
type Patient = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  birth_date: string;
  gender?: string | null;
  address?: string | null;
  house_number?: string | null;
  city?: string | null;
  state?: string | null;
  neighborhood?: string | null;
  cep?: string | null;
  cpf?: string | null;
  responsible_cpf?: string | null;
  status: string;
  notes?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  tenant_id: string;
};

export default async function PatientDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    notFound();
  }

  // Buscar o usuário no banco para obter o tenant_id
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user?.tenant_id) {
    notFound();
  }

  // Buscar o paciente diretamente no banco
  const patient = await db
    .select()
    .from(patients)
    .where(eq(patients.id, params.id))
    .then((rows) => rows[0]);

  // Se o paciente não existe ou não pertence ao tenant do usuário
  if (!patient || patient.tenant_id !== user.tenant_id) {
    notFound();
  }

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

  const formatGender = (gender?: string | null) => {
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

  const formatAddress = (patient: Patient) => {
    const parts = [
      patient.address,
      patient.house_number,
      patient.neighborhood,
      patient.city,
      patient.state,
    ].filter(Boolean);
    return parts.join(", ") || null;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div>
            <div className="mb-1 flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {patient.name}
              </h1>
              <Badge
                variant={patient.status === "active" ? "default" : "secondary"}
                className={
                  patient.status === "active"
                    ? "badge-status badge-status--active"
                    : "badge-status badge-status--muted"
                }
              >
                {patient.status === "active" ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Cadastrado em{" "}
              {new Date(patient.created_at || new Date()).toLocaleDateString(
                "pt-BR"
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BackButton />
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
          <ArchiveButton
            patientId={patient.id}
            currentStatus={patient.status}
          />
        </div>
      </div>

      <div className="space-y-6">
        {/* Informações Pessoais e Contato */}
        <div>
          <h2 className="mb-3 text-lg sm:text-xl font-semibold">
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
                      {new Date(patient.birth_date).toLocaleDateString("pt-BR")}{" "}
                      ({calculateAge(patient.birth_date)} anos)
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
            {formatAddress(patient) && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <MapPin className="text-muted-foreground h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">Endereço</p>
                    <p className="text-muted-foreground text-sm">
                      {formatAddress(patient)}
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

        {/* TODO: Implementar histórico de consultas */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <p className="text-sm font-medium text-red-700">
              🚨 IMPLEMENTAR HISTÓRICO DE CONSULTAS!!!!!!
            </p>
          </div>
          <p className="mt-2 text-sm text-red-600">
            Lembrete: Criar tabela de consultas no banco e implementar
            funcionalidade de histórico
          </p>
        </div>
      </div>
    </div>
  );
}
