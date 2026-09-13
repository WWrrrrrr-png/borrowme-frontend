import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser, checkUserEmail } from "../api/auth";

export default function Signup() {
  const [form, setForm] = useState({ email: "", password: "", name: "", gender: "MALE", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "email") {
      setEmailChecked(false);
      setEmailCheckMessage("");
    }
  };

  const handleCheckEmail = async () => {
    if (!form.email) { setEmailCheckMessage("이메일을 먼저 입력해주세요."); return; }
    setCheckingEmail(true);
    setEmailCheckMessage("");
    try {
      const response = await checkUserEmail(form.email);
      const isAvailable = response.data.data;
      setEmailChecked(isAvailable);
      setEmailCheckMessage(isAvailable ? "사용 가능한 이메일입니다." : "이미 사용 중인 이메일입니다.");
    } catch (err) {
      setEmailChecked(false);
      setEmailCheckMessage("중복확인 중 오류가 발생했습니다.");
    } finally {
      setCheckingEmail(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!emailChecked) { setError("이메일 중복확인을 먼저 완료해주세요."); return; }
    setLoading(true);
    try {
      await signupUser(form);
      alert("회원가입이 완료되었습니다. 로그인해주세요.");
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="form-card">
        <h2 className="title">회원가입</h2>
        <p className="subtitle">BorrowMe와 함께 시작해보세요</p>
        <form onSubmit={handleSubmit}>
          <input className="input" name="name" type="text" placeholder="이름" value={form.name} onChange={handleChange} required />

          <div className="field-row">
            <input className="input" name="email" type="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
            <button type="button" className="btn btn-outline" onClick={handleCheckEmail} disabled={checkingEmail}>
              {checkingEmail ? "확인 중..." : "중복확인"}
            </button>
          </div>
          {emailCheckMessage && (
            <p className={emailChecked ? "success-text" : "error-text"}>{emailCheckMessage}</p>
          )}

          <input className="input" name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
          <input className="input" name="phone" type="tel" placeholder="전화번호 (예: 01012345678)" value={form.phone} onChange={handleChange} required />

          <div style={{ marginTop: 16, fontSize: 15 }}>
            <label style={{ marginRight: 24 }}>
              <input type="radio" name="gender" value="MALE" checked={form.gender === "MALE"} onChange={handleChange} style={{ marginRight: 6 }} />
              남자
            </label>
            <label>
              <input type="radio" name="gender" value="FEMALE" checked={form.gender === "FEMALE"} onChange={handleChange} style={{ marginRight: 6 }} />
              여자
            </label>
          </div>

          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}