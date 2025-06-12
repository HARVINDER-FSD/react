import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { SIGNUP } from '../redux/actionType';
import { toast } from 'react-toastify';

const initialState = {
  name: "",
  email: "",
  password: ""
};

const Signup = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/auth', { ...formData, role: 'user' })
      .then((res) => {
        dispatch({ type: SIGNUP, payload: formData });
        toast.success("Signup Successful");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Signup failed");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Enter Your Name" /><br />
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Your Email" /><br />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter Your Password" /><br />
      <input type="submit" />
    </form>
  );
};

export default Signup;
