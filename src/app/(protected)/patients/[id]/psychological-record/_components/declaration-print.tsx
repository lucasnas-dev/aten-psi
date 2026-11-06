"use client";

import { Printer } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

import styles from "./declaration-print.module.css";

export function DeclarationPrint({
  patientId,
  children,
}: {
  patientId: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.printPage}>
      <div className={styles.controls}>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/patients/${patientId}/psychological-record`}>
            Voltar ao prontuário
          </Link>
        </Button>
        <Button size="sm" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
          Imprimir / Salvar como PDF
        </Button>
        <p className="text-muted-foreground text-xs">
          Na janela de impressão, selecione “Salvar como PDF” e desative os
          cabeçalhos e rodapés do navegador.
        </p>
      </div>
      {children}
    </div>
  );
}
