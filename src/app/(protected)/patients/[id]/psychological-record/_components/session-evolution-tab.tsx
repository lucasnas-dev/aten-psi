"use client";

import { ChevronDown, ChevronUp, Plus, Save, ShieldCheck } from "lucide-react";
import { useId, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import type { RecordData } from "./psychological-record-view";
import styles from "./psychological-record-view.module.css";
import { formatDate } from "./record-utils";

type Session = RecordData["sessions"][number];
type SessionFilter = "all" | "pending" | "signed";

const attendanceLabels = {
  attended: "Compareceu",
  excused: "Falta justificada",
  unexcused: "Falta não justificada",
  cancelled: "Cancelada / Remarcada",
} as const;

type Attendance = keyof typeof attendanceLabels;
type SessionEntry = {
  procedures: string;
  summary: string;
  attendance: Attendance | "";
};

const quickProcedures = [
  "Escuta clínica qualificada",
  "Acolhimento",
  "Psicoeducação",
  "Reestruturação cognitiva",
  "Análise funcional",
  "Interpretação clínica",
  "Regulação emocional",
  "Orientação parental/familiar",
  "Aplicação de instrumento/teste",
];

const initialEntry = (session: Session): SessionEntry => ({
  procedures: "",
  summary: session.content,
  // Uma consulta agendada ou uma falta sem classificação não confirma presença.
  attendance:
    session.status === "cancelada" || session.status === "remarcada"
      ? "cancelled"
      : session.attended
        ? "attended"
        : "",
});

export function SessionEvolutionTab({
  sessions,
  professional,
}: {
  sessions: RecordData["sessions"];
  professional: RecordData["professional"];
}) {
  const tabId = useId();
  const [filter, setFilter] = useState<SessionFilter>("all");
  const [entries, setEntries] = useState<Record<string, SessionEntry>>({});
  const [drafts, setDrafts] = useState<Record<string, boolean>>({});
  const [signatureTimes, setSignatureTimes] = useState<Record<string, string>>(
    {}
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [addenda, setAddenda] = useState<
    Record<string, { createdAt: string; text: string }>
  >({});

  const isImmutable = (session: Session) =>
    session.signed || Boolean(signatureTimes[session.id]);
  const matchesFilter = (session: Session) =>
    filter === "all" ||
    (filter === "signed" ? isImmutable(session) : !isImmutable(session));

  const updateEntry = (session: Session, patch: Partial<SessionEntry>) => {
    if (isImmutable(session)) return;
    setEntries((current) => ({
      ...current,
      [session.id]: {
        ...(current[session.id] ?? initialEntry(session)),
        ...patch,
      },
    }));
    setDrafts((current) => ({ ...current, [session.id]: false }));
  };

  const appendProcedure = (session: Session, procedure: string) => {
    if (isImmutable(session)) return;
    setEntries((current) => {
      const entry = current[session.id] ?? initialEntry(session);
      const previous = entry.procedures.trimEnd();
      return {
        ...current,
        [session.id]: {
          ...entry,
          procedures: previous ? `${previous}; ${procedure}` : procedure,
        },
      };
    });
    setDrafts((current) => ({ ...current, [session.id]: false }));
  };

  return (
    <TabsContent
      value="sessions"
      forceMount
      className={`${styles.officialSection} mt-0`}
    >
      <div className="min-w-0 space-y-3">
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-b pb-2 print:hidden">
          <p className="text-muted-foreground text-xs">
            Evite transcrições literais; registre somente a síntese técnica
            necessária.
          </p>
          <Label htmlFor={`${tabId}-filter`} className="sr-only">
            Filtrar sessões
          </Label>
          <Select
            value={filter}
            onValueChange={(next) => {
              if (next === "all" || next === "pending" || next === "signed") {
                setFilter(next);
              }
            }}
          >
            <SelectTrigger id={`${tabId}-filter`} className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="print:hidden">
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="pending">Pendentes de assinatura</SelectItem>
              <SelectItem value="signed">Assinadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {sessions.length === 0 && (
          <p className="text-muted-foreground py-3 text-center text-sm">
            Nenhuma sessão registrada.
          </p>
        )}
        {sessions.length > 0 && !sessions.some(matchesFilter) && (
          <p
            role="status"
            className="text-muted-foreground py-3 text-center text-sm print:hidden"
          >
            Nenhuma sessão corresponde ao filtro selecionado.
          </p>
        )}
        {sessions.map((session) => {
          const immutable = isImmutable(session);
          const entry = entries[session.id] ?? initialEntry(session);
          const isOpen = !immutable || Boolean(expanded[session.id]);
          const sessionId = `${tabId}-${session.id}`;
          const absent =
            entry.attendance !== "" && entry.attendance !== "attended";
          const addendum = addenda[session.id];

          return (
            <section
              key={session.id}
              aria-labelledby={`${sessionId}-title`}
              data-filtered={!matchesFilter(session)}
              className={`${styles.sessionRecord} min-w-0 space-y-2 border-b pb-3`}
            >
              <header className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                  <h3
                    id={`${sessionId}-title`}
                    className="text-sm font-semibold"
                  >
                    Sessão {session.sessionNumber} · {formatDate(session.date)}{" "}
                    às {session.time}
                  </h3>
                  <p className="text-muted-foreground text-xs break-words">
                    {session.modality || "Modalidade não informada"} ·{" "}
                    {session.duration} min ·{" "}
                    {session.type || "Tipo não informado"}
                  </p>
                </div>
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Badge variant={immutable ? "default" : "outline"}>
                    {immutable ? "Assinada e imutável" : session.status}
                  </Badge>
                  <Label
                    htmlFor={`${sessionId}-attendance`}
                    className="sr-only"
                  >
                    Registro de presença da sessão {session.sessionNumber}
                  </Label>
                  <Select
                    value={entry.attendance}
                    disabled={immutable}
                    onValueChange={(next) => {
                      if (Object.hasOwn(attendanceLabels, next)) {
                        updateEntry(session, {
                          attendance: next as Attendance,
                        });
                      }
                    }}
                  >
                    <SelectTrigger
                      id={`${sessionId}-attendance`}
                      className="h-7 text-xs print:hidden"
                    >
                      <SelectValue placeholder="Registrar presença" />
                    </SelectTrigger>
                    <SelectContent className="print:hidden">
                      {Object.entries(attendanceLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground hidden text-xs print:block">
                    Presença:{" "}
                    {entry.attendance
                      ? attendanceLabels[entry.attendance]
                      : "Não registrada"}
                  </p>
                  {immutable && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs print:hidden"
                      aria-expanded={isOpen}
                      aria-controls={`${sessionId}-body`}
                      aria-label={`${isOpen ? "Recolher" : "Expandir"} sessão ${session.sessionNumber}`}
                      onClick={() =>
                        setExpanded((current) => ({
                          ...current,
                          [session.id]: !isOpen,
                        }))
                      }
                    >
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="h-4 w-4" aria-hidden="true" />
                      )}
                      {isOpen ? "Recolher" : "Expandir"}
                    </Button>
                  )}
                </div>
              </header>
              <div
                id={`${sessionId}-body`}
                data-collapsed={!isOpen}
                className={`${styles.sessionBody} min-w-0 space-y-3`}
              >
                <div className="min-w-0 space-y-1">
                  <Label
                    htmlFor={`${sessionId}-procedures`}
                    className="text-sm"
                  >
                    Procedimentos técnico-científicos adotados
                  </Label>
                  <div
                    role="group"
                    aria-label={`Procedimentos rápidos da sessão ${session.sessionNumber}`}
                    className="flex flex-wrap gap-1 print:hidden"
                  >
                    {quickProcedures.map((procedure) => (
                      <Button
                        key={procedure}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-auto min-h-6 max-w-full px-2 py-0.5 text-xs whitespace-normal"
                        disabled={immutable}
                        onClick={() => appendProcedure(session, procedure)}
                      >
                        {procedure}
                      </Button>
                    ))}
                  </div>
                  <Textarea
                    id={`${sessionId}-procedures`}
                    rows={2}
                    className="field-sizing-fixed min-h-0 print:hidden"
                    disabled={immutable}
                    value={entry.procedures}
                    onChange={(event) =>
                      updateEntry(session, { procedures: event.target.value })
                    }
                    placeholder="Descreva os procedimentos adotados; use as sugestões ou digite livremente."
                  />
                  <p className="hidden text-sm break-words whitespace-pre-wrap print:block">
                    {entry.procedures || "Não informado"}
                  </p>
                </div>
                <div className="min-w-0 space-y-1">
                  <Label htmlFor={`${sessionId}-summary`} className="text-sm">
                    Síntese da evolução
                  </Label>
                  <Textarea
                    id={`${sessionId}-summary`}
                    rows={4}
                    className="field-sizing-fixed print:hidden"
                    disabled={immutable}
                    value={entry.summary}
                    onChange={(event) =>
                      updateEntry(session, { summary: event.target.value })
                    }
                    placeholder={
                      absent
                        ? "Registre o motivo da ausência ou do cancelamento, se conhecido, e a conduta adotada, incluindo contato, orientação ou remarcação."
                        : "Registre a síntese técnica da evolução, os resultados observados e a conduta adotada."
                    }
                  />
                  <p className="hidden text-sm break-words whitespace-pre-wrap print:block">
                    {entry.summary || "Não informado"}
                  </p>
                </div>
                {!immutable && (
                  <div className="flex flex-wrap items-center justify-end gap-2 print:hidden">
                    <p role="status" className="text-muted-foreground text-xs">
                      {drafts[session.id] &&
                        "Rascunho salvo apenas nesta página."}
                    </p>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setDrafts((current) => ({
                          ...current,
                          [session.id]: true,
                        }))
                      }
                    >
                      <Save className="h-4 w-4" aria-hidden="true" />
                      Salvar rascunho
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      className="h-auto min-h-7 max-w-full whitespace-normal"
                      onClick={() => {
                        setEntries((current) => ({
                          ...current,
                          [session.id]:
                            current[session.id] ?? initialEntry(session),
                        }));
                        setSignatureTimes((current) => ({
                          ...current,
                          [session.id]: new Date().toISOString(),
                        }));
                        setExpanded((current) => ({
                          ...current,
                          [session.id]: true,
                        }));
                      }}
                    >
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      Finalizar e assinar registro
                    </Button>
                  </div>
                )}
                {immutable && (
                  <div className="min-w-0 space-y-2 border-t pt-2">
                    <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                      <Badge variant="outline">
                        <ShieldCheck aria-hidden="true" />
                        Assinatura eletrônica
                      </Badge>
                      <span>{professional.name || "Nome não informado"}</span>
                      <span>CRP: {professional.crp || "Não informado"}</span>
                      {signatureTimes[session.id] ? (
                        <time dateTime={signatureTimes[session.id]}>
                          {new Date(signatureTimes[session.id]).toLocaleString(
                            "pt-BR"
                          )}
                        </time>
                      ) : (
                        <span>Data/hora da assinatura não informada</span>
                      )}
                    </div>
                    {signatureTimes[session.id] && (
                      <p className="text-muted-foreground text-xs print:hidden">
                        Finalização apenas nesta página, sem gravação no sistema
                        ou validação de assinatura digital.
                      </p>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="print:hidden"
                      onClick={() =>
                        setAddenda((current) => ({
                          ...current,
                          [session.id]: current[session.id] ?? {
                            createdAt: new Date().toISOString(),
                            text: "",
                          },
                        }))
                      }
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Adicionar adendo / errata
                    </Button>
                    {addendum && (
                      <div className="min-w-0 space-y-1">
                        <Label
                          htmlFor={`${sessionId}-addendum`}
                          className="text-sm"
                        >
                          Adendo / errata ·{" "}
                          {new Date(addendum.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </Label>
                        <Textarea
                          id={`${sessionId}-addendum`}
                          className="print:hidden"
                          value={addendum.text}
                          onChange={(event) => {
                            const text = event.target.value;
                            setAddenda((current) => ({
                              ...current,
                              [session.id]: { ...current[session.id], text },
                            }));
                          }}
                          placeholder="Registre a correção ou informação complementar, sem alterar o registro original."
                        />
                        <p className="hidden text-sm break-words whitespace-pre-wrap print:block">
                          {addendum.text || "Não informado"}
                        </p>
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
  );
}
