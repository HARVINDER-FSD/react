import React from 'react';
import '../App.css';
import { useSelector } from 'react-redux';

const ProductCard = ({ id, image, title, price }) => {
  const { currentUser } = useSelector((state) => state.Auth);

  return (
    <div key={id}>
      <img src={image} alt="" height={200} width={200} />
      <h3>{title}</h3>
      <h3>{price}</h3>
      {currentUser?.role === "Admin" && <button>EDIT</button>}
      {currentUser?.role === "Admin" && <button>DELETE</button>}
    </div>
  );
};

export default ProductCard;
