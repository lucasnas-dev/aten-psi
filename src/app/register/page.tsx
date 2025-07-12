"use client";

import { SignUpForm } from "../authentication/_components/sign-up-form";

export default function RegisterPage() {
  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Criar conta</h1>
          <p className="text-muted-foreground">
            Cadastre-se para acessar o sistema PsiAten
          </p>
        </div>
        <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm">
          <SignUpForm />
        </div>
        <div className="text-muted-foreground mt-4 text-center text-sm">
          <p>
            Já tem uma conta?{" "}
            <a href="/authentication" className="text-primary hover:underline">
              Fazer login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
