import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TypographySection } from "@/components/design-system/typography-section";
import { ColorsSection } from "@/components/design-system/colors-section";

describe("TypographySection", () => {
  it("exibe todos os níveis tipográficos", () => {
    render(<TypographySection />);
    const labels = ["H1", "H2", "H3", "H4", "body", "small", "muted", "code"];
    for (const label of labels) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("exibe texto de exemplo para cada nível", () => {
    render(<TypographySection />);
    const examples = [
      "Heading 1",
      "Heading 2",
      "Heading 3",
      "Heading 4",
      "Body text",
      "Small text",
      "Muted text",
      "code snippet",
    ];
    for (const example of examples) {
      expect(screen.getByText(example)).toBeInTheDocument();
    }
  });
});

describe("ColorsSection", () => {
  it("exibe pelo menos um token de cor --primary", () => {
    render(<ColorsSection />);
    const tokens = screen.getAllByText("--primary");
    expect(tokens.length).toBeGreaterThanOrEqual(1);
  });

  it("exibe swatches para light e dark", () => {
    render(<ColorsSection />);
    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
  });

  it("exibe os tokens CSS principais", () => {
    render(<ColorsSection />);
    const requiredTokens = [
      "--background",
      "--foreground",
      "--primary",
      "--muted",
      "--border",
    ];
    for (const token of requiredTokens) {
      const els = screen.getAllByText(token);
      expect(els.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("exibe swatches de preview colorido para cada token", () => {
    const { container } = render(<ColorsSection />);
    // Each token appears in both light and dark groups → 20 swatches total (10 tokens × 2 groups)
    const swatches = container.querySelectorAll("[style*='background-color']");
    expect(swatches.length).toBe(20);
  });

  it("exibe tokens em dois grupos simultâneos (light e dark)", () => {
    render(<ColorsSection />);
    // --primary deve aparecer 2 vezes: uma no grupo Light, outra no grupo Dark
    const primaryTokens = screen.getAllByText("--primary");
    expect(primaryTokens.length).toBe(2);
  });
});
