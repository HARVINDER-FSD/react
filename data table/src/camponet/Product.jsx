import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Product.css";
import { useSearchParams } from "react-router-dom";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [productIdToUpdate, setProductIdToUpdate] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const page = parseInt(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const productsPerPage = 5;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setSearchInput(searchQuery);
  }, [page, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [page, searchQuery]);

  const fetchData = () => {
    axios
      .get("http://localhost:3000/products", {
        params: {
          _page: page,
          _limit: productsPerPage,
          q: searchQuery,
        },
      })
      .then((res) => {
        setProducts(res.data);
        setTotalCount(parseInt(res.headers["x-total-count"]) || 0);
      })
      .catch((err) => console.log(err));
  };

  const totalPages = Math.ceil(totalCount / productsPerPage);

  const handleSearch = () => {
    setSearchParams({ search: searchInput, page: 1 });
  };

  const goToPage = (pageNumber) => {
    setSearchParams({ search: searchInput, page: pageNumber });
  };

  const handleUpdatePrice = () => {
    const id = parseInt(productIdToUpdate);
    const price = parseFloat(newPrice);

    if (isNaN(id) || isNaN(price)) {
      alert("Please enter valid numbers for product ID and price");
      return;
    }

    axios
      .patch(`http://localhost:3000/products/${id}`, { price })
      .then(() => {
        alert(`Price updated for product ID: ${id}`);
        fetchData();
        setProductIdToUpdate("");
        setNewPrice("");
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to update price.  product ID exists.");
      });
  };

  return (
    <div className="container">
      <h1>Product Page</h1>

      <input
        type="text"
        placeholder="Search item"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <br /><br />

      {/* Update Price Section */}

      
      <div className="update-section">
        <input
          type="text"
          placeholder="Product ID"
          value={productIdToUpdate}
          onChange={(e) => setProductIdToUpdate(e.target.value)}
        />
        <input
          type="text"
          placeholder="New Price"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
        />
        <button onClick={handleUpdatePrice}>Update Price</button>
      </div>

      <br /><br />

      <div className="product-grid">
        {products.map((el) => (
          <div key={el.id} className="product-card">
            <img
              src={el.image}
              alt={el.title}
              style={{ width: "200px", height: "200px", objectFit: "cover" }}
            />
            <h2>{el.id}</h2>
            <p>{el.title}</p>
            <p>${el.price}</p>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => goToPage(page - 1)} disabled={page === 1}>
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={page === i + 1 ? "active" : ""}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}>
          Next
        </button>
      </div>

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

export default Product;
