"use client";

import { useMemo, useState } from "react";
import {
  CATEGORIES,
  detectCategory,
  explain,
  FALLBACK_CATEGORY,
  getProviders,
  PRIORITIES,
  priorityFromText,
  rankProviders,
  zentroScore,
  type Category,
  type Priority,
  type Provider,
} from "../lib/catalog";

type Msg = { from: "you" | "zentro"; text: string };

export default function SearchExperience({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [submitted, setSubmitted] = useState(initialQuery);
  const [manualCat, setManualCat] = useState<Category | null>(null);
  const [priority, setPriority] = useState<Priority>("best");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [location, setLocation] = useState("Sector 17, your city");
  const [editingLoc, setEditingLoc] = useState(false);
  const [aiInput, setAiInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);

  const detected = useMemo(() => detectCategory(submitted), [submitted]);
  const category = manualCat ?? detected;

  const pool = useMemo(() => (category ? getProviders(category) : []), [category]);
  const ranked = useMemo(() => rankProviders(pool, priority), [pool, priority]);
  const recommended = ranked[0];

  // Effective selection: explicit pick, else the default best recommendation.
  const effectiveSelectedId = selectedId ?? recommended?.id ?? null;

  function runSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setSubmitted(query);
    setManualCat(null);
    setSelectedId(null);
    setMessages([]);
  }

  function chooseCategory(c: Category) {
    setManualCat(c);
    setSelectedId(null);
  }

  function setPriorityAndSelect(p: Priority) {
    setPriority(p);
    setSelectedId(null); // re-default to the new top recommendation
  }

  function askAssistant(e?: React.FormEvent) {
    e?.preventDefault();
    const text = aiInput.trim();
    if (!text) return;
    const p = priorityFromText(text);
    const reply: Msg[] = [{ from: "you", text }];
    if (p) {
      setPriorityAndSelect(p);
      const top = rankProviders(pool, p)[0];
      reply.push({ from: "zentro", text: top ? explain(top, p) : "Let me re-rank those for you." });
    } else {
      reply.push({
        from: "zentro",
        text: "Tell me what matters most — fastest, cheapest, top-rated, nearest, or most experienced — and I'll re-rank and recommend.",
      });
    }
    setMessages((m) => [...m, ...reply]);
    setAiInput("");
  }

  return (
    <div className="srch">
      {/* Search bar */}
      <form className="srch__bar" onSubmit={runSearch} role="search">
        <SearchIcon />
        <input
          className="srch__input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe what you need — e.g. “my kitchen sink is leaking”"
          aria-label="Describe what you need"
        />
        <button className="btn btn--primary" type="submit">Search</button>
      </form>

      {/* Context row: detected category + service location */}
      <div className="srch__context">
        {category ? (
          <span className="srch__cat">
            <span aria-hidden="true">{category.icon}</span>
            {detected && !manualCat ? "Detected" : "Category"}: <b>{category.label}</b>
            {!detected && manualCat ? null : <span className="srch__change" onClick={() => setManualCat(FALLBACK_CATEGORY)} role="button" tabIndex={0}>change</span>}
          </span>
        ) : (
          <span className="srch__cat srch__cat--none">Pick a category to see professionals near you ↓</span>
        )}

        <span className="srch__loc">
          <PinIcon />
          {editingLoc ? (
            <input
              className="srch__locinput"
              value={location}
              autoFocus
              onChange={(e) => setLocation(e.target.value)}
              onBlur={() => setEditingLoc(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingLoc(false)}
              aria-label="Service location"
            />
          ) : (
            <>
              Service at <b>{location}</b>
              <span className="srch__change" onClick={() => setEditingLoc(true)} role="button" tabIndex={0}>change</span>
            </>
          )}
        </span>
      </div>

      {/* No category yet → category chooser */}
      {!category && (
        <div className="srch__chips" role="list">
          {CATEGORIES.map((c) => (
            <button key={c.key} className="srch__chip" onClick={() => chooseCategory(c)}>
              <span aria-hidden="true">{c.icon}</span> {c.label}
            </button>
          ))}
        </div>
      )}

      {category && (
        <div className="srch__grid">
          {/* Results */}
          <div className="srch__results">
            <div className="srch__toolbar">
              <span className="srch__count"><b>{ranked.length}</b> verified pros near you</span>
              <div className="srch__sort" role="tablist" aria-label="Priority">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.key}
                    role="tab"
                    aria-selected={priority === p.key}
                    className={`srch__tab${priority === p.key ? " is-active" : ""}`}
                    onClick={() => setPriorityAndSelect(p.key)}
                    title={p.hint}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <ul className="srch__list">
              {ranked.map((p, i) => (
                <ProviderCard
                  key={p.id}
                  p={p}
                  pool={pool}
                  rank={i + 1}
                  isTop={p.id === recommended?.id}
                  isSelected={p.id === effectiveSelectedId}
                  onSelect={() => setSelectedId(p.id)}
                />
              ))}
            </ul>
          </div>

          {/* AI compare panel */}
          <aside className="srch__ai" aria-label="AI assistant">
            <div className="srch__ai-head">
              <span className="srch__ai-badge"><SparkIcon /> Zentro AI</span>
              <span className="srch__ai-sub">Compares for your priority</span>
            </div>

            {recommended && (
              <div className="srch__rec">
                <div className="srch__rec-top">Recommended for you</div>
                <div className="srch__rec-name">
                  <span className="srch__av">{recommended.initials}</span>
                  <div>
                    <b>{recommended.name}</b>
                    <span className="srch__rec-score mono">match {zentroScore(recommended, pool)}/100</span>
                  </div>
                </div>
                <p className="srch__rec-why">{explain(recommended, priority)}</p>
                <button
                  className="btn btn--primary srch__rec-cta"
                  onClick={() => setSelectedId(recommended.id)}
                >
                  Select {recommended.name.split(" ")[0]}
                </button>
              </div>
            )}

            <div className="srch__ai-quick">
              <span className="srch__ai-label">Ask the assistant</span>
              <div className="srch__ai-chips">
                {[
                  { t: "Cheapest", p: "cheapest" as Priority },
                  { t: "Fastest", p: "fastest" as Priority },
                  { t: "Top rated", p: "rated" as Priority },
                  { t: "Most experienced", p: "best" as Priority },
                ].map((q) => (
                  <button key={q.t} className="srch__ai-chip" onClick={() => setPriorityAndSelect(q.p)}>{q.t}</button>
                ))}
              </div>
            </div>

            {messages.length > 0 && (
              <div className="srch__chat">
                {messages.map((m, i) => (
                  <div key={i} className={`srch__msg srch__msg--${m.from}`}>{m.text}</div>
                ))}
              </div>
            )}

            <form className="srch__ai-form" onSubmit={askAssistant}>
              <input
                className="srch__ai-input"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="e.g. cheapest one available fast"
                aria-label="Ask the assistant"
              />
              <button className="btn btn--dark" type="submit" aria-label="Send">→</button>
            </form>
          </aside>
        </div>
      )}
    </div>
  );
}

