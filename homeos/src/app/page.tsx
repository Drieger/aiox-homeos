import Link from "next/link";
import { ThemeToggle } from "@/components/layout/theme-toggle";

/**
 * Canary page — valida providers globais (ThemeProvider, QueryClientProvider).
 * Exibe nome do sistema, toggle de tema funcional e link para o design system.
 *
 * @design Esta página existe fora do route group (app) para validar
 * que os providers do root layout funcionam antes de entrar no shell completo.
 */
export default function CanaryPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">HomeOS</h1>
        <p className="text-muted-foreground text-sm">
          Seu sistema pessoal de produtividade
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Tema:</span>
        <ThemeToggle />
      </div>

      <nav className="flex gap-4 text-sm">
        <Link
          href="/books"
          className="text-primary underline-offset-4 hover:underline"
        >
          Biblioteca
        </Link>
        <Link
          href="/design-system"
          className="text-primary underline-offset-4 hover:underline"
        >
          Design System
        </Link>
      </nav>
    </div>
  );
}
