import React, { useState } from 'react';
import axios from 'axios';
import './All.css';



import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    image: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // const { title, description, category, price, image } = form;

    const newProduct = {
      title,
      description,
      category,
      price,
      image
    };

    axios.post("http://localhost:3000/Products", newProduct)
      .then((res) => {
        console.log(res);
        setForm({
          title: '',
          description: '',
          category: '',
          price: '',
          image: ''
        });
        navigate('/');
      })
      .catch((err) => console.log(err));
  };

  const { title, description, category, price, image } = form;

  return (
    <>
      <div className="add-product">

        <h2>Add Product</h2>

        <form onSubmit={handleSubmit} className="form-grid">

          <input type="text" name="title" placeholder="Title" value={title} onChange={handleChange} required />

          <input type="text" name="description" placeholder="Description" value={description} onChange={handleChange} required />

          <input type="text" name="category" placeholder="Category" value={category} onChange={handleChange} required />

          <input type="text" name="price" placeholder="Price" value={price} onChange={handleChange} required />

          <input type="text" name="image" placeholder="Image URL" value={image} onChange={handleChange} required />

          <button type="submit">Add Product</button>

        </form>

      </div>
    
      <div className="home-wrapper">
        <footer className="home-footer">
             <p>&copy; @harvindersingh. All rights reserved.</p>

        </footer>
      </div>
    </>
    
  );
};

export default AddProduct;