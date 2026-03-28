import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FormElementsSection } from "@/components/design-system/form-elements-section";

describe("FormElementsSection", () => {
  it("exibe pelo menos um Button", () => {
    render(<FormElementsSection />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it("exibe pelo menos um Input (textbox)", () => {
    render(<FormElementsSection />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBeGreaterThanOrEqual(1);
  });

  it("exibe pelo menos um Checkbox", () => {
    render(<FormElementsSection />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThanOrEqual(1);
  });

  it("exibe pelo menos um Switch", () => {
    render(<FormElementsSection />);
    const switches = screen.getAllByRole("switch");
    expect(switches.length).toBeGreaterThanOrEqual(1);
  });

  it("exibe Textarea", () => {
    render(<FormElementsSection />);
    expect(screen.getByRole("textbox", { name: /textarea/i })).toBeInTheDocument();
  });

  it("exibe todos os componentes presentes na seção", () => {
    render(<FormElementsSection />);
    // Button
    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(1);
    // Input
    expect(screen.getAllByRole("textbox").length).toBeGreaterThanOrEqual(1);
    // Checkbox
    expect(screen.getAllByRole("checkbox").length).toBeGreaterThanOrEqual(1);
    // Switch
    expect(screen.getAllByRole("switch").length).toBeGreaterThanOrEqual(1);
  });
});
