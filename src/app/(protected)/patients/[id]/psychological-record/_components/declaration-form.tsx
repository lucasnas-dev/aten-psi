"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, FileCheck2, Printer } from "lucide-react";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useId, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { issueDeclaration } from "@/actions/issue-declaration";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  declarationFormSchema,
  type DeclarationFormValues,
  declarationWarning,
  type IssuedDocumentSummary,
} from "@/lib/documents/declaration";

const identityFields = [
  {
    name: "companionName",
    label: "Nome do acompanhante (opcional)",
    max: 255,
    required: false,
  },
  { name: "purpose", label: "Finalidade", max: 1000, required: true },
  { name: "recipient", label: "Destinatário", max: 255, required: true },
] as const;
const attendanceFields = [
  {
    name: "attendanceLocation",
    label: "Local do comparecimento",
    placeholder: "Clínica, instituição ou atendimento on-line",
    max: 500,
  },
  {
    name: "attendanceDates",
    label: "Dias / datas",
    placeholder: "Ex.: 05-11-2026 ou terças-feiras",
    max: 500,
  },
  {
    name: "attendanceTimes",
    label: "Horários",
    placeholder: "Ex.: das 14h às 14h50",
    max: 255,
  },
  {
    name: "attendanceDuration",
    label: "Duração do acompanhamento",
    placeholder: "Ex.: 50 minutos; acompanhamento desde 01-10-2026",
    max: 255,
  },
] as const;

export function DeclarationForm({
  patient,
  professional,
  onIssued,
}: {
  patient: { id: string; name: string; socialName: string | null };
  professional: { name: string; crp: string };
  onIssued: (document: IssuedDocumentSummary) => void;
}) {
  const id = useId();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastIssued, setLastIssued] = useState<IssuedDocumentSummary | null>(
    null
  );
  const request = useRef<{ fingerprint: string; id: string } | null>(null);
  const form = useForm<DeclarationFormValues>({
    resolver: zodResolver(declarationFormSchema),
    defaultValues: {
      companionName: "",
      purpose: "",
      recipient: "",
      attendanceLocation: "",
      attendanceDates: "",
      attendanceTimes: "",
      attendanceDuration: "",
      issuanceLocation: "",
      ethicalReview: false,
    },
  });
  const { execute, isExecuting } = useAction(issueDeclaration, {
    onSuccess: ({ data }) => {
      if (!data?.success) {
        setSubmitError(data?.error ?? "Não foi possível confirmar a emissão.");
        return;
      }
      setLastIssued(data.document);
      onIssued(data.document);
      request.current = null;
      toast.success(
        "Declaração registrada no histórico. A versão para impressão está disponível."
      );
    },
    onError: () => {
      setSubmitError(
        "Não foi possível emitir a declaração. Revise os campos ou tente novamente."
      );
    },
  });
  const professionalReady = Boolean(
    professional.name.trim() && professional.crp.trim()
  );

  return (
    <div className="min-w-0 space-y-3">
      <Alert className="border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
        <AlertTriangle aria-hidden="true" />
        <AlertDescription className="text-current">
          {declarationWarning}
        </AlertDescription>
      </Alert>
      {!professionalReady && (
        <Alert>
          <AlertDescription>
            Preencha nome e CRP nas{" "}
            <Link href="/settings" className="underline">
              Configurações
            </Link>{" "}
            antes de emitir documentos.
          </AlertDescription>
        </Alert>
      )}
      {submitError && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form
          className="min-w-0 space-y-3"
          onSubmit={form.handleSubmit((values) => {
            if (isExecuting) return;
            setSubmitError(null);
            setLastIssued(null);
            const payload = {
              ...values,
              patientId: patient.id,
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            };
            const fingerprint = JSON.stringify(payload);
            if (request.current?.fingerprint !== fingerprint) {
              request.current = { fingerprint, id: crypto.randomUUID() };
            }
            execute({ ...payload, requestId: request.current!.id });
          })}
          aria-busy={isExecuting}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="min-w-0 space-y-1">
              <Label htmlFor={`${id}-patient`}>Nome da pessoa atendida</Label>
              <Input
                id={`${id}-patient`}
                value={patient.socialName?.trim() || patient.name}
                readOnly
              />
            </div>
            {identityFields.map((item) => (
              <FormField
                key={item.name}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        maxLength={item.max}
                        required={item.required}
                        disabled={isExecuting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <section className="space-y-3" aria-labelledby={`${id}-attendance`}>
            <h3 id={`${id}-attendance`} className="text-sm font-semibold">
              Informações de Comparecimento
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {attendanceFields.map((item) => (
                <FormField
                  key={item.name}
                  control={form.control}
                  name={item.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{item.label}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={item.placeholder}
                          maxLength={item.max}
                          required
                          disabled={isExecuting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </section>
          <FormField
            control={form.control}
            name="issuanceLocation"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>Local de emissão</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Ex.: Manaus/AM"
                    maxLength={255}
                    required
                    disabled={isExecuting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-muted-foreground text-xs">
            A data de emissão, o nome e o CRP do profissional serão registrados
            automaticamente. A impressão reserva espaço para carimbo e
            assinatura, sem simular assinatura eletrônica.
          </p>
          <FormField
            control={form.control}
            name="ethicalReview"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      className="accent-primary mt-0.5 h-4 w-4 shrink-0"
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      disabled={isExecuting}
                    />
                  </FormControl>
                  <FormLabel className="leading-5 font-normal">
                    Revisei o texto e confirmo que contém apenas informações
                    objetivas de comparecimento, sem sintomas, situações ou
                    estados psicológicos e sem CID.
                  </FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="submit"
              size="sm"
              disabled={isExecuting || !professionalReady}
            >
              <FileCheck2 className="mr-2 h-4 w-4" aria-hidden="true" />
              {isExecuting ? "Registrando..." : "Emitir documento"}
            </Button>
            {lastIssued && (
              <Button size="sm" variant="outline" asChild>
                <Link
                  href={`/patients/${patient.id}/psychological-record/documents/${lastIssued.id}/print`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
                  Imprimir / PDF da declaração emitida
                </Link>
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
