import { test, expect } from "@playwright/test";

test("página inicial exibe título HomeOS com sidebar visível", async ({
  page,
}) => {
  await page.goto("/");

  // Título presente
  await expect(page.getByRole("heading", { name: "HomeOS" })).toBeVisible();

  // Sidebar visível (desktop viewport padrão)
  const sidebar = page.locator("aside");
  await expect(sidebar).toBeVisible();
});

test("item 'Home' está ativo na sidebar ao visitar /", async ({ page }) => {
  await page.goto("/");

  // Item "Home" presente na sidebar
  const homeLink = page.getByRole("link", { name: /Home/i }).first();
  await expect(homeLink).toBeVisible();

  // Active state: aria-current="page" no item ativo
  await expect(homeLink).toHaveAttribute("aria-current", "page");
});
