import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { accounts, tenants, users } from "@/db/schema"; // Importe accounts!

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  // Verifica se já existe usuário
  const existing = await db.query.users.findFirst({
    where: (u, { eq }) => eq(u.email, email),
  });
  if (existing) {
    console.log("Usuário já existe:", email);
    return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
  }

  // Cria um tenant para o novo usuário
  const tenantInsert = await db
    .insert(tenants)
    .values({
      name,
      plan: "free",
      // outros campos obrigatórios do seu schema de tenants
    })
    .returning({ id: tenants.id });

  const tenantId = tenantInsert[0].id;
  console.log("Tenant criado:", tenantInsert);

  // Criptografa a senha
  const hash = await bcrypt.hash(password, 10);

  // Cria usuário já associado ao tenant criado
  const userInsert = await db
    .insert(users)
    .values({
      name,
      email,
      password: hash,
      tenantId,
      // outros campos se necessário
    })
    .returning({ id: users.id });

  const userId = userInsert[0].id;
  console.log("Usuário criado:", userInsert);

  // Crie o account do tipo credentials
  const accountInsert = await db
    .insert(accounts)
    .values({
      userId,
      provider: "credentials",
      providerAccountId: email,
      password: hash,
      // outros campos se necessário
    })
    .returning();

  console.log("Account criado:", accountInsert);

  return NextResponse.json({ success: true });
}
