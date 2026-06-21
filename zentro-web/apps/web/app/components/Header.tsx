import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="wrap header__inner">
        <Link className="brand" href="/" aria-label="Zentro home">
          <span className="brand__mark">Z</span>
          Zentro
        </Link>
        <nav className="nav" aria-label="Primary">
          <Link href="/#how">How it works</Link>
          <Link href="/#categories">Categories</Link>
          <Link href="/#partner">For partners</Link>
        </nav>
        <div className="header__cta">
          <Link className="btn btn--ghost" href="/#partner">Become a partner</Link>
          <Link className="btn btn--dark" href="/search">Find a service</Link>
        </div>
      </div>
    </header>
  );
}
