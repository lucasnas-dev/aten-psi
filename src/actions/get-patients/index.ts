"use server";

import { and, desc, asc, eq, ilike, or, sql } from "drizzle-orm";

import { db } from "@/db";
import { patients } from "@/db/schema";
import { tenantActionClient } from "@/lib/auth-safe-action";

import { GetPatientsInput, getPatientsSchema } from "./schema";

type TenantCtx = {
  user: {
    tenantId: string;
  };
};

export const getPatients = tenantActionClient
  .inputSchema(getPatientsSchema)
  .action(
    async ({
      parsedInput,
      ctx,
    }: {
      parsedInput: GetPatientsInput;
      ctx: TenantCtx;
    }) => {
      try {
        const { search, status, page, limit, orderBy, orderDirection } = parsedInput;

        // Construir condições de busca
        const searchConditions = search
          ? or(
              ilike(patients.name, `%${search}%`),
              ilike(patients.email, `%${search}%`),
              ilike(patients.phone, `%${search}%`),
            )
          : undefined;

        // Construir condições de status
        const statusCondition =
          status !== "all" ? eq(patients.status, status) : undefined;

        // Condição de tenant (sempre necessária)
        const tenantCondition = eq(patients.tenant_id, ctx.user.tenantId);

        // Combinar condições
        const conditions = [
          tenantCondition,
          searchConditions,
          statusCondition,
        ].filter(Boolean);

        // Configurar ordenação
        const getOrderColumn = () => {
          switch (orderBy) {
            case "name":
              // Usar LOWER() para ordenação case-insensitive
              return sql`LOWER(${patients.name})`;
            case "updated_at":
              return patients.updated_at;
            case "created_at":
            default:
              return patients.created_at;
          }
        };

        const orderColumn = getOrderColumn();
        const orderFunction = orderDirection === "asc" ? asc : desc;

        // Buscar pacientes com paginação
        const patientsData = await db
          .select()
          .from(patients)
          .where(and(...conditions))
          .orderBy(orderFunction(orderColumn))
          .limit(limit)
          .offset((page - 1) * limit);

        // Contar total de registros para paginação
        const totalCountResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(patients)
          .where(and(...conditions));

        const totalCount = totalCountResult[0]?.count || 0;
        const totalPages = Math.ceil(totalCount / limit);

        return {
          patients: patientsData,
          pagination: {
            currentPage: page,
            totalPages,
            totalCount,
            hasNext: page < totalPages,
            hasPrev: page > 1,
            limit,
          },
        };
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
        throw new Error("Falha ao buscar pacientes");
      }
    },
  );
