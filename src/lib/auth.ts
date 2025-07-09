import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { customSession } from "better-auth/plugins";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { tenants, users } from "@/db/schema";

const FIVE_MINUTES = 5 * 60;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: false,
    schema,
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    customSession(async ({ user, session }) => {
      const userData: typeof users.$inferSelect | undefined =
        await db.query.users.findFirst({
          where: eq(users.id, user.id),
        });

      const tenantData: typeof tenants.$inferSelect | undefined =
        userData?.tenantId
          ? await db.query.tenants.findFirst({
              where: eq(tenants.id, userData.tenantId),
            })
          : undefined;

      return {
        user: {
          ...user,
          role: userData?.role,
          crp: userData?.crp,
          active: userData?.active,
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
      crp: {
        type: "string",
        fieldName: "crp",
        required: false,
      },
      role: {
        type: "string",
        fieldName: "role",
        required: false,
      },
      tenantId: {
        type: "string",
        fieldName: "tenantId",
        required: true,
      },
      active: {
        type: "boolean",
        fieldName: "active",
        required: false,
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
