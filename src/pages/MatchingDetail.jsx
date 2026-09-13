import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMatchingDetail, updateMatchingStatus } from "../api/matching";
import { useAuth } from "../context/AuthContext";

export default function MatchingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [matching, setMatching] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");

  const fetchMatching = async () => {
    try {
      const response = await getMatchingDetail(id);
      setMatching(response.data.data);
    } catch (err) {
      console.error("매칭 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMatching(); }, [id]);

  const handleStatusChange = async (newStatus) => {
    setError("");
    setUpdating(true);
    try {
      const response = await updateMatchingStatus(id, newStatus);
      setMatching(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "상태 변경에 실패했습니다.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="page-center"><p className="empty-text">불러오는 중...</p></div>;
  if (!matching) return <div className="page-center"><p className="empty-text">매칭 정보를 찾을 수 없습니다.</p></div>;

  return (
    <div className="page-center">
      <div className="form-card">
        <h2 className="title">매칭 상세</h2>
        <p className="list-item-sub"><strong>매칭 번호</strong> · {matching.id}</p>
        <p className="list-item-sub"><strong>요청 번호</strong> · {matching.requestId}</p>
        <p className="list-item-sub"><strong>헬퍼 번호</strong> · {matching.helperId}</p>
        <p style={{ margin: "10px 0" }}><span className="badge">{matching.status}</span></p>

        {error && <p className="error-text">{error}</p>}

        {user?.role === "HELPER" && matching.status === "MATCHED" && (
          <button className="btn btn-primary btn-full" onClick={() => handleStatusChange("IN_PROGRESS")} disabled={updating}>
            {updating ? "처리 중..." : "진행중으로 변경"}
          </button>
        )}
        {user?.role === "HELPER" && matching.status === "IN_PROGRESS" && (
          <button className="btn btn-primary btn-full" onClick={() => handleStatusChange("COMPLETED")} disabled={updating}>
            {updating ? "처리 중..." : "완료 처리하기"}
          </button>
        )}
        {matching.status === "COMPLETED" && <p className="success-text">이 매칭은 완료되었습니다.</p>}

        {user?.role === "USER" && (
          <Link className="btn btn-primary btn-full" to={`/payments/new/${matching.id}`} style={{ display: "block", textAlign: "center", textDecoration: "none" }}>
            이 매칭 결제하기
          </Link>
        )}

        <p className="footer-links"><Link to="/">메인으로</Link></p>
      </div>
    </div>
  );
}