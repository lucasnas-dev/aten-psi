"use client";

import Link from "next/link";

import { LoginForm } from "./_components/login-form";

export default function LoginPage() {
  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">PsiAten</h1>
          <p className="text-muted-foreground">
            Sistema de Atendimento Psicológico
          </p>
        </div>

        <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-2xl leading-none font-semibold tracking-tight">
              Login
            </h2>
            <p className="text-muted-foreground text-sm">
              Entre com suas credenciais para acessar o sistema
            </p>
          </div>
          <div className="p-6">
            <LoginForm />
          </div>
          <div className="flex flex-col space-y-4 p-6">
            <p className="text-muted-foreground text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>

        <div className="text-muted-foreground text-center text-sm">
          <p>
            Ao fazer login, você concorda com nossos{" "}
            <Link href="/termos" className="text-primary hover:underline">
              Termos de Serviço
            </Link>{" "}
            e{" "}
            <Link href="/privacidade" className="text-primary hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
