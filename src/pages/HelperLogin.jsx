import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginHelper } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function HelperLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await loginHelper({ email, password });
      const { token, id, name } = response.data.data;
      login(token, id, name, "HELPER");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="form-card">
        <h2 className="title">BorrowMe 헬퍼</h2>
        <p className="subtitle">헬퍼로 로그인하고 도움을 제공해보세요</p>
        <form onSubmit={handleSubmit}>
          <input className="input" type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input className="input" type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "헬퍼 로그인"}
          </button>
        </form>
        <p className="footer-links">헬퍼 계정이 없으신가요?<a href="/helper/signup">헬퍼 회원가입</a></p>
        <p className="footer-links"><a href="/login">일반 회원 로그인으로</a></p>
      </div>
    </div>
  );
}