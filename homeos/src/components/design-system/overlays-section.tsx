"use client";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export function OverlaysSection() {
  return (
    <div className="flex flex-col gap-8">
      {/* Dialog */}
      <SubSection title="Dialog">
        <Dialog>
          <DialogTrigger className={cn(buttonVariants({ variant: "outline" }))}>
            Abrir Dialog
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-foreground">Exemplo de Dialog</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">
              Este é um Dialog de exemplo. Clique fora ou pressione Esc para fechar.
            </p>
          </DialogContent>
        </Dialog>
      </SubSection>

      {/* Sheet */}
      <SubSection title="Sheet">
        <Sheet>
          <SheetTrigger className={cn(buttonVariants({ variant: "outline" }))}>
            Abrir Sheet
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle className="text-foreground">Exemplo de Sheet</SheetTitle>
            </SheetHeader>
            <p className="text-sm text-muted-foreground mt-4">
              Sheet lateral deslizante. Clique fora ou pressione Esc para fechar.
            </p>
          </SheetContent>
        </Sheet>
      </SubSection>

      {/* Tooltip */}
      <SubSection title="Tooltip">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className={cn(buttonVariants({ variant: "secondary" }))}>
              Hover aqui
            </TooltipTrigger>
            <TooltipContent>
              <p>Conteúdo do Tooltip</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SubSection>

      {/* Popover */}
      <SubSection title="Popover">
        <Popover>
          <PopoverTrigger className={cn(buttonVariants({ variant: "outline" }))}>
            Abrir Popover
          </PopoverTrigger>
          <PopoverContent>
            <p className="text-sm text-foreground">Conteúdo do Popover.</p>
            <p className="text-xs text-muted-foreground mt-1">
              Clique fora para fechar.
            </p>
          </PopoverContent>
        </Popover>
      </SubSection>

      {/* DropdownMenu */}
      <SubSection title="DropdownMenu">
        <DropdownMenu>
          <DropdownMenuTrigger className={cn(buttonVariants({ variant: "outline" }))}>
            Abrir Menu
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <span className="text-foreground">Ação 1</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="text-foreground">Ação 2</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span className="text-foreground">Ação 3</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SubSection>
    </div>
  );
}
