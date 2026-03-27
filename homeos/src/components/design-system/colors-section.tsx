"use client";

import { useEffect, useState } from "react";

const colorTokens = [
  { label: "background", variable: "--background" },
  { label: "foreground", variable: "--foreground" },
  { label: "card", variable: "--card" },
  { label: "primary", variable: "--primary" },
  { label: "secondary", variable: "--secondary" },
  { label: "muted", variable: "--muted" },
  { label: "accent", variable: "--accent" },
  { label: "destructive", variable: "--destructive" },
  { label: "border", variable: "--border" },
  { label: "ring", variable: "--ring" },
];

function ColorSwatch({ variable }: { variable: string }) {
  return (
    <div
      className="h-8 w-8 shrink-0 rounded-md border border-border"
      style={{ backgroundColor: `var(${variable})` }}
    />
  );
}

function TokenRow({ label, variable }: { label: string; variable: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <ColorSwatch variable={variable} />
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium">{label}</span>
        <span className="font-mono text-xs text-muted-foreground">{variable}</span>
      </div>
    </div>
  );
}

function ThemeGroup({ theme, label }: { theme: "light" | "dark"; label: string }) {
  return (
    <div className={`flex-1 rounded-lg border border-border bg-background p-4 ${theme}`}>
      <p className="mb-3 text-sm font-semibold text-foreground">{label}</p>
      <div className="divide-y divide-border">
        {colorTokens.map((token) => (
          <TokenRow key={token.variable} {...token} />
        ))}
      </div>
    </div>
  );
}

export function ColorsSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <ThemeGroup theme="light" label="Light" />
      <ThemeGroup theme="dark" label="Dark" />
    </div>
  );
}
