import SmartSearch from "./components/SmartSearch";

const CATEGORIES = [
  { ic: "🔧", t: "Plumber", k: "leaks, fittings" },
  { ic: "⚡", t: "Electrician", k: "wiring, repairs" },
  { ic: "🪚", t: "Carpenter", k: "furniture, doors" },
  { ic: "❄️", t: "AC & Appliance", k: "service, fix" },
  { ic: "🎨", t: "Painter", k: "interior, exterior" },
  { ic: "🧹", t: "Cleaning", k: "home, deep clean" },
  { ic: "🛠️", t: "Mechanic", k: "car, bike" },
  { ic: "📐", t: "Architect", k: "design, plans" },
  { ic: "📊", t: "Chartered Accountant", k: "tax, GST" },
  { ic: "📚", t: "Tutor", k: "school, exams" },
  { ic: "🍳", t: "Cook", k: "daily, events" },
  { ic: "🐜", t: "Pest Control", k: "home, office" },
];

const STEPS = [
  { n: "Step 1", t: "Describe your need", d: "Type it like you'd say it. Zentro figures out the service category for you — no menus to dig through." },
  { n: "Step 2", t: "Compare, with AI", d: "See verified pros nearby, ranked by rating, distance and price. Ask the assistant to compare them for your need, time and budget." },
  { n: "Step 3", t: "Book & chat", d: "Pick one — or take the top recommendation. Message your pro in-app and track every step." },
  { n: "Step 4", t: "Pay on approval", d: "Your payment is held safe and released only after you approve the finished work. Then you both rate each other." },
];

export default function Home() {
  return (
    <>
      <header className="header">
        <div className="wrap header__inner">
          <a className="brand" href="/" aria-label="Zentro home">
            <span className="brand__mark">Z</span>
            Zentro
          </a>
          <nav className="nav" aria-label="Primary">
            <a href="#how">How it works</a>
            <a href="#categories">Categories</a>
            <a href="#partner">For partners</a>
          </nav>
          <div className="header__cta">
            <a className="btn btn--ghost" href="#partner">Become a partner</a>
            <a className="btn btn--dark" href="#search">Find a service</a>
          </div>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section className="hero" id="search">
          <div className="wrap hero__grid">
            <div>
              <span className="eyebrow"><span className="dot" /> Instant · Verified · Nearby</span>
              <h1>
                Describe the problem.<br />
                Get the <span className="accent">right professional</span>.
              </h1>
              <p className="hero__sub">
                Plumber, electrician, painter, mechanic, CA, architect — anyone you need.
                Zentro understands your request, finds trusted experts near you, and helps you compare.
              </p>
              <div className="hero__cta">
                <a className="btn btn--primary btn--lg" href="#search">
                  Find a service <span className="arrow" aria-hidden="true">→</span>
                </a>
                <a className="btn btn--ghost btn--lg" href="#partner">Become a partner</a>
              </div>
              <div className="hero__meta">
                <span><b>12k+</b> verified pros</span>
                <span><b>4.8★</b> average rating</span>
                <span><b>30 min</b> typical arrival</span>
              </div>
            </div>

            <SmartSearch />
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="trust">
          <div className="wrap trust__row">
            <div className="trust__item">
              <span className="trust__ic"><ShieldIcon /></span>
              <div>
                <h4>Every pro is verified</h4>
                <p>Identity, documents and experience checked by our team before they ever reach you.</p>
              </div>
            </div>
            <div className="trust__item">
              <span className="trust__ic"><LockIcon /></span>
              <div>
                <h4>Payment held safe</h4>
                <p>Your money is released to the professional only after you approve the work.</p>
              </div>
            </div>
            <div className="trust__item">
              <span className="trust__ic"><SparkIcon /></span>
              <div>
                <h4>AI helps you choose</h4>
                <p>Tell the assistant your priority — fastest, cheapest, top-rated — and it compares for you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="section" id="categories">
          <div className="wrap">
            <div className="section__head">
              <span className="section__eyebrow">What can we help with</span>
              <h2>One platform for every skilled professional.</h2>
              <p>From a quick repair to a long project — pick a category, or just describe your need and we'll route it.</p>
            </div>
            <div className="cats">
              {CATEGORIES.map((c) => (
                <a className="cat" href="#search" key={c.t}>
                  <span className="cat__ic" aria-hidden="true">{c.ic}</span>
                  <span className="cat__t">{c.t}<span>{c.k}</span></span>
                </a>
              ))}
              <p className="cats__more">…and more — drivers, engineers, interior designers, consultants. If it's a trusted skill, it belongs on Zentro.</p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section" id="how" style={{ background: "var(--paper-2)" }}>
          <div className="wrap">
            <div className="section__head">
              <span className="section__eyebrow">How it works</span>
              <h2>From “it's broken” to “it's done” — in four steps.</h2>
            </div>
            <div className="steps">
              {STEPS.map((s) => (
                <div className="step" key={s.n}>
                  <div className="step__n mono">{s.n}</div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DUAL CTA */}
        <section className="section" id="partner" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="cta-band">
              <div className="cta-band__grid">
                <div className="cta-half">
                  <h3>Need something fixed today?</h3>
                  <p>Describe it once. Compare verified pros nearby and book in minutes — pay only when you're happy.</p>
                  <a className="btn btn--primary btn--lg" href="#search">Find a service <span className="arrow" aria-hidden="true">→</span></a>
                </div>
                <div className="cta-rule" />
                <div className="cta-half">
                  <h3>A skilled professional?</h3>
                  <p>Get verified once and start receiving relevant jobs near you. Build your reputation, grow your earnings.</p>
                  <a className="btn btn--on-dark btn--lg" href="#partner">Become a partner <span className="arrow" aria-hidden="true">→</span></a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer__top">
            <div className="footer__brand">
              <a className="brand" href="/"><span className="brand__mark">Z</span> Zentro</a>
              <p>Trusted professionals. Anytime. Anywhere.</p>
            </div>
            <div>
              <h5>Customers</h5>
              <ul>
                <li><a href="#search">Find a service</a></li>
                <li><a href="#categories">Browse categories</a></li>
                <li><a href="#how">How it works</a></li>
              </ul>
            </div>
            <div>
              <h5>Partners</h5>
              <ul>
                <li><a href="#partner">Become a partner</a></li>
                <li><a href="#partner">Verification</a></li>
                <li><a href="#partner">Earnings</a></li>
              </ul>
            </div>
            <div>
              <h5>Company</h5>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Trust &amp; safety</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="footer__bottom">
            <span>© 2026 Zentro. All rights reserved.</span>
            <span className="mono">Built by Aman Kumar &amp; Akarsh Singh</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 4.5-3 8.3-7 9.5C8 19.3 5 15.5 5 11V6l7-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" />
    </svg>
  );
}
