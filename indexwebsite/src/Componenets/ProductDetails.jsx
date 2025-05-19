import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './All.css';



const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => {
        console.error(err);
        setError("Failed to load product.");
      });
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <>
      <div className="product-details-container">
        <img src={product.image} alt={product.title} className="product-image" />
        <div className="product-info">
          <h1>{product.title}</h1>
          <p><strong>Description:</strong> {product.description}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Price:</strong> ${product.price}</p>
        </div>
      </div>

      <footer className="home-footer">
     <p>&copy; @harvindersingh. All rights reserved.</p>
      </footer>
    </>
  );
};

export default ProductDetails;
