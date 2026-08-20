function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <span className="footer-logo">Qumly</span>

        <p>Ask your database anything.</p>
        <div className="site-footer__links social">
          <a
            href="https://github.com/alibro005/Qumly"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub ↗
          </a>
          <a
            href="https://www.linkedin.com/in/alibro005"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn ↗
          </a>
        </div>
      </div>

      <nav className="site-footer__links" aria-label="Footer">
        <a href="#how">How it works</a>

        <a href="#features">Features</a>

        <a href="#compat">Compatibility</a>

        <a
          href="https://app.qumly.me"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open app
        </a>
      </nav>

      <p className="site-footer__copy">
        © 2026 Qumly. Built for people who'd rather ask than query.
      </p>
    </footer>
  );
}

export default Footer;
