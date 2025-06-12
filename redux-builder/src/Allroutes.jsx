import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Addproduct from './Pages/Addproduct';
import Product from './Pages/Product';
import SignIn from './Pages/SignIn';
import Signup from './Pages/Signup';
import PrivatePage from './Components/PrivatePage';

const Allroutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/add" element={<Addproduct />} />
      <Route path="/product" element={<PrivatePage><Product /></PrivatePage>} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<Signup />} />
    </Routes>
  );
};

export default Allroutes;
