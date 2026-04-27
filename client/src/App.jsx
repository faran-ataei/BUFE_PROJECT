import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./pages/Home";
import ProtectedRoute from "./lib/ProtectedRoute";

function App() {
  const userData = useSelector((state) => state.user);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/authentication" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            //<ProtectedRoute>
              <Home />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
