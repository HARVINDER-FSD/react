import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';


const AddProduct = () => {
  const [formData, setFormData] = useState({
    image: '',
    title: '',
    description: '',
    price: '',
    category: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { image, title, description, price, category } = formData;

    if (!image || !title || !description || !price || !category) {
      alert('Please fill in all fields');
      return;
    }

    axios
      .post('http://localhost:3000/products', {
        image,
        title,
        description,
        price: parseFloat(price),
        category
      })
      .then(() => {
        alert('Product added successfully!');
        setFormData({
          image: '',
          title: '',
          description: '',
          price: '',
          category: ''
        });
      })
      .catch((err) => {
        console.error(err);
        alert('Error adding product');
      });
  };

  return (
    <div>
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input
          type="url"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Product</button>
      </form>


      <div className="container">
          <div className="footer__bottom">
            <div className="footer__bottom-copyright">
              © 2025 Shopee. All Rights Reserved
            </div>
          </div>
        </div>
        
    </div>

    
  );
};

export default AddProduct;
