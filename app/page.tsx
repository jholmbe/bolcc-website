export default function Home() {
  return (
    <div className="min-h-screen bg-primary-background text-primary-text">
      <header className="border-b bg-primary-green">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <p className="text-slate-50 text-xl font-semibold tracking-tight">Bread Of Life Church</p>
          <a
            href="#visit"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Plan Your Visit
          </a>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          >
            <source src="/church-hero-vid.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/15" />
          <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-10 px-6 py-40 md:grid-cols-2 md:items-center">
            <div className="text-slate-50 space-y-6">
              <p className="text-sm font-semibold uppercase tracking-[0.22em]">
                You Are Welcome Here
              </p>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                A church family centered on Jesus and committed to our city.
              </h1>
              <p className="max-w-xl text-lg">
                Join us this Sunday for worship, Biblical teaching, and
                meaningful community for all ages.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#times"
                  className="rounded-full bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
                >
                  Service Times
                </a>
                <a
                  href="#contact"
                  className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold transition hover:border-slate-400"
                >
                  Contact Us
                </a>
              </div>
            </div>
            <div className="rounded-3xl border border-white/60 bg-white/70 p-8 shadow-lg shadow-sky-100">
              <h2 className="text-2xl font-semibold">This Sunday</h2>
              <p className="mt-3 text-slate-700">9:00 AM and 11:00 AM</p>
              <p className="mt-2 text-slate-700">123 Hope Street, Springfield</p>
              <p className="mt-4 text-sm text-slate-600">
                Kids ministry available at both services.
              </p>
            </div>
          </div>
        </section>

        <section id="times" className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold tracking-tight">Service Times</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Sunday Worship</h3>
              <p className="mt-2 text-slate-700">9:00 AM and 11:00 AM</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Prayer Gathering</h3>
              <p className="mt-2 text-slate-700">Wednesday at 6:30 PM</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Youth Night</h3>
              <p className="mt-2 text-slate-700">Friday at 7:00 PM</p>
            </article>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <h2 className="text-3xl font-bold tracking-tight">Ministries</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold">Kids</h3>
                <p className="mt-2 text-slate-700">
                  Safe, joyful classes where children learn God&apos;s word.
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold">Students</h3>
                <p className="mt-2 text-slate-700">
                  Weekly gatherings helping teens grow in faith and friendship.
                </p>
              </article>
              <article className="rounded-2xl border border-slate-200 p-6">
                <h3 className="text-lg font-semibold">Small Groups</h3>
                <p className="mt-2 text-slate-700">
                  Midweek groups for prayer, study, and practical support.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer id="visit" className="border-t border-slate-200 bg-primary-green text-slate-100">
        <div id="contact" className="mx-auto w-full max-w-6xl px-6 py-12">
          <h2 className="text-2xl font-semibold">Visit This Week</h2>
          <p className="mt-3 text-slate-300">
            123 Hope Street, Springfield, ST 00000
          </p>
          <p className="mt-1 text-slate-300">(555) 123-4567</p>
          <p className="mt-1 text-slate-300">hello@gracecommunity.org</p>
        </div>
      </footer>
    </div>
  );
}
