import { PageShell } from "@/components/layout/page-shell";

export default function Home() {
  return (
    <PageShell>
      <main className="min-h-screen flex items-center">
        <section className="max-w-2xl py-24 text-left">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Skills.dev
          </p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-foreground">
            Build your skill directory with flexible layouts.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Start left-aligned by default, then center only the pieces that need
            it. That makes future pages much easier to design.
          </p>
        </section>
      </main>
    </PageShell>
  );
}
