import { notFound } from "next/navigation";
import { getDocumentById } from "@/lib/kb/actions";
import { KbEditor } from "@/components/kb/kb-editor";

export default async function KbDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const document = await getDocumentById(id);

  if (!document) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <KbEditor
        id={document.id}
        initialTitle={document.title}
        initialContent={document.content}
      />
    </div>
  );
}
