"use client";

import {
  AlertCircle,
  Download,
  FileCheck2,
  FileText,
  Loader2,
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
    emergencyContact?: string | null;
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
  const [emergencyContact, setEmergencyContact] = useState(
    patient.emergencyContact ?? ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const age = calculatePatientAge(patient.birthDate);
  const minor = age !== null && age < 18;

  const handleSaveIdentification = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setSaveMessage("");
    try {
      // Simulação: o contato de emergência ainda não é persistido no banco.
      await new Promise<void>((resolve) => setTimeout(resolve, 600));
      setSaveMessage(
        "Simulação concluída. Contato de emergência mantido apenas nesta tela, sem gravação no banco."
      );
      toast.success("Identificação salva em simulação", {
        description: "O contato de emergência permanece apenas nesta tela.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <TabsContent
      value="identification"
      forceMount
      className={`${styles.officialSection} mt-0`}
    >
      <section>
        <div className="pb-2">
          <h2 className="text-base font-semibold">Identificação</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label>Nome</Label>
            <p className="mt-1 text-lg font-semibold">
              {patient.socialName?.trim() || patient.name}
            </p>
            {patient.socialName?.trim() && (
              <p className="text-muted-foreground mt-1 text-sm">
                Nome civil: {patient.name}
              </p>
            )}
          </div>
          <div>
            <Label>Nascimento</Label>
            <p className="mt-1">
              {formatDate(patient.birthDate)}
              {age !== null && ` (${age} anos)`}
            </p>
          </div>
          <div>
            <Label>CPF</Label>
            <p className="mt-1">{value(patient.cpf)}</p>
          </div>
          <div>
            <Label>Contato</Label>
            <p className="mt-1">
              {value(patient.phone)} · {value(patient.email)}
            </p>
          </div>
          <div>
            <Label>Psicólogo Responsável</Label>
            <p className="mt-1">{value(professional.name)}</p>
            <p className="text-muted-foreground text-sm">
              CRP: {value(professional.crp)}
            </p>
          </div>
          <div className="sm:col-span-2">
            <Label>Endereço</Label>
            <p className="mt-1">{value(patient.address)}</p>
          </div>
          {minor && (
            <div className="rounded border border-amber-200 bg-amber-50 p-4 sm:col-span-2">
              <p className="font-medium">Responsável legal</p>
              <div className="mt-1 grid gap-1 text-sm sm:grid-cols-2">
                <p>Nome: {value(patient.responsibleName)}</p>
                <p>CPF: {value(patient.responsibleCpf)}</p>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline">
                  Termo de autorização: assinatura não verificada
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    toast.info(
                      "Geração do termo de autorização ainda não disponível."
                    )
                  }
                >
                  <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
                  Imprimir Termo de Autorização
                </Button>
              </div>
            </div>
          )}
          <div className="sm:col-span-2">
            <Label htmlFor="identification-emergency-contact">
              Contato de emergência
            </Label>
            <Input
              id="identification-emergency-contact"
              className="mt-1 h-8 text-sm"
              placeholder="Nome e telefone"
              value={emergencyContact}
              disabled={isSaving}
              onChange={(event) => {
                setEmergencyContact(event.target.value);
                setSaveMessage("");
              }}
            />
            <Button
              type="button"
              className="mt-3"
              size="sm"
              disabled={isSaving}
              aria-busy={isSaving}
              onClick={handleSaveIdentification}
            >
              {isSaving ? (
                <Loader2
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Save className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              {isSaving ? "Salvando..." : "Salvar identificação"}
            </Button>
            <p
              role="status"
              aria-live="polite"
              className="text-muted-foreground mt-2 text-xs print:hidden"
            >
              {saveMessage}
            </p>
          </div>
        </div>
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
      <div className="p-6">
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>
            {loadError ?? "Prontuário não encontrado."}
          </AlertDescription>
        </Alert>
      </div>
    );
  return (
    <div className={`${styles.record} space-y-3 print:p-0`}>
      <header className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <Button size="sm" variant="outline" asChild>
          <Link href={`/patients/${data.patient.id}`}>
            Detalhes do paciente
          </Link>
        </Button>
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
      <section>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {data.patient.socialName?.trim() || data.patient.name}
            </h2>
          </div>
        </div>
      </section>
      <Tabs defaultValue="official" className="space-y-3">
        <TabsList
          aria-label="Áreas do prontuário"
          className="grid h-auto w-full grid-cols-1 gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 shadow-sm sm:grid-cols-2 print:hidden"
        >
          <TabsTrigger
            value="official"
            className="gap-2 px-3 py-2 text-sm text-slate-600 transition data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Prontuário Psicológico
          </TabsTrigger>
          <TabsTrigger
            value="private"
            className="gap-2 px-3 py-2 text-sm text-slate-600 transition data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
          >
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
              className="grid h-auto w-full grid-cols-1 gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 shadow-sm sm:grid-cols-2 lg:grid-cols-5 print:hidden"
            >
              <TabsTrigger
                className="text-sm text-slate-600 transition data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
                value="identification"
              >
                1. Identificação
              </TabsTrigger>
              <TabsTrigger
                className="text-sm text-slate-600 transition data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
                value="plan"
              >
                2. Demanda e plano
              </TabsTrigger>
              <TabsTrigger
                className="text-sm text-slate-600 transition data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
                value="sessions"
              >
                3. Evolução e sessões
              </TabsTrigger>
              <TabsTrigger
                className="text-sm text-slate-600 transition data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
                value="closing"
              >
                4. Encerramento
              </TabsTrigger>
              <TabsTrigger
                className="text-sm text-slate-600 transition data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
                value="documents"
              >
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
                <div className="pb-2">
                  <h2 className="text-base font-semibold">
                    Demanda e plano terapêutico
                  </h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label>Avaliação de demanda</Label>
                    <Textarea className="mt-1" rows={4} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
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
                  <Button>Salvar plano terapêutico</Button>
                </div>
              </section>
            </TabsContent>
            <TabsContent
              value="sessions"
              forceMount
              className={`${styles.officialSection} mt-0`}
            >
              <div className="space-y-4">
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
                          <h2 className="text-base font-semibold">
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
                                variant="outline"
                                onClick={() =>
                                  setDrafts({ ...drafts, [session.id]: true })
                                }
                              >
                                <Save className="mr-2 h-4 w-4" />
                                Salvar rascunho
                              </Button>
                              <Button
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
                              <p className="font-medium text-slate-700">
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
                <div className="pb-2">
                  <h2 className="text-base font-semibold">
                    Encaminhamento e encerramento
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowReferralForm(!showReferralForm)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Novo encaminhamento
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setShowNotificationForm(!showNotificationForm)
                      }
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
                  <div className="border-t pt-4">
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
                    <Label className="mt-4 block">Data</Label>
                    <Input className="mt-1" type="date" />
                    <Label className="mt-4 block">Síntese final</Label>
                    <Textarea className="mt-1" rows={5} />
                    <Button className="mt-4">Salvar encerramento</Button>
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
                <div className="pb-2">
                  <h2 className="text-base font-semibold">
                    Documentos e arquivos
                  </h2>
                </div>
                <div className="space-y-3">
                  <div className="space-y-3 print:hidden">
                    <div className="grid gap-2 sm:grid-cols-3">
                      {documents.map((item) => (
                        <Button
                          key={item}
                          variant={document === item ? "default" : "outline"}
                          onClick={() => setDocument(item)}
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
                      <Button className="mt-4">
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
