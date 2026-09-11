import { useEffect, useState } from "react";
import { getMyInfo } from "../api/auth";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function MyPage() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await getMyInfo();
        setInfo(response.data.data);
      } catch (err) {
        console.error("내 정보 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  return (
    <div className="page-center">
      <div className="form-card">
        <h2 className="title">마이페이지</h2>

        {loading ? (
          <p className="empty-text">불러오는 중...</p>
        ) : info ? (
          <>
            <p className="list-item-sub"><strong>이름</strong> · {info.name}</p>
            <p className="list-item-sub"><strong>이메일</strong> · {info.email}</p>
            <p style={{ margin: "10px 0" }}><span className="badge">{info.role}</span></p>
          </>
        ) : (
          <p className="empty-text">정보를 불러오지 못했습니다.</p>
        )}

        <button className="btn btn-secondary btn-full" onClick={logout}>로그아웃</button>
        <p className="footer-links">
          <Link to="/delete-account" className="link-muted">회원탈퇴</Link>
        </p>
        <p className="footer-links"><Link to="/">메인으로</Link></p>
      </div>
    </div>
  );
}