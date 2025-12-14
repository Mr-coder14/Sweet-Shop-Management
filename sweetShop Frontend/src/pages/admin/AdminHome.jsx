import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/Navbar";
import api from "../../api/api";
import "./AdminHome.css";

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalSweets: 0,
    lowStock: 0,
    totalCategories: 0,
    totalValue: 0,
  });
  const [recentSweets, setRecentSweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/sweets");
      const sweets = res.data;

      // Calculate stats
      const totalSweets = sweets.length;
      const lowStock = sweets.filter(s => s.quantity < 10).length;
      const categories = [...new Set(sweets.map(s => s.category))];
      const totalValue = sweets.reduce((sum, s) => sum + (s.price * s.quantity), 0);

      setStats({
        totalSweets,
        lowStock,
        totalCategories: categories.length,
        totalValue: totalValue.toFixed(2),
      });

      // Get recent sweets (last 5)
      setRecentSweets(sweets.slice(0, 5));
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Manage Sweets",
      description: "Add, edit, or delete sweets from inventory",
      icon: "🍬",
      path: "/admin/manage-sweets",
      color: "#667eea",
    },
    {
      title: "View Orders",
      description: "Check customer orders and order history",
      icon: "📦",
      path: "/admin/orders",
      color: "#764ba2",
    },
    {
      title: "Inventory Report",
      description: "View detailed inventory and stock reports",
      icon: "📊",
      path: "/admin/reports",
      color: "#f59e0b",
    },
    {
      title: "User Management",
      description: "Manage user accounts and permissions",
      icon: "👥",
      path: "/admin/users",
      color: "#8b5cf6",
    },
  ];

  return (
    <>
      <AdminNavbar />
      
      <div className="admin-home-container">
        {/* Header Section */}
        <div className="admin-header">
          <div className="header-content">
            <h1>🎯 Admin Dashboard</h1>
            <p>Welcome to the Sweet Shop Admin Panel. Manage your inventory, orders, and users all in one place with powerful tools and insights.</p>
          </div>
          <div className="header-icon">🍰</div>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : (
          <div className="stats-grid">
            <div className="stat-card stat-primary">
              <div className="stat-icon-wrapper">
                <div className="stat-icon">🍭</div>
              </div>
              <div className="stat-content">
                <h3>{stats.totalSweets}</h3>
                <p>Total Sweets</p>
                <div className="stat-progress">
                  <div className="progress-bar" style={{ width: '100%', background: 'linear-gradient(90deg, #667eea, #764ba2)' }}></div>
                </div>
              </div>
            </div>

            <div className="stat-card stat-warning">
              <div className="stat-icon-wrapper">
                <div className="stat-icon">⚠️</div>
              </div>
              <div className="stat-content">
                <h3>{stats.lowStock}</h3>
                <p>Low Stock Items</p>
                <div className="stat-progress">
                  <div className="progress-bar" style={{ width: `${Math.min((stats.lowStock / stats.totalSweets) * 100, 100)}%`, background: 'linear-gradient(90deg, #f59e0b, #d97706)' }}></div>
                </div>
              </div>
            </div>

            <div className="stat-card stat-info">
              <div className="stat-icon-wrapper">
                <div className="stat-icon">📑</div>
              </div>
              <div className="stat-content">
                <h3>{stats.totalCategories}</h3>
                <p>Categories</p>
                <div className="stat-progress">
                  <div className="progress-bar" style={{ width: '75%', background: 'linear-gradient(90deg, #3b82f6, #2563eb)' }}></div>
                </div>
              </div>
            </div>

            <div className="stat-card stat-success">
              <div className="stat-icon-wrapper">
                <div className="stat-icon">💰</div>
              </div>
              <div className="stat-content">
                <h3>₹{stats.totalValue}</h3>
                <p>Total Inventory Value</p>
                <div className="stat-progress">
                  <div className="progress-bar" style={{ width: '90%', background: 'linear-gradient(90deg, #10b981, #059669)' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="section">
          <h2 className="section-title">⚡ Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="action-card"
                onClick={() => navigate(action.path)}
              >
                <div className="action-icon-wrapper" style={{ background: `linear-gradient(135deg, ${action.color}20, ${action.color}10)` }}>
                  <div className="action-icon">{action.icon}</div>
                </div>
                <h3>{action.title}</h3>
                <p>{action.description}</p>
                <button className="action-btn" style={{ background: `linear-gradient(135deg, ${action.color}, ${action.color}dd)` }}>
                  Go to {action.title} →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Sweets */}
        {!loading && recentSweets.length > 0 && (
          <div className="section">
            <h2 className="section-title">🕒 Recent Sweets</h2>
            <div className="recent-sweets">
              <div className="recent-sweets-header">
                <span>Product Details</span>
                <span>Stock & Price</span>
              </div>
              {recentSweets.map((sweet) => (
                <div key={sweet.id} className="recent-sweet-item">
                  <div className="sweet-info">
                    <div className="sweet-emoji">🍬</div>
                    <div>
                      <h4>{sweet.name}</h4>
                      <span className="sweet-category">{sweet.category}</span>
                    </div>
                  </div>
                  <div className="sweet-stats">
                    <span className="sweet-price">₹{sweet.price}</span>
                    <span className={`sweet-quantity ${sweet.quantity < 10 ? 'low' : 'normal'}`}>
                      {sweet.quantity < 10 ? '⚠️' : '✓'} {sweet.quantity} in stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="view-all-btn" onClick={() => navigate("/admin/manage-sweets")}>
              <span>View All Sweets</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* Admin Info Cards */}
        <div className="section">
          <h2 className="section-title">💡 Features & Benefits</h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📋</div>
              <h3>Inventory Management</h3>
              <p>Keep track of all your sweet products. Add new items, update prices, and manage stock levels efficiently with real-time updates.</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🔄</div>
              <h3>Real-time Updates</h3>
              <p>All changes are reflected immediately across the system. Your customers see accurate stock information and pricing instantly.</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🔒</div>
              <h3>Secure Access</h3>
              <p>Admin panel is protected with authentication. Only authorized personnel can make changes to the inventory and view sensitive data.</p>
            </div>

            <div className="info-card">
              <div className="info-icon">📊</div>
              <h3>Analytics & Reports</h3>
              <p>Get detailed insights into your inventory performance, sales trends, and stock levels to make informed business decisions.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHome;