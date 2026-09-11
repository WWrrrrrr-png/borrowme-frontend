import axiosInstance from "./axiosInstance";

export const getMatchingDetail = (id) => axiosInstance.get(`/api/matchings/${id}`);

export const updateMatchingStatus = (id, status) =>
axiosInstance.patch(`/api/matchings/${id}/status`, { status });

export const getMyMatchings = () => axiosInstance.get("/api/matchings/my");