function ProviderCard({
  p, pool, rank, isTop, isSelected, onSelect,
}: {
  p: Provider; pool: Provider[]; rank: number; isTop: boolean; isSelected: boolean; onSelect: () => void;
}) {
  return (
    <li className={`pc${isSelected ? " is-selected" : ""}`}>
      <div className="pc__rank mono">{rank}</div>
      <div className="pc__av">{p.initials}</div>
      <div className="pc__main">
        <div className="pc__name">
          {p.name}
          <span className="pc__verified" title="Verified by Zentro"><BadgeIcon /></span>
          {isTop && <span className="pc__top">Top pick</span>}
        </div>
        <div className="pc__blurb">{p.blurb}</div>
        <div className="pc__meta mono">
          <span><span className="pc__star">★</span> {p.rating} ({p.reviews})</span>
          <span>{p.distanceKm} km</span>
          <span>~{p.etaMin} min</span>
          <span>{p.experienceYears} yrs exp</span>
        </div>
      </div>
      <div className="pc__right">
        <div className="pc__price mono"><b>₹{p.priceFrom}</b><span>from</span></div>
        <button className={`btn ${isSelected ? "btn--primary" : "btn--ghost"} pc__btn`} onClick={onSelect}>
          {isSelected ? "Selected" : "Select"}
        </button>
      </div>
    </li>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-5.7-7-11a7 7 0 0 1 14 0c0 5.3-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function SparkIcon() {
  return (<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z" /></svg>);
}
function BadgeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1l2.6 1.9 3.2-.2 1 3 2.6 1.8-1 3 1 3-2.6 1.8-1 3-3.2-.2L12 23l-2.6-1.9-3.2.2-1-3L2.6 16.6l1-3-1-3 2.6-1.8 1-3 3.2.2L12 1z" />
      <path d="M9.5 12.5l1.8 1.8 3.4-3.6" fill="none" stroke="#072c27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
