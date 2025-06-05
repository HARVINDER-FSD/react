import React from 'react'
import './home.css'
import img from '../assets/myimg/shope1.jpg'

const countries = [
  { code: 'id', name: 'Indonesia', link: '#' },
  { code: 'tw', name: 'Taiwan', link: '#' },
  { code: 'vn', name: 'Vietnam', link: '#' },
  { code: 'th', name: 'Thailand', link: '#' },
  { code: 'ph', name: 'Philippines', link: '#' },
  { code: 'my', name: 'Malaysia', link: '#' },
  { code: 'sg', name: 'Singapore', link: '#' },
  { code: 'br', name: 'Brazil', link: '#' },
  { code: 'mx', name: 'Mexico', link: '#' },
  { code: 'co', name: 'Colombia', link: '#' },
  { code: 'cl', name: 'Chile', link: '#' }
];

const Home = () => {
  return (
    <>
      <img className="full-width-image" src={img} alt="shope product" />

      <div className="content">
        <div className="container">
          <h2 className="content__title">Welcome to Shopee</h2>
          <h3 className="content__subtitle">
            Your preferred online shopping platform. Shopee offers a seamless, fun and reliable shopping experience to millions of users worldwide.
            <br />
            Choose a country or region.
          </h3>

      
        </div>
      </div> 

     

        <div className="container">
          <div className="footer__bottom">
            <div className="footer__bottom-copyright">
              © 2025 Shopee. All Rights Reserved
            </div>
          </div>
        </div>
      
    </>
  );
}

export default Home;
