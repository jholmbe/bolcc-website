export default function Home() {
  const announcements = [
    {
      day: "Today",
      timeOrYear: "03:00",
      title: "Welcome to Sunday Worship",
      preview:
        "Dear church family, this week we are beginning a new message series and welcoming new visitors. Join us for prayer and fellowship after service.",
    },
    {
      day: "Jun 03",
      timeOrYear: "2026",
      title: "Youth Summer Retreat Registration Open",
      preview:
        "Youth retreat signups are now open for middle and high school students. Please register before June 20 and contact the youth team for details.",
    },
    {
      day: "Jun 02",
      timeOrYear: "2026",
      title: "Thursday Bible Study Update",
      preview:
        "This Thursday we continue our study in Romans. Please bring your Bible and invite a friend who wants to grow in faith with us.",
    },
    {
      day: "Jun 01",
      timeOrYear: "2026",
      title: "Prayer Meeting Focus This Week",
      preview:
        "Friday prayer meeting will focus on families, students, and our local community. Submit prayer requests before noon if you want them included.",
    },
    {
      day: "May 28",
      timeOrYear: "2026",
      title: "Baptism Class Next Month",
      preview:
        "If you are interested in baptism, please join our upcoming class next month. We will cover testimony sharing and the meaning of baptism.",
    },
  ];
  const sermonCards = [
    {
      title: "Sermon This Sunday",
      scripture: "John 15:1-11",
      summary:
        "Abide in Christ and bear fruit that lasts. A message on remaining faithful in everyday life.",
      time: "Sunday 10:30 AM",
      toneClass: "from-emerald-900/80 via-emerald-700/40 to-transparent",
      bgClass: "from-emerald-300 via-green-500 to-slate-900",
    },
    {
      title: "Upcoming Series",
      scripture: "Psalms of Hope",
      summary:
        "A four-week walk through Psalms that strengthen us through waiting, grief, and renewal.",
      time: "Starts Next Week",
      toneClass: "from-sky-900/80 via-cyan-700/40 to-transparent",
      bgClass: "from-sky-300 via-cyan-500 to-blue-900",
    },
    {
      title: "Youth Message Focus",
      scripture: "Ephesians 6:10-18",
      summary:
        "Putting on the full armor of God for school, friendships, and decision-making.",
      time: "Sunday 11:30 AM",
      toneClass: "from-violet-900/80 via-fuchsia-700/40 to-transparent",
      bgClass: "from-fuchsia-300 via-violet-500 to-indigo-900",
    },
    {
      title: "Midweek Teaching",
      scripture: "Romans 8",
      summary:
        "Life in the Spirit: freedom, assurance, and practical obedience in community.",
      time: "Thursday 8:30 PM",
      toneClass: "from-amber-900/80 via-orange-700/40 to-transparent",
      bgClass: "from-amber-300 via-orange-500 to-stone-900",
    },
  ];

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
          <div className="relative mx-auto md:mx-[13vw] max-w-xl px-12 py-12 my-40 text-stone-800 space-y-6 rounded-3xl border border-white/60 bg-white/90 p-8 shadow-lg shadow-sky-100">
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

        {/* ANNOUNCEMENTS SECTION WITH SCROLLING */}
        <section id="announcements" className="mx-auto w-full max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
          <p className="mt-2 text-slate-700">Latest updates and church news</p>
          <div className="mt-8 max-h-130 overflow-y-auto rounded-2xl border border-slate-200 bg-white">
            {announcements.map((announcement) => (
              <article
                key={`${announcement.day}-${announcement.title}`}
                className="grid gap-4 border-b border-slate-200 px-5 py-6 last:border-b-0 md:grid-cols-[120px_1fr] md:gap-8"
              >
                <div className="md:border-r md:border-slate-200 md:pr-6">
                  <p className="text-xl font-semibold text-slate-500">{announcement.day}</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-400">{announcement.timeOrYear}</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-slate-900">{announcement.title}</h3>
                  <p className="leading-relaxed text-slate-500">{announcement.preview}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* SERMON CAROUSEL SECTION */}
        <section id="sermons" className="mx-auto w-full max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight">Current and Upcoming Sermons</h2>
          <p className="mt-2 text-slate-700">
            A quick look at what we are teaching now and what is coming next.
          </p>

          <div className="mt-8 overflow-x-auto pb-4">
            <div className="flex min-w-max items-end px-2 py-3">
              {sermonCards.map((card, index) => (
                <article
                  key={`${card.title}-${card.scripture}`}
                  className={`relative h-[430px] w-[290px] shrink-0 overflow-hidden rounded-[2.2rem] border-8 border-white shadow-xl transition-transform duration-300 hover:-translate-y-1 md:h-[480px] md:w-[340px] ${
                    index === 0 ? "ml-0" : "-ml-32 md:-ml-40"
                  }`}
                  style={{ zIndex: sermonCards.length - index }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${card.bgClass}`}
                    aria-hidden="true"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${card.toneClass}`}
                    aria-hidden="true"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-7">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/90">
                      {card.time}
                    </p>
                    <h3 className="mt-3 text-3xl font-bold leading-tight">{card.title}</h3>
                    <p className="mt-2 text-lg font-medium text-white/90">{card.scripture}</p>
                    <p className="mt-4 text-sm leading-relaxed text-white/85">{card.summary}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* MISSION SECTION BELOW RIVER VIDEO */}
        <section id="mission" className="bg-white py-30">
          <div className="mx-auto w-full max-w-6xl px-6 py-24">
            <h1 className="text-md font-medium uppercase tracking-[0.22em]">MISSION</h1>
            <div className="mt-4 grid gap-12 sm:grid-cols-2">
              <h2 className="text-3xl font-bold"> this is the tiaskehflkajsehf, kashftle for the section basically</h2>
              <p className="text-lg text-slate-700">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
                commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolor
              </p>
            </div>
          </div>
        </section>

        <section id="times" className="mx-auto w-full max-w-6xl px-6 py-30">
          <h2 className="text-3xl font-bold tracking-tight">Service Times</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-zinc-300">
              <h3 className="text-lg font-semibold">Sunday Worship</h3>
              <p className="mt-2 text-slate-700">10:30 AM to 12:30 PM</p>
              <p className="mt-2 text-slate-700">#summary about who the pastor is and what usually occurs at Sunday Worship#</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-zinc-300">
              <h3 className="text-lg font-semibold">Youth Bible Study</h3>
              <p className="mt-2 text-slate-700">Sunday 11:30 AM to 12:30 PM</p>
              <p className="mt-2 text-slate-700">#summary about who leads the youth and how youth bible study differs from sunday worship#</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-zinc-300">
              <h3 className="text-lg font-semibold">Bible Study</h3>
              <p className="mt-2 text-slate-700">Thursday 8:30 PM to 9:30 PM</p>
              <p className="mt-2 text-slate-700">#summary about what occurs at bible study, whats the incentive? which parts of the bible are being studied?#</p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-zinc-300">
              <h3 className="text-lg font-semibold">Prayer Meeting</h3>
              <p className="mt-2 text-slate-700">Friday 8:00 PM to 10:00 PM</p>
              <p className="mt-2 text-slate-700">#summary about what occurs at prayer meeting, structure? incentive? current prayers?#</p>
            </article>
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
