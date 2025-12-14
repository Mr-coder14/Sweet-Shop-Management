import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { verifyToken } from "../../api/authUtils";
import { AuthContext } from "../../context/AuthContext";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // 🔹 Check existing token and redirect
  useEffect(() => {
    const checkAuth = async () => {
      const { valid, user } = await verifyToken();

      if (valid && user) {
        if (user.role === "ADMIN") {
          navigate("/admin/home");
        } else {
          navigate("/home");
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.token;

      await login(token);

      setSuccess("Login successful ✅");

      const { valid, user } = await verifyToken();

      setTimeout(() => {
        if (valid && user.role === "ADMIN") {
          navigate("/admin/home");
        } else {
          navigate("/home");
        }
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.error || "Invalid email or password");
    }
  };

  if (loading) {
    return (
      <div className="login-page">
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p style={{ marginTop: "10px", textAlign: "center", fontSize: "18px" }}>
          Don&apos;t have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
