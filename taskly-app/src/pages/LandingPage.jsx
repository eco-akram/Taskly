import { useNavigate } from 'react-router-dom'

function FloatingDecor() {
  return <>
    {/* Violet chip — left */}
    <div className="pointer-events-none absolute left-[6%] top-[36%] hidden -rotate-6 md:block">
      <div className="flex items-center gap-1.5 rounded-full bg-violet px-3 py-1.5 text-sm font-medium text-white shadow-lg">
        Lead designer
        <span className="text-white/70">↗</span>
      </div>
    </div>

    {/* Mint chip — right */}
    <div className="pointer-events-none absolute right-[6%] top-[30%] hidden rotate-[6deg] md:block">
      <div className="rounded-full bg-mint px-3 py-1.5 text-sm font-medium text-foreground shadow-lg">
        Perhaps you?
      </div>
    </div>

    {/* Card mockup — far left */}
    <div className="pointer-events-none absolute left-[-2%] top-[52%] hidden -rotate-6 md:block">
      <div className="w-36 rounded-2xl border bg-card p-3 shadow-xl">
        <p className="font-serif text-lg italic text-foreground">Normal</p>
        <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
          <div className="h-1.5 w-3/5 rounded-full bg-muted-foreground/30" />
        </div>
      </div>
    </div>

    {/* Card mockup — far right */}
    <div className="pointer-events-none absolute right-[2%] top-[48%] hidden rotate-[4deg] md:block">
      <div className="w-44 rounded-2xl border bg-card p-3 shadow-xl">
        <span className="rounded-full bg-ember px-2 py-0.5 text-[11px] font-semibold text-ember-foreground">
          Ship Friday
        </span>
        <p className="mt-2 font-serif text-base text-foreground">Craftwork</p>
        <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
          <div className="h-1.5 w-4/5 rounded-full bg-muted-foreground/30" />
        </div>
      </div>
    </div>
  </>
}

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-screen flex-col bg-background bg-dotted">
      {/* NAV */}
      <header className="flex justify-center pt-7">
        <nav className="flex items-center gap-1 rounded-full bg-primary/95 px-2 py-2 text-primary-foreground shadow-lg backdrop-blur">
          <span className="font-serif px-3 text-base font-bold">Taskly</span>
          <div className="mx-1 h-4 w-px bg-primary-foreground/20" />
          <div className="flex items-center gap-0.5">
            {['Home', 'Features', 'About'].map(l => (
              <a key={l} href="#"
                className="rounded-full px-3.5 py-1.5 text-sm text-primary-foreground/70 transition hover:bg-primary-foreground/10 hover:text-primary-foreground">
                {l}
              </a>
            ))}
          </div>
          <button
            onClick={() => navigate('/board')}
            className="ml-1 flex items-center gap-1.5 rounded-full bg-primary-foreground px-4 py-1.5 text-sm font-semibold text-primary transition hover:opacity-90">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
            Try it
          </button>
        </nav>
      </header>

      {/* HERO */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <FloatingDecor />

        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-ember px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ember-foreground shadow-sm">
          <span className="size-1.5 rounded-full bg-ember-foreground" />
          Now in early access
        </div>

        {/* Headline */}
        <h1 className="font-serif mt-2 max-w-2xl text-5xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
          Task boards so good,{' '}
          <em>they should come</em>{' '}
          with a warning label
        </h1>

        {/* Subline */}
        <p className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground">
          Taskly is a warm, editorial take on the classic Kanban board. Plan your
          week, ship side projects, and keep your team in flow — no setup, no clutter.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate('/board')}
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md transition hover:opacity-90">
          Open your board ↗
        </button>

        {/* Avatars */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <div className="flex -space-x-2">
            {['bg-ember', 'bg-blue-400', 'bg-mint', 'bg-violet'].map((bg, i) => (
              <div key={i} className={`size-8 rounded-full border-2 border-background ${bg}`} />
            ))}
          </div>
          <p className="text-xs font-medium text-violet">Trusted by 200+ makers and small teams</p>
        </div>
      </main>

      {/* BOTTOM TOOLBAR */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-4 rounded-full border bg-card px-5 py-2.5 shadow-lg">
          {[
            <><circle cx="4" cy="6" r="1.5" fill="currentColor"/><circle cx="4" cy="12" r="1.5" fill="currentColor"/><circle cx="4" cy="18" r="1.5" fill="currentColor"/><path d="M8 6h13M8 12h13M8 18h13"/></>,
            <><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></>,
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>,
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>,
          ].map((icon, i) => (
            <svg key={i} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground transition hover:text-foreground cursor-pointer">
              {icon}
            </svg>
          ))}
        </div>
      </div>
    </div>
  )
}
