import api from "./api";

/**
 * Verify if the stored token is still valid
 * @returns {Promise<{valid: boolean, user: object|null, role: string|null}>}
 */
export const verifyToken = async () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return { valid: false, user: null, role: null };
  }

  try {
    const response = await api.get("/auth/verify");
    
    if (response.data.valid) {
      return { 
        valid: true, 
        user: {
          email: response.data.email,
          role: response.data.role
        },
        role: response.data.role
      };
    } else {
      localStorage.removeItem("token");
      return { valid: false, user: null, role: null };
    }
  } catch (error) {
    console.error("Token verification failed:", error);
    localStorage.removeItem("token");
    return { valid: false, user: null, role: null };
  }
};

/**
 * Logout user and clear token
 */
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};