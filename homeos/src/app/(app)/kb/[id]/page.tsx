import { notFound } from "next/navigation";

// Scaffold para Story 3.3 — editor Markdown será implementado nesta rota
export default async function KbDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-muted-foreground text-sm">
        Editor de documento — a ser implementado na Story 3.3
      </p>
    </div>
  );
}
