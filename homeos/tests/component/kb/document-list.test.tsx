import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DocumentList } from "@/components/kb/document-list";

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock server actions
vi.mock("@/lib/kb/actions", () => ({
  createDocument: vi.fn(),
  deleteDocument: vi.fn(),
}));

const mockDocuments = [
  {
    id: "doc-1",
    title: "Meu Primeiro Doc",
    notebookName: "Geral",
    updatedAt: new Date("2026-01-15").getTime(),
  },
  {
    id: "doc-2",
    title: "Segundo Documento",
    notebookName: "Pesquisa",
    updatedAt: new Date("2026-01-10").getTime(),
  },
];

describe("DocumentList", () => {
  it("renderiza lista de documentos com título e caderno", () => {
    render(<DocumentList documents={mockDocuments} />);
    expect(screen.getByText("Meu Primeiro Doc")).toBeInTheDocument();
    expect(screen.getByText("Segundo Documento")).toBeInTheDocument();
    expect(screen.getAllByText(/Geral/)[0]).toBeInTheDocument();
    expect(screen.getByText(/Pesquisa/)).toBeInTheDocument();
  });

  it("renderiza estado vazio com mensagem quando não há documentos", () => {
    render(<DocumentList documents={[]} />);
    expect(screen.getByText(/Nenhum documento/i)).toBeInTheDocument();
  });

  it("renderiza botão de exclusão para cada documento", () => {
    render(<DocumentList documents={mockDocuments} />);
    const deleteButtons = screen.getAllByLabelText(/Excluir/);
    expect(deleteButtons).toHaveLength(2);
  });

  it("links dos documentos apontam para /kb/[id]", () => {
    render(<DocumentList documents={mockDocuments} />);
    const links = screen.getAllByRole("link");
    const docLinks = links.filter((l) => l.getAttribute("href")?.startsWith("/kb/"));
    expect(docLinks).toHaveLength(2);
    expect(docLinks[0]).toHaveAttribute("href", "/kb/doc-1");
    expect(docLinks[1]).toHaveAttribute("href", "/kb/doc-2");
  });

  it("botão 'Novo Documento' está no header", () => {
    render(<DocumentList documents={mockDocuments} />);
    expect(screen.getByRole("button", { name: /novo documento/i })).toBeInTheDocument();
  });
});
