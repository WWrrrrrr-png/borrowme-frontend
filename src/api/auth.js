
import axiosInstance from "./axiosInstance";

export const signupUser = (data) => axiosInstance.post("/api/auth/user/signup", data); 
export const loginUser = (data) => axiosInstance.post("/api/auth/user/login", data); 
export const signupHelper = (data) => axiosInstance.post("/api/auth/helper/signup", data); 
export const loginHelper = (data) => axiosInstance.post("/api/auth/helper/login", data); 
export const loginAdmin = (data) => axiosInstance.post("/api/auth/admin/login", data); 
export const getMyInfo = () => axiosInstance.get("/api/auth/me"); 
export const deleteAccount = (password) => axiosInstance.delete("/api/auth/user/me",{data: {password} }); 
export const deleteHelperAccount = (password) => axiosInstance.delete("/api/auth/helper/me",{data: {password} });
export const checkUserEmail = (email) =>axiosInstance.get("/api/auth/user/check-email", { params: { email } });
export const checkHelperEmail = (email) =>axiosInstance.get("/api/auth/helper/check-email", { params: { email } });