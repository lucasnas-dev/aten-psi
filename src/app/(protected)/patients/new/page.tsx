import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

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
    const session = await auth.api.getSession({
      headers: await headers(),
    });

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
    <div className="space-y-2 p-3">
      {/* Formulário direto */}
      <PatientForm initialPatient={initialPatient} />
    </div>
  );
}
