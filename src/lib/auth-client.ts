import { createAuthClient } from "better-auth/react";

const { signIn, signOut, signUp, useSession } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export { signIn, signOut, signUp, useSession };
