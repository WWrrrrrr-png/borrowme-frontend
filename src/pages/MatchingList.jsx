import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyMatchings } from "../api/matching";

export default function MatchingList() {
  const [matchings, setMatchings] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="page-center">
      <div className="page-card">
        <h2 className="title" style={{ textAlign: "left" }}>내가 진행중인 매칭</h2>

        {loading ? (
          <p className="empty-text">불러오는 중...</p>
        ) : matchings.length === 0 ? (
          <p className="empty-text">진행중인 매칭이 없습니다.</p>
        ) : (
          matchings.map((m) => (
            <Link key={m.id} to={`/matchings/${m.id}`} style={{ display: "block" }}>
              <div className="list-item">
                <p className="list-item-title">매칭 #{m.id}</p>
                <span className="badge">{m.status}</span>
              </div>
            </Link>
          ))
        )}
        <p style={{ marginTop: 16 }}><a href="/">메인으로</a></p>
      </div>
    </div>
  );
}