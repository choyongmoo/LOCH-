import "../styles/Header.css";

function Header() {
  return (
    <header className="header-bar">
      <div className="header-inner">
        <div className="header-logo">LOCH</div>
        <nav className="header-nav">
          <a href="#features" className="nav-item">기능 소개</a>
          <a href="#effects" className="nav-item">기대 효과</a>
          <a href="#team" className="nav-item">팀 소개</a>
        </nav>
        <div className="header-auth">
          <a href="/login" className="login-link">로그인</a>
          <a href="/signup">
            <button className="btn-signup">회원가입</button>
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;