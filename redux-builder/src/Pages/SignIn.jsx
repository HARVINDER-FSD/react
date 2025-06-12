import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { SIGNIN } from '../redux/actionType';
import { toast } from 'react-toastify';

const initialState = {
  email: "",
  password: ""
};

const SignIn = () => {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.get('http://localhost:3000/auth')
      .then((res) => {
        const currentUser = res.data.find(
          (el) => el.email === formData.email && el.password === formData.password
        );
        if (currentUser) {
          dispatch({ type: SIGNIN, payload: currentUser });
          toast.success("Login Successful");
        } else {
          toast.error("Invalid credentials");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Login failed");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Your Email" /><br />
      <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter Your Password" /><br />
      <input type="submit" />
    </form>
  );
};

export default SignIn;
