import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { createSafeActionClient } from "next-safe-action";

import { db } from "@/db";
import { tenants, users } from "@/db/schema";

import { auth } from "./auth";

// Cliente sem autenticação
export const actionClient = createSafeActionClient();

// Cliente com autenticação obrigatória
export const protectedActionClient = createSafeActionClient().use(
  async ({ next }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    return next({ ctx: { user: session.user } });
  }
);

// Cliente com autenticação + validação de tenant
type UserWithTenant = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  tenantId?: string; // <-- Adicione aqui!
};

export const protectedWithTenantActionClient = protectedActionClient.use(
  async ({ next, ctx }) => {
    const user = ctx.user as UserWithTenant; // <-- Force o tipo aqui

    // Garante que o campo tenantId está presente no user
    let tenantId = user.tenantId;
    if (!tenantId) {
      // Busca o usuário no banco para garantir o campo
      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.id),
      });
      tenantId = dbUser?.tenant_id ?? undefined;
    }

    let tenant = undefined;
    if (tenantId) {
      tenant = await db.query.tenants.findFirst({
        where: eq(tenants.id, tenantId),
      });
    }

    if (!tenant) {
      throw new Error("Tenant not found");
    }

    return next({
      ctx: {
        user: {
          ...user,
          tenantId: tenant.id,
          tenant,
        },
      },
    });
  }
);

// Alias para facilitar o uso
export const tenantActionClient = protectedWithTenantActionClient;
