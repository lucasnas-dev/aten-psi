"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  Lock,
  Printer,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { getPatientRecord } from "@/actions/get-patient-record";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// Types for better type safety
interface PatientSession {
  id: string;
  sessionNumber: number;
  date: string;
  time: string;
  duration: number;
  type: string;
  modality: string;
  attended: boolean;
  content: string;
  observations: string;
  value?: string | null;
  status: string;
}

interface Psychologist {
  name: string;
  crp: string;
  email: string;
  phone: string;
  specialization: string;
}

interface PatientRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  cpf: string;
  responsibleCpf: string;
  address: string;
  houseNumber: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  notes: string;
  status: string;
  startDate: string | null;
  lastConsultationDate: string | null;
  totalConsultations: number;
  completedConsultations: number;
  sessions: PatientSession[];
  psychologist: Psychologist;
  createdAt: Date | null;
  updatedAt: Date | null;
}

// Status mapping for UI display (Portuguese interface)
const statusDisplayMapping = {
  active: "Ativo",
  completed: "Concluído",
  suspended: "Suspenso",
  archived: "Arquivado",
} as const;

export default function PsychologicalRecordPage({
  params,
}: {
  params: { id: string };
}) {
  const patientId = params.id;
  const [activeTab, setActiveTab] = useState("identification");
  const [editMode, setEditMode] = useState(false);
  const [showConfidentialInfo, setShowConfidentialInfo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientData, setPatientData] = useState<PatientRecord | null>(null);

  // Fetch patient record data
  const fetchPatientRecord = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching patient record for ID:", patientId);

      const result = await getPatientRecord({
        patientId,
      });

      console.log("Patient record result:", result);

      if (result?.data?.patient) {
        console.log("Patient data received:", result.data.patient);
        setPatientData(result.data.patient);
      } else {
        console.log("No patient data found in result");
        setError("Prontuário não encontrado");
      }
    } catch (err) {
      console.error("Error fetching patient record:", err);
      setError("Erro ao carregar prontuário");
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPatientRecord();
  }, [fetchPatientRecord]);

  // Calculate patient age
  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate.split("/").reverse().join("-")); // Convert DD/MM/YYYY to YYYY-MM-DD
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusColors = {
      active:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      completed:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      suspended:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      archived: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };

    const displayStatus =
      statusDisplayMapping[status as keyof typeof statusDisplayMapping] ||
      status;
    const colorClass =
      statusColors[status as keyof typeof statusColors] || statusColors.active;

    return <Badge className={colorClass}>{displayStatus}</Badge>;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex min-h-96 items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Carregando prontuário...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="mb-4 text-red-600 dark:text-red-400">{error}</p>
              <Button onClick={fetchPatientRecord} variant="outline">
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!patientData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Prontuário não encontrado
              </p>
              <Link href="/records">
                <Button variant="outline" className="mt-4">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar aos Prontuários
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header da página */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-border hover:bg-muted/80 bg-card/80 shadow-sm backdrop-blur-sm transition-all duration-300"
            >
              <Link
                href={`/patients/${patientId}`}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Paciente
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <FileText className="text-primary h-8 w-8" />
              <h1 className="text-primary text-3xl font-bold tracking-tight">
                Prontuário Psicológico
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground text-lg">
            Registro completo conforme exigências do CFP
          </p>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancelar Edição" : "Editar Prontuário"}
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Patient Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-4 md:flex-row">
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">{patientData.name}</h2>
                {getStatusBadge(patientData.status)}
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    CPF: {patientData.cpf || "Não informado"}
                  </p>
                  <p className="text-muted-foreground text-sm font-medium">
                    Data de Nascimento: {patientData.birthDate} (
                    {calculateAge(patientData.birthDate)} anos)
                  </p>
                  <p className="text-muted-foreground text-sm font-medium">
                    Início do Atendimento:{" "}
                    {patientData.startDate
                      ? format(new Date(patientData.startDate), "dd/MM/yyyy", {
                          locale: ptBR,
                        })
                      : "Não informado"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-sm font-medium">
                    Psicólogo(a): {patientData.psychologist.name}
                  </p>
                  <p className="text-muted-foreground text-sm font-medium">
                    CRP: {patientData.psychologist.crp}
                  </p>
                  <p className="text-muted-foreground text-sm font-medium">
                    Total de Consultas: {patientData.totalConsultations}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-sm font-semibold"
                onClick={() => setShowConfidentialInfo(!showConfidentialInfo)}
              >
                <Lock className="h-3 w-3" />
                {showConfidentialInfo
                  ? "Ocultar Sigilosas"
                  : "Mostrar Sigilosas"}
              </Button>
              <Badge
                variant="outline"
                className="justify-center text-sm font-semibold"
              >
                <FileText className="mr-1 h-3 w-3" />
                ID: {patientData.id.slice(-8)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Container */}
      <Tabs
        defaultValue="identification"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
          <TabsTrigger value="identification">Identificação</TabsTrigger>
          <TabsTrigger value="sessions">Sessões</TabsTrigger>
          <TabsTrigger value="clinical">Clínico</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="notes">Observações</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>

        {/* Identification Tab */}
        <TabsContent value="identification">
          <Card>
            <CardHeader>
              <CardTitle>Dados de Identificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Nome Completo
                    </Label>
                    <p className="mt-1 text-sm">{patientData.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      CPF
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.cpf || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Data de Nascimento
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.birthDate} (
                      {calculateAge(patientData.birthDate)} anos)
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Gênero
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.gender || "Não informado"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Telefone
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.phone || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      E-mail
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.email || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Status
                    </Label>
                    <div className="mt-1">
                      {getStatusBadge(patientData.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="border-t pt-6">
                <h3 className="mb-4 text-lg font-semibold">Endereço</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Logradouro
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.address || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Número
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.houseNumber || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Bairro
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.neighborhood || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Cidade
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.city || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Estado
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.state || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      CEP
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.cep || "Não informado"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Psychologist Information */}
              <div className="border-t pt-6">
                <h3 className="mb-4 text-lg font-semibold">
                  Psicólogo Responsável
                </h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Nome
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.psychologist.name}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      CRP
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.psychologist.crp}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      E-mail
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.psychologist.email || "Não informado"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Especialização
                    </Label>
                    <p className="mt-1 text-sm">
                      {patientData.psychologist.specialization ||
                        "Não informado"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Registro de Sessões</CardTitle>
                <Button variant="outline" size="sm">
                  Nova Sessão
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {patientData.sessions.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">
                    Nenhuma sessão registrada ainda.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {patientData.sessions.map((session) => (
                    <Card key={session.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">
                              Sessão {session.sessionNumber}
                            </Badge>
                            <Badge>
                              {format(new Date(session.date), "dd/MM/yyyy", {
                                locale: ptBR,
                              })}
                            </Badge>
                            <Badge variant="secondary">{session.time}</Badge>
                            <Badge
                              variant={
                                session.attended ? "default" : "destructive"
                              }
                            >
                              {session.attended ? "Compareceu" : "Faltou"}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground flex items-center gap-2 text-sm">
                            <span>{session.type}</span>
                            <span>•</span>
                            <span>{session.modality}</span>
                            <span>•</span>
                            <span>{session.duration} minutos</span>
                          </div>
                          {session.content && (
                            <div className="mt-3">
                              <Label className="text-muted-foreground text-sm font-medium">
                                Conteúdo da Sessão
                              </Label>
                              <p className="mt-1 text-sm leading-relaxed">
                                {session.content}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {session.value && (
                            <p className="text-sm font-medium">
                              R$ {session.value}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Clinical Tab */}
        <TabsContent value="clinical">
          <Card>
            <CardHeader>
              <CardTitle>Informações Clínicas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label className="text-muted-foreground text-sm font-medium">
                    Observações Gerais
                  </Label>
                  <p className="mt-2 text-sm leading-relaxed">
                    {patientData.notes || "Nenhuma observação registrada."}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-primary text-2xl font-bold">
                      {patientData.totalConsultations}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Total de Consultas
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {patientData.completedConsultations}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Consultas Realizadas
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {patientData.totalConsultations -
                        patientData.completedConsultations}
                    </div>
                    <p className="text-muted-foreground text-sm">Faltas</p>
                  </div>
                </div>

                {patientData.lastConsultationDate && (
                  <div>
                    <Label className="text-muted-foreground text-sm font-medium">
                      Última Consulta
                    </Label>
                    <p className="mt-1 text-sm">
                      {format(
                        new Date(patientData.lastConsultationDate),
                        "dd/MM/yyyy",
                        { locale: ptBR }
                      )}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Documentos</CardTitle>
                <Button variant="outline" size="sm">
                  Novo Documento
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center">
                <FileText className="text-muted-foreground/50 mx-auto h-12 w-12" />
                <p className="text-muted-foreground mt-4">
                  Nenhum documento anexado ainda.
                </p>
                <Button variant="outline" className="mt-4" size="sm">
                  Adicionar Documento
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Observações Adicionais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Adicione observações sobre o paciente..."
                  value={patientData.notes}
                  readOnly={!editMode}
                  rows={6}
                />
                {editMode && (
                  <div className="flex justify-end">
                    <Button>Salvar Observações</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico do Prontuário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <Badge variant="outline">
                    {patientData.createdAt
                      ? format(patientData.createdAt, "dd/MM/yyyy", {
                          locale: ptBR,
                        })
                      : "Data não disponível"}
                  </Badge>
                  <span className="text-muted-foreground">
                    Prontuário criado
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Badge variant="outline">
                    {patientData.updatedAt
                      ? format(patientData.updatedAt, "dd/MM/yyyy", {
                          locale: ptBR,
                        })
                      : "Data não disponível"}
                  </Badge>
                  <span className="text-muted-foreground">
                    Última atualização
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
