import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { loginAdmin } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login } = useAuth();
  const navigate = useNavigate();


  if (user && user.role === "ADMIN") {
    return <Navigate to="/admin/requests" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await loginAdmin({ email, password });
      const { token, id, name } = response.data.data;
      login(token, id, name, "ADMIN");
      // 수정: replace 추가 -> /admin/login이 히스토리에서 /admin/requests로 대체됨
      navigate("/admin/requests", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center" style={{ background: "#1F2937" }}>
      <div className="form-card">
        <h2 className="title">관리자 로그인</h2>
        <p className="subtitle">BorrowMe Admin</p>
        <form onSubmit={handleSubmit}>
          <input className="input" type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "관리자 로그인"}
          </button>
        </form>
      </div>
    </div>
  );
}