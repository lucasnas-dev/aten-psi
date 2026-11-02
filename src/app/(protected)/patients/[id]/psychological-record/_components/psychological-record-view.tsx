"use client";

import {
  AlertCircle,
  ArrowLeft,
  Download,
  FileText,
  Lock,
  Printer,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

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
const ageOf = (value: string) => {
  const birth = new Date(value);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate()))
    age--;
  return age;
};
const value = (text?: string | null) => text?.trim() || "Não informado";

export function PsychologicalRecordView({
  data,
  loadError,
}: {
  data: RecordData | null;
  loadError?: string;
}) {
  const [secret, setSecret] = useState(false);
  const [signed, setSigned] = useState<Record<string, boolean>>({});
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
  const minor = ageOf(data.patient.birthDate) < 18;
  return (
    <div className="container mx-auto space-y-6 p-6 print:p-0">
      <header className="flex flex-col justify-between gap-4 sm:flex-row print:hidden">
        <div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/patients/${data.patient.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao paciente
            </Link>
          </Button>
          <h1 className="mt-3 text-3xl font-bold">Prontuário psicológico</h1>
          <p className="text-muted-foreground">
            Registro clínico conforme CFP e Lei nº 13.787/2018.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimir / PDF
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </header>
      <Card>
        <CardContent className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-muted-foreground text-sm">Paciente</p>
            <h2 className="text-xl font-semibold">
              {data.patient.socialName?.trim() || data.patient.name}
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-lg border p-3">
            <Lock className="h-4 w-4" />
            <Label htmlFor="secret">Modo de sigilo</Label>
            <Switch id="secret" checked={secret} onCheckedChange={setSecret} />
          </div>
        </CardContent>
      </Card>
      <Tabs defaultValue="identification">
        <TabsList className="grid h-auto w-full grid-cols-2 sm:grid-cols-5">
          <TabsTrigger value="identification">1. Identificação</TabsTrigger>
          <TabsTrigger value="plan">2. Demanda e plano</TabsTrigger>
          <TabsTrigger value="sessions">3. Evolução e sessões</TabsTrigger>
          <TabsTrigger value="closing">4. Encerramento</TabsTrigger>
          <TabsTrigger value="documents">5. Documentos</TabsTrigger>
        </TabsList>
        <TabsContent value="identification">
          <Card>
            <CardHeader>
              <CardTitle>Identificação</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Nome social</Label>
                <p className="mt-1 text-lg font-semibold">
                  {value(data.patient.socialName)}
                </p>
                <p className="text-muted-foreground text-sm">
                  Nome civil: {data.patient.name}
                </p>
              </div>
              <div>
                <Label>Nascimento</Label>
                <p className="mt-1">
                  {data.patient.birthDate} ({ageOf(data.patient.birthDate)}{" "}
                  anos)
                </p>
              </div>
              <div>
                <Label>CPF</Label>
                <p className="mt-1">{value(data.patient.cpf)}</p>
              </div>
              <div>
                <Label>Contato</Label>
                <p className="mt-1">
                  {value(data.patient.phone)} · {value(data.patient.email)}
                </p>
              </div>
              <div className="sm:col-span-2">
                <Label>Endereço</Label>
                <p className="mt-1">{value(data.patient.address)}</p>
              </div>
              {minor && (
                <div className="rounded border border-amber-200 bg-amber-50 p-4 sm:col-span-2">
                  <p className="font-medium">Responsável legal</p>
                  <p className="text-sm">
                    CPF: {value(data.patient.responsibleCpf)}
                  </p>
                  <Badge
                    className="mt-2"
                    variant={
                      data.patient.responsibleCpf ? "default" : "destructive"
                    }
                  >
                    {data.patient.responsibleCpf
                      ? "Termo de autorização: verificar assinatura"
                      : "Termo de autorização pendente"}
                  </Badge>
                </div>
              )}
              <div className="sm:col-span-2">
                <Label>Contato de emergência</Label>
                <Input placeholder="Nome e telefone" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="plan">
          <Card>
            <CardHeader>
              <CardTitle>Demanda e plano terapêutico</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <Label>Previsão de duração</Label>
                  <Input className="mt-1" />
                </div>
              </div>
              <Button>Salvar plano terapêutico</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sessions">
          <div className="space-y-4">
            {data.sessions.length === 0 && (
              <Card>
                <CardContent className="text-muted-foreground p-6 text-center">
                  Nenhuma sessão registrada.
                </CardContent>
              </Card>
            )}
            {data.sessions.map((session) => {
              const immutable = signed[session.id] || session.signed;
              return (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex justify-between gap-2">
                      <CardTitle className="text-base">
                        Sessão {session.sessionNumber} · {session.date} às{" "}
                        {session.time}
                      </CardTitle>
                      <Badge variant={immutable ? "default" : "outline"}>
                        {immutable ? "Assinada e imutável" : session.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Procedimentos técnico-científicos adotados</Label>
                      <Textarea
                        className="mt-1"
                        defaultValue={session.content}
                        disabled={immutable}
                      />
                    </div>
                    <Alert>
                      <AlertCircle />
                      <AlertDescription>
                        Evite transcrições literais; registre somente a síntese
                        técnica necessária.
                      </AlertDescription>
                    </Alert>
                    <div>
                      <Label>Síntese da evolução</Label>
                      <Textarea className="mt-1" disabled={immutable} />
                    </div>
                    {secret && (
                      <div className="rounded border border-red-200 bg-red-50 p-4">
                        <Label>Registro documental restrito</Label>
                        <Textarea
                          className="mt-1"
                          placeholder="Hipóteses diagnósticas e anotações exclusivas"
                          disabled={immutable}
                        />
                      </div>
                    )}
                    <div className="flex flex-wrap justify-between gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSecret(!secret)}
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        {secret
                          ? "Ocultar sigilo"
                          : "Revelar registro restrito"}
                      </Button>
                      {!immutable && (
                        <Button
                          onClick={() =>
                            setSigned({ ...signed, [session.id]: true })
                          }
                        >
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          Finalizar e assinar registro
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        <TabsContent value="closing">
          <Card>
            <CardHeader>
              <CardTitle>Encaminhamento e encerramento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline">Novo encaminhamento</Button>
                <Button variant="outline">
                  Notificação compulsória (SINAN / Ofício)
                </Button>
              </div>
              <div className="border-t pt-4">
                <Label>Motivo</Label>
                <Input className="mt-1" />
                <Label className="mt-4 block">Data</Label>
                <Input className="mt-1" type="date" />
                <Label className="mt-4 block">Síntese final</Label>
                <Textarea className="mt-1" rows={5} />
                <Button className="mt-4">Salvar encerramento</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documentos e arquivos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-3">
                {documents.map((item) => (
                  <Button
                    key={item}
                    variant="outline"
                    onClick={() => setDocument(item)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {item}
                  </Button>
                ))}
              </div>
              <div className="rounded border p-4">
                <p className="font-medium">Emitir {document}</p>
                {document === "Declaração" && (
                  <p className="text-muted-foreground text-sm">
                    CID bloqueado para declarações.
                  </p>
                )}
                {document === "Atestado" && (
                  <>
                    <Label className="mt-3 block">
                      Prazo de validade obrigatório
                    </Label>
                    <Input className="mt-1" type="date" required />
                  </>
                )}
                <Button className="mt-4">Emitir documento</Button>
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
              {secret && (
                <div className="rounded border border-red-200 bg-red-50 p-4">
                  <Lock className="mr-2 inline h-4 w-4" />
                  Pasta de acesso exclusivo (SATEPSI)
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <p className="text-muted-foreground hidden text-center text-xs print:block">
        Profissional: {data.professional.name} · CRP: {data.professional.crp} ·
        Página 1
      </p>
    </div>
  );
}
