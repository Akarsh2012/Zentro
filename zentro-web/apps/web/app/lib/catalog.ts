// Catalog, category detection and ranking — illustrative data for the search
// experience. Mirrors the Zentro workflow: NL need -> category, then a Match Pool
// ranked by a composite "Zentro Score" with priority re-weighting.

export type Provider = {
  id: string;
  initials: string;
  name: string;
  rating: number;
  reviews: number;
  experienceYears: number;
  distanceKm: number;
  etaMin: number;
  priceFrom: number;
  successRate: number; // 0..1
  blurb: string;
};

export type Category = {
  key: string;
  label: string;
  icon: string;
  basePrice: number;
  keywords: string[];
};

export const CATEGORIES: Category[] = [
  { key: "plumber", label: "Plumber", icon: "🔧", basePrice: 399, keywords: ["plumb", "sink", "leak", "tap", "pipe", "drain", "faucet", "water", "flush", "geyser"] },
  { key: "electrician", label: "Electrician", icon: "⚡", basePrice: 349, keywords: ["electric", "wire", "light", "switch", "socket", "fan", "fuse", "power", "short circuit", "mcb", "inverter"] },
  { key: "ac", label: "AC Technician", icon: "❄️", basePrice: 499, keywords: ["ac", "air condition", "cooling", "fridge", "refriger", "appliance", "washing machine", "cooler"] },
  { key: "carpenter", label: "Carpenter", icon: "🪚", basePrice: 449, keywords: ["carpenter", "wood", "furniture", "door", "cabinet", "table", "hinge", "drawer", "bed"] },
  { key: "painter", label: "Painter", icon: "🎨", basePrice: 2800, keywords: ["paint", "wall", "whitewash", "putty", "repaint", "primer"] },
  { key: "mechanic", label: "Mechanic", icon: "🛠️", basePrice: 599, keywords: ["car", "bike", "engine", "mechanic", "vehicle", "motor", "puncture", "service vehicle"] },
  { key: "ca", label: "Chartered Accountant", icon: "📊", basePrice: 1200, keywords: ["gst", "tax", "account", "audit", "itr", "filing", "bookkeep", "balance sheet", "tds"] },
  { key: "cleaning", label: "Cleaning", icon: "🧹", basePrice: 699, keywords: ["clean", "deep clean", "sweep", "mop", "sofa clean", "bathroom clean"] },
];

export const FALLBACK_CATEGORY: Category = {
  key: "general",
  label: "Service Professional",
  icon: "🧰",
  basePrice: 499,
  keywords: [],
};

/** Infer a service category from a free-text need (the AI's intent->category step). */
export function detectCategory(query: string): Category | null {
  const q = query.toLowerCase();
  if (!q.trim()) return null;
  for (const c of CATEGORIES) {
    if (c.keywords.some((k) => q.includes(k))) return c;
  }
  return null;
}

export function getCategoryByKey(key: string): Category {
  return CATEGORIES.find((c) => c.key === key) ?? FALLBACK_CATEGORY;
}

const NAMES: [string, string][] = [
  ["RP", "Ramesh Prajapati"],
  ["SK", "Suresh Kumar"],
  ["AS", "Anita Sharma"],
  ["MV", "Mahesh Verma"],
  ["NA", "Neha Agarwal"],
  ["BK", "Bipin Kashyap"],
];

const VARIANCE = [
  { rating: 4.9, reviews: 212, exp: 8, dist: 1.2, eta: 25, pd: 0, succ: 0.97, blurb: "Quick, tidy work. Most-booked in your area." },
  { rating: 4.7, reviews: 180, exp: 5, dist: 0.8, eta: 30, pd: -40, succ: 0.94, blurb: "Closest to you and easy on the budget." },
  { rating: 4.8, reviews: 95, exp: 12, dist: 2.1, eta: 20, pd: 60, succ: 0.96, blurb: "Senior pro — fastest to arrive, premium rate." },
  { rating: 4.6, reviews: 341, exp: 4, dist: 1.6, eta: 40, pd: -25, succ: 0.91, blurb: "Highly reviewed, great value." },
  { rating: 5.0, reviews: 76, exp: 14, dist: 3.0, eta: 35, pd: 110, succ: 0.98, blurb: "Top rated, most experienced. Worth the wait." },
  { rating: 4.5, reviews: 128, exp: 6, dist: 0.9, eta: 28, pd: -15, succ: 0.9, blurb: "Reliable all-rounder nearby." },
];

