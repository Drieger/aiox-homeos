import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { OverlaysSection } from "@/components/design-system/overlays-section";
import { FeedbackSection } from "@/components/design-system/feedback-section";

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

describe("FeedbackSection", () => {
  it("exibe botão para disparar Toast", () => {
    render(<FeedbackSection />);
    const btn = screen.getByRole("button", { name: /disparar toast/i });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it("exibe pelo menos 2 Alert (default e destructive)", () => {
    render(<FeedbackSection />);
    const alerts = screen.getAllByRole("alert");
    expect(alerts.length).toBe(2);
  });

  it("exibe Progress bar", () => {
    render(<FeedbackSection />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
