import "./App.css";
import { useEffect } from "react";
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
import PaymentApprove from "./pages/PaymentApprove";
import PaymentDetail from "./pages/PaymentDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminRequestList from "./pages/AdminRequestList";
import MyPage from "./pages/MyPage";

function PrivateRoute({ children, role, loginPath = "/login" }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to={loginPath} replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to={loginPath} replace />;
  }
  return children;
}

function AppRoutes() {

  useEffect(() => {
    const handlePageShow = (event) => {
      if (event.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/helper/login" element={<HelperLogin />} />
      <Route path="/helper/signup" element={<HelperSignup />} />
      <Route path="/" element={<PrivateRoute loginPath="/login"><Main /></PrivateRoute>} />
      <Route path="/requests" element={<PrivateRoute loginPath="/login"><RequestList /></PrivateRoute>} />
      <Route path="/requests/new" element={<PrivateRoute loginPath="/login"><RequestCreate /></PrivateRoute>} />
      <Route path="/requests/:id" element={<PrivateRoute loginPath="/login"><RequestDetail /></PrivateRoute>} />
      <Route path="/delete-account" element={<PrivateRoute loginPath="/login"><DeleteAccount /></PrivateRoute>} />
      <Route path="/helper/requests" element={<PrivateRoute role="HELPER" loginPath="/helper/login"><HelperRequestList /></PrivateRoute>} />
      <Route path="/matchings" element={<PrivateRoute loginPath="/login"><MatchingList /></PrivateRoute>} />
      <Route path="/matchings/:id" element={<PrivateRoute loginPath="/login"><MatchingDetail /></PrivateRoute>} />
      <Route path="/payments/new/:matchingId" element={<PrivateRoute loginPath="/login"><PaymentReady /></PrivateRoute>} />
      <Route path="/payments/approve" element={<PaymentApprove />} />
      <Route path="/payments/:id" element={<PrivateRoute loginPath="/login"><PaymentDetail /></PrivateRoute>} />
      <Route path="/mypage" element={<PrivateRoute loginPath="/login"><MyPage /></PrivateRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/requests" element={<PrivateRoute role="ADMIN" loginPath="/admin/login"><AdminRequestList /></PrivateRoute>} />
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