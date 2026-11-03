import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { PatientForm } from "@/app/(protected)/patients/new/_components/patient-form";
import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";

export default async function NewPatientPage({
  searchParams,
}: {
  searchParams: Promise<{ patientId?: string }>;
}) {
  const { patientId } = await searchParams;
  let initialPatient;

  if (patientId) {
    let session;

    try {
      session = await auth.api.getSession({
        headers: await headers(),
      });
    } catch (error) {
      console.error("Sessão inválida ao carregar paciente:", error);
      redirect("/authentication/login");
    }

    if (!session?.user?.id) {
      notFound();
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });

    if (!user?.tenant_id) {
      notFound();
    }

    initialPatient = await db.query.patients.findFirst({
      where: (patient, { and, eq }) =>
        and(eq(patient.id, patientId), eq(patient.tenant_id, user.tenant_id!)),
    });

    if (!initialPatient) {
      notFound();
    }
  }

  return (
    <div className="w-full max-w-4xl min-w-0 space-y-3">
      {/* Formulário direto */}
      <PatientForm initialPatient={initialPatient} />
    </div>
  );
}
