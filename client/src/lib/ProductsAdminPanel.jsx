import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedAdminPanel({ children }) {
  const { user } = useSelector((state) => state.user);
  if (!user || !user.admin) {
    return <Navigate to="/" />;
  }
  return children;
}

export default ProtectedAdminPanel;
