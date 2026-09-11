import "./App.css"; // 전체 디자인 시스템 적용 — 이게 빠져있어서 지금까지 스타일이 하나도 안 먹었음
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HelperLogin from "./pages/HelperLogin";
import HelperSignup from "./pages/HelperSignup";
import Main from "./pages/Main";
import RequestList from "./pages/RequestList";
import RequestCreate from "./pages/RequestCreate";
import RequestDetail from "./pages/RequestDetail";
import DeleteAccount from "./pages/DeleteAccount";
import HelperRequestList from "./pages/HelperRequestList";
import MatchingDetail from "./pages/MatchingDetail";
import MatchingList from "./pages/MatchingList";
import PaymentReady from "./pages/PaymentReady";
import PaymentDetail from "./pages/PaymentDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminRequestList from "./pages/AdminRequestList";
import MyPage from "./pages/MyPage";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/helper/login" element={<HelperLogin />} />
      <Route path="/helper/signup" element={<HelperSignup />} />
      <Route path="/" element={<PrivateRoute><Main /></PrivateRoute>} />
      <Route path="/requests" element={<PrivateRoute><RequestList /></PrivateRoute>} />
      <Route path="/requests/new" element={<PrivateRoute><RequestCreate /></PrivateRoute>} />
      <Route path="/requests/:id" element={<PrivateRoute><RequestDetail /></PrivateRoute>} />
      <Route path="/delete-account" element={<PrivateRoute><DeleteAccount /></PrivateRoute>} />
      <Route path="/helper/requests" element={<PrivateRoute><HelperRequestList /></PrivateRoute>} />
      <Route path="/matchings" element={<PrivateRoute><MatchingList /></PrivateRoute>} />
      <Route path="/matchings/:id" element={<PrivateRoute><MatchingDetail /></PrivateRoute>} />
      <Route path="/payments/new/:matchingId" element={<PrivateRoute><PaymentReady /></PrivateRoute>} />
      <Route path="/payments/:id" element={<PrivateRoute><PaymentDetail /></PrivateRoute>} />
      <Route path="/mypage" element={<PrivateRoute><MyPage /></PrivateRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/requests" element={<PrivateRoute><AdminRequestList /></PrivateRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}