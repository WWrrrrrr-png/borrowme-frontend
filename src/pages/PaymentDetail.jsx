import { useEffect, useState } from "react";
import { useParams, useNavigationType, Navigate, Link } from "react-router-dom";
import { getPaymentDetail } from "../api/payment";

export default function PaymentDetail() {
  const { id } = useParams();
  const navType = useNavigationType();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPaymentDetail(id);
        setPayment(response.data.data);
      } catch (err) {
        console.error("결제 조회 실패:", err);
        setError(err.response?.data?.message || "결제 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 추가: 뒤로가기/앞으로가기(POP)로 이 페이지에 도달했다면, 화면을 그리지 않고 바로 메인으로 보냄
  if (navType === "POP") {
    return <Navigate to="/" replace />;
  }

  if (loading) return <div className="page-center"><p className="empty-text">불러오는 중...</p></div>;
  if (error) return <div className="page-center"><p className="error-text">{error}</p></div>;
  if (!payment) return <div className="page-center"><p className="empty-text">결제 정보를 찾을 수 없습니다.</p></div>;

  return (
    <div className="page-center">
      <div className="form-card">
        <h2 className="title">결제 상세</h2>
        <p className="list-item-sub"><strong>결제 번호</strong> · {payment.id}</p>
        <p className="list-item-sub"><strong>매칭 번호</strong> · {payment.matchingId}</p>
        {payment.amount != null && (
          <p className="price-display" style={{ margin: "16px 0" }}>{payment.amount.toLocaleString()}원</p>
        )}
        <p style={{ textAlign: "center" }}>
          <span className={payment.paymentStatus === "SUCCESS" ? "badge badge-success" : "badge badge-gray"}>
            {payment.paymentStatus}
          </span>
        </p>
        {payment.paymentStatus === "SUCCESS" && <p className="success-text" style={{ textAlign: "center" }}>결제가 정상적으로 완료되었습니다.</p>}
        <p className="footer-links"><Link to="/">메인으로</Link></p>
      </div>
    </div>
  );
}