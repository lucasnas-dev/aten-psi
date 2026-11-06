import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { db } from "@/db";
import { issuedDocuments, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import type { IssuedDeclaration } from "@/lib/documents/declaration";

import { DeclarationPrint } from "../../../_components/declaration-print";
import { DeclarationTemplate } from "../../../_components/declaration-template";

export default async function DeclarationPrintPage({
  params,
}: {
  params: Promise<{ id: string; documentId: string }>;
}) {
  const session = await auth.api
    .getSession({ headers: await headers() })
    .catch(() => null);
  if (!session?.user?.id) redirect("/authentication/login");
  const { id, documentId } = await params;
  let document;
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
    });
    if (user?.tenant_id) {
      document = await db.query.issuedDocuments.findFirst({
        where: and(
          eq(issuedDocuments.id, documentId),
          eq(issuedDocuments.patientId, id),
          eq(issuedDocuments.tenantId, user.tenant_id),
          eq(issuedDocuments.type, "declaration")
        ),
      });
    }
  } catch (error) {
    console.error(
      "Falha ao carregar declaração:",
      error instanceof Error ? error.name : "UnknownError"
    );
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Não foi possível carregar a declaração para impressão. Tente
          novamente.
        </AlertDescription>
      </Alert>
    );
  }
  if (!document) notFound();
  const printable: IssuedDeclaration = {
    id: document.id,
    type: document.type,
    issuedAt: document.issuedAt.toISOString(),
    issuedOn: document.issuedOn,
    purpose: document.purpose,
    recipient: document.recipient,
    feedbackStatus: document.feedbackStatus,
    content: document.content,
  };
  return (
    <DeclarationPrint patientId={id}>
      <DeclarationTemplate document={printable} />
    </DeclarationPrint>
  );
}
