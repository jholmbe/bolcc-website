export default function Home() {
  return (
    <div className="min-h-screen bg-primary-background text-primary-text">
      <main>
        {/* SECTION 1: River video, meeting times */}
        <section className="relative overflow-hidden">
          <video
            className="absolute h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
          >
            <source src="/church-hero-vid.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-white/15" />
          <div className="relative mx-auto md:mx-[13vw] max-w-xl px-6 my-50 text-stone-800 space-y-6 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-lg shadow-sky-100">
            <h1 className="text-4xl font-bold md:text-5xl">
              #what is something that represents the church?#
            </h1>
            <p className="text-lg">
              #welcome message here, everything will be chinese + english
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#times"
                className="text-white font-medium px-5 py-3 rounded-md bg-primary-green transition hover:bg-hover-green"
              >
                Service Times
              </a>
              <a
                href="#contact"
                className="rounded-md border border-slate-300 bg-white px-5 py-3 font-medium transition hover:border-slate-400"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>

        <section id="times" className="mx-auto w-full max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold tracking-tight">Service Times</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Sunday Worship</h3>
              <p className="mt-2 text-slate-700">10:30 AM to 12:30 PM</p>
              <p className="mt-2 text-slate-700">#summary about who the pastor is and what usually occurs at Sunday Worship#</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Youth Bible Study</h3>
              <p className="mt-2 text-slate-700">Sunday 11:30 AM to 12:30 PM</p>
              <p className="mt-2 text-slate-700">#summary about who leads the youth and how youth bible study differs from sunday worship#</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Bible Study</h3>
              <p className="mt-2 text-slate-700">Thursday 8:30 PM to 9:30 PM</p>
              <p className="mt-2 text-slate-700">#summary about what occurs at bible study, whats the incentive? which parts of the bible are being studied?#</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold">Prayer Meeting</h3>
              <p className="mt-2 text-slate-700">Friday 8:00 PM to 10:00 PM</p>
              <p className="mt-2 text-slate-700">#summary about what occurs at prayer meeting, structure? incentive? current prayers?#</p>
            </article>
          </div>
        </section>
{/* 
        <section className="bg-white">
          <div className="mx-auto w-full max-w-6xl px-6 py-16">
            <h1 className="text-s tracking-tight">MISSION</h1>
          </div>
        </section> */}
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
