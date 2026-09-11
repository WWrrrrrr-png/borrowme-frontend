import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRequest } from "../api/request";

export default function RequestCreate() {
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createRequest(form);
      navigate("/requests");
    } catch (err) {
      setError(err.response?.data?.message || "요청 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div className="form-card">
        <h2 className="title">도움 요청 등록</h2>
        <p className="subtitle">필요한 도움을 자세히 적어주세요</p>
        <form onSubmit={handleSubmit}>
          <input className="input" name="title" placeholder="제목" value={form.title} onChange={handleChange} required />
          <textarea className="input" name="content" placeholder="내용" value={form.content} onChange={handleChange} rows={5} required />
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
            {loading ? "등록 중..." : "등록하기"}
          </button>
        </form>
      </div>
    </div>
  );
}