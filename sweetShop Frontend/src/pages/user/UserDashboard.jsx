import { useEffect, useState } from "react";
import api from "../../api/api";
import SweetCard from "../../components/SweetCard";
import UserNavbar from "../../components/Navbar";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch sweets with search filters
  const fetchSweets = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      if (search) params.append('name', search);
      if (category) params.append('category', category);
      if (minPrice) params.append('minPrice', minPrice);
      if (maxPrice) params.append('maxPrice', maxPrice);
      
      // Use search endpoint if filters are applied, otherwise get all
      const endpoint = params.toString() 
        ? `/sweets/search?${params.toString()}`
        : '/sweets';
      
      const res = await api.get(endpoint);
      setSweets(res.data);
    } catch (error) {
      console.error("Error fetching sweets:", error);
      alert("Failed to fetch sweets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const purchaseSweet = async (id, quantity = 1) => {
    try {
      await api.post(`/sweets/${id}/purchase?quantity=${quantity}`);
      fetchSweets();
      alert(`Successfully purchased ${quantity} item(s)!`);
    } catch (error) {
      console.error("Error purchasing sweet:", error);
      alert(error.response?.data?.message || "Failed to purchase sweet. Please try again.");
    }
  };

  
  useEffect(() => {
    fetchSweets();
  }, []);


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchSweets();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search, category, minPrice, maxPrice]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className="user-dashboard">
      <UserNavbar />
      
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>Sweet Shop</h1>
          <p className="subtitle">Discover our delicious collection</p>
        </header>

        <div className="search-section">
          <div className="search-wrapper">
            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Search for your favorite sweets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button 
            className="filter-toggle-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <label>Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="filter-input"
                >
                  <option value="">All Categories</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Modern">Modern</option>
                  <option value="Chocolate">Chocolate</option>
                  <option value="Dry Fruits">Dry Fruits</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Min Price (₹)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>Max Price (₹)</label>
                <input
                  type="number"
                  placeholder="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="filter-input"
                />
              </div>

              <button className="clear-filters-btn" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Loading delicious sweets...</p>
          </div>
        ) : sweets.length === 0 ? (
          <div className="no-results">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>No sweets found</h3>
            <p>Try adjusting your search criteria</p>
            {(search || category || minPrice || maxPrice) && (
              <button className="clear-search-btn" onClick={clearFilters}>
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="results-count">
              Showing {sweets.length} {sweets.length === 1 ? 'sweet' : 'sweets'}
            </div>
            <div className="sweets-grid">
              {sweets.map((sweet) => (
                <SweetCard
                  key={sweet.id}
                  sweet={sweet}
                  onPurchase={purchaseSweet}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;