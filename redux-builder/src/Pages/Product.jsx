import axios from 'axios';
import '../App.css'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { REJECT, REQUEST, SUCCESS } from '../redux/actionType';
import { toast } from 'react-toastify';
import ProductCard from '../Components/ProductCard';

const Product = () => {
  const { isLoading, isError, data } = useSelector((state) => state.Product);
  const dispatch = useDispatch();

  const fetchData = () => {
    dispatch({ type: REQUEST });
    axios.get('http://localhost:3000/Products')
      .then((res) => {
        dispatch({ type: SUCCESS, payload: res.data });
        toast.success("Data Fetched Successfully");
      })
      .catch((err) => {
        console.error(err);
        dispatch({ type: REJECT });
        toast.error("Error fetching data");
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

 return (
  <div className="product-page">
    <h1>Product Page</h1>
    <div className="product-grid">
      {data.length > 0 && data.map((el) => <ProductCard key={el.id} {...el} />)}
    </div>
    <footer className="home-footer">
         <p>&copy;  All rights reserved by Harvinder Singh.</p>
    </footer>
  </div>
);
};

export default Product;
