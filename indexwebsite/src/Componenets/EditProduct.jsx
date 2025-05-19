import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './All.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    image: ""
  });

  useEffect(() => {
    axios.get(`http://localhost:3000/products/${id}`)
      .then(res => setForm(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3000/products/${id}`, form)
      .then(() => navigate('/product'))
      .catch(err => console.log(err));
  };

  return (
    <div className="edit-container">
      <h2>Edit Product</h2>
      <form className="edit-form" onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" required />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" required />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditProduct;
