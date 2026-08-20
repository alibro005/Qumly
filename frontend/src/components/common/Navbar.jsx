import { useState } from "react";
import logo from "../../assets/logo.svg";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={`site-nav ${isOpen ? "is-open" : ""}`}>
      <a href="/" className="brand-mark" aria-label="Qumly home">
        <img src={logo} alt="Qumly logo" />
        <span className="brand-mark__text">Qumly</span>
      </a>

      <nav className="site-nav__links" id="navLinks" aria-label="Primary">
        <a href="#how" onClick={() => setIsOpen(false)}>
          How it works
        </a>

        <a href="#features" onClick={() => setIsOpen(false)}>
          Features
        </a>

        <a href="#preview" onClick={() => setIsOpen(false)}>
          Preview
        </a>

        <a href="#compat" onClick={() => setIsOpen(false)}>
          Compatibility
        </a>
      </nav>

      <div className="site-nav__actions">
        <a href="https://app.qumly.me" className="btn btn--primary btn--sm hide">
          Try Qumly
        </a>

        <button
          className="icon-btn nav-toggle"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M2 4.5h14M2 9h14M2 13.5h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
