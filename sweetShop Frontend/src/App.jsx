import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserHome from "./pages/user/UserHome";
import UserDashboard from "./pages/user/UserDashboard";
import AdminHome from "./pages/admin/AdminHome";
import ManageSweets from "./pages/admin/ManageSweets";
import Profile from "./pages/user/Profile";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<UserHome />} />

          {/* User Routes - Protected */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute requiredRole="USER">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="USER">
                <Profile />
              </ProtectedRoute>
            }
          />
          

          {/* Admin Routes - Protected */}
          <Route
            path="/admin/home"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/manage-sweets"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ManageSweets />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;