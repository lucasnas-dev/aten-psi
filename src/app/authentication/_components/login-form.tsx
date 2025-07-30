"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon, LockKeyhole, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { ensureTenant } from "@/actions/ensure-tenant";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth-client";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter pelo menos 6 caracteres" }),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hook do next-safe-action para a ação de garantir tenant
  const { execute: executeEnsureTenant, isExecuting: isEnsuring } = useAction(
    ensureTenant,
    {
      onSuccess: () => {
        // Após garantir o tenant, redireciona para o dashboard
        router.push("/dashboard");
      },
      onError: ({ error }) => {
        if (error.serverError) {
          setError(error.serverError);
        } else if (error.validationErrors) {
          setError("Dados inválidos");
        } else {
          setError("Erro ao configurar conta");
        }
        setIsLoading(false);
      },
    }
  );

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true);
    setError(null);
    try {
      const { error: loginError } = await signIn.email({
        email: data.email,
        password: data.password,
      });

      if (loginError) {
        setError("Erro ao fazer login. Verifique suas credenciais.");
        setIsLoading(false);
      } else {
        // Garante que o usuário tenha tenant usando next-safe-action
        executeEnsureTenant({
          name: crypto.randomUUID(), // Em vez do email + timestamp
        });
        // O redirect acontecerá no onSuccess do useAction
      }
    } catch {
      setError("Erro ao tentar fazer login. Tente novamente mais tarde.");
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <FormControl>
                  <Input
                    placeholder="seu.email@exemplo.com"
                    className="pl-10"
                    {...field}
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <div className="relative">
                <LockKeyhole className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10 pl-10"
                    {...field}
                  />
                </FormControl>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground absolute top-3 right-3"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Esconder senha" : "Mostrar senha"}
                  </span>
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || isEnsuring}
        >
          {isLoading
            ? "Entrando..."
            : isEnsuring
              ? "Configurando conta..."
              : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}
