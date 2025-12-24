"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { consultations, patients } from "@/db/schema";
import { tenantActionClient } from "@/lib/auth-safe-action";

import { GetConsultationsInput, getConsultationsSchema } from "./schema";

type TenantCtx = {
  user: {
    tenantId: string;
  };
};

export const getConsultations = tenantActionClient
  .inputSchema(getConsultationsSchema)
  .action(
    async ({ ctx }: { parsedInput: GetConsultationsInput; ctx: TenantCtx }) => {
      try {
        // Buscar consultas com informações do paciente
        const result = await db
          .select({
            id: consultations.id,
            date: consultations.date,
            time: consultations.time,
            duration: consultations.duration,
            type: consultations.type,
            modality: consultations.modality,
            notes: consultations.notes,
            value: consultations.value,
            status: consultations.status,
            patientName: patients.name,
          })
          .from(consultations)
          .leftJoin(patients, eq(consultations.patient_id, patients.id))
          .where(eq(consultations.tenant_id, ctx.user.tenantId));

        // Transformar os dados para o formato esperado pelo componente
        const formattedConsultations = result.map((consultation) => {
          const [hours, minutes] = consultation.time.split(":").map(Number);

          // Criar data no timezone local evitando conversão UTC
          const [year, month, day] = consultation.date.split("-").map(Number);
          const startDate = new Date(
            year,
            month - 1,
            day,
            hours,
            minutes,
            0,
            0
          );

          const endDate = new Date(startDate);
          endDate.setMinutes(
            endDate.getMinutes() + parseInt(consultation.duration)
          );

          // Gerar título baseado no tipo e nome do paciente
          const typeLabels = {
            triagem: "Triagem",
            avaliacao_inicial: "Avaliação Inicial",
            atendimento: "Atendimento",
            avaliacao_psicologica: "Avaliação Psicológica",
            devolutiva: "Devolutiva",
          };

          const typeLabel =
            typeLabels[consultation.type as keyof typeof typeLabels] ||
            "Consulta";
          const title = `${typeLabel} - ${consultation.patientName}`;

          return {
            id: consultation.id,
            title,
            start: startDate,
            end: endDate,
            status: consultation.status || "agendada",
            tipo: consultation.type,
            modalidade: consultation.modality,
            pacienteNome: consultation.patientName || "",
            observacoes: consultation.notes || "",
            value: consultation.value || "",
          };
        });

        return formattedConsultations;
      } catch (error) {
        console.error("Erro ao buscar consultas:", error);
        throw new Error("Falha ao carregar consultas");
      }
    }
  );
