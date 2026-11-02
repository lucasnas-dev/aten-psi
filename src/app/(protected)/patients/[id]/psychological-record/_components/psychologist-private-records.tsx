"use client";

import { ExternalLink, FileText, Lock, Paperclip, Plus, X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import type { RecordData } from "./psychological-record-view";
import { formatDate } from "./record-utils";

type FreeNote = { id: string; date: string; content: string };
type InstrumentFile = { id: string; file: File; addedAt: string };

const today = () => {
  const date = new Date();
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const fileSize = (size: number) =>
  size < 1024 * 1024
    ? `${Math.ceil(size / 1024)} KB`
    : `${(size / (1024 * 1024)).toFixed(1)} MB`;

export function PsychologistPrivateRecords({
  sessions,
}: {
  sessions: RecordData["sessions"];
}) {
  const [analysis, setAnalysis] = useState({
    hypotheses: "",
    interpretations: "",
    symptoms: "",
  });
  const [anamnesis, setAnamnesis] = useState({
    familySocial: "",
    healthMedications: "",
    developmentRoutine: "",
  });
  const [triageObservations, setTriageObservations] = useState("");
  const [sessionNotes, setSessionNotes] = useState<Record<string, string>>({});
  const [freeNotes, setFreeNotes] = useState<FreeNote[]>([]);
  const [files, setFiles] = useState<InstrumentFile[]>([]);

  return (
    <div className="space-y-3 text-sm print:hidden">
      <div className="space-y-1">
        <p className="flex items-center gap-2 font-medium">
          <Lock className="h-4 w-4" aria-hidden="true" />
          Uso exclusivo do profissional
        </p>
        <p className="text-muted-foreground">
          Estes registros não integram a impressão ou o PDF do prontuário
          oficial.
        </p>
        <p className="text-muted-foreground text-xs" role="note">
          Rascunhos e arquivos temporários: mantidos apenas enquanto esta página
          estiver aberta, sem gravação no sistema.
        </p>
      </div>

      <Tabs defaultValue="triage" className="space-y-3">
        <TabsList
          aria-label="Seções dos registros do psicólogo"
          className="grid h-auto w-full grid-cols-1 gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 shadow-sm sm:grid-cols-2 xl:grid-cols-5"
        >
          <TabsTrigger
            value="triage"
            className="text-sm whitespace-normal text-slate-600 transition data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
          >
            Triagem
          </TabsTrigger>
          <TabsTrigger
            value="anamnesis"
            className="text-sm whitespace-normal text-slate-600 transition data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
          >
            Anamnese
          </TabsTrigger>
          <TabsTrigger
            value="analysis"
            className="text-sm whitespace-normal text-slate-600 transition data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
          >
            Hipóteses e análise clínica
          </TabsTrigger>
          <TabsTrigger
            value="notes"
            className="text-sm whitespace-normal text-slate-600 transition data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
          >
            Anotações privadas das sessões
          </TabsTrigger>
          <TabsTrigger
            value="instruments"
            className="text-sm whitespace-normal text-slate-600 transition data-[state=active]:bg-white data-[state=active]:font-semibold data-[state=active]:text-slate-950 data-[state=active]:shadow-sm"
          >
            Testes e instrumentos (SATEPSI)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="triage" className="mt-0 space-y-3">
          <h2 className="text-base font-semibold">Triagem</h2>
          <div>
            <Label htmlFor="triage-observations">Observações da Triagem</Label>
            <Textarea
              id="triage-observations"
              className="mt-1"
              rows={5}
              value={triageObservations}
              onChange={(event) => setTriageObservations(event.target.value)}
            />
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-0 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold">
              Anotações privadas das sessões
            </h2>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setFreeNotes((current) => [
                  ...current,
                  { id: crypto.randomUUID(), date: today(), content: "" },
                ])
              }
            >
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Nova anotação livre
            </Button>
          </div>
          {sessions.length === 0 && freeNotes.length === 0 && (
            <p className="text-muted-foreground py-4">
              Nenhuma sessão disponível. Crie uma anotação livre datada.
            </p>
          )}
          {sessions.map((session) => (
            <section key={session.id} className="space-y-2">
              <h3 className="font-medium">
                Sessão {session.sessionNumber} · {formatDate(session.date)} às{" "}
                {session.time}
              </h3>
              <Label htmlFor={`private-session-${session.id}`}>
                Rascunhos e percepções pessoais
              </Label>
              <Textarea
                id={`private-session-${session.id}`}
                rows={4}
                value={sessionNotes[session.id] ?? ""}
                onChange={(event) =>
                  setSessionNotes((current) => ({
                    ...current,
                    [session.id]: event.target.value,
                  }))
                }
                placeholder="Percepções pessoais e informações de terceiros ou responsáveis."
              />
            </section>
          ))}
          {freeNotes.map((note) => (
            <section key={note.id} className="space-y-2">
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <Label htmlFor={`private-date-${note.id}`}>
                    Data da anotação
                  </Label>
                  <Input
                    id={`private-date-${note.id}`}
                    type="date"
                    className="mt-1 h-8 w-auto text-sm"
                    value={note.date}
                    onChange={(event) =>
                      setFreeNotes((current) =>
                        current.map((item) =>
                          item.id === note.id
                            ? { ...item, date: event.target.value }
                            : item
                        )
                      )
                    }
                  />
                </div>
                <span className="text-muted-foreground py-1">
                  {formatDate(note.date)}
                </span>
              </div>
              <Label htmlFor={`private-note-${note.id}`}>Anotação livre</Label>
              <Textarea
                id={`private-note-${note.id}`}
                rows={4}
                value={note.content}
                onChange={(event) =>
                  setFreeNotes((current) =>
                    current.map((item) =>
                      item.id === note.id
                        ? { ...item, content: event.target.value }
                        : item
                    )
                  )
                }
                placeholder="Registro pessoal do profissional."
              />
            </section>
          ))}
        </TabsContent>

        <TabsContent value="anamnesis" className="mt-0 space-y-3">
          <h2 className="text-base font-semibold">Anamnese</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlFor="anamnesis-family-social">
                Histórico Familiar/Social
              </Label>
              <Textarea
                id="anamnesis-family-social"
                className="mt-1"
                rows={5}
                value={anamnesis.familySocial}
                onChange={(event) =>
                  setAnamnesis((current) => ({
                    ...current,
                    familySocial: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="anamnesis-health-medications">
                Histórico de Saúde e Medicações
              </Label>
              <Textarea
                id="anamnesis-health-medications"
                className="mt-1"
                rows={5}
                value={anamnesis.healthMedications}
                onChange={(event) =>
                  setAnamnesis((current) => ({
                    ...current,
                    healthMedications: event.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="anamnesis-development-routine">
                Desenvolvimento/Rotina
              </Label>
              <Textarea
                id="anamnesis-development-routine"
                className="mt-1"
                rows={5}
                value={anamnesis.developmentRoutine}
                onChange={(event) =>
                  setAnamnesis((current) => ({
                    ...current,
                    developmentRoutine: event.target.value,
                  }))
                }
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-0 space-y-3">
          <h2 className="text-base font-semibold">
            Hipóteses e análise clínica
          </h2>
          <div>
            <Label htmlFor="private-hypotheses">Hipóteses diagnósticas</Label>
            <Textarea
              id="private-hypotheses"
              className="mt-1"
              rows={4}
              value={analysis.hypotheses}
              onChange={(event) =>
                setAnalysis((current) => ({
                  ...current,
                  hypotheses: event.target.value,
                }))
              }
              placeholder="Registre hipóteses em investigação e elementos para avaliação."
            />
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlFor="private-interpretations">
                Interpretações teórico-clínicas não compartilhadas
              </Label>
              <Textarea
                id="private-interpretations"
                className="mt-1"
                rows={5}
                value={analysis.interpretations}
                onChange={(event) =>
                  setAnalysis((current) => ({
                    ...current,
                    interpretations: event.target.value,
                  }))
                }
                placeholder="Articulações teóricas e reflexões clínicas do profissional."
              />
            </div>
            <div>
              <Label htmlFor="private-symptoms">Análise de sintomas</Label>
              <Textarea
                id="private-symptoms"
                className="mt-1"
                rows={5}
                value={analysis.symptoms}
                onChange={(event) =>
                  setAnalysis((current) => ({
                    ...current,
                    symptoms: event.target.value,
                  }))
                }
                placeholder="Sintomas observados, contexto, frequência e possíveis relações."
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="instruments" className="mt-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-base font-semibold">
              Testes e instrumentos (SATEPSI)
            </h2>
            <Button size="sm" variant="outline" asChild>
              <a
                href="https://satepsi.cfp.org.br/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Consultar SATEPSI (abre em nova aba)"
              >
                <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
                Consultar SATEPSI
              </a>
            </Button>
          </div>
          <p className="text-muted-foreground">
            Folhas de respostas, escalas e materiais brutos de avaliação ficam
            separados dos documentos oficiais.
          </p>
          <div className="max-w-xl">
            <Label
              htmlFor="private-instrument-files"
              className="flex items-center gap-2"
            >
              <Paperclip className="h-4 w-4" aria-hidden="true" />
              Selecionar arquivos de avaliação
            </Label>
            <Input
              id="private-instrument-files"
              className="mt-1 h-auto text-sm"
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx,.csv,.txt"
              onChange={(event) => {
                const selected = Array.from(event.target.files ?? []);
                setFiles((current) => [
                  ...current,
                  ...selected.map((file) => ({
                    id: crypto.randomUUID(),
                    file,
                    addedAt: today(),
                  })),
                ]);
                event.target.value = "";
              }}
            />
          </div>
          {files.length === 0 ? (
            <p className="text-muted-foreground py-4">
              Nenhum arquivo selecionado.
            </p>
          ) : (
            <ul
              className="divide-y"
              aria-label="Arquivos de avaliação selecionados"
            >
              {files.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-2">
                  <FileText
                    className="text-muted-foreground h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium break-all">{item.file.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {formatDate(item.addedAt)} · {fileSize(item.file.size)} ·
                      Arquivo temporário
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={`Remover ${item.file.name} da seleção`}
                    onClick={() =>
                      setFiles((current) =>
                        current.filter((file) => file.id !== item.id)
                      )
                    }
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
