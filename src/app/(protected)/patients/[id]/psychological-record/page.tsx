import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { db } from "@/db";
import {
  consultations,
  issuedDocuments,
  patients,
  users,
  userSettings,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import type { IssuedDocumentSummary } from "@/lib/documents/declaration";

import {
  PsychologicalRecordView,
  type RecordData,
} from "./_components/psychological-record-view";

export default async function PsychologicalRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);
  if (!session?.user?.id) redirect("/authentication/login");
  const { id } = await params;
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });
  if (!user?.tenant_id) notFound();
  try {
    const patient = await db.query.patients.findFirst({
      where: and(eq(patients.id, id), eq(patients.tenant_id, user.tenant_id)),
    });
    if (!patient) notFound();
    const [sessions, professional, documentHistory] = await Promise.all([
      db.query.consultations.findMany({
        where: and(
          eq(consultations.patient_id, id),
          eq(consultations.tenant_id, user.tenant_id)
        ),
        orderBy: [desc(consultations.date), desc(consultations.time)],
      }),
      db.query.userSettings.findFirst({
        where: and(
          eq(userSettings.userId, session.user.id),
          eq(userSettings.tenantId, user.tenant_id)
        ),
      }),
      db.query.issuedDocuments
        .findMany({
          where: and(
            eq(issuedDocuments.tenantId, user.tenant_id),
            eq(issuedDocuments.patientId, id),
            eq(issuedDocuments.type, "declaration")
          ),
          columns: {
            id: true,
            type: true,
            issuedAt: true,
            issuedOn: true,
            purpose: true,
            recipient: true,
            feedbackStatus: true,
          },
          orderBy: [desc(issuedDocuments.issuedAt), desc(issuedDocuments.id)],
        })
        .then((rows) => ({
          documents: rows.map(
            (row): IssuedDocumentSummary => ({
              ...row,
              issuedAt: row.issuedAt.toISOString(),
            })
          ),
          error: undefined as string | undefined,
        }))
        .catch((error: unknown) => {
          console.error(
            "Falha ao carregar documentos emitidos:",
            error instanceof Error ? error.name : "UnknownError"
          );
          return {
            documents: [] as IssuedDocumentSummary[],
            error: "Não foi possível carregar o histórico de documentos.",
          };
        }),
    ]);
    const record: RecordData = {
      patient: {
        id: patient.id,
        name: patient.name,
        socialName: patient.social_name ?? null,
        email: patient.email ?? "",
        phone: patient.phone ?? "",
        birthDate: patient.birth_date,
        gender: patient.gender ?? "",
        cpf: patient.cpf ?? "",
        responsibleCpf: patient.responsible_cpf ?? "",
        responsibleName: patient.responsible_name ?? "",
        emergencyContactName: patient.emergency_contact_name ?? "",
        emergencyContactPhone: patient.emergency_contact_phone ?? "",
        notes: patient.notes ?? "",
        address: [
          patient.address,
          patient.house_number,
          patient.neighborhood,
          patient.city,
          patient.state,
        ]
          .filter(Boolean)
          .join(", "),
      },
      sessions: sessions.map((item, index) => ({
        id: item.id,
        sessionNumber: sessions.length - index,
        date: item.date,
        time: item.time,
        duration: Number(item.duration) || 0,
        type: item.type,
        modality: item.modality,
        attended: item.status === "realizada" || item.status === "concluida",
        status: item.status,
        content: item.notes ?? "",
        signed: false,
      })),
      professional: {
        name: professional?.name ?? session.user.name ?? "",
        crp: professional?.crp ?? "",
      },
      issuedDocuments: documentHistory.documents,
      documentLoadError: documentHistory.error,
    };
    return <PsychologicalRecordView data={record} />;
  } catch (error) {
    console.error("Erro ao carregar prontuário psicológico:", error);
    return (
      <PsychologicalRecordView
        data={null}
        loadError="Não foi possível carregar o prontuário."
      />
    );
  }
}
