import { and, eq } from "drizzle-orm";

import type { db } from "@/db";
import { issuedDocuments, patients, userSettings } from "@/db/schema";
import {
  declarationIssueDate,
  type DeclarationSnapshot,
  type IssuedDocumentSummary,
  type IssueDeclarationInput,
} from "@/lib/documents/declaration";

type Store = Pick<typeof db, "query" | "insert">;
type Professional = { id: string; tenantId: string; name: string };

const summary = (
  row: typeof issuedDocuments.$inferSelect
): IssuedDocumentSummary => ({
  id: row.id,
  type: row.type,
  issuedAt: row.issuedAt.toISOString(),
  issuedOn: row.issuedOn,
  purpose: row.purpose,
  recipient: row.recipient,
  feedbackStatus: row.feedbackStatus,
});

export async function issueDeclarationForPatient(
  store: Store,
  input: IssueDeclarationInput,
  professional: Professional
) {
  const patient = await store.query.patients.findFirst({
    where: and(
      eq(patients.id, input.patientId),
      eq(patients.tenant_id, professional.tenantId)
    ),
  });
  if (!patient) {
    return { success: false, error: "Paciente não encontrado." } as const;
  }
  const patientName = patient.social_name?.trim() || patient.name.trim();
  if (!patientName) {
    return {
      success: false,
      error:
        "Preencha o nome da pessoa atendida no cadastro antes de emitir documentos.",
    } as const;
  }

  const settings = await store.query.userSettings.findFirst({
    where: and(
      eq(userSettings.userId, professional.id),
      eq(userSettings.tenantId, professional.tenantId)
    ),
  });
  const professionalName = settings?.name?.trim() || professional.name.trim();
  const professionalCrp = settings?.crp?.trim();
  if (!professionalName || !professionalCrp) {
    return {
      success: false,
      error:
        "Preencha nome e CRP nas Configurações antes de emitir documentos.",
    } as const;
  }

  const { patientId, requestId, timeZone, ...fields } = input;
  const content: DeclarationSnapshot = {
    ...fields,
    patientName,
    professionalName,
    professionalCrp,
    timeZone,
  };
  const now = new Date();
  const [created] = await store
    .insert(issuedDocuments)
    .values({
      id: requestId,
      tenantId: professional.tenantId,
      patientId,
      professionalId: professional.id,
      type: "declaration",
      purpose: fields.purpose,
      recipient: fields.recipient,
      content,
      issuedAt: now,
      issuedOn: declarationIssueDate(now, timeZone),
    })
    .onConflictDoNothing({ target: issuedDocuments.id })
    .returning();

  // Uma repetição de rede não deve gerar duas emissões do mesmo envio.
  const existing =
    created ??
    (await store.query.issuedDocuments.findFirst({
      where: and(
        eq(issuedDocuments.id, requestId),
        eq(issuedDocuments.tenantId, professional.tenantId),
        eq(issuedDocuments.patientId, patientId),
        eq(issuedDocuments.professionalId, professional.id)
      ),
    }));
  if (!existing) {
    return {
      success: false,
      error: "Não foi possível registrar esta emissão. Tente novamente.",
    } as const;
  }
  return { success: true, document: summary(existing) } as const;
}
