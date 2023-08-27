import React, { useEffect } from "react";
import { FaArrowDown } from "react-icons/fa";
import "./Home.css";
import Product from "./ProductCard.js";
import MetaData from "../MetaData";

// importing getAllProducts from action
// import getAllProducts from "../../../Action/productAction";
import { clearErrors, getAllProducts } from "../../Action/productAction";

// using useSelector to assign initial data that is empty array of product
// using useDispatch to perform the functions in the action
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";

// why we are using useEffect? So that when the reder function is called all the products are being fetched

const Home = () => {
  // importing useAlert
  const alert = useAlert();
  const dispatch = useDispatch();
  // using use selector to access the data from the state
  const { product, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
      // upr se hum text pass kr rahay han redux kay through aur data ErrorHander se aa raha
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getAllProducts());
  }, [dispatch, error, alert]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
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
              {/* mapping */}
              {/* <Product product={product} /> */}

              {product &&
                product.map((product) => <Product product={product} />)}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
