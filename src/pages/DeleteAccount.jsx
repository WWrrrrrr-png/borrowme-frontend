import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteAccount, deleteHelperAccount } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function DeleteAccount() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
    setError("");
    setLoading(true);
    try {
      if (user?.role === "HELPER") await deleteHelperAccount(password);
      else await deleteAccount(password);
      alert("회원탈퇴가 완료되었습니다.");
      logout();
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "탈퇴에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="form-card">
        <h2 className="title">회원탈퇴</h2>
        <p className="subtitle">탈퇴 시 작성한 정보가 삭제되며, 되돌릴 수 없습니다.</p>
        <form onSubmit={handleSubmit}>
          <input className="input" type="password" placeholder="비밀번호 확인" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-danger btn-full" type="submit" disabled={loading}>
            {loading ? "처리 중..." : "탈퇴하기"}
          </button>
        </form>
        <p className="footer-links"><a href="/">취소하고 메인으로</a></p>
      </div>
    </div>
  );
}