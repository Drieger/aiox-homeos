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
    expect(screen.getByText("Heading 1")).toBeInTheDocument();
    expect(screen.getByText("Body text")).toBeInTheDocument();
    expect(screen.getByText("code snippet")).toBeInTheDocument();
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
});
