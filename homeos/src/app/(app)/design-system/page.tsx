import { TypographySection } from "@/components/design-system/typography-section";
import { ColorsSection } from "@/components/design-system/colors-section";
import { FormElementsSection } from "@/components/design-system/form-elements-section";
import { OverlaysSection } from "@/components/design-system/overlays-section";
import { FeedbackSection } from "@/components/design-system/feedback-section";

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
          <TypographySection />
        </section>

        <section id="cores">
          <h2 className="text-2xl font-semibold mb-4">Cores</h2>
          <ColorsSection />
        </section>

        <section id="form-elements">
          <h2 className="text-2xl font-semibold mb-4">
            Componentes de Formulário
          </h2>
          <FormElementsSection />
        </section>

        <section id="overlays">
          <h2 className="text-2xl font-semibold mb-6">Overlays</h2>
          <OverlaysSection />
          <h2 className="text-2xl font-semibold mt-12 mb-6">Feedback</h2>
          <FeedbackSection />
        </section>
      </main>
    </div>
  );
}
