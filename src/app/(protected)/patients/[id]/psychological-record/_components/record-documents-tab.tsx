"use client";

import { FileCheck2, FileText, Printer } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  formatDeclarationDate,
  type IssuedDocumentSummary,
} from "@/lib/documents/declaration";

import { DeclarationForm } from "./declaration-form";
import type { RecordData } from "./psychological-record-view";
import styles from "./psychological-record-view.module.css";

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

export function RecordDocumentsTab({
  patient,
  professional,
  initialDocuments,
  loadError,
}: {
  patient: RecordData["patient"];
  professional: RecordData["professional"];
  initialDocuments: IssuedDocumentSummary[];
  loadError?: string;
}) {
  const router = useRouter();
  const [activeDocument, setActiveDocument] = useState(documents[0]);
  const [documentFieldValues, setDocumentFieldValues] = useState<
    Record<string, string>
  >({});
  const [cidAuthorized, setCidAuthorized] = useState(false);
  const [newDocuments, setNewDocuments] = useState<IssuedDocumentSummary[]>([]);
  const history = Array.from(
    new Map(
      [...initialDocuments, ...newDocuments].map((item) => [item.id, item])
    ).values()
  ).sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));

  return (
    <TabsContent
      value="documents"
      forceMount
      className={`${styles.officialSection} mt-0`}
    >
      <div className="min-w-0 space-y-3">
        <div className="space-y-3 print:hidden">
          <div
            className="grid gap-2 sm:grid-cols-3"
            role="group"
            aria-label="Modalidade de documento"
          >
            {documents.map((item) => (
              <Button
                type="button"
                size="sm"
                key={item}
                aria-pressed={activeDocument === item}
                variant={activeDocument === item ? "default" : "outline"}
                onClick={() => setActiveDocument(item)}
                className="h-auto min-h-8 min-w-0 whitespace-normal"
              >
                <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                {item}
              </Button>
            ))}
          </div>
          {activeDocument === "Declaração" ? (
            <DeclarationForm
              patient={patient}
              professional={professional}
              onIssued={(document) =>
                setNewDocuments((current) => [
                  document,
                  ...current.filter((item) => item.id !== document.id),
                ])
              }
            />
          ) : (
            <div className="space-y-3">
              <p className="font-medium">Emitir {activeDocument}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {documentFields.map((field) => (
                  <div
                    key={field}
                    className={
                      field === "Solicitante" || field === "Finalidade"
                        ? ""
                        : "sm:col-span-2"
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
              {activeDocument === "Atestado" && (
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={cidAuthorized}
                    onChange={(event) => setCidAuthorized(event.target.checked)}
                  />
                  Autorização do paciente para uso de CID
                </label>
              )}
              <Button
                type="button"
                size="sm"
                onClick={() =>
                  toast.info(
                    "A emissão desta modalidade ainda não está disponível. Nenhum documento foi registrado."
                  )
                }
              >
                <FileCheck2 className="mr-2 h-4 w-4" aria-hidden="true" />
                Emitir documento
              </Button>
            </div>
          )}
        </div>
        <section
          className="min-w-0 space-y-3 border-t pt-3"
          aria-label="Histórico de documentos emitidos"
        >
          <h3 className="text-sm font-semibold">
            Histórico de documentos emitidos
          </h3>
          {loadError && (
            <Alert variant="destructive" className="print:hidden">
              <AlertDescription>
                {loadError}{" "}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => router.refresh()}
                >
                  Tentar novamente
                </Button>
              </AlertDescription>
            </Alert>
          )}
          <div className="min-w-0 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm print:min-w-0">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Data de emissão</th>
                  <th className="p-2">Finalidade</th>
                  <th className="p-2">Destinatário</th>
                  <th className="p-2">Status de devolutiva</th>
                  <th className="p-2 print:hidden">
                    <span className="sr-only">Ações</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td className="text-muted-foreground p-2" colSpan={5}>
                      {loadError
                        ? "Histórico indisponível."
                        : "Nenhum documento emitido."}
                    </td>
                  </tr>
                ) : (
                  history.map((item) => (
                    <tr key={item.id} className="border-b align-top">
                      <td className="p-2 whitespace-nowrap">
                        {formatDeclarationDate(item.issuedOn)}
                      </td>
                      <td className="p-2 break-words">
                        <p>{item.purpose}</p>
                        <p className="text-muted-foreground text-xs">
                          Declaração
                        </p>
                      </td>
                      <td className="p-2 break-words">{item.recipient}</td>
                      <td className="p-2">
                        <Badge variant="outline">Não se aplica</Badge>
                      </td>
                      <td className="p-2 print:hidden">
                        <Button size="sm" variant="outline" asChild>
                          <Link
                            href={`/patients/${patient.id}/psychological-record/documents/${item.id}/print`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Imprimir declaração de ${formatDeclarationDate(item.issuedOn)}`}
                          >
                            <Printer className="h-4 w-4" aria-hidden="true" />
                            <span className="sr-only">Imprimir / PDF</span>
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </TabsContent>
  );
}
