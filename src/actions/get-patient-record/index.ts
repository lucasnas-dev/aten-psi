"use server";

import { and, desc, eq } from "drizzle-orm";

import { db } from "@/db";
import { consultations, patients, userSettings } from "@/db/schema";
import { tenantActionClient } from "@/lib/auth-safe-action";

import { GetPatientRecordInput, getPatientRecordSchema } from "./schema";

type TenantCtx = {
  user: {
    tenantId: string;
    id: string;
  };
};

export const getPatientRecord = tenantActionClient
  .inputSchema(getPatientRecordSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: GetPatientRecordInput;
      ctx: TenantCtx;
    }) => {
      try {
        const { patientId } = parsedInput;

        console.log("get-patient-record: received patientId:", patientId);
        console.log("get-patient-record: user context:", ctx.user);

        // Fetch patient data
        const patientData = await db
          .select()
          .from(patients)
          .where(
            and(
              eq(patients.id, patientId),
              eq(patients.tenant_id, ctx.user.tenantId)
            )
          )
          .limit(1);

        console.log("get-patient-record: found patients:", patientData.length);

        if (patientData.length > 0) {
          console.log("get-patient-record: patient data:", {
            id: patientData[0].id,
            name: patientData[0].name,
            tenant_id: patientData[0].tenant_id,
          });
        }

        if (!patientData.length) {
          throw new Error("Patient not found");
        }

        const patient = patientData[0];

        // Fetch patient consultations ordered by date/time (most recent first)
        const consultationHistory = await db
          .select()
          .from(consultations)
          .where(
            and(
              eq(consultations.patient_id, patientId),
              eq(consultations.tenant_id, ctx.user.tenantId)
            )
          )
          .orderBy(desc(consultations.date), desc(consultations.time));

        // Fetch psychologist information from user settings
        const psychologistData = await db
          .select({
            name: userSettings.name,
            crp: userSettings.crp,
            email: userSettings.email,
            phone: userSettings.phone,
            specialization: userSettings.specialization,
          })
          .from(userSettings)
          .where(
            and(
              eq(userSettings.userId, ctx.user.id),
              eq(userSettings.tenantId, ctx.user.tenantId)
            )
          )
          .limit(1);

        const psychologist = psychologistData[0] || {
          name: null,
          crp: null,
          email: null,
          phone: null,
          specialization: null,
        };

        // Calculate basic statistics
        const totalConsultations = consultationHistory.length;
        const completedConsultations = consultationHistory.filter(
          (c) => c.status === "realizada"
        ).length;
        const lastConsultationDate = consultationHistory[0]?.date || null;
        const firstConsultationDate =
          consultationHistory[consultationHistory.length - 1]?.date || null;

        // Format consultation sessions for display
        const formattedSessions = consultationHistory.map(
          (consultation, index) => {
            // Calculate session number (reverse order since we ordered desc)
            const sessionNumber = consultationHistory.length - index;

            const typeLabels = {
              triagem: "Triagem",
              avaliacao_inicial: "Avaliação Inicial",
              atendimento: "Psicoterapia",
              avaliacao_psicologica: "Avaliação Psicológica",
              devolutiva: "Devolutiva",
            };

            const modalityLabels = {
              presencial: "Presencial",
              online: "Online",
              telefone: "Telefone",
            };

            return {
              id: consultation.id,
              sessionNumber,
              date: consultation.date,
              time: consultation.time,
              duration: parseInt(consultation.duration),
              type:
                typeLabels[consultation.type as keyof typeof typeLabels] ||
                consultation.type,
              modality:
                modalityLabels[
                  consultation.modality as keyof typeof modalityLabels
                ] || consultation.modality,
              attended: consultation.status === "realizada",
              content: consultation.notes || "",
              observations: "",
              value: consultation.value,
              status: consultation.status,
            };
          }
        );

        // Prepare patient record data
        const patientRecord = {
          // Basic patient information
          id: patient.id,
          name: patient.name,
          email: patient.email || "",
          phone: patient.phone || "",
          birthDate: patient.birth_date,
          gender: patient.gender || "",
          cpf: patient.cpf || "",
          responsibleCpf: patient.responsible_cpf || "",

          // Address information
          address: patient.address || "",
          houseNumber: patient.house_number || "",
          neighborhood: patient.neighborhood || "",
          city: patient.city || "",
          state: patient.state || "",
          cep: patient.cep || "",

          // Clinical information
          notes: patient.notes || "",
          status: patient.status,
          startDate: firstConsultationDate,
          lastConsultationDate,

          // Statistics
          totalConsultations,
          completedConsultations,

          // Sessions
          sessions: formattedSessions,

          // Psychologist information
          psychologist: {
            name: psychologist.name || "Não informado",
            crp: psychologist.crp || "Não informado",
            email: psychologist.email || "",
            phone: psychologist.phone || "",
            specialization: psychologist.specialization || "",
          },

          // Timestamps
          createdAt: patient.created_at,
          updatedAt: patient.updated_at,
        };

        return {
          patient: patientRecord,
        };
      } catch (error) {
        console.error("Error fetching patient record:", error);
        throw new Error("Failed to fetch patient record");
      }
    }
  );
