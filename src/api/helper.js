import axiosInstance from "./axiosInstance";

export const getApprovedRequests = () => axiosInstance.get("/api/helper/requests");
export const acceptRequest = (id) => axiosInstance.post(`/api/helper/requests/${id}/accept`);