import axiosInstance from "./axiosInstance";

export const createRequest = (data) => axiosInstance.post("/api/requests", data);


export const getMyRequests = () => axiosInstance.get("/api/requests/my");

export const getRequestDetail = (id) => axiosInstance.get(`/api/requests/${id}`);

export const updateRequest = (id, data) => axiosInstance.put(`/api/requests/${id}`, data);

export const deleteRequest = (id) => axiosInstance.delete(`/api/requests/${id}`);