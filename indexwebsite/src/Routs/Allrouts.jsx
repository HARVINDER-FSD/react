import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Componenets/Home'
import Product from '../Componenets/Product'
import Login from '../Componenets/Login'
import Addproduct from '../Componenets/Addproduct'
import Error from '../Componenets/Error'
import ProductDetails from '../Componenets/ProductDetails'
import EditProduct from '../Componenets/EditProduct'

const Allrouts = () => {
  return (
    <Routes>
        <Route path = "/" element = {<Home />}></Route>
        <Route path = '/product' element = {<Product />}></Route>
        <Route path = '/addproduct' element = {<Addproduct />}></Route>
        <Route path = '/login' element = {<Login />}></Route>
        <Route path="/product/:id" element={<ProductDetails />} /> 
        <Route path="/product/edit/:id" element={<EditProduct />} />
        <Route path = '*' element = {<Error />}></Route>
    </Routes>
  )
}

export default Allrouts