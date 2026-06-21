"use client";

import { useEffect, useRef, useState } from "react";

type Pro = {
  initials: string;
  name: string;
  rating: string;
  reviews: string;
  dist: string;
  eta: string;
  price: string;
};

type Scenario = {
  need: string;
  category: string;
  pros: Pro[];
};

const SCENARIOS: Scenario[] = [
  {
    need: "My kitchen sink is leaking",
    category: "Plumber",
    pros: [
      { initials: "RP", name: "Ramesh P.", rating: "4.9", reviews: "212", dist: "1.2 km", eta: "~25 min", price: "₹399" },
      { initials: "SK", name: "Suresh Kumar", rating: "4.7", reviews: "180", dist: "0.8 km", eta: "~30 min", price: "₹349" },
      { initials: "AS", name: "Anita Sharma", rating: "4.8", reviews: "95", dist: "2.1 km", eta: "~20 min", price: "₹420" },
    ],
  },
  {
    need: "AC stopped cooling properly",
    category: "AC Technician",
    pros: [
      { initials: "MV", name: "Mahesh V.", rating: "4.9", reviews: "341", dist: "1.6 km", eta: "~40 min", price: "₹499" },
      { initials: "FK", name: "Farhan K.", rating: "4.8", reviews: "127", dist: "1.1 km", eta: "~35 min", price: "₹450" },
      { initials: "DJ", name: "Deepa J.", rating: "4.7", reviews: "88", dist: "2.4 km", eta: "~45 min", price: "₹430" },
    ],
  },
  {
    need: "Need GST filing for my shop",
    category: "Chartered Accountant",
    pros: [
      { initials: "NA", name: "Neha Agarwal", rating: "5.0", reviews: "76", dist: "3.0 km", eta: "Today", price: "₹1,200" },
      { initials: "RT", name: "Rohit Tandon", rating: "4.9", reviews: "154", dist: "4.2 km", eta: "Tomorrow", price: "₹999" },
      { initials: "PV", name: "Priya V.", rating: "4.8", reviews: "61", dist: "2.7 km", eta: "Today", price: "₹1,100" },
    ],
  },
  {
    need: "Two rooms need repainting",
    category: "Painter",
    pros: [
      { initials: "BK", name: "Bipin K.", rating: "4.8", reviews: "203", dist: "1.9 km", eta: "~2 days", price: "₹2,800" },
      { initials: "GS", name: "Gita S.", rating: "4.9", reviews: "112", dist: "0.9 km", eta: "~1 day", price: "₹3,100" },
      { initials: "AM", name: "Arun M.", rating: "4.6", reviews: "74", dist: "3.3 km", eta: "~2 days", price: "₹2,650" },
    ],
  },
];

const TYPE_MS = 55;
const HOLD_MS = 2600;
const ERASE_MS = 22;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export default function SmartSearch() {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [revealed, setRevealed] = useState(false);
  const reduced = usePrefersReducedMotion();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const scenario = SCENARIOS[idx];

  useEffect(() => {
    const t = timers.current;
    const clearAll = () => { t.forEach(clearTimeout); t.length = 0; };
    const at = (fn: () => void, ms: number) => { t.push(setTimeout(fn, ms)); };

    if (reduced) {
      // No typing animation — show full need + results, just cycle.
      setTyped(scenario.need);
      setRevealed(true);
      at(() => setIdx((i) => (i + 1) % SCENARIOS.length), HOLD_MS + 1400);
      return clearAll;
    }

    setRevealed(false);
    setTyped("");
    const full = scenario.need;
    let i = 0;

    const typeNext = () => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i < full.length) {
        at(typeNext, TYPE_MS);
      } else {
        at(() => setRevealed(true), 320);
        at(eraseStart, full.length * 0 + HOLD_MS);
      }
    };

    const eraseStart = () => {
      setRevealed(false);
      let j = full.length;
      const eraseNext = () => {
        j -= 1;
        setTyped(full.slice(0, j));
        if (j > 0) at(eraseNext, ERASE_MS);
        else at(() => setIdx((k) => (k + 1) % SCENARIOS.length), 260);
      };
      at(eraseNext, ERASE_MS);
    };

    at(typeNext, 420);
    return clearAll;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, reduced]);

  return (
    <div className="demo" aria-hidden="true">
      <div className="demo__bar">
        <SearchIcon />
        <div className="demo__typed">
          {typed}
          <span className="caret" />
        </div>
      </div>

      <div className="demo__detect">
        {revealed ? (
          <>
            <span>Detected service</span>
            <span className="chip">
              <SparkIcon /> {scenario.category}
            </span>
            <span>· {scenario.pros.length} verified pros near you</span>
          </>
        ) : (
          <span>Reading your request…</span>
        )}
      </div>

      {revealed && (
        <div className="demo__list" key={idx}>
          {scenario.pros.map((p) => (
            <div className="pcard" key={p.name}>
              <div className="pcard__av">{p.initials}</div>
              <div>
                <div className="pcard__name">
                  {p.name}
                  <span className="verified" title="Verified by Zentro"><BadgeIcon /></span>
                </div>
                <div className="pcard__meta">
                  <span><span className="star">★</span> {p.rating} ({p.reviews})</span>
                  <span>{p.dist}</span>
                  <span>{p.eta}</span>
                </div>
              </div>
              <div className="pcard__price">
                <b>{p.price}</b>
                <span>from</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="demo__foot">
        <div className="demo__ai">
          <span className="pulse" />
          AI assistant ready to compare these for you
        </div>
        <span className="mono" style={{ fontSize: 12, color: "var(--muted-on-dark)" }}>live preview</span>
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" />
    </svg>
  );
}
function BadgeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1l2.6 1.9 3.2-.2 1 3 2.6 1.8-1 3 1 3-2.6 1.8-1 3-3.2-.2L12 23l-2.6-1.9-3.2.2-1-3L2.6 16.6l1-3-1-3 2.6-1.8 1-3 3.2.2L12 1z" />
      <path d="M9.5 12.5l1.8 1.8 3.4-3.6" fill="none" stroke="#072c27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
