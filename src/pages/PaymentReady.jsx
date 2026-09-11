import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMatchingDetail } from "../api/matching";
import { getRequestDetail } from "../api/request";
import { readyPayment } from "../api/payment";

export default function PaymentReady() {
  const { matchingId } = useParams();
  const [amount, setAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAmount = async () => {
      try {
        const matchingRes = await getMatchingDetail(matchingId);
        const requestId = matchingRes.data.data.requestId;
        const requestRes = await getRequestDetail(requestId);
        setAmount(requestRes.data.data.amount);
      } catch (err) {
        setError("결제 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchAmount();
  }, [matchingId]);

  const handlePay = async () => {
    setError("");
    setPaying(true);
    try {
      const response = await readyPayment(Number(matchingId));
      window.location.href = response.data.data.redirectUrl;
    } catch (err) {
      setError(err.response?.data?.message || "결제 준비에 실패했습니다.");
      setPaying(false);
    }
  };

  if (loading) return <div className="page-center"><p className="empty-text">불러오는 중...</p></div>;

  return (
    <div className="page-center">
      <div className="form-card">
        <h2 className="title">결제하기</h2>
        {amount === null ? (
          <p className="error-text" style={{ textAlign: "center" }}>관리자가 아직 결제 금액을 정하지 않았습니다.</p>
        ) : (
          <>
            <p className="price-display">{amount.toLocaleString()}원</p>
            {error && <p className="error-text">{error}</p>}
            <button className="btn btn-primary btn-full" onClick={handlePay} disabled={paying}>
              {paying ? "이동 중..." : "카카오페이 결제"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}