import React from "react";
import { FaArrowDown } from "react-icons/fa";
import "./Home.css";
import Product from "./Product.js";
import MetaData from "../../MetaData";

const product = {
  name: "Lavi's TShirt",
  image: "https://i.ibb.co//DRST11n/1.webp",
  price: "₹2000",
  _id: "abdulwahid",
};

const Home = () => {
  return (
    <>
      <MetaData title="ECOMMERCE" />
      <div className="banner">
        <p>Welcome to Ecommerce</p>
        <h1>FIND AMAZING PRODUCTS BELOW</h1>
        <a href="#home-products">
          <button className="home-btn">
            Scroll <FaArrowDown />
          </button>
        </a>
      </div>

      <div className="home-products" id="home-products">
        <h1>Featured Products</h1>
        {/* passing value as a props */}
        <div className="home-sub-products">
          <Product product={product} />
          <Product product={product} />
          <Product product={product} />
          <Product product={product} />
          <Product product={product} />
          <Product product={product} />
          <Product product={product} />
          <Product product={product} />
        </div>
      </div>
    </>
  );
};

export default Home;
