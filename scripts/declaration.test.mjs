import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

// Usa apenas o runner nativo e as dependências do projeto, sem instalar framework.
const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));
const cache = new Map();
function load(relative) {
  const filename = path.join(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const compiledModule = { exports: {} };
  cache.set(filename, compiledModule);
  const compiled = ts.transpileModule(readFileSync(filename, "utf8"), {
    fileName: filename,
    reportDiagnostics: true,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  });
  assert.equal(
    compiled.diagnostics?.filter(
      (item) => item.category === ts.DiagnosticCategory.Error
    ).length ?? 0,
    0
  );
  vm.runInNewContext(
    compiled.outputText,
    {
      module: compiledModule,
      exports: compiledModule.exports,
      console,
      Intl,
      Date,
      crypto: { randomUUID },
      require(specifier) {
        if (specifier === "@/actions/issue-declaration")
          return { issueDeclaration: () => {} };
        if (specifier === "next-safe-action/hooks")
          return { useAction: () => ({ execute() {}, isExecuting: false }) };
        if (specifier === "next/navigation")
          return { useRouter: () => ({ refresh() {} }) };
        if (specifier === "next/link")
          return {
            __esModule: true,
            default: ({ children, ...props }) =>
              React.createElement("a", props, children),
          };
        if (specifier.endsWith(".module.css"))
          return {
            sheet: "sheet",
            title: "title",
            details: "details",
            footer: "footer",
            signature: "signature",
            signatureLine: "signature-line",
          };
        if (specifier.startsWith("@/"))
          return load(
            `src/${specifier.slice(2)}${specifier === "@/db/schema" || specifier.startsWith("@/lib/") ? ".ts" : ".tsx"}`
          );
        if (specifier.startsWith("."))
          return load(
            path.relative(
              root,
              path.resolve(path.dirname(filename), `${specifier}.tsx`)
            )
          );
        return require(specifier);
      },
    },
    { filename }
  );
  return compiledModule.exports;
}

const {
  declarationFormSchema,
  issueDeclarationSchema,
  declarationIssueDate,
  formatDeclarationDate,
  declarationWarning,
} = load("src/lib/documents/declaration.ts");
const { issueDeclarationForPatient } = load(
  "src/actions/issue-declaration/service.ts"
);
const { issuedDocuments } = load("src/db/schema.ts");
const { PgDialect } = require("drizzle-orm/pg-core");
const dialect = new PgDialect();
const componentPath =
  "src/app/(protected)/patients/[id]/psychological-record/_components/";
const patientId = "00000000-0000-4000-8000-000000000001";
const requestId = "00000000-0000-4000-8000-000000000002";
const professional = {
  id: "professional-a",
  tenantId: "tenant-a",
  name: "Psicóloga Teste",
};
const valid = {
  companionName: "",
  purpose: "Comprovar comparecimento",
  recipient: "Setor de recursos humanos",
  attendanceLocation: "Clínica Teste",
  attendanceDates: "05-11-2026",
  attendanceTimes: "14h às 14h50",
  attendanceDuration: "50 minutos",
  issuanceLocation: "Manaus/AM",
  ethicalReview: true,
};
const input = () =>
  issueDeclarationSchema.parse({
    ...valid,
    patientId,
    requestId,
    timeZone: "America/Manaus",
  });

function storeFixture({
  tenant = "tenant-a",
  name = "Nome Completo Teste",
  socialName = "Nome Social Teste",
  crp = "20/12345",
  fail = false,
} = {}) {
  const rows = new Map();
  let inserts = 0;
  return {
    rows,
    get inserts() {
      return inserts;
    },
    query: {
      patients: {
        async findFirst({ where }) {
          const { params } = dialect.sqlToQuery(where);
          return params.includes(tenant) && params.includes(patientId)
            ? {
                id: patientId,
                tenant_id: tenant,
                name,
                social_name: socialName,
              }
            : undefined;
        },
      },
      userSettings: {
        async findFirst({ where }) {
          const { params } = dialect.sqlToQuery(where);
          assert.ok(
            params.includes(professional.tenantId) &&
              params.includes(professional.id)
          );
          return { name: "Psicóloga Registrada Teste", crp };
        },
      },
      issuedDocuments: {
        async findFirst({ where }) {
          const { params } = dialect.sqlToQuery(where);
          return [...rows.values()].find((row) =>
            [row.id, row.patientId, row.tenantId, row.professionalId].every(
              (value) => params.includes(value)
            )
          );
        },
      },
    },
    insert(table) {
      assert.equal(table, issuedDocuments);
      return {
        values(row) {
          return {
            onConflictDoNothing() {
              return {
                async returning() {
                  if (fail) throw new Error("Database unavailable");
                  if (rows.has(row.id)) return [];
                  inserts++;
                  const saved = { ...row, feedbackStatus: "not_applicable" };
                  rows.set(row.id, saved);
                  return [saved];
                },
              };
            },
          };
        },
      };
    },
  };
}

test("aceita dados objetivos e acompanhante omitido", () => {
  const withoutCompanion = { ...valid };
  delete withoutCompanion.companionName;
  assert.equal(declarationFormSchema.safeParse(withoutCompanion).success, true);
});

test("não interpreta IDs do paciente e da emissão como códigos diagnósticos", () => {
  assert.equal(
    issueDeclarationSchema.safeParse({
      ...input(),
      patientId: "00000000-6a70-4000-8000-000000000001",
      requestId: "00000000-6b00-4000-8000-000000000002",
    }).success,
    true
  );
});

test("campos objetivos obrigatórios rejeitam conteúdo em branco", () => {
  for (const field of [
    "purpose",
    "recipient",
    "attendanceLocation",
    "attendanceDates",
    "attendanceTimes",
    "attendanceDuration",
    "issuanceLocation",
  ]) {
    assert.equal(
      declarationFormSchema.safeParse({ ...valid, [field]: "   " }).success,
      false,
      field
    );
  }
});

test("rejeita campos clínicos, validade e nomes forjados enviados à action", () => {
  for (const field of [
    "cid",
    "symptoms",
    "demandDescription",
    "procedures",
    "analysis",
    "conclusion",
    "references",
    "validUntil",
    "patientName",
    "professionalName",
    "professionalCrp",
  ]) {
    assert.equal(
      issueDeclarationSchema.safeParse({
        ...input(),
        [field]: "conteúdo indevido",
      }).success,
      false,
      field
    );
  }
});

test("rejeita códigos CID/ICD nos campos de texto", () => {
  for (const code of [
    "CID",
    "CID-10 F32.1",
    "ICD-11",
    "F32",
    "F32.1",
    "U07.1",
    "6A70",
  ]) {
    assert.equal(
      declarationFormSchema.safeParse({
        ...valid,
        purpose: `Comparecimento ${code}`,
      }).success,
      false,
      code
    );
  }
});

test("não confunde nomes próprios e horários com códigos diagnósticos", () => {
  assert.equal(
    declarationFormSchema.safeParse({
      ...valid,
      companionName: "Cid Gomes",
      attendanceTimes: "8h30 às 9h20",
    }).success,
    true
  );
});

test("exige revisão ética e limita o tamanho dos textos", () => {
  assert.equal(
    declarationFormSchema.safeParse({ ...valid, ethicalReview: false }).success,
    false
  );
  assert.equal(
    declarationFormSchema.safeParse({ ...valid, purpose: "a".repeat(1001) })
      .success,
    false
  );
});

test("valida fuso e registra a data local da emissão", () => {
  assert.equal(
    issueDeclarationSchema.safeParse({ ...input(), timeZone: "invalid-zone" })
      .success,
    false
  );
  assert.equal(
    declarationIssueDate(new Date("2026-11-06T01:00:00Z"), "America/Manaus"),
    "2026-11-05"
  );
  assert.equal(formatDeclarationDate("2026-11-05"), "05-11-2026");
});

test("emissão usa nome social e identificação profissional do servidor", async () => {
  const store = storeFixture();
  const result = await issueDeclarationForPatient(store, input(), professional);
  assert.equal(result.success, true);
  assert.equal(store.inserts, 1);
  assert.equal(
    store.rows.get(requestId).content.patientName,
    "Nome Social Teste"
  );
  assert.equal(
    store.rows.get(requestId).content.professionalName,
    "Psicóloga Registrada Teste"
  );
  assert.equal(store.rows.get(requestId).content.professionalCrp, "20/12345");
  assert.equal(result.document.purpose, valid.purpose);
  assert.equal(result.document.recipient, valid.recipient);
});

test("usa nome completo quando o nome social está vazio", async () => {
  const store = storeFixture({ socialName: "  " });
  await issueDeclarationForPatient(store, input(), professional);
  assert.equal(
    store.rows.get(requestId).content.patientName,
    "Nome Completo Teste"
  );
});

test("cadastro sem nome não pode gerar declaração", async () => {
  const store = storeFixture({ name: "", socialName: "  " });
  assert.equal(
    (await issueDeclarationForPatient(store, input(), professional)).success,
    false
  );
  assert.equal(store.inserts, 0);
});

test("paciente de outro tenant não pode receber uma emissão", async () => {
  const store = storeFixture({ tenant: "tenant-other" });
  assert.equal(
    (await issueDeclarationForPatient(store, input(), professional)).success,
    false
  );
  assert.equal(store.inserts, 0);
});

test("profissional sem CRP não pode emitir", async () => {
  const store = storeFixture({ crp: "" });
  assert.equal(
    (await issueDeclarationForPatient(store, input(), professional)).success,
    false
  );
  assert.equal(store.inserts, 0);
});

test("repetição de rede reutiliza a emissão sem duplicar o histórico", async () => {
  const store = storeFixture();
  const first = await issueDeclarationForPatient(store, input(), professional);
  const second = await issueDeclarationForPatient(store, input(), professional);
  assert.equal(first.success && second.success, true);
  assert.equal(first.document.id, second.document.id);
  assert.equal(store.inserts, 1);
});

test("conflito de ID de outro tenant não revela seu documento", async () => {
  const store = storeFixture();
  store.rows.set(requestId, {
    id: requestId,
    tenantId: "tenant-other",
    patientId,
    professionalId: professional.id,
  });
  assert.equal(
    (await issueDeclarationForPatient(store, input(), professional)).success,
    false
  );
  assert.equal(store.inserts, 0);
});

test("falha no banco não produz histórico de sucesso", async () => {
  const store = storeFixture({ fail: true });
  await assert.rejects(
    issueDeclarationForPatient(store, input(), professional)
  );
  assert.equal(store.rows.size, 0);
});

test("Declaração não renderiza campos genéricos nem prazo de validade", () => {
  const { RecordDocumentsTab } = load(
    `${componentPath}record-documents-tab.tsx`
  );
  const { Tabs } = load("src/components/ui/tabs.tsx");
  const html = renderToStaticMarkup(
    React.createElement(
      Tabs,
      { defaultValue: "documents" },
      React.createElement(RecordDocumentsTab, {
        patient: {
          id: patientId,
          name: "Nome Completo Teste",
          socialName: "Nome Social Teste",
        },
        professional: { name: professional.name, crp: "20/12345" },
        initialDocuments: [],
      })
    )
  );
  for (const field of [
    "Descrição da Demanda",
    "Procedimentos",
    "Análise",
    "Conclusão",
    "Referências",
    "Prazo de Validade",
  ])
    assert.ok(!html.includes(field), field);
  for (const field of [
    "Nome da pessoa atendida",
    "Nome do acompanhante",
    "Finalidade",
    "Informações de Comparecimento",
    "Destinatário",
  ])
    assert.ok(html.includes(field), field);
  assert.ok(html.includes("Nome Social Teste"));
  assert.ok(html.includes(declarationWarning));
  assert.ok(html.includes("Relatório Multiprofissional"));
});

test("template imprime somente conteúdo objetivo, data e identificação do emissor", () => {
  const { DeclarationTemplate } = load(
    `${componentPath}declaration-template.tsx`
  );
  const html = renderToStaticMarkup(
    React.createElement(DeclarationTemplate, {
      document: {
        id: requestId,
        type: "declaration",
        issuedAt: "2026-11-05T15:00:00Z",
        issuedOn: "2026-11-05",
        purpose: valid.purpose,
        recipient: valid.recipient,
        feedbackStatus: "not_applicable",
        financialData: "FINANCIAL_MUST_NOT_PRINT",
        restrictedNotes: "PRIVATE_MUST_NOT_PRINT",
        content: {
          ...valid,
          patientName: "Nome Social Teste",
          professionalName: professional.name,
          professionalCrp: "20/12345",
          companionName: "<script>INJECTION</script>",
          financialData: "FINANCIAL_MUST_NOT_PRINT",
          restrictedNotes: "PRIVATE_MUST_NOT_PRINT",
        },
      },
    })
  );
  assert.ok(html.includes("Declaração") && html.includes("05-11-2026"));
  assert.ok(
    html.includes("Carimbo e assinatura") &&
      html.includes("20/12345") &&
      html.includes("Manaus/AM")
  );
  assert.ok(
    !html.includes("FINANCIAL_MUST_NOT_PRINT") &&
      !html.includes("PRIVATE_MUST_NOT_PRINT")
  );
  assert.ok(!html.includes("<script>"));
});
