import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProductDetailPage from "./pages/ProductDetailPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "bootstrap-icons/font/bootstrap-icons.css";
import Basket from "./pages/Basket";
import ProtectedRoute from "./lib/ProtectedRoute";
import Orders from "./pages/Order";
import AdminPanel from "./pages/AdminPanel";
import { useEffect } from "react";
import { clearAllUserData } from "./redux/slices/user.slice";

function App() {
const dispatch = useDispatch();
  const lastLoginAt = useSelector((state) => state.user?.lastLoginAt);

  useEffect(() => {
    if (lastLoginAt) {
      const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - lastLoginAt;

      if (timeElapsed > SEVEN_DAYS_IN_MS) {
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
            <Route path="/authentication/signup" element={<Signup />} />
            <Route path="/authentication/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
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
            <Route path="/admin/panel" element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
