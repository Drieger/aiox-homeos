import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FormElementsSection } from "@/components/design-system/form-elements-section";

describe("FormElementsSection", () => {
  it("exibe todos os 7 Button variants incluindo disabled", () => {
    render(<FormElementsSection />);
    const buttons = screen.getAllByRole("button");
    // 6 variants + 1 disabled = 7
    expect(buttons.length).toBe(7);
  });

  it("exibe Input padrão e Input disabled", () => {
    render(<FormElementsSection />);
    // 2 inputs (textbox) + 1 textarea (textbox) = 3 textboxes total
    const textboxes = screen.getAllByRole("textbox");
    expect(textboxes.length).toBe(3);
  });

  it("exibe Textarea com aria-label", () => {
    render(<FormElementsSection />);
    expect(screen.getByRole("textbox", { name: /textarea/i })).toBeInTheDocument();
  });

  it("exibe Select (combobox)", () => {
    render(<FormElementsSection />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("exibe Checkbox", () => {
    render(<FormElementsSection />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThanOrEqual(1);
  });

  it("exibe Switch", () => {
    render(<FormElementsSection />);
    const switches = screen.getAllByRole("switch");
    expect(switches.length).toBeGreaterThanOrEqual(1);
  });

  it("exibe Input disabled (AC 3)", () => {
    render(<FormElementsSection />);
    const disabled = screen.getByRole("textbox", { name: /input-disabled/i });
    expect(disabled).toBeDisabled();
  });

  it("exibe Button disabled (AC 3)", () => {
    render(<FormElementsSection />);
    const buttons = screen.getAllByRole("button");
    const disabledButtons = buttons.filter((btn) => btn.hasAttribute("disabled"));
    expect(disabledButtons.length).toBeGreaterThanOrEqual(1);
  });
});
