import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Main() {
  const { user, logout } = useAuth();

  return (
    <div className="page-center">
      <div className="form-card" style={{ maxWidth: 420 }}>
        <h2 className="title">BorrowMe</h2>
        <p className="subtitle">
          {user?.name}님 환영합니다 · <span className="badge">{user?.role}</span>
        </p>

        {user?.role === "HELPER" ? (
          <div className="menu-list">
            <Link className="menu-item" to="/helper/requests">들어온 요청 확인하기</Link>
            <Link className="menu-item" to="/matchings">내가 진행중인 매칭</Link>
          </div>
        ) : (
          <div className="menu-list">
            <Link className="menu-item" to="/requests/new">도움 요청하기</Link>
            <Link className="menu-item" to="/requests">내 요청 목록</Link>
          </div>
        )}

        <Link className="menu-item" to="/mypage" style={{ marginTop: 10, display: "block" }}>마이페이지</Link>

        <button className="btn btn-secondary btn-full" onClick={logout}>로그아웃</button>

        <p className="footer-links">
          <Link to="/delete-account" className="link-muted">회원탈퇴</Link>
        </p>
      </div>
    </div>
  );
}