import React from 'react';
import '../App.css';

const Home = () => {

  const handleShopNow = () => {
    // Example: Navigate to product section or page
    window.location.href = "/product"; // or use useNavigate() from react-router-dom
  };

  return (
    <div className="home-wrapper">
      <header className="home-header">
        <h1>Welcome to the Store 🛒</h1>
        <p>Find amazing products at unbeatable prices, all in one place.</p>
        <button className="shop-now-btn" onClick={handleShopNow}> Shop Now </button>
      </header>

      <section className="features">
        <h2>Why Shop With Us?</h2>
        <div className="feature-grid">
          <div className="feature-item">
            <img src="https://cdn-icons-png.flaticon.com/512/126/126083.png" alt="Quality" />
            <h3>Top Quality</h3>
            <p>Only the best handpicked items for our customers.</p>
          </div>
          <div className="feature-item">
            <img src="https://cdn-icons-png.flaticon.com/512/891/891419.png" alt="Fast Delivery" />
            <h3>Fast Delivery</h3>
            <p>Get your products delivered quickly and safely.</p>
          </div>
          <div className="feature-item">
            <img src="https://cdn-icons-png.flaticon.com/512/1170/1170576.png" alt="Support" />
            <h3>24/7 Support</h3>
            <p>We’re here to help you any time, day or night.</p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>&copy;  All rights reserved by Harvinder Singh.</p>
      </footer>
    </div>
  );
};

export default Home;