/** Build the Match Pool for a category. */
export function getProviders(category: Category): Provider[] {
  return VARIANCE.map((v, i) => ({
    id: `${category.key}-${i}`,
    initials: NAMES[i][0],
    name: NAMES[i][1],
    rating: v.rating,
    reviews: v.reviews,
    experienceYears: v.exp,
    distanceKm: v.dist,
    etaMin: v.eta,
    priceFrom: category.basePrice + v.pd,
    successRate: v.succ,
    blurb: v.blurb,
  }));
}

export type Priority = "best" | "fastest" | "cheapest" | "rated" | "nearest";

export const PRIORITIES: { key: Priority; label: string; hint: string }[] = [
  { key: "best", label: "Best match", hint: "Balanced" },
  { key: "fastest", label: "Fastest", hint: "Least time" },
  { key: "cheapest", label: "Cheapest", hint: "Lowest cost" },
  { key: "rated", label: "Top rated", hint: "Highest rating" },
  { key: "nearest", label: "Nearest", hint: "Closest" },
];

/** Composite Zentro Score (0..100), category-agnostic defaults. */
export function zentroScore(p: Provider, pool: Provider[]): number {
  const maxDist = Math.max(...pool.map((x) => x.distanceKm)) || 1;
  const maxEta = Math.max(...pool.map((x) => x.etaMin)) || 1;
  const prices = pool.map((x) => x.priceFrom);
  const minP = Math.min(...prices);
  const maxP = Math.max(...prices);

  const proximity = 1 - p.distanceKm / maxDist;
  const rating = p.rating / 5;
  const experience = Math.min(p.experienceYears, 15) / 15;
  const priceFit = maxP === minP ? 1 : 1 - (p.priceFrom - minP) / (maxP - minP);
  const responsiveness = 1 - p.etaMin / maxEta;
  const success = p.successRate;

  const score =
    0.24 * proximity +
    0.22 * rating +
    0.16 * experience +
    0.14 * priceFit +
    0.12 * responsiveness +
    0.12 * success;

  return Math.round(score * 100);
}

/** Rank the pool by the chosen priority. */
export function rankProviders(pool: Provider[], priority: Priority): Provider[] {
  const withScore = [...pool];
  switch (priority) {
    case "fastest":
      return withScore.sort((a, b) => a.etaMin - b.etaMin);
    case "cheapest":
      return withScore.sort((a, b) => a.priceFrom - b.priceFrom);
    case "rated":
      return withScore.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "nearest":
      return withScore.sort((a, b) => a.distanceKm - b.distanceKm);
    case "best":
    default:
      return withScore.sort((a, b) => zentroScore(b, pool) - zentroScore(a, pool));
  }
}

/** Map free text in the AI box to a priority (the assistant understanding intent). */
export function priorityFromText(text: string): Priority | null {
  const t = text.toLowerCase();
  if (/cheap|afford|budget|low.?cost|less money|inexpensive/.test(t)) return "cheapest";
  if (/fast|quick|urgent|soon|asap|immediate|right now|emergency/.test(t)) return "fastest";
  if (/rat|review|best quality|top|trust/.test(t)) return "rated";
  if (/near|close|nearby|distance/.test(t)) return "nearest";
  if (/experience|senior|expert|skilled|best match|balance/.test(t)) return "best";
  return null;
}

/** A plain-language reason for the recommendation (the AI's explanation). */
export function explain(p: Provider, priority: Priority): string {
  const r = `${p.rating}★ (${p.reviews})`;
  switch (priority) {
    case "fastest":
      return `${p.name} can reach you fastest — about ${p.etaMin} min away — while still rated ${r}.`;
    case "cheapest":
      return `${p.name} is the most affordable qualified option at ₹${p.priceFrom}, rated ${r}, ${p.distanceKm} km away.`;
    case "rated":
      return `${p.name} has the strongest reputation at ${r}, with ${p.experienceYears} years of experience.`;
    case "nearest":
      return `${p.name} is closest to your location — ${p.distanceKm} km — rated ${r}, arriving in ~${p.etaMin} min.`;
    case "best":
    default:
      return `${p.name} is the best overall fit: ${r}, ${p.distanceKm} km away, ₹${p.priceFrom}, ${p.experienceYears} yrs experience — a strong balance of trust, distance and price.`;
  }
}
