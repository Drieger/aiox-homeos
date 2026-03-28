"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronLeft, Home, Menu, Palette } from "lucide-react";

import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { SidebarNavItem } from "@/components/layout/sidebar-nav-item";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Knowledge Base",
    href: "/kb",
    icon: BookOpen,
  },
  {
    label: "Design System",
    href: "/design-system",
    icon: Palette,
  },
] as const;

/**
 * Sidebar colapsável principal do HomeOS — apenas desktop.
 *
 * @design Renderiza somente no desktop (hidden md:flex). O componente
 * MobileSidebar (exportado abaixo) lida com mobile via hamburger + Sheet.
 * Separação necessária para que o layout posicione o hamburger em um
 * header mobile sem usar position:fixed que sobrepõe o conteúdo.
 */
export function AppSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-background transition-all duration-200",
        sidebarCollapsed ? "w-16" : "w-60"
      )}
    >
      <div className="flex items-center justify-end border-b px-3 py-3">
        <button
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
          className="rounded-md p-1 hover:bg-accent transition-colors"
        >
          <ChevronLeft
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-200",
              sidebarCollapsed && "rotate-180"
            )}
          />
        </button>
      </div>

      <nav className="flex flex-col gap-1 px-2 py-4">
        {navItems.map((item) => (
          <SidebarNavItem
            key={item.href}
            label={item.label}
            href={item.href}
            icon={item.icon}
            isActive={isActive(item.href)}
            collapsed={sidebarCollapsed}
          />
        ))}
      </nav>
      <div className="mt-auto border-t px-2 py-3 flex justify-center">
        <ThemeToggle />
      </div>
    </aside>
  );
}

/**
 * Conteúdo de navegação para o Sheet mobile — sempre expandido.
 *
 * @design Usa SheetClose com render prop em cada link, garantindo que o
 * Sheet feche automaticamente após a navegação.
 */
function MobileNavContent() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const navLinkClass = (href: string) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
      "hover:bg-accent hover:text-accent-foreground",
      isActive(href)
        ? "bg-accent text-accent-foreground font-medium"
        : "text-muted-foreground"
    );

  return (
    <nav className="flex flex-col gap-1 px-2 py-4">
      {navItems.map((item) => (
        <SheetClose
          key={item.href}
          nativeButton={false}
          render={<Link href={item.href} />}
          className={navLinkClass(item.href)}
          aria-current={isActive(item.href) ? "page" : undefined}
        >
          <item.icon className="size-4 shrink-0" />
          <span>{item.label}</span>
        </SheetClose>
      ))}
    </nav>
  );
}

/**
 * Trigger mobile + Sheet com navegação completa.
 * Renderizado pelo AppLayout em um header mobile dedicado.
 */
export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Open navigation menu"
        className="rounded-md p-1 hover:bg-accent transition-colors"
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-60 p-0">
        <MobileNavContent />
      </SheetContent>
    </Sheet>
  );
}
