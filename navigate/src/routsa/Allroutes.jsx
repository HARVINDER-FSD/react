import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../camponet/Home'
import Product from '../camponet/Product'   
import Addproduct from '../camponet/Addproduct'
import Login from '../camponet/Login'
import './Allroutes.css'  

const Allroutes = () => {
  return (
    <div className="routes-container">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/product' element={<Product />} />
        <Route path='/Addproduct' element={<Addproduct />} />
        <Route path='/login' element={<Login />} />
      </Routes>
    </div>
  )
}

export default Allroutes