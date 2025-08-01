import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Rotas que requerem autenticação
const protectedRoutes = [
  "/dashboard",
  "/patients",
  "/agenda",
  "/records",
  "/relatorios",
  "/configuracoes",
];

// Rotas de autenticação (não devem ser acessadas por usuários logados)
const authRoutes = ["/authentication/login", "/authentication/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se há um token de sessão
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  // Se estiver em uma rota protegida e não tiver sessão, redirecionar para login
  if (
    protectedRoutes.some((route) => pathname.startsWith(route)) &&
    !sessionToken
  ) {
    return NextResponse.redirect(new URL("/authentication/login", request.url));
  }

  // Se estiver em uma rota de auth e tiver sessão, redirecionar para dashboard
  if (authRoutes.some((route) => pathname.startsWith(route)) && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirecionar root para dashboard se autenticado, senão para login
  if (pathname === "/") {
    if (sessionToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    } else {
      return NextResponse.redirect(
        new URL("/authentication/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
