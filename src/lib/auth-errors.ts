import { PASSWORD_MIN_LENGTH } from "@/lib/password-policy";

const authErrorTranslations: Array<[RegExp, string]> = [
  [
    /invalid credentials|invalid email or password|incorrect password/i,
    "E-mail ou senha inválidos.",
  ],
  [
    /user already exists|email already exists|account already exists|duplicate key/i,
    "Já existe uma conta com este e-mail.",
  ],
  [
    /password (must be|should be|is) at least \d+ characters|password too short/i,
    `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`,
  ],
  [
    /email (is required|is missing|required)|missing email/i,
    "Informe seu e-mail.",
  ],
  [
    /password (is required|is missing|required)|missing password/i,
    "Informe sua senha.",
  ],
  [/name (is required|is missing|required)|missing name/i, "Informe seu nome."],
];

export function translateAuthErrorMessage(
  message: string | null | undefined,
  fallback: string
): string {
  if (!message) {
    return fallback;
  }

  const normalizedMessage = message.trim();

  for (const [pattern, translation] of authErrorTranslations) {
    if (pattern.test(normalizedMessage)) {
      return translation;
    }
  }

  return normalizedMessage;
}
