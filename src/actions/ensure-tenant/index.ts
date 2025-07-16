"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { tenants, users } from "@/db/schema";
import { protectedActionClient } from "@/lib/auth-safe-action";

import { createTenantSchema } from "./schema";

export const ensureTenant = protectedActionClient
  .inputSchema(createTenantSchema.optional())
  .action(async ({ parsedInput, ctx }) => {
    // Busca o usuário no banco
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, ctx.user.id),
    });

    if (dbUser?.tenant_id) {
      return { hasTenant: true };
    }

    // Cria tenant com os dados validados ou padrão
    const [tenant] = await db
      .insert(tenants)
      .values({
        name: parsedInput?.name || `Tenant de ${dbUser?.name || "Usuário"}`,
        plan: parsedInput?.plan || "free",
      })
      .returning();

    // Atualiza usuário com tenant_id
    await db
      .update(users)
      .set({ tenant_id: tenant.id })
      .where(eq(users.id, ctx.user.id));

    return { hasTenant: true };
  });
