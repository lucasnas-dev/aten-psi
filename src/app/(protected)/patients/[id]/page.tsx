import { and, desc, eq } from "drizzle-orm";
import {
  AlertCircle,
  Building2,
  Calendar,
  CreditCard,
  Edit,
  FileText,
  Flag,
  House,
  Mail,
  MapPin,
  MapPinHouse,
  MapPinned,
  Phone,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { db } from "@/db";
import { consultations, patients, users } from "@/db/schema";
import { auth } from "@/lib/auth";

import { PatientStatusBadge } from "../_components/patient-status-badge";
import { ArchiveButton } from "./_components/archive-button";
import { BackButton } from "./_components/back-button";

export default async function PatientDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  let session;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    console.error("Sessão inválida ao carregar detalhes do paciente:", error);
    redirect("/authentication/login");
  }

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

  const consultationHistory = await db
    .select()
    .from(consultations)
    .where(
      and(
        eq(consultations.patient_id, patient.id),
        eq(consultations.tenant_id, user.tenant_id)
      )
    )
    .orderBy(desc(consultations.date), desc(consultations.time));

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

  const age = calculateAge(patient.birth_date);
  const isFilled = (value?: string | null) => Boolean(value?.trim());
  const requiredProfileFields: Array<string | null | undefined> = [
    patient.name,
    patient.email,
    patient.phone,
    patient.birth_date,
    patient.cpf,
    patient.cep,
    patient.address,
    patient.house_number,
    patient.neighborhood,
    patient.city,
    patient.state,
  ];

  if (age < 18) {
    requiredProfileFields.push(patient.responsible_cpf);
  }

  const completedProfileFields = requiredProfileFields.filter(isFilled).length;
  const profileCompletion = Math.round(
    (completedProfileFields / requiredProfileFields.length) * 100
  );
  const hasIncompleteProfile = profileCompletion < 100;
  const consultationTypeLabels: Record<string, string> = {
    triagem: "Triagem",
    avaliacao_inicial: "Avaliação Inicial",
    atendimento: "Psicoterapia",
    avaliacao_psicologica: "Avaliação Psicológica",
    devolutiva: "Devolutiva",
  };
  const consultationModalityLabels: Record<string, string> = {
    presencial: "Presencial",
    online: "Online",
    telefone: "Telefone",
  };
  const consultationStatusLabels: Record<string, string> = {
    agendada: "Agendada",
    confirmada: "Confirmada",
    em_andamento: "Em andamento",
    concluida: "Concluída",
    realizada: "Realizada",
    cancelada: "Cancelada",
    faltou: "Faltou",
  };
  const attendedConsultationStatuses = ["concluida", "realizada"];
  const getConsultationStatusClass = (status: string) => {
    if (attendedConsultationStatuses.includes(status)) {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (status === "cancelada" || status === "faltou") {
      return "border-red-200 bg-red-50 text-red-700";
    }

    return "border-blue-200 bg-blue-50 text-blue-700";
  };
  const formatConsultationDate = (date: string) => {
    const [year, month, day] = date.split("-");
    return year && month && day ? `${day}-${month}-${year}` : date;
  };

  return (
    <div className="w-full max-w-5xl min-w-0 space-y-3">
      {/* Header com navegação */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <h1 className="text-lg font-semibold break-words">
                {patient.name}
              </h1>
              <PatientStatusBadge status={patient.status} />
            </div>
            <p className="text-muted-foreground text-xs">
              Cadastrado em{" "}
              {new Date(patient.created_at || new Date()).toLocaleDateString(
                "pt-BR"
              )}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <BackButton />
          <Button variant="outline" size="sm" asChild>
            <Link href={`/patients/new?patientId=${patient.id}`}>
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

      <div className="space-y-3">
        {hasIncompleteProfile && (
          <div
            className="flex flex-col gap-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950 sm:flex-row sm:items-center sm:justify-between"
            role="status"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div className="space-y-1">
                <p className="text-sm font-semibold">Cadastro incompleto</p>
                <p className="text-sm text-amber-800">
                  Faltam informações importantes neste prontuário para manter o
                  cadastro completo.
                </p>
                <p className="text-xs font-medium text-amber-700">
                  Perfil {profileCompletion}% completo
                </p>
              </div>
            </div>
            <Button
              asChild
              size="sm"
              className="w-full shrink-0 bg-amber-600 text-white hover:bg-amber-700 sm:w-auto"
            >
              <Link href={`/patients/new?patientId=${patient.id}`}>
                Completar Cadastro
              </Link>
            </Button>
          </div>
        )}

        {/* Informações Pessoais e Contato */}
        <div>
          <h2 className="mb-3 text-base font-semibold">
            Informações Pessoais e Contato
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
                {isFilled(patient.cpf) && (
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">CPF</p>
                      <p className="text-muted-foreground text-sm">
                        {patient.cpf}
                      </p>
                    </div>
                  </div>
                )}
                {isFilled(patient.responsible_cpf) && (
                  <div className="flex items-center gap-3">
                    <CreditCard className="text-muted-foreground h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">CPF do responsável</p>
                      <p className="text-muted-foreground text-sm">
                        {patient.responsible_cpf}
                      </p>
                    </div>
                  </div>
                )}
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
            {[
              patient.cep,
              patient.address,
              patient.house_number,
              patient.neighborhood,
              patient.city,
              patient.state,
            ].some(isFilled) && (
              <>
                <Separator />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {isFilled(patient.cep) && (
                    <div className="flex items-center gap-3">
                      <MapPinned className="text-muted-foreground h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">CEP</p>
                        <p className="text-muted-foreground text-sm">
                          {patient.cep}
                        </p>
                      </div>
                    </div>
                  )}
                  {isFilled(patient.address) && (
                    <div className="flex items-center gap-3">
                      <MapPin className="text-muted-foreground h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Endereço</p>
                        <p className="text-muted-foreground text-sm">
                          {patient.address}
                        </p>
                      </div>
                    </div>
                  )}
                  {isFilled(patient.house_number) && (
                    <div className="flex items-center gap-3">
                      <House className="text-muted-foreground h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Número</p>
                        <p className="text-muted-foreground text-sm">
                          {patient.house_number}
                        </p>
                      </div>
                    </div>
                  )}
                  {isFilled(patient.neighborhood) && (
                    <div className="flex items-center gap-3">
                      <MapPinHouse className="text-muted-foreground h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Bairro</p>
                        <p className="text-muted-foreground text-sm">
                          {patient.neighborhood}
                        </p>
                      </div>
                    </div>
                  )}
                  {isFilled(patient.city) && (
                    <div className="flex items-center gap-3">
                      <Building2 className="text-muted-foreground h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Cidade</p>
                        <p className="text-muted-foreground text-sm">
                          {patient.city}
                        </p>
                      </div>
                    </div>
                  )}
                  {isFilled(patient.state) && (
                    <div className="flex items-center gap-3">
                      <Flag className="text-muted-foreground h-4 w-4" />
                      <div>
                        <p className="text-sm font-medium">Estado</p>
                        <p className="text-muted-foreground text-sm">
                          {patient.state}
                        </p>
                      </div>
                    </div>
                  )}
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

        <div className="max-w-3xl">
          <h2 className="mb-3 text-base font-semibold">
            Histórico de consultas
          </h2>
          {consultationHistory.length === 0 ? (
            <div className="text-muted-foreground rounded-lg border p-4 text-sm">
              Nenhuma consulta registrada para este paciente.
            </div>
          ) : (
            <div className="flex flex-col">
              {consultationHistory.map((consultation) => (
                <div
                  key={consultation.id}
                  className="border-b border-slate-100 py-2 last:border-b-0"
                >
                  <div className="flex items-center justify-start gap-2">
                    <p className="text-muted-foreground text-xs">
                      {formatConsultationDate(consultation.date)} às{" "}
                      {consultation.time}
                    </p>
                    <span
                      className={`inline-flex w-fit shrink-0 rounded-md border px-1.5 py-0 text-[11px] font-medium ${getConsultationStatusClass(consultation.status)}`}
                    >
                      {consultationStatusLabels[consultation.status] ||
                        consultation.status}
                    </span>
                  </div>
                  <p className="text-foreground mt-0.5 text-sm font-medium">
                    {consultationTypeLabels[consultation.type] ||
                      consultation.type}
                  </p>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 gap-y-0 text-xs text-slate-500">
                    <span>
                      Modalidade:{" "}
                      {consultationModalityLabels[consultation.modality] ||
                        consultation.modality}
                    </span>
                    <span>Duração: {consultation.duration} min</span>
                    {consultation.value && (
                      <span>Valor: R$ {consultation.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
