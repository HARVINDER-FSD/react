import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Product.css";
import { useSearchParams } from "react-router-dom";

const Product = () => {

  
  const [value, setValue] = useState([]);
  const [input, setinput] = useState("");
  const [searchparam, setsearchparam] = useSearchParams();

  const Page = parseInt(searchparam.get("page")) || 1;
  const searchQuery = searchparam.get("search") || "";
  const productsPerPage = 5;
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setinput(searchQuery);
  }, [Page, searchQuery]);

  useEffect(() => {
    fetchData();
  }, [Page, searchQuery]);

  const fetchData = () => {
    axios
      .get("http://localhost:3000/products", {
        params: {
          _page: Page,
          _limit: productsPerPage,
          q: searchQuery,
        },
      })
      .then((res) => {
        setValue(res.data);
        setTotalCount(parseInt(res.headers["x-total-count"]) || 0); 
      })
      .catch((err) => console.log(err));
  };

  const totalPages = Math.ceil(totalCount / productsPerPage);

  const handleSearch = () => {
    setsearchparam({ search: input, page: 1 });
  };

  const goToPage = (pageNumber) => {
    setsearchparam({ search: input, page: pageNumber });
  };

  return (
    <div className="container">
      <h1>Product Page</h1>

      <input
        type="text"
        placeholder="Search item"
        value={input}
        onChange={(e) => setinput(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <br />
      <br />

      <div className="product-grid">
        {value.map((el) => (
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
        <button onClick={() => goToPage(Page - 1)} disabled={Page === 1}>
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={Page === i + 1 ? "active" : ""}
            onClick={() => goToPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => goToPage(Page + 1)}


          disabled={Page === totalPages}
        >
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
