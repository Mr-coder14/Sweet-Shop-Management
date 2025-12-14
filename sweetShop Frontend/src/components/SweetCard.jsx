import { useState } from 'react';
import './SweetCard.css';

const SweetCard = ({ sweet, onPurchase }) => {
  const [quantity, setQuantity] = useState(1);
  const [showQuantity, setShowQuantity] = useState(false);

  const handlePurchase = () => {
    if (sweet.quantity > 0) {
      onPurchase(sweet.id, quantity);
      setQuantity(1);
      setShowQuantity(false);
    }
  };

  const increaseQuantity = () => {
    if (quantity < sweet.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="sweet-card">
      <div className="card-image-container">
        {sweet.image ? (
          <img 
            src={sweet.image} 
            alt={sweet.name}
            className="card-image"
          />
        ) : (
          <div className="placeholder-image">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          </div>
        )}
        
        {sweet.quantity === 0 && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
        
        {sweet.quantity > 0 && sweet.quantity <= 10 && (
          <div className="low-stock-badge">Only {sweet.quantity} left!</div>
        )}
      </div>

      <div className="card-content">
        <h3 className="card-title">{sweet.name}</h3>
        
        {sweet.category && (
          <span className="category-badge">{sweet.category}</span>
        )}
        
        {sweet.description && (
          <p className="card-description">{sweet.description}</p>
        )}

        <div className="card-details">
          <div className="detail-item">
            <span className="detail-label">Price</span>
            <span className="detail-value price">₹{sweet.price?.toFixed(2) || '0.00'}</span>
          </div>
          
          <div className="detail-item">
            <span className="detail-label">Stock</span>
            <span className={`detail-value stock ${sweet.quantity === 0 ? 'out' : sweet.quantity <= 10 ? 'low' : ''}`}>
              {sweet.quantity || 0} units
            </span>
          </div>
        </div>

        {showQuantity && sweet.quantity > 0 && (
          <div className="quantity-selector">
            <button 
              className="quantity-btn"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              -
            </button>
            <span className="quantity-value">{quantity}</span>
            <button 
              className="quantity-btn"
              onClick={increaseQuantity}
              disabled={quantity >= sweet.quantity}
            >
              +
            </button>
          </div>
        )}

        {sweet.quantity > 0 ? (
          showQuantity ? (
            <div className="action-buttons">
              <button
                className="cancel-btn"
                onClick={() => {
                  setShowQuantity(false);
                  setQuantity(1);
                }}
              >
                Cancel
              </button>
              <button
                className="confirm-btn"
                onClick={handlePurchase}
              >
                Confirm (₹{(sweet.price * quantity).toFixed(2)})
              </button>
            </div>
          ) : (
            <button
              className="purchase-btn"
              onClick={() => setShowQuantity(true)}
            >
              Purchase Now
            </button>
          )
        ) : (
          <button className="purchase-btn disabled" disabled>
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default SweetCard;