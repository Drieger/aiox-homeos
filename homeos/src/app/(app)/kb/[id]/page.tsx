import { notFound } from "next/navigation";
import { getDocumentById, getNotebooks, getDocumentTags, getTags } from "@/lib/kb/actions";
import { KbEditor } from "@/components/kb/kb-editor";

export default async function KbDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [document, notebooks, docTags, allTags] = await Promise.all([
    getDocumentById(id),
    getNotebooks(),
    getDocumentTags(id),
    getTags(),
  ]);

  if (!document) {
    notFound();
  }

  return (
    <div className="flex flex-col h-full">
      <KbEditor
        id={document.id}
        initialTitle={document.title}
        initialContent={document.content}
        initialNotebookId={document.notebookId}
        notebooks={notebooks}
        initialTags={docTags}
        allTags={allTags}
      />
    </div>
  );
}
