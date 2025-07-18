"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardHeader } from "@/app/_components/dashboard-header";
import { DashboardShell } from "@/app/_components/dashboard-shell";
import { Download, Printer, Lock, FileText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";

export default function ProntuarioPage({ params }: { params: { id: string } }) {
  const pacienteId = params.id;
  const [activeTab, setActiveTab] = useState("identificacao");
  const [editMode, setEditMode] = useState(false);
  const [showConfidentialInfo, setShowConfidentialInfo] = useState(false);

  // Em um sistema real, você buscaria os dados do paciente com base no ID
  const paciente = {
    id: pacienteId,
    nome: "João Silva",
    cpf: "123.456.789-00",
    dataNascimento: "15/03/1985",
    idade: 40,
    genero: "Masculino",
    estadoCivil: "Casado",
    profissao: "Engenheiro de Software",
    escolaridade: "Ensino Superior Completo",
    endereco: "Rua das Flores, 123 - São Paulo, SP",
    telefone: "(11) 98765-4321",
    email: "joao.silva@example.com",
    dataInicioAtendimento: "10/01/2025",
    psicologo: {
      nome: "Dra. Ana Beatriz Oliveira",
      crp: "06/12345",
      email: "ana.oliveira@psiaten.com",
      telefone: "(11) 97654-3210",
    },
    demandaInicial:
      "Paciente buscou atendimento relatando sintomas de ansiedade, dificuldades para dormir e preocupação excessiva com questões de trabalho.",
    encaminhamento: "Demanda espontânea",
    contatoEmergencia: {
      nome: "Maria Silva",
      parentesco: "Esposa",
      telefone: "(11) 97654-3210",
    },
    convenio: "Particular",
    registroSessoes: [
      {
        id: "1",
        data: "10/01/2025",
        horario: "14:00",
        duracao: 50,
        tipo: "Avaliação Inicial",
        modalidade: "Presencial",
        compareceu: true,
        conteudo:
          "Sessão inicial para coleta de dados e estabelecimento do contrato terapêutico. Paciente relatou histórico dos sintomas e contexto de surgimento. Explicados os princípios da TCC e estabelecidos objetivos iniciais.",
        observacoes:
          "Paciente demonstrou boa receptividade à proposta terapêutica.",
      },
      {
        id: "2",
        data: "17/01/2025",
        horario: "14:00",
        duracao: 50,
        tipo: "Psicoterapia",
        modalidade: "Presencial",
        compareceu: true,
        conteudo:
          "Aprofundamento da história de vida do paciente. Identificados padrões de pensamento perfeccionista e crenças disfuncionais relacionadas ao desempenho no trabalho.",
        observacoes:
          "Paciente trouxe relatos de situações de estresse no trabalho durante a semana.",
      },
      {
        id: "3",
        data: "24/01/2025",
        horario: "14:00",
        duracao: 50,
        tipo: "Psicoterapia",
        modalidade: "Presencial",
        compareceu: true,
        conteudo:
          "Introduzidas técnicas de respiração diafragmática e relaxamento muscular progressivo. Iniciado registro de pensamentos automáticos.",
        observacoes:
          "Paciente relatou episódio de ansiedade intensa durante reunião de trabalho.",
      },
    ],
    avaliacaoInicial: {
      queixaPrincipal:
        "Ansiedade, insônia e preocupação excessiva com o trabalho",
      historiaClinica:
        "Paciente relata que os sintomas começaram há aproximadamente 6 meses, após uma promoção no trabalho que aumentou suas responsabilidades. Sem histórico de tratamentos psicológicos anteriores. Nega uso de medicação psiquiátrica.",
      historicoFamiliar:
        "Mãe e irmã com histórico de transtornos de ansiedade. Pai teve episódios de depressão na juventude.",
      exameEstadoMental:
        "Paciente apresenta-se orientado auto e alopsiquicamente, comunicativo e colaborativo. Humor eutímico com afeto congruente. Pensamento lógico e coerente. Sem alterações sensoperceptivas. Memória e atenção preservadas. Juízo crítico mantido. Nega ideação suicida.",
      hipoteseDiagnostica: "Transtorno de Ansiedade Generalizada (F41.1)",
      impressaoGeral:
        "Paciente demonstra boa capacidade de insight e motivação para o processo terapêutico.",
    },
    planoTerapeutico: {
      abordagem: "Terapia Cognitivo-Comportamental (TCC)",
      objetivos: [
        "Redução dos sintomas de ansiedade",
        "Desenvolvimento de estratégias de enfrentamento para situações estressoras",
        "Melhoria da qualidade do sono",
        "Reestruturação de crenças disfuncionais relacionadas ao trabalho",
      ],
      frequencia: "Semanal",
      duracao: "50 minutos",
      reavaliacao: "A cada 3 meses",
    },
    evolucao: [
      {
        data: "31/01/2025",
        registro:
          "Após 3 sessões, paciente relata leve redução na intensidade das crises de ansiedade. Tem praticado as técnicas de respiração diafragmática com bons resultados.",
      },
      {
        data: "28/02/2025",
        registro:
          "Após 8 sessões, observa-se melhora significativa no padrão de sono. Paciente consegue identificar pensamentos automáticos e está começando a questioná-los.",
      },
    ],
    encaminhamentos: [
      {
        data: "15/02/2025",
        profissional: "Dr. Roberto Mendes",
        especialidade: "Psiquiatria",
        motivo: "Avaliação para possível tratamento medicamentoso complementar",
        retorno:
          "Paciente iniciou uso de Escitalopram 10mg/dia em 20/02/2025. Relata boa adaptação à medicação.",
      },
    ],
    documentosEmitidos: [
      {
        data: "15/02/2025",
        tipo: "Declaração de Comparecimento",
        finalidade: "Justificativa de ausência no trabalho",
        destinatario: "Empregador",
      },
      {
        data: "28/02/2025",
        tipo: "Relatório Psicológico",
        finalidade:
          "Solicitação do paciente para apresentação ao médico psiquiatra",
        destinatario: "Dr. Roberto Mendes",
      },
    ],
    anexos: [
      {
        data: "15/02/2025",
        tipo: "Termo de Consentimento Livre e Esclarecido",
        descricao: "Documento assinado pelo paciente autorizando o tratamento",
      },
      {
        data: "15/02/2025",
        tipo: "Contrato Terapêutico",
        descricao: "Documento estabelecendo as condições do atendimento",
      },
      {
        data: "20/02/2025",
        tipo: "Receituário Médico",
        descricao:
          "Prescrição de Escitalopram 10mg/dia pelo Dr. Roberto Mendes",
      },
    ],
  };

  const dataAtual = format(new Date(), "dd 'de' MMMM 'de' yyyy", {
    locale: ptBR,
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Prontuário Psicológico"
        text="Registro completo conforme exigências do CFP"
      >
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href={`/pacientes/${pacienteId}`}>Voltar ao Paciente</Link>
          </Button>
          <Button variant="outline" onClick={() => setEditMode(!editMode)}>
            {editMode ? "Cancelar Edição" : "Editar Prontuário"}
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
        </div>
      </DashboardHeader>

      {/* Cabeçalho do Prontuário */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={`/placeholder.svg?height=96&width=96`}
                alt={paciente.nome}
              />
              <AvatarFallback className="text-2xl">
                {paciente.nome
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold">{paciente.nome}</h2>
                <Badge>Prontuário Ativo</Badge>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    CPF: {paciente.cpf}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Data de Nascimento: {paciente.dataNascimento} (
                    {paciente.idade} anos)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Início do Atendimento: {paciente.dataInicioAtendimento}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Psicólogo(a): {paciente.psicologo.nome}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    CRP: {paciente.psicologo.crp}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Data de Atualização: {dataAtual}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setShowConfidentialInfo(!showConfidentialInfo)}
              >
                <Lock className="h-4 w-4" />
                {showConfidentialInfo
                  ? "Ocultar Informações Sigilosas"
                  : "Mostrar Informações Sigilosas"}
              </Button>
              <Badge variant="outline" className="justify-center">
                <FileText className="mr-2 h-4 w-4" />
                Registro CFP Nº {pacienteId}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Abas do Prontuário */}
      <Tabs
        defaultValue="identificacao"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          <TabsTrigger value="identificacao">Identificação</TabsTrigger>
          <TabsTrigger value="avaliacao">Avaliação Inicial</TabsTrigger>
          <TabsTrigger value="plano">Plano Terapêutico</TabsTrigger>
          <TabsTrigger value="evolucao">Evolução</TabsTrigger>
          <TabsTrigger value="sessoes">Registro de Sessões</TabsTrigger>
          <TabsTrigger value="encaminhamentos">Encaminhamentos</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        {/* Conteúdo das abas - omitido para brevidade, é o mesmo da versão anterior */}
        {/* ... */}

        {/* Aba de Identificação */}
        <TabsContent value="identificacao">
          <Card>
            <CardHeader>
              <CardTitle>Dados de Identificação</CardTitle>
              <CardDescription>
                Informações pessoais e de contato do paciente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  {editMode ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input id="nome" defaultValue={paciente.nome} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input id="cpf" defaultValue={paciente.cpf} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dataNascimento">
                          Data de Nascimento
                        </Label>
                        <Input
                          id="dataNascimento"
                          defaultValue={paciente.dataNascimento}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="genero">Gênero</Label>
                        <Select defaultValue={paciente.genero}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o gênero" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Masculino">Masculino</SelectItem>
                            <SelectItem value="Feminino">Feminino</SelectItem>
                            <SelectItem value="Não-binário">
                              Não-binário
                            </SelectItem>
                            <SelectItem value="Outro">Outro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="estadoCivil">Estado Civil</Label>
                        <Select defaultValue={paciente.estadoCivil}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o estado civil" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Solteiro">
                              Solteiro(a)
                            </SelectItem>
                            <SelectItem value="Casado">Casado(a)</SelectItem>
                            <SelectItem value="Divorciado">
                              Divorciado(a)
                            </SelectItem>
                            <SelectItem value="Viúvo">Viúvo(a)</SelectItem>
                            <SelectItem value="União Estável">
                              União Estável
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Nome Completo
                        </h3>
                        <p>{paciente.nome}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          CPF
                        </h3>
                        <p>{paciente.cpf}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Data de Nascimento
                        </h3>
                        <p>
                          {paciente.dataNascimento} ({paciente.idade} anos)
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Gênero
                        </h3>
                        <p>{paciente.genero}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Estado Civil
                        </h3>
                        <p>{paciente.estadoCivil}</p>
                      </div>
                    </>
                  )}
                </div>
                {/* Restante do conteúdo omitido para brevidade */}
              </div>
            </CardContent>
            {editMode && (
              <CardFooter>
                <Button className="ml-auto">Salvar Alterações</Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        {/* Outras abas omitidas para brevidade */}
      </Tabs>
    </DashboardShell>
  );
}
