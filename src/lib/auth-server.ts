import { auth } from "./auth";

// Exporte apenas o que existe
export const { api } = auth;

// Para usar em server components e API routes
export { auth };
