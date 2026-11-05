"use client";

import {
  AlertCircle,
  Download,
  FileCheck2,
  FileText,
  Lock,
  Plus,
  Printer,
  Save,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import styles from "./psychological-record-view.module.css";
import { PsychologistPrivateRecords } from "./psychologist-private-records";
import { formatDate } from "./record-utils";

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
const today = () => new Date().toISOString().slice(0, 10);

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
  const [signed, setSigned] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, boolean>>({});
  const [addenda, setAddenda] = useState<
    Record<string, { date: string; text: string }>
  >({});
  const [showReferralForm, setShowReferralForm] = useState(false);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [documentFieldValues, setDocumentFieldValues] = useState<
    Record<string, string>
  >({});
  const [cidAuthorized, setCidAuthorized] = useState(false);
  const [document, setDocument] = useState(documents[0]);
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
              <section>
                <div className="space-y-3">
                  <div>
                    <Label>Avaliação de demanda</Label>
                    <Textarea className="mt-1" rows={4} />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label>Objetivos</Label>
                      <Textarea className="mt-1" />
                    </div>
                    <div>
                      <Label>Abordagem</Label>
                      <Input className="mt-1" />
                    </div>
                    <div>
                      <Label>Modalidade</Label>
                      <Input className="mt-1" />
                    </div>
                    <div>
                      <Label>Frequência / Dias e horários</Label>
                      <Input
                        className="mt-1"
                        placeholder="Ex.: semanal, terças às 14h"
                      />
                    </div>
                    <div>
                      <Label>Previsão de duração</Label>
                      <Input className="mt-1" />
                    </div>
                  </div>
                  <Button size="sm">Salvar plano terapêutico</Button>
                </div>
              </section>
            </TabsContent>
            <TabsContent
              value="sessions"
              forceMount
              className={`${styles.officialSection} mt-0`}
            >
              <div className="space-y-3">
                {data.sessions.length === 0 && (
                  <section>
                    <div className="text-muted-foreground py-6 text-center">
                      Nenhuma sessão registrada.
                    </div>
                  </section>
                )}
                {data.sessions.map((session) => {
                  const immutable = signed[session.id] || session.signed;
                  return (
                    <section key={session.id}>
                      <div className="pb-2">
                        <div className="flex justify-between gap-2">
                          <h2 className="text-sm font-semibold">
                            Sessão {session.sessionNumber} ·{" "}
                            {formatDate(session.date)} às {session.time}
                          </h2>
                          <Badge variant={immutable ? "default" : "outline"}>
                            {immutable ? "Assinada e imutável" : session.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label>
                            Procedimentos técnico-científicos adotados
                          </Label>
                          <Textarea className="mt-1" disabled={immutable} />
                        </div>
                        <Alert className="print:hidden">
                          <AlertCircle />
                          <AlertDescription>
                            Evite transcrições literais; registre somente a
                            síntese técnica necessária.
                          </AlertDescription>
                        </Alert>
                        <div>
                          <Label>Síntese da evolução</Label>
                          <Textarea
                            className="mt-1"
                            defaultValue={session.content}
                            disabled={immutable}
                          />
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          {!immutable && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setDrafts({ ...drafts, [session.id]: true })
                                }
                              >
                                <Save className="mr-2 h-4 w-4" />
                                Salvar rascunho
                              </Button>
                              <Button
                                size="sm"
                                onClick={() =>
                                  setSigned({ ...signed, [session.id]: true })
                                }
                              >
                                <ShieldCheck className="mr-2 h-4 w-4" />
                                Finalizar e assinar registro
                              </Button>
                            </>
                          )}
                        </div>
                        {drafts[session.id] && !immutable && (
                          <p className="text-muted-foreground text-right text-xs">
                            Rascunho salvo nesta sessão.
                          </p>
                        )}
                        {immutable && (
                          <div className="space-y-3 border-t pt-3">
                            <div className="text-muted-foreground text-xs">
                              <p className="text-foreground font-medium">
                                Assinatura eletrônica
                              </p>
                              <p>Nome: {value(data.professional.name)}</p>
                              <p>CRP: {value(data.professional.crp)}</p>
                              <p>
                                Data/Hora: {new Date().toLocaleString("pt-BR")}
                              </p>
                              <p>Hash: SHA256-{session.id.slice(0, 12)}</p>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setAddenda({
                                  ...addenda,
                                  [session.id]: {
                                    date: today(),
                                    text: addenda[session.id]?.text || "",
                                  },
                                })
                              }
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar adendo / errata
                            </Button>
                            {addenda[session.id] && (
                              <div>
                                <Label>
                                  Adendo / errata ·{" "}
                                  {formatDate(addenda[session.id].date)}
                                </Label>
                                <Textarea
                                  className="mt-1"
                                  value={addenda[session.id].text}
                                  onChange={(event) =>
                                    setAddenda({
                                      ...addenda,
                                      [session.id]: {
                                        ...addenda[session.id],
                                        text: event.target.value,
                                      },
                                    })
                                  }
                                  placeholder="Registre a correção ou informação complementar."
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent
              value="closing"
              forceMount
              className={`${styles.officialSection} mt-0`}
            >
              <section>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowReferralForm(!showReferralForm)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Novo encaminhamento
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setShowNotificationForm(!showNotificationForm)
                      }
                      className="h-auto min-h-8 max-w-full whitespace-normal"
                    >
                      <FileCheck2 className="mr-2 h-4 w-4" />
                      Notificação compulsória (SINAN / Ofício)
                    </Button>
                  </div>
                  {showReferralForm && (
                    <div className="space-y-3 rounded border p-4">
                      <Label>Destinatário do encaminhamento</Label>
                      <Input placeholder="Profissional ou instituição" />
                      <Label>Motivo e orientações</Label>
                      <Textarea rows={3} />
                      <Button size="sm">Salvar encaminhamento</Button>
                    </div>
                  )}
                  {showNotificationForm && (
                    <div className="space-y-3 rounded border p-4">
                      <Label>Órgão destinatário</Label>
                      <Input placeholder="SINAN, conselho ou instituição" />
                      <Label>Descrição da notificação</Label>
                      <Textarea rows={3} />
                      <Button size="sm">Salvar notificação</Button>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <Label>Motivo</Label>
                    <Select>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione o motivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alta">Alta / Conclusão</SelectItem>
                        <SelectItem value="desistencia">Desistência</SelectItem>
                        <SelectItem value="abandono">Abandono</SelectItem>
                        <SelectItem value="transferencia">
                          Transferência
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Label className="mt-3 block">Data</Label>
                    <Input className="mt-1" type="date" />
                    <Label className="mt-3 block">Síntese final</Label>
                    <Textarea className="mt-1" rows={5} />
                    <Button size="sm" className="mt-3">
                      Salvar encerramento
                    </Button>
                  </div>
                </div>
              </section>
            </TabsContent>
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
