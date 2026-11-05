"use client";

import {
  AlertCircle,
  Download,
  FileCheck2,
  FileText,
  Lock,
  Printer,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import styles from "./psychological-record-view.module.css";
import { PsychologistPrivateRecords } from "./psychologist-private-records";
import { RecordClosingTab } from "./record-closing-tab";
import { formatDate } from "./record-utils";
import { SessionEvolutionTab } from "./session-evolution-tab";

export type RecordData = {
  patient: {
    id: string;
    name: string;
    socialName: string | null;
    email: string;
    phone: string;
    birthDate: string;
    gender: string;
    cpf: string;
    responsibleCpf: string;
    responsibleName?: string | null;
    emergencyContactName: string;
    emergencyContactPhone: string;
    notes: string;
    address: string;
  };
  sessions: Array<{
    id: string;
    sessionNumber: number;
    date: string;
    time: string;
    duration: number;
    type: string;
    modality: string;
    attended: boolean;
    status: string;
    content: string;
    signed: boolean;
  }>;
  professional: { name: string; crp: string };
};
const documents = [
  "Declaração",
  "Atestado",
  "Relatório Psicológico",
  "Relatório Multiprofissional",
  "Laudo",
  "Parecer",
];
const documentFields = [
  "Solicitante",
  "Finalidade",
  "Descrição da Demanda",
  "Procedimentos",
  "Análise",
  "Conclusão",
  "Referências",
];
const value = (text?: string | null) => text?.trim() || "Não informado";

const therapeuticPlanFields = [
  {
    key: "demandOrigin",
    label: "Origem da demanda",
    placeholder: "Selecione ou digite a origem",
    suggestions: [
      "Demanda espontânea",
      "Encaminhamento médico",
      "Escolar",
      "Judicial",
      "Familiar",
    ],
  },
  {
    key: "serviceType",
    label: "Tipo de serviço",
    placeholder: "Selecione ou digite o serviço",
    suggestions: [
      "Psicoterapia Individual",
      "Psicoterapia Infantil/Adolescente",
      "Avaliação Psicológica",
      "Terapia de Casal/Família",
      "Orientação Parental",
    ],
  },
  {
    key: "modality",
    label: "Modalidade",
    placeholder: "Selecione ou digite a modalidade",
    suggestions: ["Presencial", "Online / Síncrono", "Híbrido"],
  },
  {
    key: "theoreticalApproach",
    label: "Abordagem teórica",
    placeholder: "Selecione ou digite a abordagem",
    suggestions: [
      "Terapia Cognitivo-Comportamental",
      "Psicanálise",
      "Análise do Comportamento",
      "Humanista / Fenomenológica",
      "Gestalt-terapia",
      "Sistêmica",
      "Psicologia Analítica",
    ],
  },
  {
    key: "frequency",
    label: "Frequência / Dias e horários",
    placeholder: "Ex.: Semanal, terças às 14h",
    suggestions: [],
  },
  {
    key: "durationReview",
    label: "Previsão de duração / Reavaliação",
    placeholder: "Selecione ou digite a previsão",
    suggestions: [
      "Prazo indeterminado",
      "Reavaliação trimestral",
      "Reavaliação semestral",
      "Prazo determinado / Focal",
    ],
  },
] as const;

const calculatePatientAge = (birthDate: string) => {
  const [year, month, day] = birthDate.split("-").map(Number);
  if (!year || !month || !day) return null;
  const birth = new Date(year, month - 1, day);
  const now = new Date();
  if (
    birth.getFullYear() !== year ||
    birth.getMonth() !== month - 1 ||
    birth.getDate() !== day ||
    birth > now
  )
    return null;
  let age = now.getFullYear() - year;
  if (
    now.getMonth() + 1 < month ||
    (now.getMonth() + 1 === month && now.getDate() < day)
  )
    age--;
  return age;
};

function PatientIdentificationTab({
  patient,
  professional,
}: {
  patient: RecordData["patient"];
  professional: RecordData["professional"];
}) {
  const age = calculatePatientAge(patient.birthDate);
  const minor = age !== null && age < 18;

  return (
    <TabsContent
      value="identification"
      forceMount
      className={`${styles.officialSection} mt-0`}
    >
      <section className="min-w-0 space-y-2">
        <dl className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0 space-y-1">
            <dt className="text-muted-foreground">Nome</dt>
            <dd className="text-foreground font-semibold break-words">
              {patient.socialName?.trim() || patient.name}
            </dd>
            {patient.socialName?.trim() && (
              <dd className="text-muted-foreground text-xs break-words">
                Nome civil: {patient.name}
              </dd>
            )}
          </div>
          <div className="min-w-0 space-y-1">
            <dt className="text-muted-foreground">Nascimento</dt>
            <dd>
              {formatDate(patient.birthDate)}
              {age !== null && ` (${age} anos)`}
            </dd>
          </div>
          <div className="min-w-0 space-y-1">
            <dt className="text-muted-foreground">CPF</dt>
            <dd>{value(patient.cpf)}</dd>
          </div>
          <div className="min-w-0 space-y-1">
            <dt className="text-muted-foreground">Telefone</dt>
            <dd className="break-words">{value(patient.phone)}</dd>
          </div>
          <div className="min-w-0 space-y-1">
            <dt className="text-muted-foreground">E-mail</dt>
            <dd className="break-words">{value(patient.email)}</dd>
          </div>
          <div className="min-w-0 space-y-1">
            <dt className="text-muted-foreground">Psicólogo responsável</dt>
            <dd className="break-words">{value(professional.name)}</dd>
            <dd className="text-muted-foreground text-xs">
              CRP: {value(professional.crp)}
            </dd>
          </div>
          <div className="min-w-0 space-y-1 sm:col-span-2 lg:col-span-3">
            <dt className="text-muted-foreground">Endereço</dt>
            <dd className="break-words">{value(patient.address)}</dd>
          </div>
        </dl>
        {minor && (
          <section className="bg-muted/40 min-w-0 space-y-2 rounded-md border p-3">
            <h3 className="text-foreground text-sm font-semibold">
              Responsável legal
            </h3>
            <dl className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
              <div className="min-w-0 space-y-1">
                <dt className="text-muted-foreground">Nome</dt>
                <dd className="break-words">
                  {value(patient.responsibleName)}
                </dd>
              </div>
              <div className="min-w-0 space-y-1">
                <dt className="text-muted-foreground">CPF</dt>
                <dd>{value(patient.responsibleCpf)}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="max-w-full whitespace-normal">
                Termo de autorização: assinatura não verificada
              </Badge>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-auto min-h-8 max-w-full whitespace-normal print:hidden"
                onClick={() =>
                  toast.info(
                    "Geração do termo de autorização ainda não disponível."
                  )
                }
              >
                <Printer className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
                Imprimir Termo de Autorização
              </Button>
            </div>
          </section>
        )}
        <section className="min-w-0 space-y-2 border-t pt-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-foreground text-sm font-semibold">
              Contato de emergência
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="print:hidden"
              asChild
            >
              <Link href={`/patients/new?patientId=${patient.id}`}>
                Editar contato no cadastro
              </Link>
            </Button>
          </div>
          <dl className="grid grid-cols-1 gap-2.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div className="min-w-0 space-y-1">
              <dt className="text-muted-foreground">Nome</dt>
              <dd className="break-words">
                {value(patient.emergencyContactName)}
              </dd>
            </div>
            <div className="min-w-0 space-y-1">
              <dt className="text-muted-foreground">Telefone</dt>
              <dd className="break-words">
                {value(patient.emergencyContactPhone)}
              </dd>
            </div>
          </dl>
        </section>
      </section>
    </TabsContent>
  );
}

export function PsychologicalRecordView({
  data,
  loadError,
}: {
  data: RecordData | null;
  loadError?: string;
}) {
  const [documentFieldValues, setDocumentFieldValues] = useState<
    Record<string, string>
  >({});
  const [cidAuthorized, setCidAuthorized] = useState(false);
  const [document, setDocument] = useState(documents[0]);
  const planId = useId();
  const [therapeuticPlan, setTherapeuticPlan] = useState({
    demandOrigin: "",
    serviceType: "",
    modality: "",
    theoreticalApproach: "",
    frequency: "",
    durationReview: "",
    demandAssessment: "",
    objectivesAndPlan: "",
  });
  const [planUpdatedAt, setPlanUpdatedAt] = useState<Date | null>(null);

  const updateTherapeuticPlan = (
    field: keyof typeof therapeuticPlan,
    value: string
  ) => {
    setTherapeuticPlan((current) => ({ ...current, [field]: value }));
    setPlanUpdatedAt(null);
  };

  if (!data)
    return (
      <div className="min-w-0">
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>
            {loadError ?? "Prontuário não encontrado."}
          </AlertDescription>
        </Alert>
      </div>
    );
  return (
    <div
      className={`${styles.record} w-full max-w-5xl min-w-0 space-y-3 print:max-w-none print:p-0`}
    >
      <header className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <h2 className="text-base font-semibold sm:text-lg">
            {data.patient.socialName?.trim() || data.patient.name}
          </h2>
          <Button size="sm" variant="outline" asChild>
            <Link href={`/patients/${data.patient.id}`}>
              Detalhes do paciente
            </Link>
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir / PDF
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </header>
      <Tabs defaultValue="official" className="space-y-3">
        <TabsList
          aria-label="Áreas do prontuário"
          className="border-border grid h-auto w-full grid-cols-1 gap-1 rounded-lg border p-1 sm:grid-cols-2 print:hidden"
        >
          <TabsTrigger value="official" className="gap-2 px-3 py-1 text-sm">
            <FileText className="h-4 w-4" aria-hidden="true" />
            Prontuário Psicológico
          </TabsTrigger>
          <TabsTrigger value="private" className="gap-2 px-3 py-1 text-sm">
            <Lock className="h-4 w-4" aria-hidden="true" />
            Registros do Psicólogo
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="official"
          forceMount
          className={`${styles.officialPanel} mt-0`}
        >
          <Tabs defaultValue="identification" className="space-y-3">
            <TabsList
              aria-label="Seções do prontuário oficial"
              className="border-border grid h-auto w-full grid-cols-1 gap-1 rounded-lg border p-1 sm:grid-cols-2 lg:grid-cols-5 print:hidden"
            >
              <TabsTrigger className="py-1 text-sm" value="identification">
                1. Identificação
              </TabsTrigger>
              <TabsTrigger className="py-1 text-sm" value="plan">
                2. Demanda e plano
              </TabsTrigger>
              <TabsTrigger className="py-1 text-sm" value="sessions">
                3. Evolução e sessões
              </TabsTrigger>
              <TabsTrigger className="py-1 text-sm" value="closing">
                4. Encerramento
              </TabsTrigger>
              <TabsTrigger className="py-1 text-sm" value="documents">
                5. Documentos
              </TabsTrigger>
            </TabsList>
            <PatientIdentificationTab
              key={data.patient.id}
              patient={data.patient}
              professional={data.professional}
            />
            <TabsContent
              value="plan"
              forceMount
              className={`${styles.officialSection} mt-0`}
            >
              <form
                className="min-w-0 space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  setPlanUpdatedAt(new Date());
                }}
              >
                <section
                  className="min-w-0 space-y-3"
                  aria-labelledby={`${planId}-framework`}
                >
                  <h3
                    id={`${planId}-framework`}
                    className="text-sm font-semibold"
                  >
                    Enquadre Terapêutico
                  </h3>
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                    {therapeuticPlanFields.map((field) => {
                      const fieldId = `${planId}-${field.key}`;
                      const listId = `${fieldId}-suggestions`;
                      return (
                        <div key={field.key} className="min-w-0 space-y-1">
                          <Label
                            htmlFor={fieldId}
                            className="text-muted-foreground text-sm"
                          >
                            {field.label}
                          </Label>
                          <Input
                            id={fieldId}
                            name={field.key}
                            list={field.suggestions.length ? listId : undefined}
                            autoComplete="off"
                            placeholder={field.placeholder}
                            value={therapeuticPlan[field.key]}
                            onChange={(event) =>
                              updateTherapeuticPlan(
                                field.key,
                                event.target.value
                              )
                            }
                          />
                          {field.suggestions.length > 0 && (
                            <datalist id={listId}>
                              {field.suggestions.map((suggestion) => (
                                <option key={suggestion} value={suggestion} />
                              ))}
                            </datalist>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
                <section
                  className="min-w-0 space-y-3"
                  aria-labelledby={`${planId}-narrative`}
                >
                  <h3
                    id={`${planId}-narrative`}
                    className="text-sm font-semibold"
                  >
                    Narrativa Clínica
                  </h3>
                  <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                    <div className="min-w-0 space-y-1">
                      <Label
                        htmlFor={`${planId}-assessment`}
                        className="text-muted-foreground text-sm"
                      >
                        Avaliação de demanda
                      </Label>
                      <Textarea
                        id={`${planId}-assessment`}
                        name="demandAssessment"
                        className="field-sizing-fixed"
                        rows={5}
                        placeholder="Sintetize tecnicamente o motivo da procura, a demanda identificada e o contexto relevante ao atendimento. Registre apenas as informações necessárias ao prontuário oficial, sem transcrições literais."
                        value={therapeuticPlan.demandAssessment}
                        onChange={(event) =>
                          updateTherapeuticPlan(
                            "demandAssessment",
                            event.target.value
                          )
                        }
                      />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <Label
                        htmlFor={`${planId}-objectives`}
                        className="text-muted-foreground text-sm"
                      >
                        Objetivos e plano terapêutico
                      </Label>
                      <Textarea
                        id={`${planId}-objectives`}
                        name="objectivesAndPlan"
                        className="field-sizing-fixed"
                        rows={5}
                        placeholder="Descreva os objetivos acordados com a pessoa atendida, a conduta planejada, os procedimentos técnico-científicos e os critérios de acompanhamento e reavaliação, conforme as necessidades do caso."
                        value={therapeuticPlan.objectivesAndPlan}
                        onChange={(event) =>
                          updateTherapeuticPlan(
                            "objectivesAndPlan",
                            event.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </section>
                <div className="flex flex-wrap items-center gap-2 print:hidden">
                  <Button type="submit" variant="outline" size="sm">
                    <Save className="h-4 w-4" aria-hidden="true" />
                    Salvar plano terapêutico
                  </Button>
                  <p
                    role="status"
                    aria-atomic="true"
                    className="text-muted-foreground min-w-0 text-xs"
                  >
                    {planUpdatedAt && (
                      <>
                        Plano atualizado em{" "}
                        <time dateTime={planUpdatedAt.toISOString()}>
                          {planUpdatedAt.toLocaleString("pt-BR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </time>
                        . Apenas nesta página, sem gravação permanente.
                      </>
                    )}
                  </p>
                </div>
              </form>
            </TabsContent>
            <SessionEvolutionTab
              key={data.patient.id}
              sessions={data.sessions}
              professional={data.professional}
            />
            <RecordClosingTab key={data.patient.id} />
            <TabsContent
              value="documents"
              forceMount
              className={`${styles.officialSection} mt-0`}
            >
              <section>
                <div className="space-y-3">
                  <div className="space-y-3 print:hidden">
                    <div className="grid gap-2 sm:grid-cols-3">
                      {documents.map((item) => (
                        <Button
                          size="sm"
                          key={item}
                          variant={document === item ? "default" : "outline"}
                          onClick={() => setDocument(item)}
                          className="h-auto min-h-8 min-w-0 whitespace-normal"
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          {item}
                        </Button>
                      ))}
                    </div>
                    <div className="rounded border p-4">
                      <p className="font-medium">Emitir {document}</p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        {documentFields.map((field) => (
                          <div
                            key={field}
                            className={
                              field === "Descrição da Demanda" ||
                              field === "Procedimentos" ||
                              field === "Análise" ||
                              field === "Conclusão" ||
                              field === "Referências"
                                ? "sm:col-span-2"
                                : ""
                            }
                          >
                            <Label htmlFor={`document-${field}`}>{field}</Label>
                            <Textarea
                              id={`document-${field}`}
                              className="mt-1"
                              rows={field === "Solicitante" ? 2 : 3}
                              value={documentFieldValues[field] || ""}
                              onChange={(event) =>
                                setDocumentFieldValues({
                                  ...documentFieldValues,
                                  [field]: event.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        ))}
                      </div>
                      {document === "Atestado" && (
                        <label className="mt-3 flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={cidAuthorized}
                            onChange={(event) =>
                              setCidAuthorized(event.target.checked)
                            }
                          />
                          Autorização do paciente para uso de CID
                        </label>
                      )}
                      <Button size="sm" className="mt-3">
                        <FileCheck2 className="mr-2 h-4 w-4" />
                        Emitir documento
                      </Button>
                    </div>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2">Data de emissão</th>
                        <th className="p-2">Finalidade</th>
                        <th className="p-2">Destinatário</th>
                        <th className="p-2">Status de devolutiva</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-muted-foreground p-2" colSpan={4}>
                          Nenhum documento emitido.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </TabsContent>
          </Tabs>
          <p className="text-muted-foreground hidden text-center text-xs print:block">
            Profissional: {data.professional.name} · CRP:{" "}
            {data.professional.crp} · Página 1
          </p>
        </TabsContent>
        <TabsContent
          value="private"
          forceMount
          className={`${styles.privatePanel} mt-0 print:hidden`}
        >
          <PsychologistPrivateRecords
            key={data.patient.id}
            sessions={data.sessions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
