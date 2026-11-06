import { z } from "zod";

export const declarationWarning =
  "⚠️ ATENÇÃO: É expressamente vedado o registro de sintomas, situações, estados psicológicos ou CID na Declaração (Art. 9º, § 1º da Res. CFP 06/2019)";

// Esta checagem complementa, mas não substitui, a revisão ética do profissional.
const diagnosticCodePattern =
  /\b[A-Z]\d{2}(?:\.\d{1,4})?\b|\b\d[A-GI-Z]\d[A-Z\d](?:\.[A-Z\d]{1,4})?\b/i;
const diagnosticLabelPattern = /\b(?:CID|ICD)(?:[\s-]?(?:10|11))?\b/i;

const requiredText = (label: string, max: number) =>
  z.string().trim().min(1, `${label} é obrigatório.`).max(max);

const declarationFields = z
  .object({
    companionName: z.string().trim().max(255).optional(),
    purpose: requiredText("Finalidade", 1000),
    recipient: requiredText("Destinatário", 255),
    attendanceLocation: requiredText("Local do comparecimento", 500),
    attendanceDates: requiredText("Dias do comparecimento", 500),
    attendanceTimes: requiredText("Horários do comparecimento", 255),
    attendanceDuration: requiredText("Duração do acompanhamento", 255),
    issuanceLocation: requiredText("Local de emissão", 255),
    ethicalReview: z.boolean().refine((reviewed) => reviewed, {
      message: "Confirme a revisão do conteúdo objetivo da declaração.",
    }),
  })
  .strict();

function validateDiagnosticCodes(
  fields: z.infer<typeof declarationFields>,
  ctx: z.RefinementCtx
) {
  // UUIDs e outros metadados não são conteúdo clínico e não entram na checagem.
  for (const field of Object.keys(
    declarationFields.shape
  ) as (keyof typeof fields)[]) {
    const text = fields[field];
    // Nomes próprios (ex.: Cid) e horários (ex.: 8h30) não são diagnósticos.
    const isName = field === "companionName" || field === "recipient";
    if (
      typeof text === "string" &&
      (diagnosticCodePattern.test(text) ||
        (!isName && diagnosticLabelPattern.test(text)))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [field],
        message: "Não inclua CID ou códigos diagnósticos na declaração.",
      });
    }
  }
}

export const declarationFormSchema = declarationFields.superRefine(
  validateDiagnosticCodes
);

export const issueDeclarationSchema = declarationFields
  .extend({
    patientId: z.string().uuid(),
    requestId: z.string().uuid(),
    timeZone: z
      .string()
      .max(100)
      .refine((timeZone) => {
        try {
          new Intl.DateTimeFormat("pt-BR", { timeZone });
          return true;
        } catch {
          return false;
        }
      }, "Fuso horário inválido."),
  })
  .strict()
  .superRefine(validateDiagnosticCodes);

export type DeclarationFormValues = z.infer<typeof declarationFormSchema>;
export type IssueDeclarationInput = z.infer<typeof issueDeclarationSchema>;

export type DeclarationSnapshot = DeclarationFormValues & {
  patientName: string;
  professionalName: string;
  professionalCrp: string;
  timeZone: string;
};

export type IssuedDocumentSummary = {
  id: string;
  type: "declaration";
  issuedAt: string;
  issuedOn: string;
  purpose: string;
  recipient: string;
  feedbackStatus: "not_applicable";
};

export type IssuedDeclaration = IssuedDocumentSummary & {
  content: DeclarationSnapshot;
};

export function declarationIssueDate(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function formatDeclarationDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}-${month}-${year}`;
}
