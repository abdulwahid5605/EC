import React, { useEffect, useState } from "react";
import "./Product.css";
import ProductCard from "../Home/ProductCard";
import { getAllProducts, clearErrors } from "../../Action/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
import Pagination from "react-js-pagination";
import { useAlert } from "react-alert";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import MetaData from "../MetaData";

const catagories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "Smartphones",
];

// match isliye kay hum backend se keyword access krlen
const Products = ({ match }) => {
  const [ratings, setRatings] = useState(0);

  const [price, setPrice] = useState([0, 25000]);
  // there is an index of array required that will change the value of price
  const [currentPage, setcurrentPage] = useState(1);

  const [catagory, setCatagory] = useState("");

  const priceHandler = (event, newPrice) => {
    setPrice(newPrice);
  };
  const setCurrentPageNo = (e) => {
    setcurrentPage(e);
  };

  // const ratingsHandler = (event, newRatings) => {
  //   setRatings(newRatings);
  // };

  const alert = useAlert();
  const dispatch = useDispatch();
  const keyword = match.params.keyword;

  const {
    product,
    loading,
    error,
    productCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  let count = filteredProductsCount;

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    // keyword and get all products are passed in actions and backend operation is performed
    dispatch(getAllProducts(keyword, currentPage, price, catagory, ratings));
  }, [dispatch, keyword, alert, error, currentPage, price, catagory, ratings]);

  return (
    <>
      <MetaData title="ECOMMERCE -- PRODUCTS" />
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="productsHeading">Products</h1>

          <div className="products">
            {product &&
              product.map((product) => <ProductCard product={product} />)}
          </div>

          <div className="filterBox">
            <Typography>Price</Typography>
            {/* the value of this slider takes an array as input having start value and end value */}
            <Slider
              className="slider"
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={25000}
            />
            <Typography>Catagories</Typography>
            <ul className="catagory-con">
              {catagories &&
                catagories.map((catagory) => (
                  <li
                    className="catagory"
                    key={catagory}
                    onClick={() => {
                      setCatagory(catagory);
                    }}
                  >
                    {catagory}
                  </li>
                ))}
            </ul>

            <fieldset className="field">
              <Typography component="legend">Ratings Above</Typography>
              <Slider
                value={ratings}
                min={0}
                max={5}
                onChange={(e, newRatings) => {
                  setRatings(newRatings);
                }}
                valueLabelDisplay="auto"
                aria-labelledby="continuous-slider"
              />
            </fieldset>
          </div>

          {resultPerPage < count && (
            <div className="paging">
              <Pagination
                activePage={currentPage}
                totalItemsCount={productCount}
                itemsCountPerPage={resultPerPage}
                prevPageText="Prev"
                firstPageText="First"
                lastPageText="Last"
                nextPageText="Next"
                activeClass="pageItemActive"
                activeLinkClass="ActiveAClass"
                onChange={setCurrentPageNo}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Products;
