import axiosInstance from "./axiosInstance";

export const getAdminRequests = (status) =>
  axiosInstance.get("/api/admin/requests", { params: { status } });

export const approveRequest = (id) =>
  axiosInstance.patch(`/api/admin/requests/${id}/approve`);

export const rejectRequest = (id, reason) =>
  axiosInstance.patch(`/api/admin/requests/${id}/reject`, { reason });

export const setRequestAmount = (id, amount) =>
  axiosInstance.patch(`/api/admin/requests/${id}/amount`, { amount });