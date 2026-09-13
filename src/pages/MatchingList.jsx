import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyMatchings } from "../api/matching";

const DISMISS_KEY = "helper_dismissed_matchings";

export default function MatchingList() {
  const [matchings, setMatchings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissedIds, setDismissedIds] = useState(() => {
    const saved = localStorage.getItem(DISMISS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getMyMatchings();
        setMatchings(response.data.data);
      } catch (err) {
        console.error("매칭 목록 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDismiss = (e, matchingId) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = [...dismissedIds, matchingId];
    setDismissedIds(updated);
    localStorage.setItem(DISMISS_KEY, JSON.stringify(updated));
  };

  const visibleMatchings = matchings.filter((m) => !dismissedIds.includes(m.id));

  return (
    <div className="page-center">
      <div className="page-card">
        <h2 className="title" style={{ textAlign: "left" }}>내가 진행중인 매칭</h2>

        {loading ? (
          <p className="empty-text">불러오는 중...</p>
        ) : visibleMatchings.length === 0 ? (
          <p className="empty-text">진행중인 매칭이 없습니다.</p>
        ) : (
          visibleMatchings.map((m) => (
            <Link key={m.id} to={`/matchings/${m.id}`} style={{ display: "block", textDecoration: "none" }}>
              <div className="list-item">
                <button
                  className="dismiss-btn"
                  onClick={(e) => handleDismiss(e, m.id)}
                  title="화면에서만 숨기기 (삭제 아님)"
                >
                  ✕
                </button>
                <p className="list-item-title">매칭 #{m.id}</p>
                <span className="badge">{m.status}</span>
              </div>
            </Link>
          ))
        )}
        <p style={{ marginTop: 16 }}><Link to="/">메인으로</Link></p>
      </div>
    </div>
  );
}