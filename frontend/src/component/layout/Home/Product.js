import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";

const options = {
  edit: false,
  activeColor: "tomato",
  value: 2.5,
  isHalf: true,
  //   if you wnat to use media query in a single line
  // agr window ka size 600 px se kam ha
  size: window.innerWidth < 800 ? 16 : 22,
  color: "gray",
};

const Product = ({ product }) => {
  return (
    <Link className="productCard" to={product._id}>
      <img src={product.image} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <ReactStars {...options} />
        <span className="productCardSpan">(256 reviews)</span>
      </div>
      <span className="price">{product.price}</span>
    </Link>
  );
};

export default Product;
