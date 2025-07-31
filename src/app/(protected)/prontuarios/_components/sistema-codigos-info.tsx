"use client";

import { BookOpen, Hash, InfoIcon, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function SistemaCodigosInfo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <InfoIcon className="mr-2 h-4 w-4" />
          Sistema de Códigos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Sistema de Códigos de Arquivamento
          </DialogTitle>
          <DialogDescription>
            Padrão moderno de organização e localização de prontuários
            psicológicos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Estrutura do Código */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estrutura do Código</CardTitle>
              <CardDescription>
                Cada prontuário recebe um código único seguindo o padrão
                internacional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 rounded-lg bg-gray-50 p-4 text-center font-mono text-lg dark:bg-gray-800">
                <span className="text-blue-600">PSI</span>-
                <span className="text-green-600">2025</span>-
                <span className="text-purple-600">001</span>-
                <span className="text-orange-600">A1</span>-
                <span className="text-red-600">P1</span>-
                <span className="text-indigo-600">001</span>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="border-blue-200 bg-blue-50 text-blue-700"
                  >
                    PSI
                  </Badge>
                  <h4 className="font-semibold">Identificação da Área</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Código fixo para Psicologia. Identifica a especialidade
                    médica/terapêutica.
                  </p>
                </div>

                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="border-green-200 bg-green-50 text-green-700"
                  >
                    2025
                  </Badge>
                  <h4 className="font-semibold">Ano de Abertura</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ano em que o prontuário foi criado. Facilita a organização
                    temporal.
                  </p>
                </div>

                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="border-purple-200 bg-purple-50 text-purple-700"
                  >
                    001
                  </Badge>
                  <h4 className="font-semibold">Número Sequencial</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Numeração sequencial do prontuário no ano (001-999).
                  </p>
                </div>

                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="border-orange-200 bg-orange-50 text-orange-700"
                  >
                    A1
                  </Badge>
                  <h4 className="font-semibold">Setor e Armário</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Letra do setor (A-Z) + número do armário (1-9).
                  </p>
                </div>

                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="border-red-200 bg-red-50 text-red-700"
                  >
                    P1
                  </Badge>
                  <h4 className="font-semibold">Prateleira</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    P + número da prateleira no armário (1-5).
                  </p>
                </div>

                <div className="space-y-2">
                  <Badge
                    variant="outline"
                    className="border-indigo-200 bg-indigo-50 text-indigo-700"
                  >
                    001
                  </Badge>
                  <h4 className="font-semibold">Posição no Arquivo</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Posição específica na prateleira (001-999).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organização Física */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Organização Física do Arquivo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <h4 className="mb-3 font-semibold">Setores</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Setor A</Badge>
                      <span className="text-sm">Pacientes ativos (A-M)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Setor B</Badge>
                      <span className="text-sm">Pacientes ativos (N-Z)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Setor C</Badge>
                      <span className="text-sm">Prontuários concluídos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Setor D</Badge>
                      <span className="text-sm">Arquivo morto</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">Estrutura por Armário</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      • <strong>Armários 1-3:</strong> Prontuários por ordem
                      alfabética
                    </div>
                    <div>
                      • <strong>Armários 4-6:</strong> Prontuários por data de
                      abertura
                    </div>
                    <div>
                      • <strong>Prateleiras 1-2:</strong> Prontuários ativos
                    </div>
                    <div>
                      • <strong>Prateleiras 3-4:</strong> Prontuários em
                      atendimento
                    </div>
                    <div>
                      • <strong>Prateleira 5:</strong> Documentos complementares
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Normas e Conformidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Conformidade com Normas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400">
                    ✓ Resolução CFP nº 001/2009
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Normas de atuação para os psicólogos em relação ao
                    preconceito e à discriminação.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400">
                    ✓ Lei Geral de Proteção de Dados (LGPD)
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sistema de códigos preserva a privacidade e permite controle
                    de acesso adequado.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400">
                    ✓ Código de Ética Profissional do Psicólogo
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Garante sigilo e confidencialidade através de acesso
                    controlado.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-green-700 dark:text-green-400">
                    ✓ Normas ISO 15489 (Gestão de Documentos)
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Padrão internacional para gestão de informações e
                    documentos.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Exemplos Práticos */}
          <Card>
            <CardHeader>
              <CardTitle>Exemplos Práticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="mb-2 font-mono text-lg">
                    PSI-2025-001-A1-P1-001
                  </div>
                  <p className="text-sm">
                    <strong>Localização:</strong> Primeiro prontuário de 2025,
                    localizado no Setor A, Armário 1, Prateleira 1, Posição 001.
                  </p>
                </div>

                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <div className="mb-2 font-mono text-lg">
                    PSI-2024-125-C2-P3-078
                  </div>
                  <p className="text-sm">
                    <strong>Localização:</strong> Prontuário número 125 de 2024,
                    arquivado no Setor C (concluídos), Armário 2, Prateleira 3,
                    Posição 078.
                  </p>
                </div>

                <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                  <div className="mb-2 font-mono text-lg">
                    PSI-2023-456-D1-P5-234
                  </div>
                  <p className="text-sm">
                    <strong>Localização:</strong> Prontuário de 2023 no arquivo
                    morto (Setor D), Armário 1, Prateleira 5, Posição 234.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefícios do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle>Benefícios do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600">
                    🔍 Busca Rápida
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Localização imediata de qualquer prontuário através do
                    código.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600">
                    📊 Controle de Acesso
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Rastreabilidade completa de quem acessa cada prontuário.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-600">
                    ⚡ Eficiência
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Reduz tempo de busca e organização do arquivo físico.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-600">
                    🛡️ Segurança
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Conformidade com normas de segurança e privacidade.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
