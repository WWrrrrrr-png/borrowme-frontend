import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getRequestDetail, updateRequest, deleteRequest } from "../api/request";
import { getMyMatchings } from "../api/matching";

export default function RequestDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [matching, setMatching] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequestDetail(id);
        const data = response.data.data;
        setRequest(data);
        setForm({ title: data.title, content: data.content });

        try {
          const matchingsRes = await getMyMatchings();
          const matched = matchingsRes.data.data.find(
            (m) => m.requestId === Number(id)
          );
          if (matched) setMatching(matched);
        } catch (mErr) {
          console.error("매칭 조회 실패:", mErr);
        }
      } catch (err) {
        console.error("요청 상세 조회 실패:", err);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await updateRequest(id, form);
      setRequest(response.data.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "수정에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteRequest(id);
      navigate("/requests");
    } catch (err) {
      setError(err.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  if (!request) return <div className="page-center"><p className="empty-text">불러오는 중...</p></div>;

  const isPaid = matching && matching.status === "COMPLETED";
  const canPay = matching && matching.status !== "COMPLETED" && request.amount;

  return (
    <div className="page-center">
      <div className="form-card">
        <h2 className="title">요청 상세</h2>

        {isEditing ? (
          <form onSubmit={handleUpdate}>
            <input className="input" name="title" value={form.title} onChange={handleChange} required />
            <textarea className="input" name="content" value={form.content} onChange={handleChange} rows={5} required />
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-primary" type="submit">저장</button>
            <button className="btn btn-outline" type="button" onClick={() => setIsEditing(false)} style={{ marginLeft: 8 }}>취소</button>
          </form>
        ) : (
          <>
            <p className="list-item-sub"><strong>제목</strong> · {request.title}</p>
            <p className="list-item-sub"><strong>내용</strong> · {request.content}</p>

            <p style={{ margin: "10px 0", display: "flex", gap: 8, alignItems: "center" }}>
              <span className="badge">{request.status}</span>
              {isPaid && (
                <span className="badge" style={{ background: "#d1fae5", color: "#059669" }}>
                  결제완료
                </span>
              )}
            </p>

            {request.amount && <p className="list-item-sub"><strong>결제 금액</strong> · {request.amount.toLocaleString()}원</p>}
            {request.adminComment && <p className="list-item-sub"><strong>관리자 코멘트</strong> · {request.adminComment}</p>}

            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <button className="btn btn-outline" onClick={() => setIsEditing(true)}>수정</button>
              <button className="btn btn-danger" onClick={handleDelete}>삭제</button>
            </div>

            {canPay && (
              <Link
                className="btn btn-primary btn-full"
                to={`/payments/new/${matching.id}`}
                style={{ display: "block", textAlign: "center", textDecoration: "none", marginTop: 12 }}
              >
                카카오페이 결제하기
              </Link>
            )}
          </>
        )}
        <p className="footer-links"><a href="/requests">목록으로</a></p>
      </div>
    </div>
  );
}