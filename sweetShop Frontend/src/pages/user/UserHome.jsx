import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserHome.css';
import Navbar from "../../components/Navbar";



const UserHome = () => {
  const navigate = useNavigate();

  return (
    <div className="user-home">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Sweet Shop!
            </h1>
            <p className="hero-description">
              Buy delicious sweets online. Browse, search, and purchase
              your favorite sweets easily.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary" 
                onClick={() => navigate("/user/dashboard")}
              >
                <span>Start Shopping</span>
                <span className="btn-icon">→</span>
              </button>
              {/* <button className="btn btn-secondary">
                <span>View Menu</span>
              </button> */}
            </div>
          </div>
          <div className="hero-image">
            <div className="floating-card card-1">🍰</div>
            <div className="floating-card card-2">🍭</div>
            <div className="floating-card card-3">🧁</div>
            <div className="floating-card card-4">🍪</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎂</div>
            <h3>Fresh Daily</h3>
            <p>All our sweets are made fresh every day with premium ingredients</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>Quick and reliable delivery to your doorstep within hours</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3>Quality Assured</h3>
            <p>100% satisfaction guarantee on all our products</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Secure Payment</h3>
            <p>Safe and secure payment options for your convenience</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <h2 className="section-title">Popular Categories</h2>
        <div className="categories-grid">
          <div className="category-card">
            <div className="category-overlay"></div>
            <span className="category-emoji">🍰</span>
            <h3>Cakes</h3>
          </div>
          <div className="category-card">
            <div className="category-overlay"></div>
            <span className="category-emoji">🍪</span>
            <h3>Cookies</h3>
          </div>
          <div className="category-card">
            <div className="category-overlay"></div>
            <span className="category-emoji">🍭</span>
            <h3>Candies</h3>
          </div>
          <div className="category-card">
            <div className="category-overlay"></div>
            <span className="category-emoji">🧁</span>
            <h3>Cupcakes</h3>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="stat-number">500+</h3>
            <p className="stat-label">Products</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">10k+</h3>
            <p className="stat-label">Happy Customers</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">50+</h3>
            <p className="stat-label">Varieties</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number">4.9★</h3>
            <p className="stat-label">Rating</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Satisfy Your Sweet Tooth?</h2>
          <p>Join thousands of happy customers enjoying our delicious treats</p>
          <button 
            className="btn btn-large" 
            onClick={() => navigate("/user/dashboard")}
          >
            <span>Order Now</span>
            <span className="btn-icon">→</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default UserHome;