"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

function SubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

export function FeedbackSection() {
  return (
    <div className="flex flex-col gap-8">
      {/* Toast */}
      <SubSection title="Toast">
        <Button
          variant="outline"
          onClick={() => toast("Exemplo de toast disparado com sucesso!")}
        >
          Disparar Toast
        </Button>
      </SubSection>

      {/* Alert */}
      <SubSection title="Alert">
        <Alert>
          <AlertTitle className="text-foreground">Informação</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Este é um Alert padrão com título e descrição.
          </AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>
            Este é um Alert destrutivo — indica um problema crítico.
          </AlertDescription>
        </Alert>
      </SubSection>

      {/* Skeleton */}
      <SubSection title="Skeleton">
        <div className="flex flex-col gap-2 w-full max-w-sm">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </SubSection>

      {/* Progress */}
      <SubSection title="Progress">
        <div className="w-full max-w-sm">
          <Progress value={60} />
          <p className="text-xs text-muted-foreground mt-1">60% concluído</p>
        </div>
      </SubSection>
    </div>
  );
}
