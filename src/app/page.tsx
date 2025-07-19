import { CalendarDays, Clock, FileText, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="container flex h-16 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="hidden font-bold sm:inline-block">AtenPsi</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/painel"
                className="hover:text-foreground/80 transition-colors"
              >
                Início
              </Link>
              <Link
                href="/pacientes"
                className="hover:text-foreground/80 transition-colors"
              >
                Pacientes
              </Link>
              <Link
                href="/agenda"
                className="hover:text-foreground/80 transition-colors"
              >
                Agenda
              </Link>
              <Link
                href="/relatorios"
                className="hover:text-foreground/80 transition-colors"
              >
                Relatórios
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Button asChild variant="secondary">
                <Link href="/authentication/login">Entrar</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="from-muted/50 to-background w-full bg-gradient-to-b py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  AtenPsi - Sistema de Atendimento Psicológico
                </h1>
                <p className="text-muted-foreground mx-auto max-w-[700px] md:text-xl">
                  Uma solução completa para gerenciar atendimentos psicológicos,
                  consultas e registros de pacientes.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg" variant="secondary">
                  <Link href="/authentication/login">Começar</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/sobre">Saiba Mais</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Gestão de Pacientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Users className="text-primary h-10 w-10" />
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Gerencie registros de pacientes, histórico e informações
                        de contato em um só lugar.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild className="w-full">
                    <Link href="/pacientes">Ver Pacientes</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">
                    Agendamento de Consultas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <CalendarDays className="text-primary h-10 w-10" />
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Agende, reagende e gerencie consultas com um calendário
                        intuitivo.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild className="w-full">
                    <Link href="/agenda">Gerenciar Agenda</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">Controle de Sessões</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Clock className="text-primary h-10 w-10" />
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Acompanhe a duração das sessões, presença e status de
                        pagamento.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild className="w-full">
                    <Link href="/sessoes">Ver Sessões</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">
                    Relatórios e Análises
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <FileText className="text-primary h-10 w-10" />
                    <div>
                      <p className="text-muted-foreground text-sm">
                        Visualize estatísticas e gere relatórios para acompanhar
                        sua prática.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" asChild className="w-full">
                    <Link href="/relatorios">Ver Relatórios</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-muted-foreground text-center text-sm leading-loose md:text-left">
            © 2025 PsiAten. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
