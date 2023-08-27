import React, { useEffect } from "react";
import "./productDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../../Action/productAction";
import { useAlert } from "react-alert";
import Carousel from "react-material-ui-carousel";
import ReactStars from "react-rating-stars-component";
import Loader from "../Loader/Loader";

import ReviewCard from "./ReviewCard.js";

import MetaData from "../../MetaData";

const ProductDetails = ({ match }) => {
  const dispatch = useDispatch();

  const alert = useAlert();

  const { product, error, loading } = useSelector(
    (state) => state.productDetails
  );

  useEffect(() => {
    // bhai error bar bar nahi dekhana bas ik bar dekha ka null krday
    // that is why we will use clearError
    if (error) {
      // agr bhai aap error ko null kro gay to zahir ha return error to nahi hoga na ajeeb
      alert.error(error);
      dispatch(clearErrors);
    }
    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match.params.id, alert, error]);

  const options = {
    activeColor: "tomato",
    value: product.ratings,
    isHalf: true,
    edit: false,
    size: window.innerWidth < 800 ? 20 : 22,
    color: "gray",
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={`${product.name} -- ECOMMERCE`} />
          <div className="productDetails">
            <div>
              <Carousel>
                {/* i=index */}
                {/* key is not necessary. If we donot provide it then error will be generated in "console" but our code will   */}
                {product.images &&
                  product.images.map((item, i) => (
                    <img src={item.url} key={item.url} alt={`${i} Slide`} />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>

              <div className="detailsBlock-2">
                <ReactStars {...options} />
                <p>({product.noOfReviews} reviews)</p>
              </div>

              <div className="detailsBlock-3">
                <h2>{`₹${product.price}`}</h2>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button>-</button>
                    <input type="number" value="1" />
                    <button>+</button>
                  </div>
                  <button>Add to Cart</button>
                </div>
                <p>
                  Status:
                  <b className={product.stock > 1 ? "greenColor" : "redColor"}>
                    {product.stock > 1 ? " InStock" : " OutOfStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
                <button>Submit Review</button>
              </div>
            </div>
          </div>

          <h1 className="revHeading">Reviews</h1>
          {/* <ReviewCard props={product.reviews[0]} /> */}
          {product.reviews && product.reviews[0] ? (
            <div className="reviewComponent">
              {product.reviews &&
                product.reviews.map((reviews) => (
                  <ReviewCard reviews={reviews} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
        </>
      )}
    </>
  );
};

export default ProductDetails;
