"use client";

import { MapPin, Navigation } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface RecordLocatorProps {
  archivalCode: string;
}

export function RecordLocator({ archivalCode }: RecordLocatorProps) {
  // Function to decode the archival code
  const decodeArchivalCode = (code: string) => {
    const parts = code.split("-");
    if (parts.length !== 6) return null;

    const [prefix, year, number, location, shelf, position] = parts;
    const sector = location.charAt(0);
    const cabinet = location.substring(1);

    return {
      prefix,
      year,
      number,
      sector,
      cabinet,
      shelf: shelf.substring(1), // Remove the 'P'
      position,
    };
  };

  const codeInfo = decodeArchivalCode(archivalCode);

  if (!codeInfo) {
    return (
      <Button variant="outline" size="sm" disabled>
        <MapPin className="mr-2 h-4 w-4" />
        Código Inválido
      </Button>
    );
  }

  const getSectorDescription = (sector: string) => {
    const sectors = {
      A: "Pacientes Ativos (A-M)",
      B: "Pacientes Ativos (N-Z)",
      C: "Prontuários Concluídos",
      D: "Arquivo Morto",
    };
    return sectors[sector as keyof typeof sectors] || `Setor ${sector}`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MapPin className="mr-2 h-4 w-4" />
          Localizar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Localização do Prontuário
          </DialogTitle>
          <DialogDescription>
            Instruções para encontrar o prontuário físico
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Código decodificado */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Código de Arquivamento</CardTitle>
              <div className="rounded-lg bg-gray-50 p-3 text-center font-mono text-lg dark:bg-gray-800">
                {archivalCode}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div className="text-center">
                  <Badge
                    variant="outline"
                    className="border-blue-200 bg-blue-50 text-blue-700"
                  >
                    {codeInfo.prefix}
                  </Badge>
                  <p className="mt-1 text-sm">Psicologia</p>
                </div>
                <div className="text-center">
                  <Badge
                    variant="outline"
                    className="border-green-200 bg-green-50 text-green-700"
                  >
                    {codeInfo.year}
                  </Badge>
                  <p className="mt-1 text-sm">Ano</p>
                </div>
                <div className="text-center">
                  <Badge
                    variant="outline"
                    className="border-purple-200 bg-purple-50 text-purple-700"
                  >
                    {codeInfo.number}
                  </Badge>
                  <p className="mt-1 text-sm">Número</p>
                </div>
                <div className="text-center">
                  <Badge
                    variant="outline"
                    className="border-orange-200 bg-orange-50 text-orange-700"
                  >
                    {codeInfo.sector}
                    {codeInfo.cabinet}
                  </Badge>
                  <p className="mt-1 text-sm">Setor/Armário</p>
                </div>
                <div className="text-center">
                  <Badge
                    variant="outline"
                    className="border-red-200 bg-red-50 text-red-700"
                  >
                    P{codeInfo.shelf}
                  </Badge>
                  <p className="mt-1 text-sm">Prateleira</p>
                </div>
                <div className="text-center">
                  <Badge
                    variant="outline"
                    className="border-indigo-200 bg-indigo-50 text-indigo-700"
                  >
                    {codeInfo.position}
                  </Badge>
                  <p className="mt-1 text-sm">Posição</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instruções de localização */}
          <Card>
            <CardHeader>
              <CardTitle>Instruções de Localização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Dirija-se ao Setor {codeInfo.sector}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {getSectorDescription(codeInfo.sector)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Localize o Armário {codeInfo.cabinet}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Os armários estão numerados e organizados sequencialmente
                      no setor.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Encontre a Prateleira {codeInfo.shelf}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      As prateleiras são numeradas de cima para baixo (1 =
                      superior, 5 = inferior).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-sm font-bold text-white">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      Busque a Posição {codeInfo.position}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Os prontuários estão organizados numericamente da esquerda
                      para a direita na prateleira.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações adicionais */}
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CardContent className="p-4">
              <h4 className="mb-2 font-semibold text-yellow-800 dark:text-yellow-200">
                ⚠️ Lembrete Importante
              </h4>
              <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                <li>• Sempre registre a retirada do prontuário no sistema</li>
                <li>• Utilize luvas descartáveis ao manusear os documentos</li>
                <li>• Retorne o prontuário ao local exato após o uso</li>
                <li>
                  • Em caso de dúvida, consulte o responsável pelo arquivo
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Resumo da localização */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-4">
              <h4 className="mb-2 font-semibold text-green-800 dark:text-green-200">
                📍 Localização Resumida
              </h4>
              <p className="text-lg font-medium text-green-700 dark:text-green-300">
                Setor {codeInfo.sector} → Armário {codeInfo.cabinet} →
                Prateleira {codeInfo.shelf} → Posição {codeInfo.position}
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
