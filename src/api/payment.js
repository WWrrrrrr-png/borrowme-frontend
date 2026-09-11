import axiosInstance from "./axiosInstance";

export const readyPayment = (matchingId) =>
  axiosInstance.post("/api/payments/ready", { matchingId });

export const getPaymentDetail = (id) => axiosInstance.get(`/api/payments/${id}`);

export const approvePayment = (paymentId, pgToken) =>
  axiosInstance.get("/api/payments/approve", {
    params: { paymentId, pg_token: pgToken },
  });