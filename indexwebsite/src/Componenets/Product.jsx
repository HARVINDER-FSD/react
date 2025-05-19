import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './All.css';

import { useNavigate, useSearchParams } from 'react-router-dom';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [input, setInput] = useState("");

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    setInput(searchQuery);
  }, [searchQuery]);

  const fetchData = () => {
    axios.get(`http://localhost:3000/products?_page=${page}&_limit=6`, {
      params: {
        q: searchQuery,
      }
    })
    .then(res => setProducts(res.data))
    .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, [page, searchQuery]);

  const handleChange = (e) => {
    const keyword = e.target.value;
    setInput(keyword);
    setSearchParams({ search: keyword });
  };

  const handleDelete = (id, e) => {
    e.stopPropagation(); // prevent navigating to details on delete click
    axios.delete(`http://localhost:3000/products/${id}`)
      .then(() => fetchData())
      .catch(err => console.log(err));
  };

  return (
    <div>
      <h1>Product Page</h1>
      <div className='product-search'>
        <input type="text" value={input} placeholder='Search Item' onChange={handleChange} />
      </div>

      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card" onClick={() => navigate(`/product/${product.id}`)}>
            <h1>{product.id}</h1>
            <img src={product.image} height={200} width={200} alt={product.title} />
            <p>{product.title}</p>
            <p>{product.description}</p>
            <p>{product.category}</p>
            <p>${product.price}</p>
            <button onClick={(e) => { e.stopPropagation(); navigate(`/product/edit/${product.id}`); }}>Edit</button>
            <button onClick={(e) => handleDelete(product.id, e)}>Delete</button>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</button>
        <span>{page}</span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>

      <footer className="home-footer">
             <p>&copy; @harvindersingh. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Product;
