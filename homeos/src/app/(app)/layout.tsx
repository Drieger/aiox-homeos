import { AppSidebar, MobileSidebar } from "@/components/layout/app-sidebar";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-h-0">
        {/* Mobile header — only visible below md breakpoint */}
        <header className="flex md:hidden items-center gap-2 border-b px-4 py-2 shrink-0 bg-background">
          <MobileSidebar />
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
