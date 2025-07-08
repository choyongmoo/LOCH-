import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p className="footer-text">© 2025 LOCH Team. All rights reserved.</p>
        <a
          href="https://github.com/choyongmoo/LOCH-"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          GitHub 저장소 →
        </a>
      </div>
    </footer>
  );
}

export default Footer;
