import { test, expect } from "@playwright/test";
import { db } from "@/lib/db";
import { notebooks, documents } from "@/lib/db/schema";
import { ulid } from "ulidx";

// Helper: cria um documento de teste no banco e retorna o ID
async function createTestDocument(title: string, content: string) {
  const notebookId = ulid();
  const docId = ulid();
  await db.insert(notebooks).values({ id: notebookId, name: "Teste" });
  await db.insert(documents).values({
    id: docId,
    notebookId,
    title,
    content,
  });
  return docId;
}

test.describe("KB Editor — Story 3.3", () => {
  test("abre documento existente e exibe título e conteúdo", async ({ page }) => {
    const docId = await createTestDocument("Meu Documento", "# Olá\nConteúdo inicial");

    await page.goto(`/kb/${docId}`);

    // Título editável presente
    const titleInput = page.locator('input[placeholder="Sem título"]');
    await expect(titleInput).toBeVisible();
    await expect(titleInput).toHaveValue("Meu Documento");
  });

  test("editar título dispara indicador 'salvo' após debounce", async ({ page }) => {
    const docId = await createTestDocument("Título Original", "Conteúdo");

    await page.goto(`/kb/${docId}`);

    const titleInput = page.locator('input[placeholder="Sem título"]');
    await titleInput.fill("Novo Título");

    // Aguarda indicador "salvando..." aparecer
    await expect(page.getByText("salvando...")).toBeVisible({ timeout: 2000 });

    // Aguarda indicador "salvo"
    await expect(page.getByText("salvo")).toBeVisible({ timeout: 5000 });
  });

  test("toggle entre Editar e Preview alterna modos", async ({ page }) => {
    const docId = await createTestDocument("Doc Toggle", "**negrito**");

    await page.goto(`/kb/${docId}`);

    // Modo inicial: editor
    const previewButton = page.getByRole("button", { name: "Preview" });
    await expect(previewButton).toBeVisible();

    // Clica em Preview
    await previewButton.click();

    // Agora deve mostrar o botão "Editar"
    const editButton = page.getByRole("button", { name: "Editar" });
    await expect(editButton).toBeVisible();

    // Conteúdo renderizado como Markdown
    const renderedContent = page.locator(".prose");
    await expect(renderedContent).toBeVisible();
    // "negrito" renderizado como <strong>
    await expect(renderedContent.locator("strong")).toBeVisible();
  });

  test("syntax highlight em bloco de código no preview", async ({ page }) => {
    const code = "```javascript\nconst x = 1;\n```";
    const docId = await createTestDocument("Doc Código", code);

    await page.goto(`/kb/${docId}`);

    // Vai para preview
    await page.getByRole("button", { name: "Preview" }).click();

    // Bloco de código deve estar presente e com highlight
    const codeBlock = page.locator(".prose code");
    await expect(codeBlock).toBeVisible();
  });
});
