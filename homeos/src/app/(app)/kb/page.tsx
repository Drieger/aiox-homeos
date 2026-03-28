import { KbSidebar } from "@/components/kb/kb-sidebar";
import { DocumentList } from "@/components/kb/document-list";
import { getNotebooks, getDocuments, getTags } from "@/lib/kb/actions";

export default async function KbPage() {
  const [notebookList, documentList, tagList] = await Promise.all([
    getNotebooks(),
    getDocuments(),
    getTags(),
  ]);

  return (
    <div className="flex h-full overflow-hidden">
      <KbSidebar notebooks={notebookList} tags={tagList} />
      <DocumentList documents={documentList} />
      <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
        Selecione um documento
      </div>
    </div>
  );
}
