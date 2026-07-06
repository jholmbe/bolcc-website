import { client } from "@/sanity/client";

const HOME_PAGE_QUERY = `*[_type == "homePage"][0]{
  heroTitle,
  heroWelcomeMessage,
  missionTitle,
  missionDescription,
  serviceTimes[]{
    title,
    time,
    description
  },
  footerTitle,
  footerAddress,
  footerPhone,
  footerEmail
}`;

const options = { next: { revalidate: 30 } };

export default async function Home() {
  const homePageContent = await client.fetch<{
    heroTitle?: string;
    heroWelcomeMessage?: string;
    missionTitle?: string;
    missionDescription?: string;
    serviceTimes?: Array<{
      title?: string;
      time?: string;
      description?: string;
    }>;
    footerTitle?: string;
    footerAddress?: string;
    footerPhone?: string;
    footerEmail?: string;
  }>(HOME_PAGE_QUERY, {}, options);

  const heroTitle =
    homePageContent?.heroTitle ?? "#what is something that represents the church?#";
  const heroWelcomeMessage =
    homePageContent?.heroWelcomeMessage ??
    "#welcome message here, everything will be chinese + english";
  const missionTitle =
    homePageContent?.missionTitle ??
    "this is the tiaskehflkajsehf, kashftle for the section basically";
  const missionDescription =
    homePageContent?.missionDescription ??
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolor";

  const defaultServiceTimes = [
    {
      title: "Sunday Worship",
      time: "10:30 AM to 12:30 PM",
      description:
        "#summary about who the pastor is and what usually occurs at Sunday Worship#",
    },
    {
      title: "Youth Bible Study",
      time: "Sunday 11:30 AM to 12:30 PM",
      description:
        "#summary about who leads the youth and how youth bible study differs from sunday worship#",
    },
    {
      title: "Bible Study",
      time: "Thursday 8:30 PM to 9:30 PM",
      description:
        "#summary about what occurs at bible study, whats the incentive? which parts of the bible are being studied?#",
    },
    {
      title: "Prayer Meeting",
      time: "Friday 8:00 PM to 10:00 PM",
      description:
        "#summary about what occurs at prayer meeting, structure? incentive? current prayers?#",
    },
  ];

  const serviceTimes =
    homePageContent?.serviceTimes?.filter(
      (card): card is { title: string; time: string; description: string } =>
        Boolean(card?.title && card?.time && card?.description),
    ) ?? defaultServiceTimes;

  const footerTitle = homePageContent?.footerTitle ?? "Visit This Week";
  const footerAddress =
    homePageContent?.footerAddress ?? "123 Hope Street, Springfield, ST 00000";
  const footerPhone = homePageContent?.footerPhone ?? "(555) 123-4567";
  const footerEmail = homePageContent?.footerEmail ?? "hello@gracecommunity.org";

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
              {heroTitle}
            </h1>
            <p className="text-lg">
              {heroWelcomeMessage}
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

        {/* MISSION STATEMENT */}
        <section id="mission" className="bg-primary-background py-30">
          <div className="mx-auto w-full max-w-6xl px-6 py-24">
            <h1 className="text-md font-medium uppercase tracking-[0.22em]">MISSION</h1>
            <div className="mt-4 grid gap-12 sm:grid-cols-2">
              <h2 className="text-3xl font-bold">{missionTitle}</h2>
              <p className="text-lg text-slate-700">{missionDescription}</p>
            </div>
          </div>
        </section>

        {/* SERVICE TIMES */}
        <section id="times" className="bg-primary-background mx-auto w-full max-w-6xl px-6 py-30">
          <h2 className="text-3xl font-bold tracking-tight">Service Times</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {serviceTimes.map((card) => (
              <article
                key={`${card.title}-${card.time}`}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-zinc-300"
              >
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-slate-700">{card.time}</p>
                <p className="mt-2 text-slate-700">{card.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      
      {/* FOOTER*/}
      <footer id="visit" className="border-t border-slate-200 bg-zinc-900 text-slate-100">
        <div id="contact" className="mx-auto w-full max-w-6xl px-6 py-12">
          <h2 className="text-2xl font-semibold">{footerTitle}</h2>
          <p className="mt-3 text-slate-300">{footerAddress}</p>
          <p className="mt-1 text-slate-300">{footerPhone}</p>
          <p className="mt-1 text-slate-300">{footerEmail}</p>
        </div>
      </footer>
    </div>
  );
}
