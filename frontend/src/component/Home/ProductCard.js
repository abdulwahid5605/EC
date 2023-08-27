import React from "react";
import ReactStars from "react-rating-stars-component";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const options = {
    edit: false,
    activeColor: "tomato",
    value: product.ratings,
    isHalf: true,
    //   if you wnat to use media query in a single line
    // agr window ka size 600 px se kam ha
    size: window.innerWidth < 800 ? 20 : 22,
    color: "gray",
  };
  return (
    <Link className="productCard" to={`/product/${product._id}`}>
      <img src={product.images[0].url} alt={product.name} />
      <p>{product.name}</p>
      <div>
        <ReactStars {...options} />
        <span className="productCardSpan">({product.noOfReviews} reviews)</span>
      </div>
      <span className="price">{`₹${product.price}`}</span>
    </Link>
  );
};

export default ProductCard;
