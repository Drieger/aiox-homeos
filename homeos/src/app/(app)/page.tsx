/**
 * Home page do HomeOS — dentro do route group (app) para herdar o layout com sidebar.
 *
 * @design Página de entrada simples: exibe título do sistema. A navegação é
 * provida pela sidebar (via AppLayout), portanto nenhum link adicional é necessário aqui.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-3xl font-bold tracking-tight">HomeOS</h1>
      <p className="text-muted-foreground text-sm">
        Seu sistema pessoal de produtividade
      </p>
    </div>
  );
}
