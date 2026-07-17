const cards = Array.from({length: 10}, (_, index) => index + 1);

export default function BottomBarExamplesLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none fixed -left-24 top-24 -z-10 size-80 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none fixed -right-28 bottom-20 -z-10 size-96 rounded-full bg-secondary/25 blur-3xl" />

      <main className="mx-auto flex w-full max-w-lg flex-col gap-5 px-5 pb-32 pt-8">
        <header className="space-y-2">
          <p className="text-small font-medium text-primary">BottomBar preview</p>
          <h1 className="text-3xl font-bold tracking-tight">Today</h1>
          <p className="text-small text-default-500">
            Scroll the content to see the floating glass surface remain legible above it.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3">
          {cards.map((card) => (
            <article
              key={card}
              className={[
                "min-h-28 rounded-3xl border border-divider/50 p-4 shadow-small",
                card % 3 === 0
                  ? "bg-primary/15"
                  : card % 3 === 1
                    ? "bg-secondary/15"
                    : "bg-content1/80",
              ].join(" ")}
            >
              <p className="text-tiny font-semibold uppercase tracking-wider text-default-500">
                Card {card}
              </p>
              <p className="mt-3 text-small">
                Content continues beneath the regular glass surface.
              </p>
            </article>
          ))}
        </div>
      </main>

      {children}
    </div>
  );
}
