import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { tenants, users } from "@/db/schema";
import logger from "@/lib/logger";

const FIVE_MINUTES = 5 * 60;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: false,
    schema,
  }),
  plugins: [
    customSession(async ({ user, session }) => {
      logger.info("Custom session plugin triggered");

      const userData = await db.query.users.findFirst({
        where: eq(users.id, user.id),
      });

      const tenantData = userData?.tenantId
        ? await db.query.tenants.findFirst({
            where: eq(tenants.id, userData.tenantId),
          })
        : undefined;

      return {
        user: {
          ...user,
          emailVerified: userData?.emailVerified,
          tenant: tenantData
            ? {
                id: tenantData.id,
                name: tenantData.name,
                plan: tenantData.plan,
              }
            : undefined,
        },
        session,
      };
    }),
  ],
  user: {
    modelName: "users",
    additionalFields: {
      emailVerified: {
        type: "boolean",
        fieldName: "emailVerified",
        required: false,
      },
      tenantId: {
        type: "string",
        fieldName: "tenantId",
        required: true,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: FIVE_MINUTES,
    },
    modelName: "sessions",
  },
  account: {
    modelName: "accounts",
  },
  verification: {
    modelName: "verifications",
  },
  emailAndPassword: {
    enabled: true,
  },
  pages: {
    signIn: "/authentication",
  },
});

// Log básico para indicar que o Better Auth foi configurado
logger.info("Better Auth configurado com sucesso");
