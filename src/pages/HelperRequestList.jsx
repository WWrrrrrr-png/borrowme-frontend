import { useEffect, useState } from "react";
import { getApprovedRequests, acceptRequest } from "../api/helper";
import { useAuth } from "../context/AuthContext";

export default function HelperRequestList() {
  const { logout } = useAuth(); 
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    try {
      const response = await getApprovedRequests();
      setRequests(response.data.data);
    } catch (err) {
      console.error("승인된 요청 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleAccept = async (id) => {
    setError("");
    setAcceptingId(id);
    try {
      const response = await acceptRequest(id);
      alert(`매칭이 생성되었습니다. (매칭번호: ${response.data.data.id})`);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "요청 수락에 실패했습니다.");
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="page-center">
      <div className="page-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 className="title" style={{ textAlign: "left", marginBottom: 0 }}>승인된 도움 요청</h2>
          <button className="btn btn-outline btn-sm" onClick={() => logout("/helper/login")}>로그아웃</button>
        </div>

        {error && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}

        {loading ? (
          <p className="empty-text">불러오는 중...</p>
        ) : requests.length === 0 ? (
          <p className="empty-text">지금 수락 가능한 요청이 없습니다.</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="list-item">
              <p className="list-item-title">{req.title}</p>
              <p className="list-item-sub">{req.content}</p>
              <button className="btn btn-primary btn-sm" style={{ marginTop: 10 }} onClick={() => handleAccept(req.id)} disabled={acceptingId === req.id}>
                {acceptingId === req.id ? "처리 중..." : "이 요청 수락하기"}
              </button>
            </div>
          ))
        )}

      </div>
    </div>
  );
}