const typographyLevels = [
  { label: "H1", className: "text-4xl font-bold", example: "Heading 1" },
  { label: "H2", className: "text-3xl font-semibold", example: "Heading 2" },
  { label: "H3", className: "text-2xl font-semibold", example: "Heading 3" },
  { label: "H4", className: "text-xl font-semibold", example: "Heading 4" },
  { label: "body", className: "text-base", example: "Body text" },
  { label: "small", className: "text-sm", example: "Small text" },
  { label: "muted", className: "text-sm text-muted-foreground", example: "Muted text" },
  { label: "code", className: "font-mono text-sm", example: "code snippet" },
];

export function TypographySection() {
  return (
    <div className="flex flex-col gap-4">
      {typographyLevels.map(({ label, className, example }) => (
        <div key={label} className="flex items-baseline gap-6 border-b border-border pb-4 last:border-0">
          <span className="w-16 shrink-0 text-xs font-medium text-muted-foreground">
            {label}
          </span>
          <span className={className}>{example}</span>
        </div>
      ))}
    </div>
  );
}
