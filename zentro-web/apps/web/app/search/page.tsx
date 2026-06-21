import Header from "../components/Header";
import SearchExperience from "../components/SearchExperience";

export const metadata = {
  title: "Find a service — Zentro",
  description: "Describe your need, see verified professionals near you ranked by your priority, and compare them with the Zentro AI assistant.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const initialQuery = q ?? "";

  return (
    <>
      <Header />
      <main id="main" className="srch-page">
        <div className="wrap">
          <div className="srch-page__head">
            <h1>Find the right professional</h1>
            <p>Type your need in plain words — Zentro detects the service, ranks verified pros near you by your priority, and the assistant helps you compare.</p>
          </div>
          <SearchExperience initialQuery={initialQuery} />
        </div>
      </main>
    </>
  );
}
