import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OverlaysSection } from "@/components/design-system/overlays-section";

describe("OverlaysSection", () => {
  it("exibe trigger button para Dialog", () => {
    render(<OverlaysSection />);
    expect(
      screen.getByRole("button", { name: /abrir dialog/i })
    ).toBeInTheDocument();
  });

  it("exibe trigger button para Sheet", () => {
    render(<OverlaysSection />);
    expect(
      screen.getByRole("button", { name: /abrir sheet/i })
    ).toBeInTheDocument();
  });

  it("trigger do Dialog é clicável (não disabled)", () => {
    render(<OverlaysSection />);
    const trigger = screen.getByRole("button", { name: /abrir dialog/i });
    expect(trigger).not.toBeDisabled();
  });

  it("trigger do Sheet é clicável (não disabled)", () => {
    render(<OverlaysSection />);
    const trigger = screen.getByRole("button", { name: /abrir sheet/i });
    expect(trigger).not.toBeDisabled();
  });

  it("exibe trigger para Popover", () => {
    render(<OverlaysSection />);
    expect(
      screen.getByRole("button", { name: /abrir popover/i })
    ).toBeInTheDocument();
  });

  it("exibe trigger para DropdownMenu", () => {
    render(<OverlaysSection />);
    expect(
      screen.getByRole("button", { name: /abrir menu/i })
    ).toBeInTheDocument();
  });
});
