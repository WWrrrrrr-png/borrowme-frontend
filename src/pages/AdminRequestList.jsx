import { useEffect, useState } from "react";
import { getAdminRequests, approveRequest, rejectRequest, setRequestAmount } from "../api/admin";

const statusLabel = { PENDING: "대기중", APPROVED: "승인됨", REJECTED: "거절됨" };
const statusBadgeClass = { PENDING: "badge-warning", APPROVED: "badge-success", REJECTED: "badge-danger" };

export default function AdminRequestList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amountInputs, setAmountInputs] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await getAdminRequests(statusFilter);
      setRequests(response.data.data);
    } catch (err) {
      console.error("요청 목록 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const handleAmountChange = (requestId, value) => {
    setAmountInputs({ ...amountInputs, [requestId]: value });
  };

  const handleSaveAmount = async (requestId) => {
    const amount = Number(amountInputs[requestId]);
    if (!amount || amount <= 0) {
      setError("올바른 금액을 입력해주세요.");
      return;
    }
    setError("");
    setSavingId(requestId);
    try {
      await setRequestAmount(requestId, amount);
      // 저장 성공 후 입력창 값은 비워줌 (저장된 금액은 아래 price-box에 별도로 표시되므로)
      setAmountInputs({ ...amountInputs, [requestId]: "" });
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "금액 저장에 실패했습니다.");
    } finally {
      setSavingId(null);
    }
  };

  const handleApprove = async (requestId) => {
    if (!window.confirm("이 요청을 승인하시겠습니까?")) return;
    setError("");
    setProcessingId(requestId);
    try {
      await approveRequest(requestId);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "승인에 실패했습니다.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    const reason = window.prompt("거절 사유를 입력해주세요.");
    if (!reason) return;
    setError("");
    setProcessingId(requestId);
    try {
      await rejectRequest(requestId, reason);
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.message || "거절에 실패했습니다.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="admin-shell">
      <div className="admin-container">
        <div className="admin-header">
          <h1 className="page-title">요청 관리</h1>
          <p className="page-subtitle">사용자의 도움 요청을 확인하고 승인/거절 및 결제 금액을 설정합니다</p>
        </div>

        <div className="tabs">
          {["PENDING", "APPROVED", "REJECTED"].map((s) => (
            <button
              key={s}
              className={`tab-btn ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {statusLabel[s]}
            </button>
          ))}
        </div>

        {error && <p className="error-text" style={{ marginBottom: 12 }}>{error}</p>}

        {loading ? (
          <p className="empty-text">불러오는 중...</p>
        ) : requests.length === 0 ? (
          <p className="empty-text">해당 상태의 요청이 없습니다.</p>
        ) : (
          <div className="admin-card-list">
            {requests.map((req) => (
              <div key={req.id} className="admin-card">
                <div className="admin-card-top">
                  <h3 className="admin-card-title">{req.title}</h3>
                  <span className={`badge ${statusBadgeClass[req.status] || "badge-gray"}`}>
                    {statusLabel[req.status] || req.status}
                  </span>
                </div>

                <p className="admin-card-content clamp-3">{req.content}</p>

                {req.status === "PENDING" && (
                  <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                    <button className="btn btn-primary btn-sm" onClick={() => handleApprove(req.id)} disabled={processingId === req.id}>
                      {processingId === req.id ? "처리 중..." : "승인"}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleReject(req.id)} disabled={processingId === req.id}>
                      거절
                    </button>
                  </div>
                )}

                {req.status === "REJECTED" && req.adminComment && (
                  <p className="list-item-sub" style={{ marginBottom: 14 }}>
                    <strong>거절 사유</strong> · {req.adminComment}
                  </p>
                )}

              
                <div className={`admin-price-box ${req.amount ? "is-set" : "is-empty"}`}>
                  <span className="admin-price-box-label">결제 금액</span>
                  <span className="admin-price-box-value">
                    {req.amount ? `${req.amount.toLocaleString()}원` : "미설정"}
                  </span>
                </div>

           
                <div className="admin-card-footer">
                  <input
                    type="number"
                    placeholder={req.amount ? "새 금액으로 변경" : "금액 입력"}
                    value={amountInputs[req.id] || ""}
                    onChange={(e) => handleAmountChange(req.id, e.target.value)}
                    className="input admin-amount-input"
                  />
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={() => handleSaveAmount(req.id)}
                    disabled={savingId === req.id}
                  >
                    {savingId === req.id ? "저장 중..." : req.amount ? "금액 수정" : "금액 저장"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ marginTop: 24 }}><a href="/">메인으로</a></p>
      </div>
    </div>
  );
}