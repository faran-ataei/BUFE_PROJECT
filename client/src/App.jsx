import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// Bileşenler (Components)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./lib/ProtectedRoute";
import ProtectedAdminPanel from "./lib/ProductsAdminPanel";

// Sayfalar (Pages)
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProductDetailPage from "./pages/ProductDetailPage";
import Basket from "./pages/Basket";
import Orders from "./pages/Order";
import AdminPanel from "./pages/OrdersPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ClientMyOrders from "./pages/ClientMyOrders";

// Redux Aksiyonları
import { clearAllUserData } from "./redux/slices/user.slice";

// Stil Dosyaları
import "bootstrap-icons/font/bootstrap-icons.css";
import ResendVerification from "./pages/ResendVerification";
import EmailVerified from "./pages/EmailVerified";
import NotFound from "./pages/NorFound";
import { Toaster } from "@/components/ui/sonner";

function App() {
  const dispatch = useDispatch();
  const lastLoginAt = useSelector((state) => state.user?.lastLoginAt);

  // ✅ Oturum Kontrolü: 7 gün geçince kullanıcı verilerini temizler
  useEffect(() => {
    if (lastLoginAt) {
      const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - lastLoginAt;

      if (timeElapsed > SEVEN_DAYS_IN_MS) {
        // Oturum süresi dolduğunda Redux state'ini sıfırla
        dispatch(clearAllUserData());
      }
    }
  }, [lastLoginAt, dispatch]);

  return (
    <BrowserRouter>
      <div id="root">
        <Navbar />
        <main>
          <Routes>
            {/* --- Kimlik Doğrulama Yolları (Auth Routes) --- */}
            <Route path="/authentication/signup" element={<Signup />} />
            <Route path="/authentication/login" element={<Login />} />
            <Route
              path="/authentication/forgot-password"
              element={<ForgotPassword />}
            />
            {/* Şifre Sıfırlama Sayfası: E-postadaki linkten gelen token parametresini alır */}
            <Route
              path="/authentication/reset-password/:token"
              element={<ResetPassword />}
            />

            {/* --- E-posta Doğrulama Yolları (Email Verification Routes) --- */}
            <Route
              path="/authentication/resend-verification"
              element={<ResendVerification />}
            />

            <Route path="/email-verified" element={<EmailVerified />} />

            {/* --- Genel Yollar (Public Routes) --- */}
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />

            {/* --- Korumalı Yollar (Protected Routes) --- */}
            <Route
              path="/basket"
              element={
                <ProtectedRoute>
                  <Basket />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route path="/my-orders" element={
              <ProtectedRoute>
                <ClientMyOrders />
              </ProtectedRoute>
            } />

            {/* --- Yönetici Paneli (Admin Routes) --- */}
            <Route
              path="/admin/panel"
              element={
                <ProtectedAdminPanel>
                  <AdminPanel />
                </ProtectedAdminPanel>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster richColors position="top-right" closeButton theme="dark" />
    </BrowserRouter>
  );
}

export default App;
