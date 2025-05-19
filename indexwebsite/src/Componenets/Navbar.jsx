import React from 'react';
import { Link } from 'react-router-dom';
import './All.css';


const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/">Home</Link>
      <Link to="/product">Product</Link>
      <Link to="/addproduct">Add Product</Link>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default Navbar;
