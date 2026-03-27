"use client";

import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  isActive: boolean;
  collapsed: boolean;
}

/**
 * Item de navegação da sidebar com estado ativo e modo colapsado.
 *
 * @param label - Texto do item
 * @param href - Destino da navegação
 * @param icon - Ícone Lucide
 * @param isActive - Se a rota atual corresponde a este item
 * @param collapsed - Se a sidebar está no modo ícone
 *
 * @design Componente extraído do AppSidebar para facilitar testes
 * e reutilização. O estado ativo usa `aria-current="page"` para
 * acessibilidade além da distinção visual.
 */
export function SidebarNavItem({
  label,
  href,
  icon: Icon,
  isActive,
  collapsed,
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive
          ? "bg-accent text-accent-foreground font-medium"
          : "text-muted-foreground",
        collapsed && "justify-center px-2"
      )}
    >
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
