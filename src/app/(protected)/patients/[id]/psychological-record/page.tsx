import { and, desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { db } from "@/db";
import { consultations, patients, users, userSettings } from "@/db/schema";
import { auth } from "@/lib/auth";

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
    const [sessions, professional] = await Promise.all([
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
