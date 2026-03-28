"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

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

export function FormElementsSection() {
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      {/* Button */}
      <SubSection title="Button">
        <Button variant="default">Default</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button disabled>Disabled</Button>
      </SubSection>

      {/* Input */}
      <SubSection title="Input">
        <Input
          aria-label="input"
          placeholder="Digite algo..."
          className="max-w-xs"
        />
        <Input
          aria-label="input-disabled"
          placeholder="Desabilitado"
          disabled
          className="max-w-xs"
        />
      </SubSection>

      {/* Textarea */}
      <SubSection title="Textarea">
        <Textarea
          aria-label="textarea"
          placeholder="Escreva aqui..."
          className="max-w-sm"
        />
      </SubSection>

      {/* Select */}
      <SubSection title="Select">
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Opção 1</SelectItem>
            <SelectItem value="option2">Opção 2</SelectItem>
            <SelectItem value="option3">Opção 3</SelectItem>
            <SelectItem value="option4">Opção 4</SelectItem>
          </SelectContent>
        </Select>
      </SubSection>

      {/* Checkbox */}
      <SubSection title="Checkbox">
        <div className="flex items-center gap-2">
          <Checkbox
            id="checkbox-example"
            checked={checkboxChecked}
            onCheckedChange={(v) => setCheckboxChecked(v === true)}
          />
          <Label htmlFor="checkbox-example" className="text-foreground">
            Aceitar termos
          </Label>
        </div>
      </SubSection>

      {/* Switch */}
      <SubSection title="Switch">
        <div className="flex items-center gap-2">
          <Switch
            id="switch-example"
            checked={switchChecked}
            onCheckedChange={setSwitchChecked}
          />
          <Label htmlFor="switch-example" className="text-foreground">
            {switchChecked ? "Ativado" : "Desativado"}
          </Label>
        </div>
      </SubSection>

      {/* Badge */}
      <SubSection title="Badge">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">Outline</Badge>
      </SubSection>

      {/* Label */}
      <SubSection title="Label">
        <Label className="text-foreground">Label standalone</Label>
      </SubSection>
    </div>
  );
}
