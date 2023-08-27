// the products will be fetched in action using axios
import axios from "axios";
import {
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_FAIL,
  CLEAR_ERRORS,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL,
} from "../constants/productConstants";

// The payload contains the information necessary to update the state in response to the action.

// bhai initially keyword ka empty hona zaruri ha takay /products wala link sahi se kam karay
// keyword and current page comming from useEffect
export const getAllProducts =
  (
    keyword = "",
    currentPage = 1,
    price = [0, 25000],
    catagory = "",
    ratings = 0
  ) =>
  async (dispatch) => {
    // using try catch in case if error occurs we should be able to add the operation in catch

    try {
      // returning the type of function
      dispatch({ type: ALL_PRODUCT_REQUEST });
      let link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;
      if (catagory) {
        link = `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[gte]=${price[0]}&price[lte]=${price[1]}&catagory=${catagory}`;
      }
      // what when this function is called? we have to get the data from the backend
      const { data } = await axios.get(link);

      // products stored in data variable now passing this data in success fucntion
      dispatch({ type: ALL_PRODUCT_SUCCESS, payload: data });
    } catch (error) {
      // if the product are failed to be fetched
      dispatch({
        type: ALL_PRODUCT_FAIL,
        payload: error.response.data.message,
      });
    }
  };

// getProductDetails
export const getProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_DETAILS_REQUEST });
    const { data } = await axios.get(`/api/v1/product/${id}`);
    dispatch({
      type: PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: PRODUCT_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};

// Clear Error will be used only to null the errors and return the state as it is

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
