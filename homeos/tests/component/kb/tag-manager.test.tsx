import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TagManager } from "@/components/kb/tag-manager";

vi.mock("@/lib/kb/actions", () => ({
  addTagToDocument: vi.fn().mockResolvedValue(undefined),
  removeTagFromDocument: vi.fn().mockResolvedValue(undefined),
}));

const mockAllTags = [
  { id: "tag-1", name: "typescript" },
  { id: "tag-2", name: "react" },
  { id: "tag-3", name: "nextjs" },
];

describe("TagManager", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza chips das tags iniciais", () => {
    render(
      <TagManager
        documentId="doc-1"
        initialTags={[{ id: "tag-1", name: "typescript" }]}
        allTags={mockAllTags}
      />
    );

    expect(screen.getByTestId("tag-chip-typescript")).toBeInTheDocument();
  });

  it("chip de tag exibe botão × para remoção", () => {
    render(
      <TagManager
        documentId="doc-1"
        initialTags={[{ id: "tag-1", name: "typescript" }]}
        allTags={mockAllTags}
      />
    );

    const removeBtn = screen.getByRole("button", { name: /remover tag typescript/i });
    expect(removeBtn).toBeInTheDocument();
  });

  it("clique no × remove o chip visualmente", async () => {
    render(
      <TagManager
        documentId="doc-1"
        initialTags={[{ id: "tag-1", name: "typescript" }]}
        allTags={mockAllTags}
      />
    );

    const removeBtn = screen.getByRole("button", { name: /remover tag typescript/i });
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.queryByTestId("tag-chip-typescript")).not.toBeInTheDocument();
    });
  });

  it("renderiza input para adicionar nova tag", () => {
    render(
      <TagManager documentId="doc-1" initialTags={[]} allTags={mockAllTags} />
    );

    const input = screen.getByTestId("tag-input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("placeholder", "Adicionar tag...");
  });

  it("pressionar Enter com texto não existente adiciona novo chip", async () => {
    const { addTagToDocument } = await import("@/lib/kb/actions");

    render(
      <TagManager documentId="doc-1" initialTags={[]} allTags={mockAllTags} />
    );

    const input = screen.getByTestId("tag-input");
    fireEvent.change(input, { target: { value: "nova-tag" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(screen.getByTestId("tag-chip-nova-tag")).toBeInTheDocument();
    });

    expect(addTagToDocument).toHaveBeenCalledWith("doc-1", "nova-tag");
  });
});
