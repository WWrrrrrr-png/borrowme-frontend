import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { approvePayment } from "../api/payment";

const MIN_PROCESSING_MS = 1800; 
const MIN_SUCCESS_MS = 1800;    

export default function PaymentApprove() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState("");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const paymentId = searchParams.get("paymentId");
    const pgToken = searchParams.get("pg_token");

    if (!paymentId || !pgToken) {
      setStatus("fail");
      setError("결제 승인에 필요한 정보가 없습니다.");
      return;
    }

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const doApprove = async () => {
      const startedAt = Date.now(); 

      try {
        const response = await approvePayment(paymentId, pgToken);
        const payment = response.data.data;

    
        const elapsed = Date.now() - startedAt;
        if (elapsed < MIN_PROCESSING_MS) {
          await wait(MIN_PROCESSING_MS - elapsed);
        }

        setStatus("success");
       
        await wait(MIN_SUCCESS_MS);
        navigate(`/payments/${payment.id}`, { replace: true });
      } catch (err) {
        const elapsed = Date.now() - startedAt;
        if (elapsed < MIN_PROCESSING_MS) {
          await wait(MIN_PROCESSING_MS - elapsed);
        }
        setStatus("fail");
        setError(err.response?.data?.message || "결제 승인에 실패했습니다.");
      }
    };

    doApprove();
  }, [searchParams, navigate]);

  return (
    <div className="page-center">
      <div className="form-card">

        {status === "processing" && (
          <p className="empty-text">결제를 승인하는 중입니다...</p>
        )}

        {status === "success" && (
          <p className="success-text" style={{ textAlign: "center" }}>
            결제가 완료되었습니다! 잠시 후 이동합니다...
          </p>
        )}

        {status === "fail" && (
          <>
            <p className="error-text" style={{ textAlign: "center" }}>{error}</p>
            <p className="footer-links"><Link to="/">메인으로</Link></p>
          </>
        )}

      </div>
    </div>
  );
}