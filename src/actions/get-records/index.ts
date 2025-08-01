"use server";

import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { consultations, patients } from "@/db/schema";
import { tenantActionClient } from "@/lib/auth-safe-action";

import {
  GetPsychologicalRecordsInput,
  getPsychologicalRecordsSchema,
  UpdateRecordStatusInput,
  updateRecordStatusSchema,
} from "./schema";

type TenantContext = {
  user: {
    tenantId: string;
  };
};

// Interface for psychological record data
export interface PsychologicalRecord {
  id: string;
  archivalCode: string;
  patientId: string;
  patientName: string;
  patientCpf: string;
  startDate: Date;
  lastConsultationDate: Date;
  status: "active" | "completed" | "suspended" | "archived";
  recordNumber: string;
  sector: string;
  shelf: string;
  position: string;
  notes?: string;
  totalConsultations: number;
  psychologist: string;
  psychologistCrp: string;
}

// Generate archival code based on modern standards
function generateArchivalCode(
  year: number,
  recordNumber: number,
  sector: string,
  cabinet: string,
  shelf: string
): string {
  const paddedNumber = recordNumber.toString().padStart(3, "0");
  const paddedPosition = "001"; // Default position, will be updated when physically archived
  return `PSI-${year}-${paddedNumber}-${sector}${cabinet}-P${shelf}-${paddedPosition}`;
}

// Determine patient status based on consultations
function determinePatientStatus(
  consultations: Array<{ id: string; date: Date; type: string; status: string }>
): "active" | "completed" | "suspended" | "archived" {
  if (consultations.length === 0) return "active";

  const lastConsultation = consultations[0]; // Already ordered by date desc
  const daysSinceLastConsultation = Math.floor(
    (Date.now() - new Date(lastConsultation.date).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // If last consultation was more than 90 days ago, consider suspended
  if (daysSinceLastConsultation > 90) {
    return "suspended";
  }

  // If patient has had sessions and recent activity, consider active
  return "active";
}

export const getPsychologicalRecords = tenantActionClient
  .inputSchema(getPsychologicalRecordsSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: GetPsychologicalRecordsInput;
      ctx: TenantContext;
    }) => {
      try {
        const { search, status, sector, page, limit, orderBy, orderDirection } =
          parsedInput;

        // Build search conditions
        const searchConditions = search
          ? or(
              ilike(patients.name, `%${search}%`),
              ilike(patients.cpf, `%${search}%`)
            )
          : undefined;

        const conditions = [
          eq(patients.tenant_id, ctx.user.tenantId),
          ...(searchConditions ? [searchConditions] : []),
        ];

        // Get patients with their consultation data
        const patientsData = await db
          .select({
            id: patients.id,
            name: patients.name,
            cpf: patients.cpf,
            created_at: patients.created_at,
          })
          .from(patients)
          .where(and(...conditions))
          .limit(limit)
          .offset((page - 1) * limit);

        // For each patient, get consultation statistics
        const recordsPromises = patientsData.map(async (patient) => {
          const consultationsDataRaw = await db
            .select({
              id: consultations.id,
              date: consultations.date,
              type: consultations.type,
              status: consultations.status,
            })
            .from(consultations)
            .where(eq(consultations.patient_id, patient.id))
            .orderBy(desc(consultations.date));

          // Convert date string to Date object
          const consultationsData = consultationsDataRaw.map((c) => ({
            ...c,
            date: new Date(c.date),
          }));

          const totalConsultations = consultationsData.length;
          const startDate =
            consultationsData.length > 0
              ? consultationsData[consultationsData.length - 1].date
              : new Date(patient.created_at!);

          const lastConsultationDate =
            consultationsData.length > 0
              ? consultationsData[0].date
              : new Date(patient.created_at!);

          // Determine status
          const recordStatus = determinePatientStatus(consultationsData);

          // Generate record number based on creation year
          const year = startDate.getFullYear();
          const recordNumber = `${totalConsultations.toString().padStart(3, "0")}/${year}`;

          // Generate archival code (for now, using default values)
          const archivalCode = generateArchivalCode(
            year,
            totalConsultations || 1,
            "A",
            "1",
            "1"
          );

          // Default sector assignment based on patient name
          const firstLetter = patient.name.charAt(0).toUpperCase();
          const defaultSector = firstLetter <= "M" ? "A" : "B";

          const record: PsychologicalRecord = {
            id: patient.id,
            archivalCode,
            patientId: patient.id,
            patientName: patient.name,
            patientCpf: patient.cpf || "",
            startDate,
            lastConsultationDate,
            status: recordStatus,
            recordNumber,
            sector: defaultSector,
            shelf: "1",
            position: "001",
            totalConsultations,
            psychologist: "Dra. Ana Beatriz Oliveira", // TODO: Get from user settings
            psychologistCrp: "06/12345", // TODO: Get from user settings
          };

          return record;
        });

        const records = await Promise.all(recordsPromises);

        // Apply status filter
        const filteredRecords =
          status === "all"
            ? records
            : records.filter((record) => record.status === status);

        // Apply sector filter
        const sectorFilteredRecords = sector
          ? filteredRecords.filter((record) => record.sector === sector)
          : filteredRecords;

        // Apply sorting
        const sortedRecords = sectorFilteredRecords.sort((a, b) => {
          let comparison = 0;

          switch (orderBy) {
            case "code":
              comparison = a.archivalCode.localeCompare(b.archivalCode);
              break;
            case "patient_name":
              comparison = a.patientName.localeCompare(b.patientName);
              break;
            case "start_date":
              comparison = a.startDate.getTime() - b.startDate.getTime();
              break;
            case "status":
              comparison = a.status.localeCompare(b.status);
              break;
          }

          return orderDirection === "asc" ? comparison : -comparison;
        });

        // Count total for pagination
        const totalCount = await db
          .select({ count: sql<number>`count(*)` })
          .from(patients)
          .where(and(...conditions));

        const total = totalCount[0]?.count || 0;
        const totalPages = Math.ceil(total / limit);

        return {
          records: sortedRecords,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount: total,
            hasNext: page < totalPages,
            hasPrev: page > 1,
            limit,
          },
        };
      } catch (error) {
        console.error("Error fetching psychological records:", error);
        throw new Error("Failed to fetch psychological records");
      }
    }
  );

export const updateRecordStatus = tenantActionClient
  .inputSchema(updateRecordStatusSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: UpdateRecordStatusInput;
      ctx: TenantContext;
    }) => {
      try {
        // For now, we'll store the archival information in the patient notes
        // In a real implementation, you'd want a separate psychological_records table

        const archivalInfo = {
          status: parsedInput.status,
          archivalCode: parsedInput.archivalCode,
          sector: parsedInput.sector,
          shelf: parsedInput.shelf,
          position: parsedInput.position,
          archivedAt: new Date().toISOString(),
          notes: parsedInput.notes,
        };

        // Update patient with archival information
        await db
          .update(patients)
          .set({
            notes: JSON.stringify(archivalInfo),
            updated_at: new Date(),
          })
          .where(
            and(
              eq(patients.id, parsedInput.patientId),
              eq(patients.tenant_id, ctx.user.tenantId)
            )
          );

        return {
          success: true,
          message: "Record status updated successfully",
        };
      } catch (error) {
        console.error("Error updating record status:", error);
        throw new Error("Failed to update record status");
      }
    }
  );
