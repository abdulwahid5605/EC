// the products will be fetched in action using axios
import axios from "axios";
import {
  ALL_PRODUCT_REQUEST,
  ALL_PRODUCT_SUCCESS,
  ALL_PRODUCT_FAIL,
  CLEAR_ERRORS,
} from "../constants/productConstants";

// The payload contains the information necessary to update the state in response to the action.

export const getAllProducts = () => async (dispatch) => {
  // using try catch in case if error occurs we should be able to add the operation in catch

  try {
    // returning the type of function
    dispatch({ type: ALL_PRODUCT_REQUEST });
    // what when this function is called? we have to get the data from the backend
    const { data } = await axios.get("/api/v1/products");

    // products stored in data variable now passing this data in success fucntion
    dispatch({ type: ALL_PRODUCT_SUCCESS, payload: data });
  } catch (error) {
    // if the product are failed to be fetched
    dispatch({ type: ALL_PRODUCT_FAIL, payload: error.response.data.message });
  }
};

// Clear Error will be used only to null the errors and return the state as it is

export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
