import { useEffect, useState } from "react";
import api from "../../api/api";
import AdminNavbar from "../../components/Navbar";
import "./ManageSweets.css";

const ManageSweets = () => {
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    description: "",
  });
  const [searchForm, setSearchForm] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [restockForm, setRestockForm] = useState({
    id: "",
    quantity: "",
  });
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Fetch all sweets
  const fetchSweets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/sweets");
      setSweets(res.data);
      setFilteredSweets(res.data);
      showMessage("Sweets loaded successfully", "success");
    } catch (error) {
      showMessage("Error loading sweets: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Search sweets
  const searchSweets = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchForm.name) params.append("name", searchForm.name);
      if (searchForm.category) params.append("category", searchForm.category);
      if (searchForm.minPrice) params.append("minPrice", searchForm.minPrice);
      if (searchForm.maxPrice) params.append("maxPrice", searchForm.maxPrice);

      const res = await api.get(`/sweets/search?${params.toString()}`);
      setFilteredSweets(res.data);
      showMessage(`Found ${res.data.length} sweets`, "success");
    } catch (error) {
      showMessage("Error searching sweets: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Reset search
  const resetSearch = () => {
    setSearchForm({
      name: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
    setFilteredSweets(sweets);
  };

  // Add or Update sweet
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await api.put(`/sweets/${editingId}`, form);
        showMessage("Sweet updated successfully", "success");
        setEditingId(null);
      } else {
        await api.post("/sweets", form);
        showMessage("Sweet added successfully", "success");
      }
      setForm({ name: "", category: "", price: "", quantity: "", description: "" });
      fetchSweets();
    } catch (error) {
      showMessage("Error saving sweet: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Edit sweet
  const editSweet = (sweet) => {
    setForm({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price,
      quantity: sweet.quantity,
      description: sweet.description || "",
    });
    setEditingId(sweet.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Cancel edit
  const cancelEdit = () => {
    setForm({ name: "", category: "", price: "", quantity: "", description: "" });
    setEditingId(null);
  };

  // Delete sweet
  const deleteSweet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) return;
    
    try {
      setLoading(true);
      await api.delete(`/sweets/${id}`);
      showMessage("Sweet deleted successfully", "success");
      fetchSweets();
    } catch (error) {
      showMessage("Error deleting sweet: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Restock sweet
  const handleRestock = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post(`/sweets/${restockForm.id}/restock?quantity=${restockForm.quantity}`);
      showMessage("Sweet restocked successfully", "success");
      setShowRestockModal(false);
      setRestockForm({ id: "", quantity: "" });
      fetchSweets();
    } catch (error) {
      showMessage("Error restocking sweet: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // Open restock modal
  const openRestockModal = (sweet) => {
    setRestockForm({ id: sweet.id, quantity: "" });
    setShowRestockModal(true);
  };

  // Show message
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <>
      <AdminNavbar />
      
      <div className="manage-sweets-container">
        {/* Header */}
        <div className="page-header">
          <h1>🍬 Manage Sweets</h1>
          <p>Add, edit, and manage your sweet inventory</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`alert alert-${message.type}`}>
            <span className="alert-icon">
              {message.type === 'success' ? '✓' : '⚠'}
            </span>
            <span>{message.text}</span>
          </div>
        )}

        {/* Add/Edit Sweet Form */}
        <div className="card form-card">
          <div className="card-header">
            <h2>{editingId ? "✏️ Edit Sweet" : "➕ Add New Sweet"}</h2>
          </div>
          <form onSubmit={handleSubmit} className="sweet-form">
            <div className="form-row">
              <div className="form-group">
                <label>Sweet Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Gulab Jamun"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  placeholder="e.g., Traditional, Chocolate"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹) *</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  placeholder="Stock quantity"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Enter a brief description of the sweet (optional)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">⏳ Saving...</span>
                ) : (
                  <span>{editingId ? "💾 Update Sweet" : "➕ Add Sweet"}</span>
                )}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>
                  ✖ Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Search Form */}
        <div className="card search-card">
          <div className="card-header">
            <h2>🔍 Search Sweets</h2>
          </div>
          <form onSubmit={searchSweets} className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label>Sweet Name</label>
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={searchForm.name}
                  onChange={(e) => setSearchForm({ ...searchForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  placeholder="Search by category..."
                  value={searchForm.category}
                  onChange={(e) => setSearchForm({ ...searchForm, category: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Min Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Min"
                  value={searchForm.minPrice}
                  onChange={(e) => setSearchForm({ ...searchForm, minPrice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Max Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Max"
                  value={searchForm.maxPrice}
                  onChange={(e) => setSearchForm({ ...searchForm, maxPrice: e.target.value })}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                🔍 Search
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetSearch}>
                🔄 Reset
              </button>
            </div>
          </form>
        </div>

        {/* Sweets List */}
        <div className="card">
          <div className="card-header">
            <h2>📦 All Sweets</h2>
            <span className="count-badge">{filteredSweets.length} items</span>
          </div>
          
          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading sweets...</p>
            </div>
          )}
          
          {!loading && filteredSweets.length === 0 && (
            <div className="no-data">
              <span className="no-data-icon">🍭</span>
              <p>No sweets found</p>
              <small>Add some sweets to get started!</small>
            </div>
          )}

          <div className="sweets-grid">
            {filteredSweets.map((sweet) => (
              <div key={sweet.id} className="sweet-card">
                <div className="sweet-header">
                  <h3>{sweet.name}</h3>
                  <span className="category-badge">{sweet.category}</span>
                </div>
                
                <div className="sweet-details">
                  <div className="detail-item">
                    <span className="label">💰 Price:</span>
                    <span className="value price">₹{sweet.price}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">📦 Stock:</span>
                    <span className={`value ${sweet.quantity < 10 ? 'low-stock' : 'in-stock'}`}>
                      {sweet.quantity} units
                      {sweet.quantity < 10 && <span className="stock-warning"> ⚠️ Low</span>}
                    </span>
                  </div>
                  {sweet.description && (
                    <div className="detail-item description">
                      <span className="label">📝 Description:</span>
                      <p className="value">{sweet.description}</p>
                    </div>
                  )}
                </div>

                <div className="sweet-actions">
                  <button 
                    className="btn btn-edit" 
                    onClick={() => editSweet(sweet)}
                    disabled={loading}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn btn-restock" 
                    onClick={() => openRestockModal(sweet)}
                    disabled={loading}
                  >
                    📦 Restock
                  </button>
                  <button 
                    className="btn btn-delete" 
                    onClick={() => deleteSweet(sweet.id)}
                    disabled={loading}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Restock Modal */}
        {showRestockModal && (
          <div className="modal-overlay" onClick={() => setShowRestockModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📦 Restock Sweet</h2>
              </div>
              <form onSubmit={handleRestock}>
                <div className="form-group">
                  <label>Quantity to Add *</label>
                  <input
                    type="number"
                    placeholder="Enter quantity to add"
                    value={restockForm.quantity}
                    onChange={(e) => setRestockForm({ ...restockForm, quantity: e.target.value })}
                    required
                    min="1"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "⏳ Restocking..." : "✓ Restock"}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => setShowRestockModal(false)}
                  >
                    ✖ Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ManageSweets;