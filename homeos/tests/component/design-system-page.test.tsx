import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import DesignSystemPage from "@/app/(app)/design-system/page";

describe("DesignSystemPage", () => {
  it("renderiza a seção Tipografia", () => {
    render(<DesignSystemPage />);
    expect(
      screen.getByRole("heading", { name: /Tipografia/i })
    ).toBeInTheDocument();
  });

  it("renderiza a seção Cores", () => {
    render(<DesignSystemPage />);
    expect(
      screen.getByRole("heading", { name: /Cores/i })
    ).toBeInTheDocument();
  });

  it("renderiza a seção Componentes de Formulário", () => {
    render(<DesignSystemPage />);
    expect(
      screen.getByRole("heading", { name: /Componentes de Formulário/i })
    ).toBeInTheDocument();
  });

  it("renderiza a seção Overlays", () => {
    render(<DesignSystemPage />);
    expect(
      screen.getByRole("heading", { name: /Overlays/i })
    ).toBeInTheDocument();
  });

  it("renderiza todas as 4 seções na mesma página", () => {
    render(<DesignSystemPage />);
    const sections = ["Tipografia", "Cores", "Componentes de Formulário", "Overlays"];
    for (const section of sections) {
      expect(
        screen.getByRole("heading", { name: new RegExp(section, "i") })
      ).toBeInTheDocument();
    }
  });
});
