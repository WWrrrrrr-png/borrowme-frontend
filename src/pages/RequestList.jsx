import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyRequests } from "../api/request";

const statusLabel = { PENDING: "대기중", APPROVED: "승인됨", REJECTED: "거절됨", MATCHED: "매칭완료" };
const statusBadgeClass = { PENDING: "badge-warning", APPROVED: "badge-success", REJECTED: "badge-danger", MATCHED: "badge" };

export default function RequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyRequests();
        setRequests(response.data.data);
      } catch (err) {
        console.error("요청 목록 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-center">
      <div className="page-card">
        <div className="top-bar">
          <h2 className="page-title" style={{ marginBottom: 0 }}>내 도움 요청 목록</h2>
          <Link className="btn btn-primary btn-sm" to="/requests/new">+ 새 요청</Link>
        </div>
        <p className="page-subtitle">등록한 도움 요청의 진행 상황을 확인하세요</p>

        {loading ? (
          <p className="empty-text">불러오는 중...</p>
        ) : requests.length === 0 ? (
          <p className="empty-text">등록한 요청이 없습니다.</p>
        ) : (
          requests.map((req) => (
            <Link key={req.id} to={`/requests/${req.id}`} style={{ display: "block", textDecoration: "none" }}>
              <div className="list-item">
                <div className="admin-card-top">
                  <p className="list-item-title" style={{ margin: 0 }}>{req.title}</p>
                  <span className={`badge ${statusBadgeClass[req.status] || "badge-gray"}`}>
                    {statusLabel[req.status] || req.status}
                  </span>
                </div>
              </div>
            </Link>
          ))
        )}
        <p style={{ marginTop: 16 }}><Link to="/">메인으로</Link></p>
      </div>
    </div>
  );
}