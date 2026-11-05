"use client";

import { FileCheck2, Plus, Save } from "lucide-react";
import { useId, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import styles from "./psychological-record-view.module.css";
import { formatDate } from "./record-utils";

type NetworkKind = "referral" | "notification";
type NetworkDraft = {
  date: string;
  recipient: string;
  specialty: string;
  notes: string;
};
type NetworkRecord = NetworkDraft & { id: number; kind: NetworkKind };

const specialties = [
  "Psiquiatria",
  "Neurologia",
  "Fonoaudiologia",
  "Psicopedagogia",
  "Escola",
  "Rede de Proteção / Conselho Tutelar",
  "SINAN",
  "Outra especialidade",
];
const closingReasons = [
  "Alta / Objetivos terapêuticos atingidos",
  "Conclusão de processo de avaliação psicológica",
  "Desistência / Interrupção a pedido do paciente",
  "Abandono (ausências sucessivas sem retorno)",
  "Transferência para outro profissional/serviço",
  "Encerramento institucional / contratual",
];
const finalConducts = [
  "Retorno sob demanda / portas abertas",
  "Orientações finais realizadas em sessão devolutiva",
  "Busca ativa e tentativas de contato registradas",
  "Seguimento em serviço externo",
  "Sem pendências clínicas",
];

const emptyNetworkDraft = (): NetworkDraft => {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
  return { date, recipient: "", specialty: "", notes: "" };
};

export function RecordClosingTab() {
  const id = useId();
  const [activeForm, setActiveForm] = useState<NetworkKind | null>(null);
  const [networkDrafts, setNetworkDrafts] = useState<
    Record<NetworkKind, NetworkDraft>
  >(() => ({
    referral: emptyNetworkDraft(),
    notification: emptyNetworkDraft(),
  }));
  const [networkRecords, setNetworkRecords] = useState<NetworkRecord[]>([]);
  const [networkFeedback, setNetworkFeedback] = useState("");
  const [closing, setClosing] = useState({
    reason: "",
    date: "",
    finalConduct: "",
    summary: "",
  });
  const [closingSavedAt, setClosingSavedAt] = useState<Date | null>(null);

  const updateClosing = (field: keyof typeof closing, value: string) => {
    setClosing((current) => ({ ...current, [field]: value }));
    setClosingSavedAt(null);
  };
  const updateNetworkDraft = (
    kind: NetworkKind,
    patch: Partial<NetworkDraft>
  ) => {
    setNetworkDrafts((current) => ({
      ...current,
      [kind]: { ...current[kind], ...patch },
    }));
  };

  return (
    <TabsContent
      value="closing"
      forceMount
      className={`${styles.officialSection} mt-0`}
    >
      <div className="min-w-0 space-y-3">
        <section
          className="min-w-0 space-y-3"
          aria-labelledby={`${id}-network`}
        >
          <header className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <h3 id={`${id}-network`} className="text-sm font-semibold">
              Encaminhamentos e notificações
            </h3>
            <div className="flex min-w-0 flex-wrap gap-2 print:hidden">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-auto min-h-7 max-w-full whitespace-normal print:hidden"
                aria-expanded={activeForm === "referral"}
                aria-controls={`${id}-network-form`}
                onClick={() => {
                  setActiveForm((current) =>
                    current === "referral" ? null : "referral"
                  );
                  setNetworkFeedback("");
                }}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Novo encaminhamento
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-auto min-h-7 max-w-full whitespace-normal print:hidden"
                aria-expanded={activeForm === "notification"}
                aria-controls={`${id}-network-form`}
                onClick={() => {
                  setActiveForm((current) =>
                    current === "notification" ? null : "notification"
                  );
                  setNetworkFeedback("");
                }}
              >
                <FileCheck2 className="h-4 w-4" aria-hidden="true" />
                Notificação compulsória (SINAN / Ofício)
              </Button>
            </div>
          </header>
          <datalist id={`${id}-specialties`}>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty} />
            ))}
          </datalist>
          {activeForm && (
            <form
              id={`${id}-network-form`}
              aria-label={
                activeForm === "referral"
                  ? "Novo encaminhamento"
                  : "Nova notificação"
              }
              className="min-w-0 space-y-3 print:hidden"
              onSubmit={(event) => {
                event.preventDefault();
                const draft = networkDrafts[activeForm];
                if (!draft.recipient.trim() || !draft.notes.trim()) {
                  setNetworkFeedback(
                    "Informe o destinatário e o motivo, orientações e conduta."
                  );
                  return;
                }
                const record = {
                  ...draft,
                  recipient: draft.recipient.trim(),
                  specialty: draft.specialty.trim(),
                  notes: draft.notes.trim(),
                  kind: activeForm,
                };
                setNetworkRecords((current) => [
                  ...current,
                  { ...record, id: current.length },
                ]);
                setNetworkDrafts((current) => ({
                  ...current,
                  [activeForm]: emptyNetworkDraft(),
                }));
                setNetworkFeedback(
                  activeForm === "referral"
                    ? "Encaminhamento adicionado à lista nesta página, sem gravação permanente."
                    : "Notificação adicionada à lista nesta página, sem gravação permanente. Nenhum envio realizado."
                );
                setActiveForm(null);
              }}
            >
              <div className="grid grid-cols-1 items-end gap-2.5 sm:grid-cols-3">
                <div className="min-w-0 space-y-1">
                  <Label
                    htmlFor={`${id}-network-date`}
                    className="text-muted-foreground text-sm"
                  >
                    Data
                  </Label>
                  <Input
                    id={`${id}-network-date`}
                    type="date"
                    required
                    value={networkDrafts[activeForm].date}
                    onChange={(event) =>
                      updateNetworkDraft(activeForm, {
                        date: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="min-w-0 space-y-1">
                  <Label
                    htmlFor={`${id}-network-recipient`}
                    className="text-muted-foreground text-sm"
                  >
                    Destinatário / Profissional ou Órgão
                  </Label>
                  <Input
                    id={`${id}-network-recipient`}
                    required
                    placeholder="Profissional, serviço ou órgão"
                    value={networkDrafts[activeForm].recipient}
                    onChange={(event) =>
                      updateNetworkDraft(activeForm, {
                        recipient: event.target.value,
                      })
                    }
                  />
                </div>
                <div className="min-w-0 space-y-1">
                  <Label
                    htmlFor={`${id}-network-specialty`}
                    className="text-muted-foreground text-sm"
                  >
                    Especialidade / Tipo
                  </Label>
                  <Input
                    id={`${id}-network-specialty`}
                    list={`${id}-specialties`}
                    autoComplete="off"
                    placeholder="Selecione ou digite livremente"
                    value={networkDrafts[activeForm].specialty}
                    onChange={(event) =>
                      updateNetworkDraft(activeForm, {
                        specialty: event.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="min-w-0 space-y-1">
                <Label
                  htmlFor={`${id}-network-notes`}
                  className="text-muted-foreground text-sm"
                >
                  Motivo, orientações e conduta
                </Label>
                <Textarea
                  id={`${id}-network-notes`}
                  rows={2}
                  className="field-sizing-fixed min-h-0"
                  required
                  placeholder="Registre a justificativa técnica, as orientações e a articulação com o profissional, serviço ou órgão destinatário."
                  value={networkDrafts[activeForm].notes}
                  onChange={(event) =>
                    updateNetworkDraft(activeForm, {
                      notes: event.target.value,
                    })
                  }
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button type="submit" size="sm" variant="outline">
                  <Save className="h-4 w-4" aria-hidden="true" />
                  {activeForm === "referral"
                    ? "Salvar encaminhamento na lista"
                    : "Salvar notificação na lista"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveForm(null)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
          <div
            role="status"
            aria-atomic="true"
            className="text-muted-foreground text-xs print:hidden"
          >
            {networkFeedback}
          </div>
          {networkRecords.length > 0 && (
            <ul
              className="divide-y border-t text-sm"
              aria-label="Encaminhamentos e notificações registrados"
            >
              {networkRecords.map((record) => (
                <li key={record.id} className="min-w-0 space-y-1 py-2">
                  <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h4 className="text-sm font-semibold">
                      {record.kind === "referral"
                        ? "Encaminhamento"
                        : "Notificação"}
                    </h4>
                    <dl className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
                      <div>
                        <dt className="sr-only">Data</dt>
                        <dd className="text-muted-foreground text-xs">
                          <time dateTime={record.date}>
                            {formatDate(record.date)}
                          </time>
                        </dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="sr-only">
                          Destinatário / Profissional ou Órgão
                        </dt>
                        <dd className="break-words">{record.recipient}</dd>
                      </div>
                      {record.specialty && (
                        <div className="min-w-0">
                          <dt className="sr-only">Especialidade / Tipo</dt>
                          <dd className="text-muted-foreground text-xs break-words">
                            {record.specialty}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  <p className="break-words whitespace-pre-wrap">
                    {record.notes}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section
          className="min-w-0 space-y-3 border-t pt-3"
          aria-labelledby={`${id}-closing`}
        >
          <h3 id={`${id}-closing`} className="text-sm font-semibold">
            Encerramento do acompanhamento
          </h3>
          <form
            className="min-w-0 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              setClosingSavedAt(new Date());
            }}
          >
            <div className="grid grid-cols-1 items-end gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="min-w-0 space-y-1">
                <Label
                  htmlFor={`${id}-reason`}
                  className="text-muted-foreground text-sm"
                >
                  Motivo do encerramento
                </Label>
                <Input
                  id={`${id}-reason`}
                  list={`${id}-reasons`}
                  className="print:hidden"
                  autoComplete="off"
                  placeholder="Selecione ou digite livremente"
                  value={closing.reason}
                  onChange={(event) =>
                    updateClosing("reason", event.target.value)
                  }
                />
                <datalist id={`${id}-reasons`}>
                  {closingReasons.map((reason) => (
                    <option key={reason} value={reason} />
                  ))}
                </datalist>
                <p className="hidden text-sm break-words print:block">
                  {closing.reason || "Não informado"}
                </p>
              </div>
              <div className="min-w-0 space-y-1">
                <Label
                  htmlFor={`${id}-closing-date`}
                  className="text-muted-foreground text-sm"
                >
                  Data do encerramento
                </Label>
                <Input
                  id={`${id}-closing-date`}
                  type="date"
                  className="print:hidden"
                  value={closing.date}
                  onChange={(event) =>
                    updateClosing("date", event.target.value)
                  }
                />
                <p className="hidden text-sm print:block">
                  {closing.date ? formatDate(closing.date) : "Não informada"}
                </p>
              </div>
              <div className="min-w-0 space-y-1">
                <Label
                  htmlFor={`${id}-conduct`}
                  className="text-muted-foreground text-sm"
                >
                  Conduta pós-encerramento / Encaminhamento final
                </Label>
                <Input
                  id={`${id}-conduct`}
                  list={`${id}-conducts`}
                  className="print:hidden"
                  autoComplete="off"
                  placeholder="Selecione ou digite livremente"
                  value={closing.finalConduct}
                  onChange={(event) =>
                    updateClosing("finalConduct", event.target.value)
                  }
                />
                <datalist id={`${id}-conducts`}>
                  {finalConducts.map((conduct) => (
                    <option key={conduct} value={conduct} />
                  ))}
                </datalist>
                <p className="hidden text-sm break-words print:block">
                  {closing.finalConduct || "Não informada"}
                </p>
              </div>
            </div>
            <div className="min-w-0 space-y-1">
              <Label
                htmlFor={`${id}-summary`}
                className="text-muted-foreground text-sm"
              >
                Síntese final e evolução do processo
              </Label>
              <Textarea
                id={`${id}-summary`}
                rows={4}
                className="field-sizing-fixed print:hidden"
                placeholder="Sintetize a evolução e os resultados alcançados, a devolutiva realizada e as orientações finais. Em caso de abandono, registre as tentativas de contato e a conduta adotada, com as informações técnicas necessárias ao prontuário."
                value={closing.summary}
                onChange={(event) =>
                  updateClosing("summary", event.target.value)
                }
              />
              <p className="hidden text-sm break-words whitespace-pre-wrap print:block">
                {closing.summary || "Não informada"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 print:hidden">
              <Button type="submit" size="sm">
                <Save className="h-4 w-4" aria-hidden="true" />
                Salvar encerramento
              </Button>
              <p
                role="status"
                aria-atomic="true"
                className="text-muted-foreground min-w-0 text-xs"
              >
                {closingSavedAt && (
                  <>
                    Encerramento atualizado em{" "}
                    <time dateTime={closingSavedAt.toISOString()}>
                      {closingSavedAt.toLocaleString("pt-BR", {
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
        </section>
      </div>
    </TabsContent>
  );
}
