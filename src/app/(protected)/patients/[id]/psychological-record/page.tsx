"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Download, FileText, Lock, Printer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
    telefone: "(92) 99999-9999",
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
    <div className="space-y-2 p-3">
      {/* Header da página */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-border hover:bg-muted/80 bg-card/80 shadow-sm backdrop-blur-sm transition-all duration-300"
            >
              <Link
                href={`/patients/${pacienteId}`}
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

      {/* Cabeçalho do Prontuário */}
      <div className="mb-4">
        <div className="flex flex-col items-start gap-4 md:flex-row">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{paciente.nome}</h2>
              <Badge className="text-sm font-semibold">Prontuário Ativo</Badge>
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  CPF: {paciente.cpf}
                </p>
                <p className="text-muted-foreground text-sm font-medium">
                  Data de Nascimento: {paciente.dataNascimento} (
                  {paciente.idade} anos)
                </p>
                <p className="text-muted-foreground text-sm font-medium">
                  Início do Atendimento: {paciente.dataInicioAtendimento}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Psicólogo(a): {paciente.psicologo.nome}
                </p>
                <p className="text-muted-foreground text-sm font-medium">
                  CRP: {paciente.psicologo.crp}
                </p>
                <p className="text-muted-foreground text-sm font-medium">
                  Data de Atualização: {dataAtual}
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
              {showConfidentialInfo ? "Ocultar Sigilosas" : "Mostrar Sigilosas"}
            </Button>
            <Badge
              variant="outline"
              className="justify-center text-sm font-semibold"
            >
              <FileText className="mr-1 h-3 w-3" />
              CFP Nº {pacienteId}
            </Badge>
          </div>
        </div>
      </div>

      {/* Abas do Prontuário */}
      <Tabs
        defaultValue="identificacao"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-2"
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

        {/* Aba de Identificação */}
        <TabsContent value="identificacao">
          <div>
            <h3 className="mb-3 text-xl font-semibold">
              Dados de Identificação
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Informações pessoais e de contato do paciente
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  {editMode ? (
                    <>
                      <div className="space-y-1">
                        <Label htmlFor="nome">Nome Completo</Label>
                        <Input id="nome" defaultValue={paciente.nome} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="cpf">CPF</Label>
                        <Input id="cpf" defaultValue={paciente.cpf} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="dataNascimento">
                          Data de Nascimento
                        </Label>
                        <Input
                          id="dataNascimento"
                          defaultValue={paciente.dataNascimento}
                        />
                      </div>
                      <div className="space-y-1">
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
                      <div className="space-y-1">
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
                        <h3 className="text-muted-foreground text-sm font-medium">
                          Nome Completo
                        </h3>
                        <p>{paciente.nome}</p>
                      </div>
                      <div>
                        <h3 className="text-muted-foreground text-sm font-medium">
                          CPF
                        </h3>
                        <p>{paciente.cpf}</p>
                      </div>
                      <div>
                        <h3 className="text-muted-foreground text-sm font-medium">
                          Data de Nascimento
                        </h3>
                        <p>
                          {paciente.dataNascimento} ({paciente.idade} anos)
                        </p>
                      </div>
                      <div>
                        <h3 className="text-muted-foreground text-sm font-medium">
                          Gênero
                        </h3>
                        <p>{paciente.genero}</p>
                      </div>
                      <div>
                        <h3 className="text-muted-foreground text-sm font-medium">
                          Estado Civil
                        </h3>
                        <p>{paciente.estadoCivil}</p>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-1">
                  {editMode ? (
                    <>
                      <div className="space-y-1">
                        <Label htmlFor="profissao">Profissão</Label>
                        <Input
                          id="profissao"
                          defaultValue={paciente.profissao}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="escolaridade">Escolaridade</Label>
                        <Input
                          id="escolaridade"
                          defaultValue={paciente.escolaridade}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="endereco">Endereço</Label>
                        <Input id="endereco" defaultValue={paciente.endereco} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input id="telefone" defaultValue={paciente.telefone} />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="email">E-mail</Label>
                        <Input id="email" defaultValue={paciente.email} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-muted-foreground text-sm font-medium">
                          Profissão
                        </h3>
                        <p>{paciente.profissao}</p>
                      </div>
                      <div>
                        <h3 className="text-muted-foreground text-sm font-medium">
                          Escolaridade
                        </h3>
                        <p>{paciente.escolaridade}</p>
                      </div>
                      <div>
                        <h3 className="text-muted-foreground text-sm font-medium">
                          Endereço
                        </h3>
                        <p>{paciente.endereco}</p>
                      </div>
                      <div>
                        <h3 className="text-muted-foreground text-sm font-medium">
                          Telefone
                        </h3>
                        <p>{paciente.telefone}</p>
                      </div>
                      <div>
                        <h3 className="text-muted-foreground text-sm font-medium">
                          E-mail
                        </h3>
                        <p>{paciente.email}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Informações de Contato de Emergência */}
              <div className="border-t pt-2">
                <h3 className="mb-1 text-lg font-semibold">
                  Contato de Emergência
                </h3>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                  {editMode ? (
                    <>
                      <div className="space-y-1">
                        <Label htmlFor="nomeEmergencia">Nome</Label>
                        <Input
                          id="nomeEmergencia"
                          defaultValue={paciente.contatoEmergencia.nome}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="parentesco">Parentesco</Label>
                        <Input
                          id="parentesco"
                          defaultValue={paciente.contatoEmergencia.parentesco}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="telefoneEmergencia">Telefone</Label>
                        <Input
                          id="telefoneEmergencia"
                          defaultValue={paciente.contatoEmergencia.telefone}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h4 className="text-muted-foreground text-sm font-medium">
                          Nome
                        </h4>
                        <p>{paciente.contatoEmergencia.nome}</p>
                      </div>
                      <div>
                        <h4 className="text-muted-foreground text-sm font-medium">
                          Parentesco
                        </h4>
                        <p>{paciente.contatoEmergencia.parentesco}</p>
                      </div>
                      <div>
                        <h4 className="text-muted-foreground text-sm font-medium">
                          Telefone
                        </h4>
                        <p>{paciente.contatoEmergencia.telefone}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Informações Sigilosas */}
              {showConfidentialInfo && (
                <div className="bg-muted/30 rounded-lg border-t p-2 pt-2">
                  <h3 className="mb-1 flex items-center gap-2 text-lg font-semibold">
                    <Lock className="text-primary h-5 w-5" />
                    Informações Sigilosas
                  </h3>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div>
                      <h4 className="text-muted-foreground text-sm font-medium">
                        Demanda Inicial
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed">
                        {paciente.demandaInicial}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-muted-foreground text-sm font-medium">
                        Encaminhamento
                      </h4>
                      <p className="mt-1 text-sm">{paciente.encaminhamento}</p>
                    </div>
                    <div>
                      <h4 className="text-muted-foreground text-sm font-medium">
                        Convênio
                      </h4>
                      <p className="mt-1 text-sm">{paciente.convenio}</p>
                    </div>
                    <div>
                      <h4 className="text-muted-foreground text-sm font-medium">
                        Psicólogo Responsável
                      </h4>
                      <div className="mt-1 text-sm">
                        <p>{paciente.psicologo.nome}</p>
                        <p className="text-muted-foreground">
                          {paciente.psicologo.email}
                        </p>
                        <p className="text-muted-foreground">
                          {paciente.psicologo.telefone}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {editMode && (
              <div className="mt-4 flex justify-end">
                <Button>Salvar Alterações</Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Aba de Avaliação Inicial */}
        <TabsContent value="avaliacao">
          <div>
            <h3 className="mb-3 text-xl font-semibold">Avaliação Inicial</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Registro da primeira avaliação psicológica do paciente
            </p>
            <div className="space-y-4">
              <div className="space-y-1">
                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                    Queixa Principal
                  </h3>
                  {editMode ? (
                    <Textarea
                      defaultValue={paciente.avaliacaoInicial.queixaPrincipal}
                      placeholder="Descreva a queixa principal do paciente..."
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">
                      {paciente.avaliacaoInicial.queixaPrincipal}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                    História Clínica
                  </h3>
                  {editMode ? (
                    <Textarea
                      defaultValue={paciente.avaliacaoInicial.historiaClinica}
                      placeholder="Descreva a história clínica do paciente..."
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">
                      {paciente.avaliacaoInicial.historiaClinica}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                    Histórico Familiar
                  </h3>
                  {editMode ? (
                    <Textarea
                      defaultValue={paciente.avaliacaoInicial.historicoFamiliar}
                      placeholder="Descreva o histórico familiar relevante..."
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">
                      {paciente.avaliacaoInicial.historicoFamiliar}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                    Exame do Estado Mental
                  </h3>
                  {editMode ? (
                    <Textarea
                      defaultValue={paciente.avaliacaoInicial.exameEstadoMental}
                      placeholder="Descreva o exame do estado mental..."
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">
                      {paciente.avaliacaoInicial.exameEstadoMental}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                    Hipótese Diagnóstica
                  </h3>
                  {editMode ? (
                    <Input
                      defaultValue={
                        paciente.avaliacaoInicial.hipoteseDiagnostica
                      }
                      placeholder="Ex: Transtorno de Ansiedade Generalizada (F41.1)"
                    />
                  ) : (
                    <Badge variant="secondary" className="text-sm">
                      {paciente.avaliacaoInicial.hipoteseDiagnostica}
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                    Impressão Geral
                  </h3>
                  {editMode ? (
                    <Textarea
                      defaultValue={paciente.avaliacaoInicial.impressaoGeral}
                      placeholder="Descreva a impressão geral sobre o paciente..."
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">
                      {paciente.avaliacaoInicial.impressaoGeral}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {editMode && (
              <div className="mt-4 flex justify-end">
                <Button>Salvar Alterações</Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Aba de Plano Terapêutico */}
        <TabsContent value="plano">
          <div>
            <h3 className="mb-3 text-xl font-semibold">Plano Terapêutico</h3>
            <p className="text-muted-foreground mb-4 text-sm">
              Estratégia e objetivos do processo terapêutico
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                <div className="space-y-1">
                  <div>
                    <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                      Abordagem Terapêutica
                    </h3>
                    {editMode ? (
                      <Input
                        defaultValue={paciente.planoTerapeutico.abordagem}
                        placeholder="Ex: Terapia Cognitivo-Comportamental (TCC)"
                      />
                    ) : (
                      <p className="text-sm">
                        {paciente.planoTerapeutico.abordagem}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                      Frequência
                    </h3>
                    {editMode ? (
                      <Select
                        defaultValue={paciente.planoTerapeutico.frequencia}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a frequência" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Semanal">Semanal</SelectItem>
                          <SelectItem value="Quinzenal">Quinzenal</SelectItem>
                          <SelectItem value="Mensal">Mensal</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm">
                        {paciente.planoTerapeutico.frequencia}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                      Duração das Sessões
                    </h3>
                    {editMode ? (
                      <Input
                        defaultValue={paciente.planoTerapeutico.duracao}
                        placeholder="Ex: 50 minutos"
                      />
                    ) : (
                      <p className="text-sm">
                        {paciente.planoTerapeutico.duracao}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                      Reavaliação
                    </h3>
                    {editMode ? (
                      <Input
                        defaultValue={paciente.planoTerapeutico.reavaliacao}
                        placeholder="Ex: A cada 3 meses"
                      />
                    ) : (
                      <p className="text-sm">
                        {paciente.planoTerapeutico.reavaliacao}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-muted-foreground mb-2 text-sm font-medium">
                    Objetivos Terapêuticos
                  </h3>
                  {editMode ? (
                    <Textarea
                      defaultValue={paciente.planoTerapeutico.objetivos.join(
                        "\n",
                      )}
                      placeholder="Digite cada objetivo em uma linha..."
                      rows={6}
                    />
                  ) : (
                    <ul className="space-y-2">
                      {paciente.planoTerapeutico.objetivos.map(
                        (objetivo, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span className="text-primary">•</span>
                            {objetivo}
                          </li>
                        ),
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
            {editMode && (
              <div className="mt-4 flex justify-end">
                <Button>Salvar Alterações</Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Aba de Evolução */}
        <TabsContent value="evolucao">
          <div>
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mb-3 text-xl font-semibold">
                    Evolução do Tratamento
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Registro da evolução clínica do paciente
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Nova Evolução
                </Button>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                {paciente.evolucao.map((evolucao, index) => (
                  <div
                    key={index}
                    className="border-primary border-l-4 py-2 pl-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <Badge variant="outline">{evolucao.data}</Badge>
                    </div>
                    <p className="text-sm leading-relaxed">
                      {evolucao.registro}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Aba de Registro de Sessões */}
        <TabsContent value="sessoes">
          <div>
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mb-3 text-xl font-semibold">
                    Registro de Sessões
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Histórico detalhado de todas as sessões realizadas
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Nova Sessão
                </Button>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                {paciente.registroSessoes.map((sessao) => (
                  <div
                    key={sessao.id}
                    className="border-primary rounded-lg border border-l-4 p-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge>{sessao.data}</Badge>
                          <Badge variant="outline">{sessao.tipo}</Badge>
                          <Badge
                            variant={
                              sessao.compareceu ? "default" : "destructive"
                            }
                          >
                            {sessao.compareceu ? "Compareceu" : "Faltou"}
                          </Badge>
                        </div>
                        <div className="text-muted-foreground text-sm">
                          {sessao.horario} • {sessao.duracao}min •{" "}
                          {sessao.modalidade}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="space-y-2">
                        <div>
                          <h4 className="mb-1 text-sm font-medium">
                            Conteúdo da Sessão
                          </h4>
                          <p className="text-sm leading-relaxed">
                            {sessao.conteudo}
                          </p>
                        </div>
                        {sessao.observacoes && (
                          <div>
                            <h4 className="mb-1 text-sm font-medium">
                              Observações
                            </h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {sessao.observacoes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Aba de Encaminhamentos */}
        <TabsContent value="encaminhamentos">
          <div>
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="mb-3 text-xl font-semibold">
                    Encaminhamentos
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Registro de encaminhamentos para outros profissionais
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Novo Encaminhamento
                </Button>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                {paciente.encaminhamentos.map((encaminhamento, index) => (
                  <div
                    key={index}
                    className="border-secondary rounded-lg border border-l-4 p-4"
                  >
                    <div>
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div className="space-y-1">
                          <div>
                            <h4 className="text-muted-foreground text-sm font-medium">
                              Data do Encaminhamento
                            </h4>
                            <p className="text-sm">{encaminhamento.data}</p>
                          </div>
                          <div>
                            <h4 className="text-muted-foreground text-sm font-medium">
                              Profissional
                            </h4>
                            <p className="text-sm">
                              {encaminhamento.profissional}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-muted-foreground text-sm font-medium">
                              Especialidade
                            </h4>
                            <Badge>{encaminhamento.especialidade}</Badge>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div>
                            <h4 className="text-muted-foreground text-sm font-medium">
                              Motivo do Encaminhamento
                            </h4>
                            <p className="text-sm leading-relaxed">
                              {encaminhamento.motivo}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-muted-foreground text-sm font-medium">
                              Retorno/Feedback
                            </h4>
                            <p className="text-sm leading-relaxed">
                              {encaminhamento.retorno}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Aba de Documentos */}
        <TabsContent value="documentos">
          <div className="space-y-2">
            {/* Documentos Emitidos */}
            <div>
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold">
                      Documentos Emitidos
                    </h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Documentos psicológicos emitidos para o paciente
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Emitir Documento
                  </Button>
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  {paciente.documentosEmitidos.map((documento, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-muted-foreground h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">
                            {documento.tipo}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {documento.finalidade} • {documento.data}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Destinatário: {documento.destinatario}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Baixar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Anexos */}
            <div>
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="mb-3 text-xl font-semibold">Anexos</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      Documentos anexos ao prontuário
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Adicionar Anexo
                  </Button>
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  {paciente.anexos.map((anexo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="text-muted-foreground h-5 w-5" />
                        <div>
                          <p className="text-sm font-medium">{anexo.tipo}</p>
                          <p className="text-muted-foreground text-xs">
                            {anexo.descricao}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            Data: {anexo.data}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Visualizar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Outras abas omitidas para brevidade */}
      </Tabs>
    </div>
  );
}
