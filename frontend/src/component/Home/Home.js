import React, { useEffect } from "react";
import { FaArrowDown } from "react-icons/fa";
import "./Home.css";
import Product from "./ProductCard.js";
import MetaData from "../MetaData";
import { clearErrors, getAllProducts } from "../../Action/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import { useAlert } from "react-alert";

const Home = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (error) {
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
            <div className="home-sub-products">
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
