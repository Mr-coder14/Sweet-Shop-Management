import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { verifyToken } from "../api/authUtils";

const ProtectedRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { valid, role } = await verifyToken();

      if (!valid) {
        setIsAuthorized(false);
        setLoading(false);
        return;
      }

      setUserRole(role);

      // If no specific role required, just check if authenticated
      if (!requiredRole) {
        setIsAuthorized(true);
        setLoading(false);
        return;
      }

      // Check if user has the required role
      if (role === requiredRole) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }

      setLoading(false);
    };

    checkAuth();
  }, [requiredRole]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    // Not authenticated or wrong role
    if (!userRole) {
      
      return <Navigate to="/login" replace />;
    } else {
      
      if (userRole === "ADMIN") {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/user/dashboard" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;