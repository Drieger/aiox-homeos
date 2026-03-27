const sections = [
  { id: "tipografia", label: "Tipografia" },
  { id: "cores", label: "Cores" },
  { id: "form-elements", label: "Componentes de Formulário" },
  { id: "overlays", label: "Overlays" },
] as const;

export default function DesignSystemPage() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8 h-full"
      style={{ scrollBehavior: "smooth" }}
    >
      <aside className="hidden md:block">
        <nav className="sticky top-4 flex flex-col gap-1">
          <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Design System
          </p>
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {section.label}
            </a>
          ))}
        </nav>
      </aside>

      <main className="flex flex-col gap-16 pb-16">
        <section id="tipografia">
          <h2 className="text-2xl font-semibold mb-4">Tipografia</h2>
          <p className="text-muted-foreground">
            Showcase de estilos tipográficos — a ser implementado na Story 2.2.
          </p>
        </section>

        <section id="cores">
          <h2 className="text-2xl font-semibold mb-4">Cores</h2>
          <p className="text-muted-foreground">
            Paleta de cores do sistema — a ser implementado na Story 2.2.
          </p>
        </section>

        <section id="form-elements">
          <h2 className="text-2xl font-semibold mb-4">
            Componentes de Formulário
          </h2>
          <p className="text-muted-foreground">
            Inputs, selects, checkboxes e demais elementos — a ser implementado na Story 2.3.
          </p>
        </section>

        <section id="overlays">
          <h2 className="text-2xl font-semibold mb-4">Overlays</h2>
          <p className="text-muted-foreground">
            Modais, sheets, tooltips e popovers — a ser implementado na Story 2.4.
          </p>
        </section>
      </main>
    </div>
  );
}
