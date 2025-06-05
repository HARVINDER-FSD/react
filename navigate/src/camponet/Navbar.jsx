import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'
import logo from '../assets/myimg/logo.jpg' 

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Shop Logo" />
        </Link>
      </div>

      <div className="center-links">
        <Link to="/">Home</Link>
        <Link to="/product">Product</Link>
        <Link to="/addproduct">Add Product</Link>
      </div>

      <div className="right-link">
        <Link to="/login">Login</Link>
      </div>
    </div>
  )
}

export default Navbar