import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { accounts } from "@/db/schema";
import { auth } from "@/lib/auth";
import logger from "@/lib/logger";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Verificar se o email existe no banco de dados
    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.providerAccountId, email))
      .limit(1);

    if (!account.length) {
      logger.error("Conta não encontrada para o email:", { email });
      return new Response(JSON.stringify({ error: "Conta não encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verificar se o hash da senha está presente
    const hash = account[0].password;
    if (!hash) {
      logger.error("Hash da senha não encontrado para o email:", { email });
      return new Response(
        JSON.stringify({ error: "Erro interno no servidor" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Verificar a senha
    const senhaCorreta = await bcrypt.compare(password, hash);

    if (!senhaCorreta) {
      logger.error("Senha incorreta para o email:", { email });
      return new Response(JSON.stringify({ error: "Senha incorreta" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Retornar sucesso
    logger.info("Login bem-sucedido para o email:", { email });
    return new Response(
      JSON.stringify({ message: "Login bem-sucedido", account: account[0] }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    logger.error("Erro no POST handler:", { error });
    return new Response(JSON.stringify({ error: "Erro interno no servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const GET = async (req: Request) => {
  try {
    // Usar o auth.handler para lidar com requisições GET
    const response = await auth.handler(req);

    if (!response.body) {
      logger.error("Resposta vazia do auth.handler");
      return new Response(
        JSON.stringify({ error: "Resposta vazia do servidor" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    return response;
  } catch (error) {
    logger.error("Erro no GET handler:", { error });
    return new Response(JSON.stringify({ error: "Erro interno no servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
