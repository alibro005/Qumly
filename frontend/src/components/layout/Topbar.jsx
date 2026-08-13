import logo from "../../assets/logo.svg";

function Topbar({ onToggleSidebar, sidebarOpen = true }) {
  return (
    <header className="topbar">
      <div className="topbar__brand">
        <button
          className="icon-btn sidebar-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 4.5h14M2 9h14M2 13.5h14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <a href="/" className="brand-mark" aria-label="Qumly home">
          <img src={logo} alt="Qumly logo" />
          <span className="brand-mark__text">Qumly</span>
        </a>
      </div>

      <div className="topbar__status">
        <span className="status-chip status-chip--ready">
          <span className="status-dot" aria-hidden="true"></span>
          Ready
        </span>
      </div>
    </header>
  );
}

export default Topbar;
